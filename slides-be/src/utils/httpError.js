/**
 * Error carrying an HTTP status. Throw it from controllers/services and the
 * central error handler turns it into a JSON response.
 */
class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }

  static badRequest(message = "Bad request", details) {
    return new HttpError(400, message, details);
  }

  static unauthorized(message = "Authentication required") {
    return new HttpError(401, message);
  }

  static forbidden(message = "Access denied") {
    return new HttpError(403, message);
  }

  static notFound(message = "Record not found") {
    return new HttpError(404, message);
  }

  static conflict(message = "Record already exists") {
    return new HttpError(409, message);
  }
}

module.exports = HttpError;
