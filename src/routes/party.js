const express = require("express");
const auth = require("../middleware/auth");
const partyController =  require("../controllers/partyController");

const router = express.Router();

router.post("/create", auth, partyController.createParty);
router.post("/update/:id", auth, partyController.updateParty);
router.get("/find/:id", auth, partyController.findPartyById);
router.get("/delete/:id", auth, partyController.deletePartyById);
router.get("/list", auth, partyController.listParties);

module.exports = router;
