const partyController = require("../controllers/partyController");
const crudRouter = require("./crudRouter");

module.exports = crudRouter(partyController, {
  "/suppliers/list_for_select": partyController.listSuppliersForSelect,
});
