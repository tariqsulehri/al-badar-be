const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * Builds the standard route set used by every resource:
 *   POST /create, POST /update/:id, GET /find/:id, DELETE /delete/:id, GET /list
 * plus any extra GET routes (e.g. { "/list_for_select": handler }).
 */
const crudRouter = (controller, extraGetRoutes = {}) => {
  const router = express.Router();

  router.post("/create", asyncHandler(controller.create));
  router.post("/update/:id", asyncHandler(controller.update));
  router.get("/find/:id", asyncHandler(controller.findById));
  router.delete("/delete/:id", asyncHandler(controller.remove));
  router.get("/list", asyncHandler(controller.list));

  Object.entries(extraGetRoutes).forEach(([path, handler]) => router.get(path, asyncHandler(handler)));

  return router;
};

module.exports = crudRouter;
