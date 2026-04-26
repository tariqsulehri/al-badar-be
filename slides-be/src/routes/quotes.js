const express = require("express");
const auth = require("../middleware/auth");
const quoteController =  require("../controllers/quoteController");

const router = express.Router();

router.post("/create", auth, quoteController.createQuote);
router.post("/update/:id", auth, quoteController.updateQuote);
router.get("/find/:id", auth, quoteController.findQuoteById);
router.get("/delete/:id", auth, quoteController.deleteQuoteById);
router.get("/list", auth, quoteController.listQuotes);
// router.get("/custumer/list/:id", auth, quoteController.listCustomerQuotes);

module.exports = router;
