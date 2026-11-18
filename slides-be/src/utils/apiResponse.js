/**
 * Every JSON response uses one envelope:
 *   { status: "success" | "error", message: string, result: any }
 * Errors are produced by middleware/errorHandler.js.
 */
const send = (res, httpStatus, message, result) =>
  res.status(httpStatus).json({ status: "success", message, result: result ?? null });

exports.ok = (res, result, message = "Success") => send(res, 200, message, result);

exports.created = (res, result, message = "Record created") => send(res, 201, message, result);
