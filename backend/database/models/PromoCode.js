const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema(
  {
    code: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    reward: { 
      type: Number, 
      required: true 
    },
    
    currency: { 
      type: String, 
      enum: ["sc", "gc"], 
      default: "sc", 
      lowerCase: true 
    },
    minWager: { 
      type: Number, 
      default: 0 
    },
    redeemers: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: "User" },
        claimedAt: { type: Date, default: Date.now }
      },
    ],
    ips: [{ type: String }],
    redeemptionsTotal: { 
      type: Number, 
      default: 0 
    },
    redeemptionsMax: { 
      type: Number, 
      required: true 
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PromoCode", promoCodeSchema);