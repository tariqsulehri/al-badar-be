const mongoose = require("mongoose");
const POrder = require("../models/porder.model");
const quoteService = require("./quoteService");
const { toNumber } = require("lodash");

const maxNumberInField = async () => {
  try {
    const result = await POrder.findOne().sort({invoice_number: -1});
    return result ? result.invoice_number + 1 : 1;
  } catch (error) {
    console.error("Error fetching max number:", error);
    return null;
  }
};

const createPOrder = async (data) => {
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

  let result = await POrder(invoice).save();
  return result;
};

const updatePOrder = async (id, updateData) => {
  const filter = { _id: mongoose.Types.ObjectId(id) };
  const result = await POrder.findOneAndUpdate(filter, updateData);

  return result;
};

const deletePOrderById = async (id) => {
  const filter = { _id: mongoose.Types.ObjectId(id) };
  const result = await POrder.findOneAndUpdate(filter, { is_active: false });

  return true;
};

const findPOrder = async (id) => {
  const result = await POrder.find({ _id: mongoose.Types.ObjectId(id) });
  return result;
};

const listPOrders = async (pageNo, pageSize, searchBy, searchText) => {
  pageNo = pageNo || 1;
  pageSize = req.query.pageSize || 10;
  skipRecords = pageNo * pageSize;

  const count = await POrder.countDocuments();
  let data = null;

  // if (searchText !== "") {
  //   data = await POrder.find({ name: { $regex: searchText, $options: "i" } })
  //     .skip(parseInt(skipRecords))
  //     .limit(parseInt(pageSize));
  // } else {
  data = await POrder.find().skip(parseInt(skipRecords)).limit(parseInt(pageSize));
  // }
  return {
    totalRecords: count || 0,
    data,
  };
};

module.exports = {
  createPOrder,
  updatePOrder,
  deletePOrderById,
  listPOrders,
  findPOrder,
};
