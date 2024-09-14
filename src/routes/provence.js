const express = require("express");
const auth = require("../middleware/auth");
const provController =  require("../controllers/setup/provController");

const router = express.Router();

router.post("/create", auth, provController.createProvence);
router.post("/update/:id", auth, provController.updateProvence);
router.get("/find/:id", auth, provController.findProvenceById);
router.get("/delete/:id", auth, provController.deleteProvenceById);
router.get("/list", auth, provController.listProvences);
router.get("/list_for_select", auth, provController.listProvencesForSelect);

module.exports = router;
