const express = require("express");
const auth = require("../middleware/auth");
const slidesController =  require("../controllers/slidesController");

const router = express.Router();

router.post("/create", auth, slidesController.createSlide);
router.post("/upload", auth, slidesController.uploadImage);
router.post("/update/:id", auth, slidesController.updateSlide);
router.get("/find/:id", auth, slidesController.findSlideById);
router.get("/delete/:id", auth, slidesController.deleteSlideById);
router.get("/list", auth, slidesController.listSlides);

module.exports = router;
