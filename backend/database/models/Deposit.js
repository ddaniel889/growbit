const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true }, // Cantidad en SC
  pay_amount: { type: Number }, // Cantidad exacta en Crypto (ej: 10.5 USDT)
  pay_currency: { type: String }, // usdttrc20, etc.
  payment_id: { type: String, unique: true }, // ID de NOWPayments
  pay_address: { type: String }, // Dirección donde el usuario debe depositar
  status: { type: String, default: "waiting" }, // waiting, finished, failed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("deposit", depositSchema);
