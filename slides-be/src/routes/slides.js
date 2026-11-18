const asyncHandler = require("../middleware/asyncHandler");
const { uploadSingleImage } = require("../middleware/imageUpload");
const slidesController = require("../controllers/slidesController");
const crudRouter = require("./crudRouter");

const router = crudRouter(slidesController);
router.post("/upload", uploadSingleImage, asyncHandler(slidesController.uploadImage));

module.exports = router;
