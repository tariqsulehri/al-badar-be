const { z } = require("zod");
const { ROLES } = require("../models/user.model");

const password = z.string().min(8, "Password must be at least 8 characters").max(128);

const loginSchema = z.object({
  // `username` accepts either the username or the email address.
  username: z.string().trim().min(1, "Username is required").max(100),
  password: z.string().min(1, "Password is required").max(128),
});

const createUserSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().trim().pipe(z.email()),
  password,
  role: z.enum(ROLES).default("user"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: password,
});

module.exports = { loginSchema, createUserSchema, changePasswordSchema };
