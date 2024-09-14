const express = require("express");
const router = express.Router();
const { Parties } = require("../models/parties");

router.post("/create", async (req, res) => {
  try {
    let data = req.body;
    //   data.created_at = new Date();
    //   data.updated_at = new Date();
    //   let result = await new Parties(data).save();
    let result = { result: "OK" };
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(401).send("Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send(INVALID_INPUT);
    }

    let result = await Parties.find({ _id: req.params.id });

    SUCCESS.result = result;
    return res.status(200).send(SUCCESS);
  } catch (error) {
    SOME_THONG_WENTWRONG.message = error.message;
    return res.status(400).send(SOME_THONG_WENTWRONG);
  }
});

router.post("/:id", async (req, res) => {
  try {
    if (!req.params.e) {
      return res.status(400).send(INVALID_INPUT);
    }

    let result = await Parties.find({ _id: req.params.id });

    SUCCESS.result = result;
    return res.status(200).send(SUCCESS);
  } catch (error) {
    SOME_THONG_WENTWRONG.message = error.message;
    return res.status(400).send(SOME_THONG_WENTWRONG);
  }
});

router.get("/user_by_email", async (req, res) => {
  try {
    let { email_id } = req.body;

    if (
      !email_id ||
      !first_name ||
      !last_name ||
      !active ||
      !gender ||
      !date_of_birth
    ) {
      return res.status(400).send(INVALID_INPUT);
    }

    let result = await Parties.find({ active: true, email_id: email_id });

    SUCCESS.result = result;
    return res.status(200).send(SUCCESS);
  } catch (error) {
    SOME_THONG_WENTWRONG.message = error.message;
    return res.status(400).send(SOME_THONG_WENTWRONG);
  }
});

router.post("/", async (req, res) => {
  try {
    let { email_id, first_name, last_name, active, gender, date_of_birth } =
      req.body;

    if (
      !email_id ||
      !first_name ||
      !last_name ||
      !active ||
      !gender ||
      !date_of_birth
    ) {
      return res.status(400).send(INVALID_INPUT);
    }

    var data = req.body;

    data.created_at = new Date();
    data.updated_at = new Date();

    let result = await new Parties(data).save();

    SUCCESS.result = result;
    return res.status(200).send(SUCCESS);
  } catch (error) {
    SOME_THONG_WENTWRONG.message = error.message;
    return res.status(400).send(SOME_THONG_WENTWRONG);
  }
});

router.put("/", async (req, res) => {
  try {
    let { id, email_id, first_name, last_name, active, gender, date_of_birth } =
      req.body;

    if (
      !id ||
      !email_id ||
      !first_name ||
      !last_name ||
      !active ||
      !gender ||
      !date_of_birth
    ) {
      return res.status(400).send(INVALID_INPUT);
    }

    var data = req.body;
    data.updated_at = new Date();
    let result = await Parties.findByIdAndUpdate(data.id, data);

    SUCCESS.result = result;
    return res.status(200).send(SUCCESS);
  } catch (error) {
    SOME_THONG_WENTWRONG.message = error.message;
    return res.status(400).send(SOME_THONG_WENTWRONG);
  }
});

router.delete("/", async (req, res) => {
  return res.status(200).send("Delete Brands");
});

module.exports = router;
