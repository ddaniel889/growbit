const mongoose = require("mongoose");

const slideGameSchema = new mongoose.Schema(
  {
    outcome: { type: Number },
    fair: {
      seed: { type: mongoose.Schema.ObjectId, ref: "SlideSeed" },
      seedPublic: { type: String },
      blockNum: { type: String },
    },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    currency: { type: String, enum: ["sc", "gc"], default: "sc" }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Reverse populate with virtuals
slideGameSchema.virtual("bets", {
  ref: "SlideBet",
  localField: "_id",
  foreignField: "game",
  justOne: false,
});

module.exports = mongoose.model("SlideGame", slideGameSchema);
