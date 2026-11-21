const auth = require("../middleware/auth");
const authRoutes = require("../routes/auth");
const users = require("../routes/users");
const slides = require("../routes/slides");
const party = require("../routes/party");
const quotes = require("../routes/quotes");
const invoices = require("../routes/invoice");
const customerPlan = require("../routes/customerPlan");
const lookups = require("../routes/lookups");

module.exports = function mountRoutes(app) {
  // Public
  app.use("/api/auth", authRoutes);

  // Everything below requires a valid JWT.
  app.use("/api/users", auth, users);
  app.use("/api/slides", auth, slides);
  app.use("/api/party", auth, party);
  app.use("/api/quote", auth, quotes);
  app.use("/api/invoice", auth, invoices);
  app.use("/api/customer-plan", auth, customerPlan);
  Object.entries(lookups).forEach(([path, router]) => app.use(path, auth, router));
};
