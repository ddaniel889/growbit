const User = require("../../../database/models/User");
const BalanceTransaction = require("../../../database/models/BalanceTransaction");

// Load utils
const { socketRemoveAntiSpam } = require("../../../utils/socket");
const {
  generalCheckSendRakebackClaimUser,
} = require("../../../utils/general/rakeback");

const RAKEBACK_TYPES = ["daily", "weekly", "monthly"];
const MIN_CLAIM = process.env.RAKEBACK_MIN_CLAIM || 0.001;

const generalSendRakebackClaimSocket = async (
  io,
  socket,
  user,
  data,
  callback,
) => {
  try {
    const rakebackType = data.rakebackType;

    if (!RAKEBACK_TYPES.includes(rakebackType)) {
      return callback({
        success: false,
        error: { type: "error", message: "Invalid Rakeback Type" },
      });
    }

    const rakebackData = user.rakeback[rakebackType];

    if (rakebackData.available < MIN_CLAIM) {
      // CAMBIADO: Mensaje adaptado para expresar la moneda dorada GC
      throw new Error(`You can't claim less than ${MIN_CLAIM} GC`);
    }

    generalCheckSendRakebackClaimUser(rakebackData, rakebackType);

    // Update user balance and reset available rakeback
    const dataDatabase = await Promise.all([
      User.findByIdAndUpdate(
        user._id,
        {
          // CAMBIADO: Se modificó "wallet.sc" a "wallet.gc" para acreditar la moneda dorada gratuita
          $inc: { "wallet.gc": rakebackData.available }, 
          [`rakeback.${rakebackType}.available`]: 0,
          [`rakeback.${rakebackType}.lastClaimed`]: new Date(),
        },
        { new: true },
      ).select("balance wallet xp stats rakeback mute ban verifiedAt updatedAt"),
      BalanceTransaction.create({
        amount: rakebackData.available,
        type: `${rakebackType}RakebackClaim`,
        user: user._id,
        state: "completed",
        currency: "gc" 
        // OPCIONAL/RECOMENDADO: Si tu modelo BalanceTransaction soporta especificar la moneda, 
        // puedes añadir currency: "gc" aquí si lo consideras necesario para tus auditorías.
      }),
    ]);

    callback({ success: true, user: dataDatabase[0] });

    socketRemoveAntiSpam(user._id);
  } catch (err) {
    socketRemoveAntiSpam(socket.decoded._id);
    callback({
      success: false,
      error: { type: "error", message: err.message },
    });
  }
};

module.exports = {
  generalSendRakebackClaimSocket,
};