const express = require("express");
const auth = require("../middleware/auth");
const porderController =  require("../controllers/porderController");

const router = express.Router();

router.post("/create", auth, porderController.createPOrder);
router.post("/update/:id", auth, porderController.updatePOrder);
router.get("/find/:id", auth, porderController.findPOrderById);
router.get("/delete/:id", auth, porderController.deletePOrderById);
router.get("/list", auth, porderController.listPOrders);
// router.get("/custumer/list/:id", auth, quoteController.listCustomerQuotes);

module.exports = router;
