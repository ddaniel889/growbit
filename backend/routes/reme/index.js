const express = require("express");
const router = express.Router();
const { settingCheck } = require("../../utils/setting");

const { authorizeUser } = require("../../middleware/auth");
const { gameRateLimiterMiddleware } = require("../../middleware/rateLimiter");
const { play } = require("../../services/reme");
const User = require("../../database/models/User");
const {
  socketCheckAntiSpam,
  socketRemoveAntiSpam,
  checkVerified,
} = require("../../utils/socket");

const REME_MIN_AMOUNT = process.env.REME_MIN_AMOUNT || 0.01;

module.exports = (io) => {
  router.post(
    "/roll",
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
        settingCheck(req.user, "games.reme.enabled");

        const betAmount = +req.body.amount;
        const autobet = req.body.autobet;
        // NUEVO: Recibir la moneda elegida por el cliente, por defecto cae en 'sc'
        const currency = req.body.currency ? req.body.currency.toLowerCase() : "sc";

        validateParams(betAmount, currency);

        // AJUSTE: Cambiamos 'balance' por 'wallet' en la proyección de Mongoose
        const user = await User.findById(req.user._id)
          .select(
            "rank wallet local.emailVerified stats limits fair username mute ban affiliates",
          )
          .lean();

        checkVerified(user);

        // AJUSTE: Ahora validamos contra la billetera multi-moneda
        checkBalance(user, betAmount, currency);

        // AJUSTE: Le inyectamos la variable 'currency' al servicio play() 
        // para que sepa de dónde descontar y acreditar de forma atómica
        const { rolls, multiplier } = await play(user, betAmount, io, autobet, currency);

        socketRemoveAntiSpam(userId);
        res
          .status(200)
          .json({ success: true, rolls: rolls, multiplier: multiplier });
      } catch (err) {
        console.error(err);
        socketRemoveAntiSpam(userId);
        res.status(500).json({
          success: false,
          error: { type: "error", message: err.message },
        });
      }
    },
  );

  return router;
};

// AJUSTE: Agregamos soporte visual de moneda al string de error
function validateParams(amount, currency) {
  if (!amount || isNaN(amount)) {
    throw new Error("Invalid Amount");
  }

  if (amount < REME_MIN_AMOUNT) {
    throw new Error(
      `You need to bet at least ${parseFloat(REME_MIN_AMOUNT).toFixed(2)} ${currency.toUpperCase()}.`,
    );
  }
}

// AJUSTE: Comprobación dinámica de saldo basada en la billetera multi-moneda
function checkBalance(user, betAmount, currency) {
  if (!user) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  }
  
  // Extraemos dinámicamente el balance de la moneda solicitada ('sc' o 'gc')
  const currentWalletBalance = user.wallet ? user.wallet[currency] : 0;

  if (currentWalletBalance < betAmount) {
    throw new Error(`You have not enough ${currency.toUpperCase()} balance for this action.`);
  }
}