require("dotenv").config({
  path: "c:/Users/USER/Desktop/growbit/growbit/backend/.env",
});
const mongoose = require("mongoose");
const Setting = require("../database/models/Setting");

const defaultCoins = [
  { name: "BTC", network: "Bitcoin", enabled: true, withdrawEnabled: false },
  { name: "ETH", network: "ERC20", enabled: true, withdrawEnabled: false },
  { name: "TRX", network: "TRC20", enabled: true, withdrawEnabled: false },
  { name: "LTC", network: "Litecoin", enabled: true, withdrawEnabled: true },
  { name: "USDT", network: "TRC20", enabled: true, withdrawEnabled: false },
];

async function fixCoins() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to DB");

    const settings = await Setting.findOne();
    if (settings) {
      console.log(
        "Current coins:",
        JSON.stringify(settings.crypto.coins, null, 2),
      );
      settings.crypto.coins = defaultCoins;
      settings.crypto.deposit.enabled = true;
      settings.crypto.withdraw.enabled = true;
      await settings.save();
      console.log("Coins updated successfully.");
    } else {
      console.log("Settings not found.");
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

fixCoins();
