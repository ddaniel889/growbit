const mongoose = require("mongoose");
require("dotenv").config();
const HomeBanner = require("../database/models/HomeBanner");

const seedData = [
  {
    title: "Growbit Jackpots",
    description:
      "Whenever you play Cases, Battles or Slots you play for a chance to win big!",
    buttonText: "View Jackpots",
    buttonUrl: "/cases",
    imageUrl: "/img/hero_wizard.png",
    imageClass: "wizard",
    backgroundGradient: "linear-gradient(180deg, #1d3330 0%, #0c1c1a 100%)",
    order: 0,
  },
  {
    title: "Daily Race",
    description: "Compete for total of 60 BGL every single day!",
    buttonText: "View Race",
    buttonUrl: "/leaderboard",
    imageUrl: "/img/banner/race.png",
    imageClass: "plane",
    backgroundGradient: "linear-gradient(180deg, #4456ef 0%, #2b3990 100%)",
    order: 1,
  },
  {
    title: "Challenges",
    description: "Check out our active challenges and win extra rewards!",
    buttonText: "View Challenges",
    buttonUrl: "/challenges",
    imageUrl: "/img/hero_vip.png",
    imageClass: "vip",
    backgroundGradient: "linear-gradient(180deg, #1d2b33 0%, #0c141c 100%)",
    order: 2,
  },
];

async function seed() {
  try {
    const mongoUri =
      process.env.DATABASE_URI ||
      process.env.DATABASE_URL ||
      process.env.MONGO_URI;
    if (!mongoUri) throw new Error("No database URI found in .env");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding banners...");

    // Clear existing
    await HomeBanner.deleteMany({});

    // Insert new
    await HomeBanner.insertMany(seedData);
    console.log("Successfully seeded 3 hero banners!");

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
