const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoice_number: {
      type: Number,
      default: 1,
    },
    invoice_date: {
      type: Date,
      required: [true, "Invoice date is required"],
      default: new Date(),
    },

    quote_number: {
      type: Number,
      required: [true, "Invoice number is required"],
    },
    quote_date: {
      type: Date,
      required: [true, "Invoice date is required"]
    },

    invoiceAmount: {
      type: Number,
      default: 0,
    },

    invoiceDiscount: {
      type: Number,
      default: 0,
    },

    netAmount: {
      type: Number,
      default: 0,
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
    created_by: { type: String, required: [true, ""], default: new Date() },
    updated_by: { type: String, default: new Date()},

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

module.exports = mongoose.model("Invoice", invoiceSchema);
