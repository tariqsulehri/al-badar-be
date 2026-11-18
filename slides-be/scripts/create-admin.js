/**
 * Creates (or promotes/resets) an admin user.
 *
 *   ADMIN_USERNAME=admin ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='long-secret' npm run create-admin
 */
const mongoose = require("mongoose");
const { dbUri } = require("../src/config/env");
const connectDb = require("../src/startup/db");
const { User } = require("../src/models/user.model");
const { hashPassword } = require("../src/services/userService");

const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const main = async () => {
  if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Set ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD");
  }
  if (ADMIN_PASSWORD.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  }

  await connectDb(dbUri);
  const password = await hashPassword(ADMIN_PASSWORD);
  const user = await User.findOneAndUpdate(
    { username: ADMIN_USERNAME },
    { $set: { email: ADMIN_EMAIL, password, role: "admin", active: true } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  console.log(`Admin user "${user.username}" is ready.`);
};

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
