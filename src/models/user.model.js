const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxlength: 50,
    },
    email: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 50,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 1024,
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
    }

});

const getrateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.NODE_SECRET_KEY);
    return token;
}

const User = new mongoose.model("User", userSchema);
exports.User = User;