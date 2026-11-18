const quoteController = require("../controllers/quoteController");
const crudRouter = require("./crudRouter");

module.exports = crudRouter(quoteController);
