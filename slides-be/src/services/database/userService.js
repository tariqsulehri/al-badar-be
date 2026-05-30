const { User } = require("../../models/user.model");

const getUserByEmailOrUsername = async (email, username) => {
  return User.findOne({ $or: [{ email }, { username }] });
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserByID = async (id) => {
  return User.findById(id).select("-password");
};

const getUserAllDataByID = async (id) => {
  return User.findById(id);
};

const getUsers = async () => {
  return User.find().select("-password");
};

const createUserAccount = async (username, email, password, role) => {
  const user = new User({ username, email, password, role });
  await user.save();
  return { _id: user._id, username: user.username, email: user.email, role: user.role };
};

const updateUserPassword = async (id, passwordHash) => {
  return User.findByIdAndUpdate(id, { password: passwordHash }, { new: true });
};

const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};

const updateOTP = async ({ id, otp }) => {
  return User.findByIdAndUpdate(id, { otp }, { new: true });
};

const confirmOTP = async ({ id, otp }) => {
  return User.findOne({ _id: id, otp });
};

module.exports = {
  getUserByEmailOrUsername,
  getUserByEmail,
  getUserByID,
  getUserAllDataByID,
  getUsers,
  createUserAccount,
  updateUserPassword,
  deleteUser,
  updateOTP,
  confirmOTP,
};
