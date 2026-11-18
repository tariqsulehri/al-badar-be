const dotenv = require("dotenv");

dotenv.config();

const REQUIRED = ["DB", "NODE_SECRET_KEY"];

const missing = REQUIRED.filter((name) => !process.env[name]);
if (missing.length && process.env.NODE_ENV !== "test") {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

if (process.env.NODE_SECRET_KEY && process.env.NODE_SECRET_KEY.length < 32) {
  // eslint-disable-next-line no-console
  console.warn("NODE_SECRET_KEY is shorter than 32 characters; use a long random value in production.");
}

const parseList = (value, fallback) =>
  (value || fallback)
    .split(",")
    .map((item) => item.trim().replace(/\/+$/, ""))
    .filter(Boolean);

module.exports = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3500,
  dbUri: process.env.DB,
  jwtSecret: process.env.NODE_SECRET_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  corsOrigins: parseList(process.env.CORS_ORIGINS, "http://localhost:3000"),
  baseUrl: (process.env.BASE_URL || "").replace(/\/+$/, ""),
});
