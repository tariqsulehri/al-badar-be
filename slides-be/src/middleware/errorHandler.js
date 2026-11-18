const multer = require("multer");
const mongoose = require("mongoose");
const { ZodError } = require("zod");
const HttpError = require("../utils/httpError");
const logger = require("../utils/logger");

const toHttpError = (err) => {
  if (err instanceof HttpError) return err;

  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
    return HttpError.badRequest("Validation failed", details);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return HttpError.badRequest("Validation failed", details);
  }

  if (err instanceof mongoose.Error.CastError) {
    return HttpError.badRequest(`Invalid value for ${err.path}`);
  }

  if (err && err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(", ");
    return HttpError.conflict(fields ? `A record with this ${fields} already exists` : "Duplicate record");
  }

  if (err instanceof multer.MulterError) {
    return HttpError.badRequest(err.code === "LIMIT_FILE_SIZE" ? "File is too large" : err.message);
  }

  if (err && err.type === "entity.parse.failed") {
    return HttpError.badRequest("Malformed JSON body");
  }

  return null;
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const httpError = toHttpError(err);

  if (!httpError) {
    logger.error({ err, method: req.method, url: req.originalUrl }, "Unhandled error");
    return res.status(500).json({ status: "error", message: "Internal server error", result: null });
  }

  const body = { status: "error", message: httpError.message, result: null };
  if (httpError.details) body.errors = httpError.details;
  return res.status(httpError.statusCode).json(body);
};

const notFoundHandler = (req, res) =>
  res.status(404).json({ status: "error", message: `Route not found: ${req.method} ${req.path}`, result: null });

module.exports = { errorHandler, notFoundHandler };
