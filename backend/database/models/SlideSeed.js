const mongoose = require("mongoose");

const slideSeedSchema = new mongoose.Schema({
  seedServer: { type: String, required: true },
  previousHash: { type: String, default: null },
  index: { type: Number, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SlideSeed", slideSeedSchema);
