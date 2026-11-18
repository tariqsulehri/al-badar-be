const mongoose = require("mongoose");
const { port, dbUri } = require("./src/config/env");
const app = require("./src/app");
const connectDb = require("./src/startup/db");
const logger = require("./src/utils/logger");

const start = async () => {
  try {
    await connectDb(dbUri);
  } catch (err) {
    logger.error({ err }, "Could not connect to MongoDB; exiting");
    process.exit(1);
  }

  const server = app.listen(port, () => logger.info(`Server is listening on port ${port}`));

  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

process.on("unhandledRejection", (err) => {
  logger.error({ err }, "Unhandled promise rejection");
});

start();
