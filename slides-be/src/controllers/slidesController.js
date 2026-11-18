const slideService = require("../services/slideService");
const { ok, created } = require("../utils/apiResponse");
const HttpError = require("../utils/httpError");
const { readPayload } = require("../utils/query");
const { baseUrl } = require("../config/env");
const { PUBLIC_PATH } = require("../middleware/imageUpload");

const parseFilters = (filters) => {
  if (!filters || typeof filters !== "string") return {};
  try {
    return JSON.parse(filters);
  } catch {
    throw HttpError.badRequest("filters must be valid JSON");
  }
};

// Runs after the uploadSingleImage middleware.
exports.uploadImage = async (req, res) => {
  if (!req.file) throw HttpError.badRequest("No file uploaded");
  const origin = baseUrl || `${req.protocol}://${req.get("host")}`;
  const file = `${origin}${PUBLIC_PATH}/${req.file.filename}`;
  // `file` stays top-level for the existing frontend; `result` matches the standard envelope.
  return res.status(201).json({ status: "success", message: "File uploaded", result: { file }, file });
};

exports.create = async (req, res) => created(res, await slideService.createSlide(readPayload(req.body)));

exports.list = async (req, res) => {
  const { pageNo, pageSize, searchBy, searchText, filters } = req.query;
  const result = await slideService.getSlides({
    pageNo,
    pageSize,
    searchBy,
    searchText,
    filters: parseFilters(filters),
  });
  return ok(res, result);
};

exports.update = async (req, res) =>
  ok(res, await slideService.updateSlide(req.params.id, readPayload(req.body)), "Record updated");

exports.findById = async (req, res) => ok(res, await slideService.findSlide(req.params.id));

exports.remove = async (req, res) => {
  await slideService.deleteSlide(req.params.id);
  return ok(res, null, "Record deleted");
};
