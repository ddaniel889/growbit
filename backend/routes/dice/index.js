const express = require("express");
const router = express.Router();

const { authorizeUser } = require("../../middleware/auth");
const { gameRateLimiterMiddleware } = require("../../middleware/rateLimiter");
const { play } = require("../../services/dice");
const User = require("../../database/models/User");
const {
  socketCheckAntiSpam,
  socketRemoveAntiSpam,
  checkVerified,
} = require("../../utils/socket");

const DICE_MIN_AMOUNT = process.env.DICE_MIN_AMOUNT || 0.01;
const SUPPORTED_CURRENCIES = ["sc", "gc"];

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
        let mode = req.body.mode || "under";
        const target = Math.floor(+req.body.target);
        const target2 = Math.floor(+req.body.target2);
        const betAmount = +req.body.amount;
        
        // NUEVO: Sanitizar y validar el tipo de moneda enviado por el frontend
        const currency = req.body.currency ? req.body.currency.toLowerCase() : "sc";

        if (!SUPPORTED_CURRENCIES.includes(currency)) {
          throw new Error("Invalid Currency Type");
        }

        validateParams(betAmount, mode, target, target2, currency);

        // MODIFICADO: Añadimos 'wallet' a la proyección para poder revisar los balances reales
        const user = await User.findById(req.user._id)
          .select(
            "rank balance wallet local.emailVerified stats limits fair username mute ban affiliates",
          )
          .lean();

        checkVerified(user);

        // MODIFICADO: Ahora valida basándose en la moneda seleccionada dinámicamente
        checkBalance(user, betAmount, currency);

        // EJECUCIÓN: Pasamos la variable currency al servicio encargado del procesamiento atómico 
        // de la jugada (apuesta, generación de semilla Provably Fair y acreditación de premios).
        const { roll, win } = await play(
          user,
          target,
          target2,
          mode,
          betAmount,
          io,
          currency // Pasar la moneda al servicio interno
        );

        // NUEVO: Buscamos el estado final del usuario para retornar los nuevos balances al Header
        const updatedUser = await User.findById(req.user._id)
          .select("balance wallet xp stats rakeback mute ban verifiedAt updatedAt");

        socketRemoveAntiSpam(userId);
        
        // MODIFICADO: Retornamos 'user' para que el Front lo intercepte en el store de Vuex
        res.status(200).json({ 
          success: true, 
          roll: roll, 
          win: win, 
          user: updatedUser 
        });
      } catch (err) {
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

// MODIFICADO: Ajustamos el mensaje de error para reflejar dinámicamente la moneda en validaciones
function validateParams(amount, mode, target, target2, currency) {
  if (!amount || isNaN(amount)) {
    throw new Error("Invalid Amount");
  }

  if (amount < DICE_MIN_AMOUNT) {
    throw new Error(
      `You need to bet at least ${parseFloat(DICE_MIN_AMOUNT).toFixed(2)} ${currency.toUpperCase()}.`,
    );
  }

  if (!target || isNaN(target)) {
    throw new Error("Invalid Target");
  }
  if (target < 2 || target > 98) {
    throw new Error("Invalid Target");
  }

  if (mode === "between" || mode === "outside") {
    if (!target2 || isNaN(target2)) {
      throw new Error("Invalid Target");
    }

    if (target < 4 || target2 > 98) {
      throw new Error("Invalid Target");
    }

    // Number range must be greater than 1
    if (target2 - target <= 1) {
      throw new Error("Invalid Range");
    }
  }
}

// MODIFICADO: Verifica el saldo de la subcuenta correcta usando notación de corchetes
function checkBalance(user, betAmount, currency) {
  if (!user) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  }
  
  // Extraer saldo dinámico de wallet (ej: user.wallet.gc o user.wallet.sc)
  const currentWalletBalance = user.wallet && user.wallet[currency] ? user.wallet[currency] : 0;

  if (currentWalletBalance < betAmount) {
    throw new Error("You have not enough balance for this action.");
  }
}