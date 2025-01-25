const { successResponse, internalServerError, genericErrorResponse, customSuccessResponse, badRequestResponse } = require("../helpers/responseHelper");
const invoiceService = require("../services/invoiceService");
const AppMessages =  require('../constants/appMessages');
const quoteService = require('../services/quoteService');

exports.createInvoice = async (req, res) => {
  try {

    let data = req.body;
    const quote =  await quoteService.findQuoteById(data.quote_id);
    if(!quote){
      return genericErrorResponse(res, AppMessages.RECORD_NOT_FOUND_MSG);
    }
    const result = await invoiceService.createInvoice(quote);
    if (!result) {
      return genericErrorResponse(res, AppMessages.DUPLICATE_RECORDS_MSG);
    }
    return customSuccessResponse(res, result, AppMessages.RECORD_SUCCESSFULY_CREATED);

  } catch (error) {
    console.log(error.message);
    return internalServerError(res);
  }
};

exports.listInvoices = async (req, res) => {
  try {
    let pageNo = req.query.pageNo;
    let pageSize = req.query.pageSize;

    let searchBy = req.query.searchBy || "name";
    let searchText = req.query.searchText || "";

    let result = await invoiceService.listInvoices(pageNo, pageSize, searchBy, searchText);
    return customSuccessResponse(res, result, appMessages.RECORD_SUCCESSFULY_CREATED);
  } catch (error) {
    console.log(error.message);
    return internalServerError(res);
  }
};

exports.updateInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await invoiceService.updateInvoice(id, req.body);
    if (!result) {
      return genericErrorResponse(res, AppMessages.RECORD_NOT_FOUND_MSG);
    }
    return customSuccessResponse(res, result, appMessages.RECORD_SUCCESSFULY_UPDATED);
  } catch (error) {
    console.log(error.message);
    return internalServerError(res);
  }
};

exports.findInvoiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await invoiceService.findInvoice(id);

    if (!result) {
      return genericErrorResponse(res, AppMessages.RECORD_NOT_FOUND_MSG);
    }

    return customSuccessResponse(res, result, appMessages.SUCCESS);
  } catch (error) {
    return internalServerError(res);
  }
};

exports.deleteInvoiceById = async (req, res) => {
  const { id } = req.params;
  try {
    let result = await invoiceService.deleteInvoiceById(id);
    return customSuccessResponse(res, result, appMessages.SUCCESS);
  } catch (error) {
    return internalServerError(res);
  }
};
