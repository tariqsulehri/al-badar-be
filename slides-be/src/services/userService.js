const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const { jwtSecret, jwtExpiresIn } = require("../config/env");
const HttpError = require("../utils/httpError");

const SALT_ROUNDS = 12;
const INVALID_CREDENTIALS = "Invalid username or password";
// Used when the user doesn't exist so login takes the same time either way.
const DUMMY_HASH = bcrypt.hashSync("timing-equaliser", SALT_ROUNDS);

const toPublicUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
});

const signToken = (user) =>
  jwt.sign({ username: user.username, role: user.role }, jwtSecret, {
    subject: String(user._id),
    expiresIn: jwtExpiresIn,
    algorithm: "HS256",
  });

const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);

/** Verifies credentials (username or email) and returns { token, user }. */
const login = async ({ username, password }) => {
  const identifier = username.trim();
  const user = await User.findOne({
    active: true,
    $or: [{ username: identifier }, { email: identifier.toLowerCase() }],
  }).select("+password");

  const valid = await bcrypt.compare(password, user?.password || DUMMY_HASH);
  if (!user || !valid) {
    throw HttpError.unauthorized(INVALID_CREDENTIALS);
  }

  return { token: signToken(user), user: toPublicUser(user) };
};

const createUser = async ({ username, email, password, role }) => {
  const exists = await User.exists({ $or: [{ username }, { email: email.toLowerCase() }] });
  if (exists) {
    throw HttpError.conflict("A user with this username or email already exists");
  }
  const user = await User.create({ username, email, role, password: await hashPassword(password) });
  return toPublicUser(user);
};

const listUsers = () => User.find().sort({ created_at: -1 });

const findUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw HttpError.notFound("User not found");
  return user;
};

const deleteUser = async (id, currentUserId) => {
  if (String(id) === String(currentUserId)) {
    throw HttpError.badRequest("You cannot delete your own account");
  }
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) throw HttpError.notFound("User not found");
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    throw HttpError.badRequest("Current password is incorrect");
  }
  user.password = await hashPassword(newPassword);
  await user.save();
};

module.exports = { login, createUser, listUsers, findUser, deleteUser, changePassword, hashPassword };
