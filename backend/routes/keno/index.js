const express = require("express");
const router = express.Router();

const { authorizeUser } = require("../../middleware/auth");
const { gameRateLimiterMiddleware } = require("../../middleware/rateLimiter");
const User = require("../../database/models/User");
const { play, KENO_MAX_AMOUNT } = require("../../services/keno");
const { settingCheck } = require("../../utils/setting");
const {
  socketCheckAntiSpam,
  socketRemoveAntiSpam,
  checkVerified,
} = require("../../utils/socket");

const KENO_MIN_AMOUNT = process.env.KENO_MIN_AMOUNT || 0.01;

module.exports = (io) => {
  router.post(
    "/play",
    [gameRateLimiterMiddleware, authorizeUser(true)],
    async (req, res) => {
      let userId;

      try {
        userId = req.user._id.toString();
        await socketCheckAntiSpam(userId);
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: { type: "error", message: err.message },
        });
      }

      try {
        settingCheck(req.user, "games.keno.enabled");

        const picks = req.body.picks;
        const betAmount = +req.body.amount;
        const mode = req.body.mode;
        const currency = req.body.currency || "sc"; // Capturamos la divisa activa

        validateParams(betAmount, picks, currency);

        const user = await User.findById(req.user._id)
          .select(
            "rank balance wallet local.emailVerified stats limits fair username mute ban affiliates",
          )
          .lean();

        checkVerified(user);

        // Validamos el saldo dinámicamente según la moneda elegida
        checkBalance(user, betAmount, currency);

        const { numbers } = await play(user, picks, betAmount, mode, io, currency);

        await socketRemoveAntiSpam(userId);
        res.status(200).json({ success: true, numbers: numbers });
      } catch (err) {
        await socketRemoveAntiSpam(userId);
        res.status(500).json({
          success: false,
          error: { type: "error", message: err.message },
        });
      }
    },
  );

  return router;
};

function validateParams(amount, picks, currency) {
  if (!amount || isNaN(amount)) {
    throw new Error("Invalid Amount");
  }

  if (amount < KENO_MIN_AMOUNT) {
    throw new Error(
      `You need to bet at least ${parseFloat(KENO_MIN_AMOUNT).toFixed(2)} ${currency.toUpperCase()}.`,
    );
  }

  if (amount > KENO_MAX_AMOUNT) {
    throw new Error(
      `You can bet max ${parseFloat(KENO_MAX_AMOUNT).toFixed(2)} ${currency.toUpperCase()}.`,
    );
  }

  if (!picks || !picks?.length) {
    throw new Error("Invalid picks");
  }
  if (picks.length > 10) {
    throw new Error("You have picket too many numbers!");
  }
}

function checkBalance(user, betAmount, currency) {
  if (!user) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  }
  
  // Verificación dinámica bimoneda
  const userWalletBalance = user.wallet ? user.wallet[currency.toLowerCase()] : user.balance;
  if (userWalletBalance < betAmount) {
    throw new Error("You have not enough balance for this action.");
  }
}
