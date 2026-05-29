const UserSeed = require("../../database/models/UserSeed");
const crypto = require("crypto");
const { calculateRakeback } = require("../../utils/general/rakeback");
const User = require("../../database/models/User");
const QuickGame = require("../../database/models/QuickGame");
const {
  getPayoutMultiplierForHole,
  PLINKO_HOUSE_EDGE,
} = require("./payout_list");
const { buildRandomBools } = require("../../utils/games/provability_fair");
const {
  updateAffiliate,
  updateReports,
  updateNonce,
  updateUser,
  limitMultiplier,
} = require("../../utils/games/games");
const { generalAddBetsList } = require("../general/bets");
const { generalSanitizeUserSeed } = require("../../utils/general/user");
const { tryToClaim } = require("../challenges");

/**
 * Procesa una jugada de Plinko bajo el sistema bimoneda (sc / gc)
 * @param {Object} user - Objeto del usuario actual
 * @param {Number} amount - Monto apostado
 * @param {Number} rows - Cantidad de filas (8 a 16)
 * @param {String} risk - Nivel de riesgo (low, medium, high)
 * @param {Object} io - Instancia de Socket.io
 * @param {String} currency - Divisa activa seleccionada ('sc' o 'gc')
 */
async function playPlinko(user, amount, rows, risk, io, currency = "sc") {
  
  // =========================================================================
  // FASE 1: DESCONTAR APUESTA AL LANZAR LA BOLA
  // =========================================================================
  // Parámetros: payoutAmount=0, balance=-amount, wager=amount, houseEdge=PLINKO_HOUSE_EDGE
  let wageredUser = await updateUser(
    0, 
    -amount, 
    amount, 
    PLINKO_HOUSE_EDGE, 
    user, 
    currency
  );

  io.of("/general").to(user._id.toString()).emit("user", { user: wageredUser });

  // Lógica del Sistema de Transparencia (Provably Fair)
  const provabilityFair = await UserSeed.findOne({
    user: user._id,
    state: "active",
  }).select("seedClient seedServer nonce hash user state");

  const combined = `${provabilityFair.seedServer}-${provabilityFair.nonce}-${provabilityFair.seedClient}`;
  const hash = crypto.createHash("sha256").update(combined).digest("hex");

  const shuffledGroup = buildRandomBools(rows, hash);

  const path = calculateBallPath(shuffledGroup, rows);
  const hole = getHoleFromBallPath(path);

  // Obtener multiplicador basado en la casilla de caída
  let payoutMultiplier = getPayoutMultiplierForHole(hole, risk, rows);
  payoutMultiplier = limitMultiplier(amount, payoutMultiplier, "plinko");

  const payoutAmount = payoutMultiplier * amount;

  let promises = [];

  promises = [
    updateNonce(provabilityFair._id),
    QuickGame.create({
      game: "plinko",
      amount: amount,
      payout: payoutAmount,
      multiplier: payoutMultiplier,
      currency: currency.toLowerCase(), // Guardamos explícitamente la divisa en la BD
      data: {
        rows,
        risk: risk,
        path,
      },
      fair: {
        nonce: provabilityFair.nonce,
        seed: provabilityFair._id,
      },
      user: user._id,
      state: "completed",
    }),
  ];

  let [updatedSeed, game] = await Promise.all(promises);

  // Actualizaciones de utilidades generales de la plataforma
  updateAffiliate(user, amount, PLINKO_HOUSE_EDGE);
  updateReports(user, amount, payoutAmount, "plinko");
  tryToClaim(user, amount, "plinko", payoutMultiplier, io);

  // Poblar información del usuario para el historial general
  game = await game.populate({
    path: "user",
    select: "username stats avatar rank anonymous",
  });

  game = game.toObject();
  game.method = "plinko";
  game.fair = { seed: generalSanitizeUserSeed(provabilityFair) };

  // =========================================================================
  // FASE 2: ACREDITAR GANANCIA CUANDO LA BOLA TERMINA DE CAER
  // =========================================================================
  setTimeout(
    async () => {
      // Parámetros: 
      // - payoutAmount: Incrementa estadísticas globales de ganancias
      // - balance (payoutAmount): Suma el premio obtenido en wallet.sc o wallet.gc
      // - wager (0): Enviamos 0 porque la apuesta y su volumen ya se procesaron en la Fase 1
      let updatedUser = await updateUser(
        payoutAmount,
        payoutAmount,
        0,
        PLINKO_HOUSE_EDGE,
        user,
        currency
      );

      // Sincronizar el nuevo estado del cliente bimoneda vía Socket global
      io.of("/general")
        .to(user._id.toString())
        .emit("user", { user: updatedUser });

      // Insertar la apuesta en el feed público en tiempo real de la plataforma
      generalAddBetsList(
        io,
        {
          ...game,
          method: "plinko",
        },
        game.user,
      );
    },
    game.data.rows * 200 + 700, // Tiempo exacto que tarda la física visual en el front
  );

  return {
    game,
  };
}

// Helpers matemáticos del motor físico de Plinko (Sin cambios)
function calculateBallPath(randNumber, numRows) {
  if (randNumber.length < numRows) {
    throw new Error(
      `randNumber array length must at least equal to ${numRows}`,
    );
  }

  const path = [];
  let prev_col = 0;
  for (let i = 0; i < numRows; i++) {
    const row = i + 1;
    const is_left = !!randNumber[i];
    const column = is_left ? prev_col : prev_col + 1;
    path.push({
      row,
      column,
    });
    prev_col = column;
  }

  return path;
}

function getHoleFromBallPath(path) {
  return path[path.length - 1].column;
}

module.exports = {
  playPlinko,
};