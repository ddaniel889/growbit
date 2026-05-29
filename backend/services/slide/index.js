const crypto = require("crypto");
const User = require("../../database/models/User");
const SlideGame = require("../../database/models/SlideGame");
const SlideBet = require("../../database/models/SlideBet");
const SlideSeed = require("../../database/models/SlideSeed");

const { socketRemoveAntiSpam } = require("../../utils/socket");
const { fairGetData, fairGetBlockData } = require("../../utils/fair");
const { generalUserGetFormated } = require("../../utils/general/user");
const {
  slideCheckSendBetData,
  slideCheckSendBetUser,
  slideCheckSendBetGame,
  slideSanitizeGame,
  slideSanitizeBets,
  slideSanitizeBet,
  SLIDE_HOUSE_EDGE,
  getWinningColour,
} = require("../../utils/games/slide");

// Load controllers
const { generalAddBetsList } = require("../general/bets");
const {
  updateAffiliate,
  updateUser,
  updateReports,
  limitMultiplier,
} = require("../../utils/games/games");
const { tryToClaim } = require("../challenges");
const { logger } = require("../../utils/logger");

const NUMBER_OF_SLIDE_SEEDS = 1000;

// Game slide variables globales
let slideGame = null;
let slideBets = [];
let slideHistory = [];
let slideBetPendingCount = 0;

const slideGetDataSocket = async (io, socket, user, data, callback) => {
  // Solución al contador congelado: Si el juego está en null, devolvemos marcas de tiempo válidas
  if (!slideGame) {
    const now = new Date().getTime();
    return {
      game: {
        state: "created", 
        history: slideHistory,
        bets: [],
        createdAt: now,
        updatedAt: now
      },
      bets: [],
      history: slideHistory,
    };
  }

  return {
    game: slideSanitizeGame(slideGame),
    bets: slideSanitizeBets(slideBets),
    history: slideHistory,
  };
};

const slideSendBetSocket = async (io, socket, user, data, callback) => {
  try {
    if (!slideGame) {
      return callback({
        success: false,
        error: { type: "error", message: "El juego se está inicializando, por favor espera un momento." },
      });
    }

    // Aseguramos que el payload contenga la moneda antes de validar
    data.currency = data.currency ? data.currency.toLowerCase() : 'sc';

    slideCheckSendBetData(data);
    slideCheckSendBetUser(data, user, slideBets);
    slideCheckSendBetGame(slideGame);

    try {
      slideBetPendingCount = slideBetPendingCount + 1;

      const amount = data.amount;
      const currencyKey = data.currency;

      let promises = [];

      // Descontar del balance bimoneda dinámico
      promises = [
        User.findByIdAndUpdate(
          user._id,
          {
            $inc: {
              [`wallet.${currencyKey}`]: -amount,
              "stats.total.bet": amount,
              "stats.slide.bet": amount,
            },
          },
          { new: true }
        ).lean(),
        SlideBet.create({
          amount: amount,
          color: data.color,
          currency: currencyKey, 
          game: slideGame._id,
          user: user._id,
        }),
      ];

      let dataDatabase = await Promise.all(promises);
      dataDatabase[1] = dataDatabase[1].toObject();

      dataDatabase[1].user = {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        rank: user.rank,
        limits: user.limits,
        affiliates: user.affiliates,
        anonymous: user.anonymous,
      };

      slideBets.push(dataDatabase[1]);

      // Emitir la apuesta en tiempo real a la sala
      io.of("/slide").to("slide").emit("bet", {
        bet: slideSanitizeBet(dataDatabase[1]),
      });

      // Retornar éxito al usuario con su billetera actualizada para refrescar el Navbar
      callback({ success: true, user: dataDatabase[0] });

      // Notificación inmediata del descuento al canal privado del usuario
      io.of("/general").to(user._id.toString()).emit("user", { user: dataDatabase[0] });

      slideBetPendingCount = slideBetPendingCount - 1;
      socketRemoveAntiSpam(user._id);
    } catch (err) {
      slideBetPendingCount = slideBetPendingCount - 1;
      socketRemoveAntiSpam(user._id);
      callback({
        success: false,
        error: { type: "error", message: err.message },
      });
    }
  } catch (err) {
    socketRemoveAntiSpam(user._id);
    callback({
      success: false,
      error: { type: "error", message: err.message },
    });
  }
};

const slideGameStart = async (io) => {
  try {
    slideGame = await slideGenerateGame();
    slideBets = [];

    io.of("/slide").to("slide").emit("game", {
      game: slideSanitizeGame(slideGame),
    });

    // Forzar un tiempo de espera estricto y limpio de 13 segundos reales para evitar bloqueos por desfase horarió
    const duration = 13000; 

    setTimeout(
      () => {
        slideGamePending(io);
      },
      duration
    );
  } catch (err) {
    logger.error("Error al arrancar la ronda en slideGameStart, reintentando en 2s...", err);
    setTimeout(() => slideGameStart(io), 2000);
  }
};

const slideGamePending = async (io) => {
  try {
    if (!slideGame) return setTimeout(() => slideGameStart(io), 1000);

    if (slideGame.state !== "pending") {
      slideGame.state = "pending";
      slideGame.updatedAt = new Date().getTime();

      io.of("/slide").to("slide").emit("game", {
        game: slideSanitizeGame(slideGame),
      });
    }

    if (slideBetPendingCount <= 0) {
      slideGameFairness(io);
    } else {
      setTimeout(() => {
        slideGamePending(io);
      }, 500);
    }
  } catch (err) {
    logger.error(err);
    setTimeout(() => slideGamePending(io), 1000);
  }
};

const slideGameFairness = async (io) => {
  try {
    if (!slideGame) return setTimeout(() => slideGameStart(io), 1000);

    slideGame.state = "fairness";
    slideGame.updatedAt = new Date().getTime();

    if (!slideGame.fair.blockNum) {
      const fairData = await fairGetData();
      slideGame.fair.blockNum = fairData.data.head_block_num + 1;

      io.of("/slide").to("slide").emit("game", {
        game: slideSanitizeGame(slideGame),
      });
    }

    const fairBlockData = await fairGetBlockData(slideGame.fair.blockNum);
    slideGame.fair.seedPublic = fairBlockData.data.id;

    slideGame.outcome = slideGetOutcome(slideGame);

    slideGame.state = "rolling";
    slideGame.updatedAt = new Date().getTime();

    io.of("/slide").to("slide").emit("game", {
      game: slideSanitizeGame(slideGame),
    });

    setTimeout(() => {
      slideGameComplete(io);
    }, 5500);
  } catch (err) {
    logger.error("Error en Slide Provably Fair, reintentando fase en 2s...", err);
    setTimeout(() => {
      slideGameFairness(io);
    }, 2000);
  }
};

const slideGameComplete = async (io) => {
  try {
    if (!slideGame) return setTimeout(() => slideGameStart(io), 1000);

    slideGame.state = "completed";

    let promisesUsers = [];
    let promisesBets = [];
    let amountBetTotal = 0;
    let amountPayoutTotal = 0;

    const { winningColour, winningMultiplier } = getWinningColour(
      slideGame.outcome,
    );
    
    for (let bet of slideBets) {
      let amountPayout = 0;

      if (winningColour === bet.color) {
        let multiplier = limitMultiplier(
          bet.amount,
          winningMultiplier,
          "slide",
        );
        amountPayout = bet.amount * multiplier;
        bet.multiplier = multiplier;
      }

      if (bet.user.rank !== "admin") {
        amountBetTotal = amountBetTotal + bet.amount;
        amountPayoutTotal = amountPayoutTotal + amountPayout;
      }

      updateAffiliate(bet.user, bet.amount, SLIDE_HOUSE_EDGE);
      if (amountPayout > 0) {
        tryToClaim(bet.user, bet.amount, "slide", bet.multiplier, io);
      }

      const currencyKey = bet.currency ? bet.currency.toLowerCase() : 'sc';

      if (amountPayout > 0) {
        promisesUsers.push(
          User.findByIdAndUpdate(
            bet.user._id,
            {
              $inc: {
                [`wallet.${currencyKey}`]: amountPayout,
                "stats.total.won": amountPayout,
                "stats.slide.won": amountPayout,
              }
            },
            { new: true }
          ).lean()
        );
      } else {
        promisesUsers.push(User.findById(bet.user._id).lean());
      }

      promisesBets.push(
        SlideBet.findByIdAndUpdate(
          bet._id,
          {
            multiplier: bet.multiplier || 0,
            payout: amountPayout,
            updatedAt: new Date().getTime(),
          },
          { new: true },
        )
          .select("amount payout user currency updatedAt createdAt multiplier")
          .populate({
            path: "user",
            select: "username avatar rank xp stats rakeback anonymous wallet createdAt",
          })
          .lean(),
      );
    }

    updateReports({ rank: "user" }, amountBetTotal, amountPayoutTotal, "slide");
    
    const dataDatabase = await Promise.all([
      SlideGame.findByIdAndUpdate(
        slideGame._id,
        {
          outcome: slideGame.outcome,
          fair: slideGame.fair,
          state: "completed",
          updatedAt: new Date().getTime(),
        },
        { new: true },
      )
        .select("outcome state createdAt")
        .lean(),
      ...promisesUsers,
      ...promisesBets,
    ]);

    // Sanitización de historial con tiempos unificados
    if (dataDatabase[0]) {
      dataDatabase[0].createdAt = new Date(dataDatabase[0].createdAt).getTime();
      slideHistory.unshift(dataDatabase[0]);
    }
    
    if (slideHistory.length > 100) {
      slideHistory.pop();
    }

    dataDatabase[0].fair = slideGame.fair; 
    
    io.of("/slide").to("slide").emit("game", { game: slideSanitizeGame(dataDatabase[0]) });

    // Acreditación de saldo en vivo para ganadores y perdedores
    for (const user of dataDatabase.slice(1, promisesUsers.length + 1)) {
      if(user && user._id) {
        io.of("/general").to(user._id.toString()).emit("user", { user: user });
      }
    }

    for (const bet of dataDatabase.slice(promisesUsers.length + 1)) {
      if (!bet) continue;
      bet.game = dataDatabase[0];
      bet.game.fair = slideGame.fair;

      generalAddBetsList(
        io,
        {
          ...bet,
          method: "slide",
        },
        bet.user,
      );
    }

    setTimeout(() => {
      slideGameStart(io);
    }, 1000 * 3);
  } catch (err) {
    logger.error("Error en completado de Slide, reintentando bucle...", err);
    setTimeout(() => slideGameStart(io), 2000);
  }
};

const slideInit = async (io) => {
  try {
    let [lastGame, completedGames] = await Promise.all([
      SlideGame.findOne({})
        .sort({ createdAt: -1 })
        .select("fair state createdAt gameIndex bets")
        .populate({
          path: "fair.seed",
          select: "seedServer index previousHash",
        })
        .populate({ path: "bets", select: "amount payout game user currency" })
        .lean(),
      SlideGame.find({ state: "completed" })
        .sort({ createdAt: -1 })
        .limit(100)
        .select("outcome fair state createdAt")
        .lean(),
    ]);

    slideHistory = completedGames.map(game => ({
      ...game,
      createdAt: new Date(game.createdAt).getTime()
    })) || [];

    if (lastGame && lastGame.state !== "completed" && Array.isArray(lastGame.bets)) {
      let promises = [];

      for (const bet of lastGame.bets) {
        if (bet && bet.payout === undefined) {
          const currencyKey = bet.currency ? bet.currency.toLowerCase() : 'sc';

          promises = [
            ...promises,
            SlideBet.findByIdAndUpdate(bet._id, {
              payout: bet.amount,
              updatedAt: new Date().getTime(),
            }),
            User.findByIdAndUpdate(bet.user, {
              $inc: {
                [`wallet.${currencyKey}`]: bet.amount, 
                "stats.total.bet": -bet.amount,
                "stats.slide.bet": -bet.amount,
              },
              updatedAt: new Date().getTime(),
            }),
          ];
        }
      }

      lastGame.outcome = slideGetOutcome(lastGame);

      let dataDatabase = await Promise.all([
        SlideGame.findByIdAndUpdate(
          lastGame._id,
          {
            outcome: lastGame.outcome,
            state: "completed",
            updatedAt: new Date().getTime(),
          },
          { new: true },
        )
          .select("outcome fair.nonce state createdAt")
          .lean(),
        ...promises,
      ]);

      if (dataDatabase[0]) {
        dataDatabase[0].createdAt = new Date(dataDatabase[0].createdAt).getTime();
        slideHistory.unshift(dataDatabase[0]);
        if (slideHistory.length > 100) {
          slideHistory.pop();
        }
      }
    }

    slideGameStart(io);
  } catch (err) {
    logger.error("Error crítico en slideInit, reintentando inicialización completa...", err);
    setTimeout(() => slideInit(io), 3000);
  }
};

const slideGetOutcome = (slideGame) => {
  if (!slideGame || !slideGame.fair || !slideGame.fair.seed) return 0;
  const combined = `${slideGame.fair.seed.seedServer}-${slideGame.fair.seedPublic}`;
  const hash = crypto.createHash("sha256").update(combined).digest("hex");
  return Math.abs(parseInt(hash.substr(0, 8), 16)) % 15;
};

const slideGenerateGame = async () => {
  const lastGameDb = await SlideGame.findOne({}).sort({ createdAt: -1 }).lean();

  let gameIndex = 0;
  if (lastGameDb && typeof lastGameDb.gameIndex === "number") {
    gameIndex = lastGameDb.gameIndex + 1;
  }

  const seedIndex = NUMBER_OF_SLIDE_SEEDS - 1 - (gameIndex % NUMBER_OF_SLIDE_SEEDS);
  let seed = await SlideSeed.findOne({ index: seedIndex }).lean();

  if (!seed) {
    seed = await SlideSeed.findOne({}).lean();
    if (!seed) {
      throw new Error("No se encontraron registros de semillas en la colección 'SlideSeed'.");
    }
  }

  let gameDatabase = await SlideGame.create({
    gameIndex: gameIndex,
    fair: {
      seed: seed._id,
    },
    state: "created",
  });

  const gameObject = gameDatabase.toObject();
  gameObject.fair = { seed: seed };

  // Forzar que el objeto local tenga marcas de tiempo numéricas uniformes
  gameObject.createdAt = new Date(gameObject.createdAt).getTime();
  gameObject.updatedAt = new Date(gameObject.updatedAt).getTime();

  return gameObject;
};

module.exports = {
  slideGetDataSocket,
  slideSendBetSocket,
  slideInit,
};