const express = require("express");
const auth = require("../middleware/auth");
const invoiceController =  require("../controllers/invoiceController");

const router = express.Router();

router.post("/create", auth, invoiceController.createInvoice);
router.post("/update/:id", auth, invoiceController.updateInvoice);
router.get("/find/:id", auth, invoiceController.findInvoiceById);
router.get("/delete/:id", auth, invoiceController.deleteInvoiceById);
router.get("/list", auth, invoiceController.listInvoices);
// router.get("/custumer/list/:id", auth, invoiceController.listCustomerInvoices);

module.exports = router;
