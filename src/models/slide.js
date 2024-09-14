const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Code is required"],
    trim: true,
    minlength: [3, "Code must be at least 3 characters long"],
  },
  supplier: {
    type: String,
    required: [true, "Supplier is required"],
    trim: true,
  },
  provence: {
    type: String,
    required: [true, "Provence is required"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
  },
  area: {
    type: String,
    required: [true, "Area is required"],
    trim: true,
  },
  subArea: {
    type: String,
    required: [true, "SubArea is required"],
    trim: true,
  },
  mediaType: {
    type: String,
    required: [true, "MediaType is required"],
    enum: ["Video", "Image", "Text"], 
  },
  height_feets: {
    type: Number,
    required: true,
    min: [0, "Height cannot be negative"],
    default: 0,
  },
  width_feets: {
    type: Number, // changed to Number for consistency
    required: true,
    min: [0, "Width cannot be negative"],
    default: 0,
  },
  location_from: {
    type: String,
    trim: true,
    default: "",
  },
  location_to: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  smd_screen: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  no_of_steamers: {
    type: Number,
    required: true,
    min: [0, "Number of steamers cannot be negative"],
    default: 0,
  },
  working_hrs_day: {
    type: Number,
    required: true,
    min: [0, "Working hours per day cannot be negative"],
    default: 0,
  },
  ad_duration: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  no_of_spots: {
    type: Number,
    required: true,
    min: [0, "Number of spots cannot be negative"],
    default: 0,
  },
  rate_per_week: {
    type: Number,
    required: true,
    min: [0, "Rate per week cannot be negative"],
    default: 0,
  },
  trafic_facing_coming: {
    type: String,
    required: [true, "Traffic facing coming is required"],
    trim: true,
  },
  facing_trafic_going: {
    type: String,
    required: [true, "Facing traffic going is required"],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["A", "B", "C"], // Example categories
    default: "A",
  },
  dimension: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  lights: {
    type: String,
    required: true,
    enum: ["Available", "Not Available"], // Enums for lights field
    default: "Not Available",
  },
  supQuotedPrice: {
    type: Number,
    required: true,
    min: [0, "Supplier quoted price cannot be negative"],
    default: 0,
  },
  supDiscountedPrice: {
    type: Number,
    required: true,
    min: [0, "Supplier discounted price cannot be negative"],
    default: 0,
  },
  supFinalPrice: {
    type: Number, // changed to Number for consistency
    required: [true, "Supplier final price is required"],
  },
  quotedPrice: {
    type: Number,
    required: true,
    min: [0, "Quoted price cannot be negative"],
    default: 0,
  },
  discountedPrice: {
    type: Number,
    required: true,
    min: [0, "Discounted price cannot be negative"],
    default: 0,
  },
  finalPrice: {
    type: Number,
    required: true,
    min: [0, "Final price cannot be negative"],
    default: 0,
  },
  latitude: {
    type: Number,
    // required: true,
    // min: [-90, "Latitude must be between -90 and 90"],
    // max: [90, "Latitude must be between -90 and 90"],
    default: 0,
  },
  longitude: {
    type: Number,
    required: true,
    // min: [-180, "Longitude must be between -180 and 180"],
    // max: [180, "Longitude must be between -180 and 180"],
    default: 0,
  },
  eyeBall: {
    type: Number,
    required: true,
    min: [0, "Eyeball count cannot be negative"],
    default: 0,
  },
  status: {
    type: Number,
    required: true,
    enum: [0, 1], // Example for status values
    default: 0,
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true,
  },
  image: {
    type: String,
    required: [true, "Image URL is required"],
    trim: true,
  },
});

module.exports = mongoose.model("Slide", slideSchema);
