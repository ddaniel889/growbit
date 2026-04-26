require("dotenv").config({
  path: "c:/Users/USER/Desktop/growbit/growbit/backend/.env",
});
const mongoose = require("mongoose");
const crypto = require("crypto");
const CrashSeed = require("../database/models/CrashSeed");
const SlideSeed = require("../database/models/SlideSeed");

async function generateSmallSeeds() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to DB");

    const countCrash = await CrashSeed.countDocuments();
    if (countCrash === 0) {
      console.log("Generating 1000 Crash seeds...");
      let seeds = [];
      let prevHash = crypto.randomBytes(24).toString("hex");
      for (let i = 0; i < 1000; i++) {
        let hash = crypto.createHash("sha256").update(prevHash).digest("hex");
        seeds.push({ index: i, seedServer: hash, previousHash: prevHash });
        prevHash = hash;
      }
      await CrashSeed.insertMany(seeds);
      console.log("Crash seeds generated.");
    }

    const countSlide = await SlideSeed.countDocuments();
    if (countSlide === 0) {
      console.log("Generating 1000 Slide seeds...");
      let seeds = [];
      let prevHash = crypto.randomBytes(24).toString("hex");
      for (let i = 0; i < 1000; i++) {
        let hash = crypto.createHash("sha256").update(prevHash).digest("hex");
        seeds.push({ index: i, seedServer: hash, previousHash: prevHash });
        prevHash = hash;
      }
      await SlideSeed.insertMany(seeds);
      console.log("Slide seeds generated.");
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

generateSmallSeeds();
