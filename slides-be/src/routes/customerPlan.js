const customerPlanController = require("../controllers/customerPlanController");
const crudRouter = require("./crudRouter");

module.exports = crudRouter(customerPlanController, {
  "/next-serial": customerPlanController.getNextSerial,
});
