const mongoose = require("mongoose");
require("dotenv").config();

async function listCollections() {
  try {
    if (!process.env.DATABASE_URI) {
      console.error("DATABASE_URI is not defined.");
      // Try to read it manually if dotenv fails or if .env is tricky
      const fs = require("fs");
      const path = require("path");
      const envPath = path.join(__dirname, "..", ".env");
      if (fs.existsSync(envPath)) {
        const envConfig = require("dotenv").parse(fs.readFileSync(envPath));
        for (const k in envConfig) {
          process.env[k] = envConfig[k];
        }
      }
    }

    if (!process.env.DATABASE_URI) {
      console.error("Still no DATABASE_URI found. Exiting.");
      process.exit(1);
    }

    console.log("Connecting to:", process.env.DATABASE_URI.split("@")[1]); // Log safely

    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to MongoDB.");

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(`Total collections: ${collections.length}`);

    console.log("Collections:");
    collections.forEach((c) => console.log(` - ${c.name}`));

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

listCollections();
