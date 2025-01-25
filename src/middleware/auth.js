const jwt = require("jsonwebtoken");
const HttpCodes = require("../constants/httpCodes");
const AppMessages = require("../constants/appMessages");
const ErrorResponse = require("../composer/error-response");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(HttpCodes.FORBIDDEN).send(new ErrorResponse(AppMessages.APP_ACCESS_DENIED));
  }

  try {
    // const decoded = jwt.verify(token, process.env.NODE_SECRET_KEY);
    // console.log(decoded);
    // req.user = decoded;

    next();
  } catch (ex) {
    return res.status(HttpCodes.FORBIDDEN).send(new ErrorResponse(AppMessages.APP_ACCESS_DENIED));
  }
}

module.exports = auth;
