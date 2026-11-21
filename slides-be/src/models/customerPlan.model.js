const mongoose = require("mongoose");

const customerPlanItemSchema = new mongoose.Schema(
  {
    sr_no: {
      type: Number,
      required: true,
      default: 1,
    },
    slide_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slide",
      required: [true, "Slide ID is required"],
    },
    code: {
      type: String,
      required: [true, "Slide code is required"],
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    width_feets: {
      type: Number,
      default: 0,
      min: [0, "Width cannot be negative"],
    },
    height_feets: {
      type: Number,
      default: 0,
      min: [0, "Height cannot be negative"],
    },
    sqft: {
      type: Number,
      default: 0,
      min: [0, "Sqft cannot be negative"],
    },
    quotingMonthlyRent: {
      type: Number,
      default: 0,
      min: [0, "Quoting rent cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountedMonthlyRent: {
      type: Number,
      default: 0,
      min: [0, "Discounted rent cannot be negative"],
    },
    thirtyDaysRent: {
      type: Number,
      default: 0,
      min: [0, "30 days rent cannot be negative"],
    },
    skinCost: {
      type: Number,
      default: 0,
      min: [0, "Skin cost cannot be negative"],
    },
    grandTotal: {
      type: Number,
      default: 0,
      min: [0, "Grand total cannot be negative"],
    },
    status: {
      type: String,
      default: "Available",
      trim: true,
    },
    mediaType: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const customerPlanSchema = new mongoose.Schema(
  {
    serial_number: {
      type: String,
      required: [true, "Serial number is required"],
      unique: true,
      trim: true,
      index: true,
    },
    plan_number: {
      type: Number,
      required: [true, "Plan number is required"],
      unique: true,
      index: true,
    },
    plan_date: {
      type: Date,
      required: [true, "Plan date is required"],
      default: Date.now,
    },
    title: {
      type: String,
      default: "ABMS Outdoor Media Plan for Client",
      trim: true,
    },
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: [true, "Client is required"],
    },
    client_name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    client_details: {
      partyType: { type: String, default: "" },
      city: { type: String, default: "" },
      phoneNo: { type: String, default: "" },
      email: { type: String, default: "" },
      contactPerson: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    slides: {
      type: [customerPlanItemSchema],
      default: [],
    },
    totalSqft: {
      type: Number,
      default: 0,
    },
    totalQuotingMonthlyRent: {
      type: Number,
      default: 0,
    },
    totalDiscountedMonthlyRent: {
      type: Number,
      default: 0,
    },
    totalThirtyDaysRent: {
      type: Number,
      default: 0,
    },
    totalSkinCost: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    notes: {
      type: [String],
      default: [
        "Rates and Availability should be mentioned in ppt",
        "Rates will be Change when we make the ppt",
        "Availability will be Change when we make the ppt",
      ],
    },
    planStatus: {
      type: String,
      default: "Draft",
      trim: true,
    },
    created_by: {
      type: String,
      default: "",
    },
    updated_by: {
      type: String,
      default: "",
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CustomerPlan", customerPlanSchema);
