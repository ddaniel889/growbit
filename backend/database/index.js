const mongoose = require("mongoose");
const { logger } = require("../utils/logger");

mongoose.set("strictQuery", true);
mongoose.set("autoIndex", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI, {
      //useUnifiedTopology: true,
      //useNewUrlParser: true,
      serverSelectionTimeoutMS: 30000,
      family: 4
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Error: ${err.message}`);
    logger.error(`MongoDB Error: ${err.message}`);
    throw err;
  }
};

module.exports = connectDB;
