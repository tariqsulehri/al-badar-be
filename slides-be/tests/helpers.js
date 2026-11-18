const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/app");
const { User } = require("../src/models/user.model");
const { hashPassword } = require("../src/services/userService");

const PASSWORD = "correct-horse-battery";

/** Each test file gets its own database so files can't interfere with each other. */
const connect = async (suffix) => {
  const base = process.env.DB.replace(/\/[^/?]*(\?|$)/, `/slides_test_${suffix}$1`);
  await mongoose.connect(base);
  await mongoose.connection.dropDatabase();
  await Promise.all(Object.values(mongoose.models).map((model) => model.syncIndexes()));
};

const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};

const createUser = async (role = "admin", username = `${role}-user`) =>
  User.create({ username, email: `${username}@example.com`, password: await hashPassword(PASSWORD), role });

const loginAs = async (role = "admin") => {
  const username = `${role}-user`;
  if (!(await User.exists({ username }))) await createUser(role, username);
  const res = await request(app).post("/api/auth").send({ username, password: PASSWORD });
  return res.body.result.token;
};

module.exports = { app, request, connect, disconnect, createUser, loginAs, PASSWORD };
