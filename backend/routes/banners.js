const express = require("express");
const router = express.Router();
const HomeBanner = require("../database/models/HomeBanner");

module.exports = () => {
  // Get active banners for frontend
  router.get("/", async (req, res) => {
    try {
      const banners = await HomeBanner.find({ active: true }).sort({
        order: 1,
      });
      res.json({ success: true, banners });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
};
