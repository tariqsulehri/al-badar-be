const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const HttpError = require("../utils/httpError");

/**
 * Requires a valid `Authorization: Bearer <jwt>` header and sets
 * req.user = { id, username, role }.
 */
function auth(req, res, next) {
  const [scheme, token] = (req.get("authorization") || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(HttpError.unauthorized());
  }

  try {
    const payload = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
    req.user = { id: payload.sub, username: payload.username, role: payload.role };
    return next();
  } catch {
    return next(HttpError.unauthorized("Invalid or expired token"));
  }
}

module.exports = auth;
