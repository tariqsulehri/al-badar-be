const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { corsOrigins, nodeEnv } = require("./config/env");
const mountRoutes = require("./startup/routes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

// Behind nginx / a load balancer in production, so req.ip and req.protocol are correct.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    // Slide images are loaded by the frontend (and by pptxgenjs) from another origin.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: (origin, callback) => callback(null, !origin || corsOrigins.includes(origin)),
  })
);
app.use(express.json({ limit: "1mb" }));
if (nodeEnv !== "test") app.use(morgan(nodeEnv === "production" ? "combined" : "dev"));

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/", (req, res) => res.status(200).send("ok"));

mountRoutes(app);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
