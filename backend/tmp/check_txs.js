require("dotenv").config({
  path: "c:/Users/USER/Desktop/growbit/growbit/backend/.env",
});
const mongoose = require("mongoose");
const CryptoTransaction = require("../database/models/CryptoTransaction");

async function checkTransactions() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to DB");

    const latest = await CryptoTransaction.find({ type: "deposit" })
      .sort({ createdAt: -1 })
      .limit(5);
    console.log("Latest deposits:", JSON.stringify(latest, null, 2));

    const pendingWithdraws = await CryptoTransaction.find({
      type: "withdraw",
      state: { $ne: "completed" },
    });
    console.log("Pending withdraws count:", pendingWithdraws.length);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

checkTransactions();
