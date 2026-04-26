const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure username is unique
        minLength: 5,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true, // Fix typo: require -> required
        unique: true,   // Ensure email is unique
        minlength: 5,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true, // Fix typo: require -> required
        minlength: 5,
        maxlength: 1024,
    },
    active: {
        type: Boolean,
        default: true // Set default value to true
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: Date.now
    },

    logo: {
        type: String,
        default: '' // Optional: default empty string for logo
    }

});

const getrateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.NODE_SECRET_KEY);
    return token;
}

const User = new mongoose.model("User", userSchema);
exports.User = User;