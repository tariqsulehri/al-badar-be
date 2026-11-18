const mongoose = require("mongoose");

const ROLES = ["admin", "manager", "user"];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 5,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      select: false, // never returned unless explicitly requested with .select("+password")
    },
    role: {
      type: String,
      enum: ROLES,
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    logo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = { User, ROLES };
