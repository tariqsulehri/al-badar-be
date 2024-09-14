const express = require("express");
const auth = require("../middleware/auth");
const subArea =  require("../controllers/setup/subAreaController");

const router = express.Router();

router.post("/create", auth, subArea.createSubArea);
router.post("/update/:id", auth, subArea.updateSubArea);
router.get("/find/:id", auth, subArea.findSubAreaById);
router.get("/delete/:id", auth, subArea.deleteSubAreaById);
router.get("/list", auth, subArea.listSubAreas);
router.get("/list_for_select", auth, subArea.listSubAreaForSelect);

module.exports = router;
