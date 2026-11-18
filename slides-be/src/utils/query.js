const HttpError = require("./httpError");

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Case-insensitive "contains" match that is safe against regex injection / ReDoS. */
const containsRegex = (text) => ({ $regex: escapeRegExp(text), $options: "i" });

/** Case-insensitive exact match. */
const exactRegex = (text) => ({ $regex: `^${escapeRegExp(text)}$`, $options: "i" });

/** 1-based pagination parsed from the query string, clamped to sane bounds. */
const parsePagination = (query = {}, { defaultPageSize = 10, maxPageSize = 100 } = {}) => {
  const pageNo = Math.max(parseInt(query.pageNo, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(query.pageSize, 10) || defaultPageSize, 1), maxPageSize);
  return { pageNo, pageSize, skip: (pageNo - 1) * pageSize };
};

const paginatedResult = ({ data, totalRecords, pageNo, pageSize }) => ({
  data,
  totalRecords,
  pageNo,
  pageSize,
  totalPages: Math.ceil(totalRecords / pageSize),
});

/** Fields a client may never set directly. */
const PROTECTED_FIELDS = ["_id", "__v", "createdAt", "updatedAt", "created_at", "updated_at"];

/**
 * Returns the request payload as a plain object, accepting both `{ data: {...} }`
 * (what the frontend sends) and a bare body, with protected fields removed.
 */
const readPayload = (body) => {
  const payload = body && typeof body.data === "object" && body.data !== null ? body.data : body;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw HttpError.badRequest("Request body must be a JSON object");
  }
  const clean = { ...payload };
  PROTECTED_FIELDS.forEach((field) => delete clean[field]);
  return clean;
};

module.exports = { escapeRegExp, containsRegex, exactRegex, parsePagination, paginatedResult, readPayload };
