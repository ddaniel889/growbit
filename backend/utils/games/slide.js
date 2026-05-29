/**
/**
 * House Edge Calculation
 *
 * For purple and red 7/15 * 2 = 0.93
 *
 */
const SLIDE_HOUSE_EDGE = 7;
const SLIDE_MAX_AMOUNT = process.env.SLIDE_MAX_AMOUNT || 500;
const SLIDE_MIN_AMOUNT = process.env.SLIDE_MIN_AMOUNT || 0.01;

const slideCheckSendBetData = (data) => {
  if (data === undefined || data === null) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  } else if (
    data.color === undefined ||
    typeof data.color !== "string" ||
    ["red", "yellow", "purple"].includes(data.color) === false
  ) {
    throw new Error("Your provided bet color is invalid.");
  } else if (
    data.amount === undefined ||
    isNaN(data.amount) === true ||
    data.amount <= 0
  ) {
    throw new Error("Your provided bet amount is invalid.");
  } else if (data.amount < SLIDE_MIN_AMOUNT) {
    throw new Error(
      `You can only bet a min amount of $${parseFloat(SLIDE_MIN_AMOUNT)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} per bet.`,
    );
  } else if (data.amount > SLIDE_MAX_AMOUNT) {
    throw new Error(
      `You can only bet a max amount of $${parseFloat(SLIDE_MAX_AMOUNT)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} per bet.`,
    );
  }
};

const slideCheckSendBetUser = (data, user, slideBets) => {
  // Aseguramos que venga una moneda válida en el payload ('sc' o 'gc')
  const currencyKey = data.currency ? data.currency.toLowerCase() : 'sc';

  if (!["sc", "gc"].includes(currencyKey)) {
    throw new Error("Invalid currency selected.");
  }

  // Verificación dinámica en la billetera del usuario
  const hasEnoughWalletBalance = user.wallet && user.wallet[currencyKey] >= data.amount;

  if (!hasEnoughWalletBalance) {
    throw new Error("You don't have enough balance for this action.");
  } else if (
    slideBets.filter(
      (element) => element.user._id.toString() === user._id.toString(),
    ).length >= 1
  ) {
    throw new Error(`You can only bet once per game.`);
  }
};

const slideCheckSendBetGame = (slideGame) => {
  if (
    slideGame.state !== "created" ||
    new Date().getTime() - 13 * 1000 >= new Date(slideGame.createdAt).getTime()
  ) {
    throw new Error("You need to wait for the next round before you can bet.");
  }
};

const getWinningColour = (number) => {
  if (number === 0) {
    return { winningColour: "yellow", winningMultiplier: 14 };
  } else if (number % 2 === 0) {
    return { winningColour: "red", winningMultiplier: 2 };
  } else {
    return { winningColour: "purple", winningMultiplier: 2 };
  }
};

const slideSanitizeGame = (game) => {
  if (!game) {
    const now = new Date().getTime();
    return {
      state: "created",
      createdAt: now,
      updatedAt: now,
      history: []
    };
  }

  return {
    _id: game._id,
    gameIndex: game.gameIndex,
    state: game.state,
    outcome: game.outcome,
    fair: game.fair ? { blockNum: game.fair.blockNum } : undefined,
    // Garante absoluto de conversión a número Unix timestamp (milisegundos)
    createdAt: game.createdAt ? new Date(game.createdAt).getTime() : new Date().getTime(),
    updatedAt: game.updatedAt ? new Date(game.updatedAt).getTime() : new Date().getTime(),
  };
};

const slideSanitizeBets = (bets) => {
  let sanitized = [];

  for (const bet of bets) {
    sanitized.push({
      ...bet,
      user: {
        _id: bet.user._id,
        username: bet.user.anonymous ? "Hidden" : bet.user.username,
        avatar: bet.user.avatar,
        rank: bet.user.rank,
      },
    });
  }

  return sanitized;
};

const slideSanitizeBet = (bet) => {
  let sanitized = JSON.parse(JSON.stringify(bet));

  sanitized.user = {
    _id: sanitized.user._id,
    username: bet.user.anonymous ? "Hidden" : bet.user.username,
    avatar: sanitized.user.avatar,
    rank: sanitized.user.rank,
  };

  return sanitized;
};

module.exports = {
  slideCheckSendBetData,
  slideCheckSendBetUser,
  slideCheckSendBetGame,
  slideSanitizeGame,
  slideSanitizeBets,
  slideSanitizeBet,
  getWinningColour,
  SLIDE_HOUSE_EDGE,
  SLIDE_MAX_AMOUNT,
  SLIDE_MIN_AMOUNT,
};
