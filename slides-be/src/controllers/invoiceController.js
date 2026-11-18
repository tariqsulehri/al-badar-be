const invoiceService = require("../services/invoiceService");
const { ok, created } = require("../utils/apiResponse");
const { parsePagination, readPayload } = require("../utils/query");

exports.create = async (req, res) => {
  const { quote_id: quoteId } = readPayload(req.body);
  return created(res, await invoiceService.createInvoiceFromQuote(quoteId));
};

exports.list = async (req, res) => {
  const pagination = parsePagination(req.query);
  const searchText = (req.query.searchText || "").trim();
  return ok(res, await invoiceService.listInvoices({ ...pagination, searchText }));
};

exports.update = async (req, res) =>
  ok(res, await invoiceService.updateInvoice(req.params.id, readPayload(req.body)), "Record updated");

exports.findById = async (req, res) => ok(res, await invoiceService.findInvoice(req.params.id));

exports.remove = async (req, res) => {
  await invoiceService.deactivateInvoice(req.params.id);
  return ok(res, null, "Record deleted");
};
