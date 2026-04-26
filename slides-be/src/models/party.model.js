const mongoose = require("mongoose");

const partySchema = new mongoose.Schema(
  {
    partyType: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      // required: true,
      // unique: true,
    },

    provence: {
      type: String,
      // required: true,
    },

    city: {
      type: String,
      // require: true,
    },

    phoneNo: {
      type: String,
      default: "",
    },

    cellNo: {
      type: String,
      default: "",
    },

    email: {
      type: String,
    },

    website: {
      type: String,
      default: "",
    },

    fax: {
      type: String,
      default: "",
    },

    contactPerson: {
      type: String,
      default: "",
    },
    contactPersonEmail: {
      type: String,
      default: "",
    },

    address:{
      type: String,
      default: "",
    },

    ntn: {
      type: String,
      default: "",
    },

    gst: {
      type: String,
      default: "",
    },

    accountNumber: {
      type: String,
      default: "",
    },

    bankName: {
      type: String,
      default: "",
    },

    gl_code: {
      type: String,
      default: "",
    },

    gl_name: {
      type: String,
      default: "",
    },

    remarks_internal: {
      type: String,
      default: "",
    },

    is_active: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Party", partySchema);
