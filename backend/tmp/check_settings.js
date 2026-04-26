require("dotenv").config({
  path: "c:/Users/USER/Desktop/growbit/growbit/backend/.env",
});
const mongoose = require("mongoose");
const Setting = require("../database/models/Setting");

async function checkSettings() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to DB");

    const settings = await Setting.findOne();
    console.log("Crypto Settings:", JSON.stringify(settings.crypto, null, 2));

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

checkSettings();
