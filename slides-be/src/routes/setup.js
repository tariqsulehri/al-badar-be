const express = require('express');
const router = express.Router();
let { FAIL, SUCCESS, INVALID_INPUT } = require('../helpers/app_messages');

router.get("/api/setups", async (req, res) => {
    res.status(200).send("Setups");
});

module.exports = router;