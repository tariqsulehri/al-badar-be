const mongoose = require("mongoose");
const Slide = require("../models/slide.model");

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

const ADVANCED_FILTER_FIELDS = [
  "city",
  "area",
  "subArea",
  "supplier",
  "category",
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createSlide = async (slideData) => {
  const slide = new Slide(slideData);
  await slide.save();
  return slide;
};

const updateSlide = async (slideId, updateData) => {
  return Slide.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(slideId) },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteSlide = async (id) => {
  await Slide.findByIdAndDelete(mongoose.Types.ObjectId(id));
  return { message: "Item deleted successfully" };
};

const findSlide = async (id) => {
  return Slide.findOne({ _id: mongoose.Types.ObjectId(id) });
};

const buildSearchQuery = (searchBy = "code", searchText = "") => {
  const trimmedSearchText = searchText?.trim();
  if (!trimmedSearchText) {
    return {};
  }
  const escapedSearchText = escapeRegExp(trimmedSearchText);

  if (searchBy === "all") {
    const textQueries = SEARCHABLE_TEXT_FIELDS.map((field) => ({
      [field]: { $regex: escapedSearchText, $options: "i" },
    }));
    const numberValue = Number(trimmedSearchText);
    const numberQueries = Number.isNaN(numberValue)
      ? []
      : SEARCHABLE_NUMBER_FIELDS.map((field) => ({ [field]: numberValue }));

    return { $or: [...textQueries, ...numberQueries] };
  }

  if (SEARCHABLE_TEXT_FIELDS.includes(searchBy)) {
    return {
      [searchBy]: { $regex: escapedSearchText, $options: "i" },
    };
  }

  if (SEARCHABLE_NUMBER_FIELDS.includes(searchBy)) {
    const numberValue = Number(trimmedSearchText);
    if (Number.isNaN(numberValue)) {
      return { _id: null };
    }

    return { [searchBy]: numberValue };
  }

  return {
    code: { $regex: escapedSearchText, $options: "i" },
  };
};

const normalizeFilters = (filters = {}) => {
  if (!filters || typeof filters !== "object") {
    return {};
  }

  return ADVANCED_FILTER_FIELDS.reduce((query, field) => {
    const value = typeof filters[field] === "string" ? filters[field].trim() : "";
    if (!value) {
      return query;
    }

    query[field] = { $regex: `^${escapeRegExp(value)}$`, $options: "i" };
    return query;
  }, {});
};

const buildSlidesQuery = ({ searchBy, searchText, filters }) => {
  const searchQuery = buildSearchQuery(searchBy, searchText);
  const filterQuery = normalizeFilters(filters);
  const queries = [searchQuery, filterQuery].filter((query) => Object.keys(query).length);

  if (!queries.length) {
    return {};
  }

  if (queries.length === 1) {
    return queries[0];
  }

  return { $and: queries };
};

const getSlides = async ({ pageNo = 1, pageSize = 10, searchBy = "code", searchText = "", filters = {} } = {}) => {
  const normalizedPageNo = Math.max(Number(pageNo) || 1, 1);
  const normalizedPageSize = Math.min(Math.max(Number(pageSize) || 10, 1), 5000);
  const query = buildSlidesQuery({ searchBy, searchText, filters });

  const [data, totalRecords] = await Promise.all([
    Slide.find(query)
      .sort({ createdAt: -1 })
      .skip((normalizedPageNo - 1) * normalizedPageSize)
      .limit(normalizedPageSize),
    Slide.countDocuments(query),
  ]);

  return {
    data,
    totalRecords,
    pageNo: normalizedPageNo,
    pageSize: normalizedPageSize,
    totalPages: Math.ceil(totalRecords / normalizedPageSize),
  };
};

const listSlides = async () => {
  return Slide.find().sort({ createdAt: -1 });
};

const listSuppliersForSelect = async () => {
  const suppliers = await Slide.distinct("supplier", {
    supplier: { $nin: [null, ""] },
  });

  return suppliers
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((supplier) => ({
      label: supplier,
      value: supplier,
    }));
};

module.exports = {
  createSlide,
  updateSlide,
  deleteSlide,
  findSlide,
  getSlides,
  listSlides,
  listSuppliersForSelect,
};
