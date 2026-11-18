const Slide = require("../models/slide.model");
const HttpError = require("../utils/httpError");
const { containsRegex, exactRegex, paginatedResult } = require("../utils/query");
const { syncLookupsFromSlides } = require("./lookupSyncService");

const SEARCHABLE_TEXT_FIELDS = [
  "code",
  "supplier",
  "provence",
  "city",
  "area",
  "subArea",
  "mediaType",
  "dimension",
  "lights",
  "status",
  "category",
];

const SEARCHABLE_NUMBER_FIELDS = [
  "height_feets",
  "width_feets",
  "supQuotedPrice",
  "supDiscountedPrice",
  "supFinalPrice",
  "quotedPrice",
  "discountedPrice",
  "finalPrice",
];

const ADVANCED_FILTER_FIELDS = ["city", "area", "subArea", "supplier", "category"];

// The selected-slides / PPTX export screen pulls large pages; everything else should stay small.
const MAX_PAGE_SIZE = 5000;

const buildSearchQuery = (searchBy = "code", searchText = "") => {
  const text = typeof searchText === "string" ? searchText.trim() : "";
  if (!text) return {};

  if (searchBy === "all") {
    const numberValue = Number(text);
    const numberQueries = Number.isNaN(numberValue)
      ? []
      : SEARCHABLE_NUMBER_FIELDS.map((field) => ({ [field]: numberValue }));
    return { $or: [...SEARCHABLE_TEXT_FIELDS.map((field) => ({ [field]: containsRegex(text) })), ...numberQueries] };
  }

  if (SEARCHABLE_TEXT_FIELDS.includes(searchBy)) {
    return { [searchBy]: containsRegex(text) };
  }

  if (SEARCHABLE_NUMBER_FIELDS.includes(searchBy)) {
    const numberValue = Number(text);
    return Number.isNaN(numberValue) ? { _id: null } : { [searchBy]: numberValue };
  }

  return { code: containsRegex(text) };
};

const buildFilterQuery = (filters) => {
  if (!filters || typeof filters !== "object") return {};
  return ADVANCED_FILTER_FIELDS.reduce((query, field) => {
    const value = typeof filters[field] === "string" ? filters[field].trim() : "";
    if (value) query[field] = exactRegex(value);
    return query;
  }, {});
};

const buildSlidesQuery = ({ searchBy, searchText, filters }) => {
  const queries = [buildSearchQuery(searchBy, searchText), buildFilterQuery(filters)].filter(
    (query) => Object.keys(query).length
  );
  if (queries.length === 0) return {};
  if (queries.length === 1) return queries[0];
  return { $and: queries };
};

const getSlides = async ({ pageNo = 1, pageSize = 10, searchBy = "code", searchText = "", filters = {} } = {}) => {
  const normalizedPageNo = Math.max(Number(pageNo) || 1, 1);
  const normalizedPageSize = Math.min(Math.max(Number(pageSize) || 10, 1), MAX_PAGE_SIZE);
  const query = buildSlidesQuery({ searchBy, searchText, filters });

  const [data, totalRecords] = await Promise.all([
    Slide.find(query)
      .sort({ createdAt: -1 })
      .skip((normalizedPageNo - 1) * normalizedPageSize)
      .limit(normalizedPageSize),
    Slide.countDocuments(query),
  ]);

  return paginatedResult({ data, totalRecords, pageNo: normalizedPageNo, pageSize: normalizedPageSize });
};

const ensureUniqueCode = async (code, excludeId) => {
  if (!code) return;
  const filter = excludeId ? { code, _id: { $ne: excludeId } } : { code };
  if (await Slide.exists(filter)) throw HttpError.conflict("A slide with this code already exists");
};

const createSlide = async (data) => {
  await ensureUniqueCode(data.code?.trim());
  const slide = await Slide.create(data);
  await syncLookupsFromSlides(slide);
  return slide;
};

const updateSlide = async (id, data) => {
  await ensureUniqueCode(data.code?.trim(), id);
  const slide = await Slide.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!slide) throw HttpError.notFound("Slide not found");
  await syncLookupsFromSlides(slide);
  return slide;
};

const findSlide = async (id) => {
  const slide = await Slide.findById(id);
  if (!slide) throw HttpError.notFound("Slide not found");
  return slide;
};

const deleteSlide = async (id) => {
  const slide = await Slide.findByIdAndDelete(id);
  if (!slide) throw HttpError.notFound("Slide not found");
};

module.exports = { getSlides, createSlide, updateSlide, findSlide, deleteSlide };
