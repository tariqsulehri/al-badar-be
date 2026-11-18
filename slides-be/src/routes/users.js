const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const requireRole = require("../middleware/requireRole");
const usersController = require("../controllers/usersController");

// Mounted behind `auth` in startup/routes.js.
const router = express.Router();
const adminOnly = requireRole("admin");

router.get("/me", asyncHandler(usersController.me));
router.post("/change-password", asyncHandler(usersController.changePassword));

router.get("/list", adminOnly, asyncHandler(usersController.listUsers));
router.post("/create", adminOnly, asyncHandler(usersController.createUser));
router.get("/find/:id", adminOnly, asyncHandler(usersController.findUser));
router.delete("/delete/:id", adminOnly, asyncHandler(usersController.deleteUser));

module.exports = router;
