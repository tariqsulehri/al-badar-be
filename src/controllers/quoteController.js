const { ok200, badRequet400, internalServerError500, notFound404 } = require("../response-handlers/response-handler");
const quoteService = require("../services/quoteService");

exports.createQuote = async (req, res) => {
  try {
    let data  = req.body;
    const result = await quoteService.createQuote(data);
    if (!result) {
      return res.status(200).send({ status: "error", message: "Quote already exists" });
    }
    return res.status(200).send({ status: "success", message: "Record created", result });
  } catch (error) {
    return res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

exports.listQuotes = async (req, res) => {
  try {
    let pageNo = req.query.pageNo;
    let pageSize = req.query.pageSize;

    let searchBy = req.query.searchBy || "name";
    let searchText = req.query.searchText || "";

    let result = await quoteService.listQuotes(pageNo, pageSize, searchBy, searchText);
    res.status(200).send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateQuote = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await quoteService.updateQuote(id, req.body);
    if (!result) {
      return badRequet400(res, null, null);
    }

    return ok200(res, null, result);

  } catch (error) {
    console.log(error.message);
    return internalServerError500(res, null, null);
  }
};

exports.findQuoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await quoteService.findQuoteById(id);
    return ok200(res, "Success", result);
  } catch (error) {
    return internalServerError500(res, null, null);
  }
};

exports.deleteQuoteById = async (req, res) => {
  const { id } = req.params;
  try {
    let result = await quoteService.deleteQuoteById(id);
    res.status(200).json(result);
  } catch (error) {
    return internalServerError500(res, null, null);
  }
};
