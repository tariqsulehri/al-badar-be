const HttpError = require("../utils/httpError");

/** Use after `auth`. Allows the request only if req.user.role is one of `roles`. */
const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(HttpError.forbidden());
    }
    return next();
  };

module.exports = requireRole;
