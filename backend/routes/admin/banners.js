const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const HomeBanner = require("../../database/models/HomeBanner");
const { authorizeUser, authorizeAdmin } = require("../../middleware/auth");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "banners",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });

module.exports = () => {
  // Get all banners (for admin list)
  router.get("/", [authorizeUser(true), authorizeAdmin], async (req, res) => {
    try {
      const banners = await HomeBanner.find().sort({ order: 1 });
      res.json({ success: true, banners });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create new banner
  router.post(
    "/",
    [authorizeUser(true), authorizeAdmin, upload.single("image")],
    async (req, res) => {
      try {
        const {
          title,
          description,
          buttonText,
          buttonUrl,
          imageClass,
          backgroundGradient,
          order,
        } = req.body;

        const banner = new HomeBanner({
          title,
          description,
          buttonText,
          buttonUrl,
          imageUrl: req.file.path,
          imageClass,
          backgroundGradient,
          order: order || 0,
        });

        await banner.save();
        res.json({ success: true, banner });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    },
  );

  // Update banner
  router.put(
    "/:id",
    [authorizeUser(true), authorizeAdmin, upload.single("image")],
    async (req, res) => {
      try {
        const updateData = { ...req.body };
        if (req.file) {
          updateData.imageUrl = req.file.path;
        }

        const banner = await HomeBanner.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true },
        );
        res.json({ success: true, banner });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    },
  );

  // Delete banner
  router.delete(
    "/:id",
    [authorizeUser(true), authorizeAdmin],
    async (req, res) => {
      try {
        await HomeBanner.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Banner deleted" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    },
  );

  return router;
};
