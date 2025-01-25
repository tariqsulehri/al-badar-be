const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    po_number: {
      type: Number,
      required: [true, "Purchase order number is required"],
      default: 1,
    },
    
    po_date: {
      type: Date,
      required: [true, "Purchase date is required"],
      default: new Date(),
    },

    supplier_id: {
        type: String,
        required: [true, "Supplier is required"],
    },

    quote_number: {
      type: Number,
      required: [true, "Quote number is required"],
      default: 1,
    },
    quite_date: {
      type: Date,
      required: [true, "Quote date is required"],
      default: new Date(),
    },
    inovice_number: {
      type: Number,
      default: null,
    },
    inovice_date: {
      type: Number,
      default: null,
    },

    customer: {
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

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
