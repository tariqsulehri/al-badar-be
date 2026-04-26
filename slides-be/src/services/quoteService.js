const mongoose = require("mongoose");
const Quote = require("../models/quote.model");


const maxNumberInField = async () => {
  try {
    const result = await Quote.findOne().sort({ quote_number: -1 }).select('quote_number');
    return result ? result.quote_number + 1 : 1;
  } catch (error) {
    console.error("Error fetching max number:", error);
    return null;
  }
};

const calculateQuoteAmount = async (selectedSlides) => {
  let supQuotedAmount = 0;
  let supAmountAferDiscount = 0;
  let supDiscount = 0;
  let supFinalQuotedAmount = 0;

  let quotedAmount = 0;
  let quotedAmountAfterDiscount = 0;
  let quotedDiscount = 0
  let netQuotedAmount = 0;

  selectedSlides =  selectedSlides || [];

  selectedSlides.forEach((slide) => {
    supQuotedAmount += slide.supQuotedPrice || 0;
    supAmountAferDiscount += slide.supDiscountedPrice || 0;
    supDiscount =  supQuotedAmount - supAmountAferDiscount;
    supFinalQuotedAmount = supQuotedAmount -  supDiscount;

    quotedAmount += slide.quotedPrice || 0;
    quotedAmountAfterDiscount += slide.discountedPrice || 0;
    quotedDiscount = quotedAmount - quotedAmountAfterDiscount;
    netQuotedAmount = quotedAmount - quotedDiscount;
  });

  return {
    supQuotedAmount,
    supAmountAferDiscount,
    supDiscount,
    supFinalQuotedAmount,

    quotedAmount,
    quotedAmountAfterDiscount,
    quotedDiscount,
    netQuotedAmount,
  };
}

const createQuote = async (data) => {
  const exists = await Quote.findOne({ quote_number: data.quote_number });
  if (exists) {
    return null;
  }

  let {
    supQuotedAmount,
    supAmountAferDiscount,
    supDiscount,
    supFinalQuotedAmount,
    quotedAmount,
    quotedAmountAfterDiscount,
    quotedDiscount,
    netQuotedAmount
  } = await calculateQuoteAmount(data.slides);

  data.quote_number = await  maxNumberInField();

  data.supQuotedAmount = supQuotedAmount;
  data.supDiscountedAmount = supAmountAferDiscount;
  data.supDiscount =  supDiscount;
  data.supFinalQuotedAmount = supFinalQuotedAmount;

  data.quotedAmount = quotedAmount;
  data.quotedAmountAfterDiscount = quotedAmountAfterDiscount;
  data.quotedDiscount=quotedDiscount;
  data.netQuotedAmount = netQuotedAmount;

  let result = await new Quote(data).save();
  return result;
};

const updateQuote = async (id, updateData) => {
  const filter = { _id: mongoose.Types.ObjectId(id) };
  const result = await Quote.findOneAndUpdate(filter, updateData);

  return result;
};

const deleteQuoteById = async (id) => {
  const filter = { _id: mongoose.Types.ObjectId(id) };
  const result = await Quote.findOneAndUpdate(filter, { is_active: false });

  return true;
};

const findQuoteById = async (id) => {
  const result = await Quote.findOne({ _id: mongoose.Types.ObjectId(id) });
  return result;
};

const listQuotes = async (pageNo, pageSize, searchBy, searchText) => {
  pageNo = pageNo || 1;
  pageSize = req.query.pageSize || 10;
  skipRecords = pageNo * pageSize;

  const count = await Quote.countDocuments();
  let data = null;

  // if (searchText !== "") {
  //   data = await Quote.find({ name: { $regex: searchText, $options: "i" } })
  //     .skip(parseInt(skipRecords))
  //     .limit(parseInt(pageSize));
  // } else {
  data = await Quote.find().skip(parseInt(skipRecords)).limit(parseInt(pageSize));
  // }
  return {
    totalRecords: count || 0,
    data,
  };
};

module.exports = {
  createQuote,
  updateQuote,
  deleteQuoteById,
  listQuotes,
  findQuoteById,
};
