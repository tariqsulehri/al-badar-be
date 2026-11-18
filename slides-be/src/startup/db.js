const mongoose = require("mongoose");
const logger = require("../utils/logger");

mongoose.set("strictQuery", true);

/** Connects to MongoDB; rejects if the connection fails so the process can exit. */
const connectDb = async (uri) => {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  logger.info("Connected to MongoDB");

  mongoose.connection.on("error", (err) => logger.error({ err }, "MongoDB connection error"));
  mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
};

module.exports = connectDb;
