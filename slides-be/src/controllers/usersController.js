const userService = require("../services/userService");
const { loginSchema, createUserSchema, changePasswordSchema } = require("../validation/user.schemas");
const { ok, created } = require("../utils/apiResponse");

exports.login = async (req, res) => {
  const credentials = loginSchema.parse(req.body);
  return ok(res, await userService.login(credentials), "Logged in");
};

exports.me = async (req, res) => ok(res, await userService.findUser(req.user.id));

exports.createUser = async (req, res) => {
  const input = createUserSchema.parse(req.body?.data ?? req.body);
  return created(res, await userService.createUser(input), "User created");
};

exports.listUsers = async (req, res) => ok(res, await userService.listUsers());

exports.findUser = async (req, res) => ok(res, await userService.findUser(req.params.id));

exports.deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id, req.user.id);
  return ok(res, null, "User deleted");
};

exports.changePassword = async (req, res) => {
  const input = changePasswordSchema.parse(req.body);
  await userService.changePassword(req.user.id, input);
  return ok(res, null, "Password changed");
};
