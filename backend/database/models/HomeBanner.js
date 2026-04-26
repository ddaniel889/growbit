const mongoose = require("mongoose");

const homeBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      default: "View Now",
    },
    buttonUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageClass: {
      type: String,
      default: "",
    },
    backgroundGradient: {
      type: String,
      default: "linear-gradient(180deg, #1d3330 0%, #0c1c1a 100%)",
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("HomeBanner", homeBannerSchema);
