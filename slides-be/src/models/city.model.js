const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    is_active: {
        type: Boolean
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: Date.now
    }

});

const City = new mongoose.model("City", citySchema);
exports.City = City;


