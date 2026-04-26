const mongoose = require('mongoose');

const subAreaSchema = new mongoose.Schema({
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

const SubArea = new mongoose.model("SubArea", subAreaSchema);
exports.SubArea = SubArea;

