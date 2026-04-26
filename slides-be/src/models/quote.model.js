const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    quote_number: {
      type: Number,
      required: [true, "Quote number is required"],
      default: 1,
    },
    quote_date: {
      type: Date,
      required: [true, "Quote date is required"],
      default: new Date(),
    },

    supQuotedAmount: {
      type: Number,
      default: 0,
    },
    supDiscountedAmount: {
      type: Number,
      default: 0,
    },
    supDiscount: {
      type: Number,
      default: 0,
    },
    supFinalQuotedAmount: {
      type: Number,
      default: 0,
    },
    quotedAmount: {
      type: Number,
      default: 0,
    },
    quotedAmountAfterDiscount: {
      type: Number,
      default: 0,
    },
    quotedDiscount: {
      type: Number,
      default: 0,
    },

    netQuotedAmount: {
      type: Number,
      default: 0,
    },
    po_number: {
      type: Number,
      default: null,
    },
    inovice_number: {
      type: Number,
      default: null,
    },

    customer_id: {
      type: String,
      required: [true, "Customer is required"],
    },
    customer_name: {
      type: String,
      required: [true, "Customer is required"],
    },
    slides: [],
    created_by: { type: String, required: [true, ""], default: "" },
    updated_by: { type: String, default: "" },

    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quote", quoteSchema);
