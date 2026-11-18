const Quote = require("../models/quote.model");
const HttpError = require("../utils/httpError");
const { containsRegex, paginatedResult } = require("../utils/query");

/**
 * Next sequential number for `field`.
 * NOTE: max+1 can race under concurrent creates; the unique index on the number
 * field turns that into a 409 instead of a silent duplicate.
 */
const nextNumber = async (Model, field) => {
  const last = await Model.findOne().sort({ [field]: -1 }).select(field).lean();
  return (last?.[field] || 0) + 1;
};

const sum = (slides, field) => slides.reduce((total, slide) => total + (Number(slide?.[field]) || 0), 0);

const calculateQuoteAmounts = (slides = []) => {
  const supQuotedAmount = sum(slides, "supQuotedPrice");
  const supDiscountedAmount = sum(slides, "supDiscountedPrice");
  const quotedAmount = sum(slides, "quotedPrice");
  const quotedAmountAfterDiscount = sum(slides, "discountedPrice");

  return {
    supQuotedAmount,
    supDiscountedAmount,
    supDiscount: supQuotedAmount - supDiscountedAmount,
    supFinalQuotedAmount: supDiscountedAmount,
    quotedAmount,
    quotedAmountAfterDiscount,
    quotedDiscount: quotedAmount - quotedAmountAfterDiscount,
    netQuotedAmount: quotedAmountAfterDiscount,
  };
};

const createQuote = async (data) => {
  const slides = Array.isArray(data.slides) ? data.slides : [];
  return Quote.create({
    ...data,
    ...calculateQuoteAmounts(slides),
    quote_number: await nextNumber(Quote, "quote_number"),
  });
};

const updateQuote = async (id, data) => {
  const quote = await Quote.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!quote) throw HttpError.notFound("Quote not found");
  return quote;
};

/** Soft delete: quotes are referenced by invoices. */
const deactivateQuote = async (id) => {
  const quote = await Quote.findByIdAndUpdate(id, { is_active: false }, { new: true });
  if (!quote) throw HttpError.notFound("Quote not found");
};

const findQuote = async (id) => {
  const quote = await Quote.findById(id);
  if (!quote) throw HttpError.notFound("Quote not found");
  return quote;
};

const listQuotes = async ({ pageNo, pageSize, skip, searchText }) => {
  const filter = searchText ? { customer_name: containsRegex(searchText) } : {};
  const [data, totalRecords] = await Promise.all([
    Quote.find(filter).sort({ quote_number: -1 }).skip(skip).limit(pageSize),
    Quote.countDocuments(filter),
  ]);
  return paginatedResult({ data, totalRecords, pageNo, pageSize });
};

module.exports = { createQuote, updateQuote, deactivateQuote, findQuote, listQuotes, nextNumber };
