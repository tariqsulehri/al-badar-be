const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "test" ? "silent" : "info"),
  format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
  transports: [new winston.transports.Console()],
});

/** Accepts both logger.error(message) and logger.error({ err, ...meta }, message). */
const wrap = (level) => (metaOrMessage, message) => {
  if (typeof metaOrMessage === "string") return logger.log(level, metaOrMessage);
  const { err, ...meta } = metaOrMessage || {};
  return logger.log(level, message || err?.message || "", {
    ...meta,
    ...(err ? { error: err.message, stack: err.stack } : {}),
  });
};

module.exports = { info: wrap("info"), warn: wrap("warn"), error: wrap("error"), debug: wrap("debug") };
