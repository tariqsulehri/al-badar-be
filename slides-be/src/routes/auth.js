const express = require("express");
const rateLimit = require("express-rate-limit");
const asyncHandler = require("../middleware/asyncHandler");
const usersController = require("../controllers/usersController");

const router = express.Router();

// Slow down password guessing: 10 attempts per IP per 15 minutes.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.LOGIN_RATE_LIMIT) || 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { status: "error", message: "Too many login attempts, please try again later", result: null },
});

router.post("/", loginLimiter, asyncHandler(usersController.login));

module.exports = router;
