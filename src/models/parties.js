const mongoose = require('mongoose');

const partiesSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true
    },

    provence: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        require: true,
    },

    phoneNo: {
        type: String,
        require: true,
    },

    cellNo: {
        type: String,
        require: true,
    },

    address:{
        type: String,
    },

    NTN: {
        type: String,
        
    },

    GST: {
        type: String,
        
    },
    bankName: {
        type: String,
    },

    gl_code:{
        type: String,
        required: true,
    },

    remarks_internal: {
        type: String,
        default:""
    },

    active: {
        type: Boolean
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: Date.now
    },

    created_by: {
        type: String
    }

});

const Parties = new mongoose.model("Parties", partiesSchema);
exports.Parties = Parties;


