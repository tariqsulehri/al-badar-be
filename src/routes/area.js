const express = require("express");
const auth = require("../middleware/auth");
const areaController =  require("../controllers/setup/areaController");

const router = express.Router();

router.post("/create", auth, areaController.createArea);
router.post("/update/:id", auth, areaController.updateArea);
router.get("/find/:id", auth, areaController.findAreaById);
router.get("/delete/:id", auth, areaController.deleteAreaById);
router.get("/list", auth, areaController.listAreas);
router.get("/list_for_select", auth, areaController.listAreasForSelect);

module.exports = router;
