const mongoose = require('mongoose');

const provenceSchema = new mongoose.Schema({
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

const Provence = new mongoose.model("Provence", provenceSchema);
exports.Provence = Provence;


