const Invoice = require("../models/invoice.model");
const HttpError = require("../utils/httpError");
const { containsRegex, paginatedResult } = require("../utils/query");
const quoteService = require("./quoteService");

/** Creates an invoice from an existing quote. */
const createInvoiceFromQuote = async (quoteId) => {
  if (!quoteId) throw HttpError.badRequest("quote_id is required");
  const quote = await quoteService.findQuote(quoteId);

  if (await Invoice.exists({ quote_number: quote.quote_number })) {
    throw HttpError.conflict("An invoice already exists for this quote");
  }

  return Invoice.create({
    invoice_number: await quoteService.nextNumber(Invoice, "invoice_number"),
    invoice_date: new Date(),
    invoiceAmount: quote.quotedAmount,
    invoiceDiscount: quote.quotedDiscount,
    netAmount: quote.netQuotedAmount,
    quote_number: quote.quote_number,
    quote_date: quote.quote_date,
    customer_id: quote.customer_id,
    customer_name: quote.customer_name,
    slides: quote.slides,
    is_active: true,
  });
};

const updateInvoice = async (id, data) => {
  const invoice = await Invoice.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!invoice) throw HttpError.notFound("Invoice not found");
  return invoice;
};

/** Soft delete: invoices are financial records and are never removed. */
const deactivateInvoice = async (id) => {
  const invoice = await Invoice.findByIdAndUpdate(id, { is_active: false }, { new: true });
  if (!invoice) throw HttpError.notFound("Invoice not found");
};

const findInvoice = async (id) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) throw HttpError.notFound("Invoice not found");
  return invoice;
};

const listInvoices = async ({ pageNo, pageSize, skip, searchText }) => {
  const filter = searchText ? { customer_name: containsRegex(searchText) } : {};
  const [data, totalRecords] = await Promise.all([
    Invoice.find(filter).sort({ invoice_number: -1 }).skip(skip).limit(pageSize),
    Invoice.countDocuments(filter),
  ]);
  return paginatedResult({ data, totalRecords, pageNo, pageSize });
};

module.exports = { createInvoiceFromQuote, updateInvoice, deactivateInvoice, findInvoice, listInvoices };
