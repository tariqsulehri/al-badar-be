const express = require("express");
const auth = require("../middleware/auth");
const cityController =  require("../controllers/setup/cityController");

const router = express.Router();

router.post("/create", auth, cityController.createCity);
router.post("/update/:id", auth, cityController.updateCity);
router.get("/find/:id", auth, cityController.findCityById);
router.get("/delete/:id", auth, cityController.deleteCityById);
router.get("/list", cityController.listCity);
router.get("/list_for_select", auth, cityController.listCitiesForSelect);

module.exports = router;
 