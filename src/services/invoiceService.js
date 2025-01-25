const mongoose = require("mongoose");
const Invoice = require("../models/invoice.model");
const quoteService = require("./quoteService");
const { toNumber } = require("lodash");

const maxNumberInField = async () => {
  try {
    const result = await Invoice.findOne().sort({invoice_number: -1});
    return result ? result.invoice_number + 1 : 1;
  } catch (error) {
    console.error("Error fetching max number:", error);
    return null;
  }
};

const createInvoice = async (data) => {
  let invoice_number = await maxNumberInField();
  let invoice = {
    invoice_number: invoice_number,
    invoice_date: new Date(),
    invoiceAmount: data.quotedAmount,
    invoiceDiscount: data.quotedDiscount,
    netAmount: data.netQuotedAmount,
    quote_number: data.quote_number,
    quote_date: data.quote_date,
    customer_id: data.customer_id,
    customer_name: data.customer_name,
    slides: data.slides,
    is_active: true,
  };

  let result = await Invoice(invoice).save();
  return result;
};

const updateInvoice = async (id, updateData) => {
  const filter = { _id: mongoose.Types.ObjectId(id) };
  const result = await Invoice.findOneAndUpdate(filter, updateData);

  return result;
};

const deleteInvoiceById = async (id) => {
  const filter = { _id: mongoose.Types.ObjectId(id) };
  const result = await Invoice.findOneAndUpdate(filter, { is_active: false });

  return true;
};

const findInvoice = async (id) => {
  const result = await Invoice.find({ _id: mongoose.Types.ObjectId(id) });
  return result;
};

const listInvoices = async (pageNo, pageSize, searchBy, searchText) => {
  pageNo = pageNo || 1;
  pageSize = req.query.pageSize || 10;
  skipRecords = pageNo * pageSize;

  const count = await Invoice.countDocuments();
  let data = null;

  // if (searchText !== "") {
  //   data = await Invoice.find({ name: { $regex: searchText, $options: "i" } })
  //     .skip(parseInt(skipRecords))
  //     .limit(parseInt(pageSize));
  // } else {
  data = await Invoice.find().skip(parseInt(skipRecords)).limit(parseInt(pageSize));
  // }
  return {
    totalRecords: count || 0,
    data,
  };
};

module.exports = {
  createInvoice,
  updateInvoice,
  deleteInvoiceById,
  listInvoices,
  findInvoice,
};
