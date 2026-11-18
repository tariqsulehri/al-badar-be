const invoiceController = require("../controllers/invoiceController");
const crudRouter = require("./crudRouter");

module.exports = crudRouter(invoiceController);
