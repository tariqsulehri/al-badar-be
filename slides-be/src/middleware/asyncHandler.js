/** Forwards rejected promises from async route handlers to the error handler (Express 4). */
module.exports = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
