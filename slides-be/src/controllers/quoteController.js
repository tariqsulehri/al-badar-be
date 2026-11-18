const quoteService = require("../services/quoteService");
const { ok, created } = require("../utils/apiResponse");
const { parsePagination, readPayload } = require("../utils/query");

exports.create = async (req, res) => created(res, await quoteService.createQuote(readPayload(req.body)));

exports.list = async (req, res) => {
  const pagination = parsePagination(req.query);
  const searchText = (req.query.searchText || "").trim();
  return ok(res, await quoteService.listQuotes({ ...pagination, searchText }));
};

exports.update = async (req, res) =>
  ok(res, await quoteService.updateQuote(req.params.id, readPayload(req.body)), "Record updated");

exports.findById = async (req, res) => ok(res, await quoteService.findQuote(req.params.id));

exports.remove = async (req, res) => {
  await quoteService.deactivateQuote(req.params.id);
  return ok(res, null, "Record deleted");
};
