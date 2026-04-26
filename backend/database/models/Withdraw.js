const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  address: { type: String, required: true },
  currency: { type: String, required: true },
  batch_id: { type: String, unique: true }, // ID devuelto por NowPayments
  status: { type: String, default: "PENDING" }, // PENDING, PAID, FAILED
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Withdraw", withdrawSchema);
