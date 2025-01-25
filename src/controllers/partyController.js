const mongoose = require("mongoose");
const { ok200, badRequet400, internalServerError500, notFound404 } = require("../response-handlers/response-handler");
const partyService = require("../services/partyService");
const Party = require("../models/party.model");

exports.createParty = async (req, res) => {
  try {

    let {data} = req.body;

    const exists = await Party.findOne({ name: data.name, partyType: data.partyType });
    if (exists) {
      return res.status(200).send({ status: "error", message: "Party already exists" });
    }
    
    let result = await new Party(data).save();
    return res.status(200).send({ status: "success", message: "Record created", result });

  } catch (error) {
    return res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

exports.listParties = async (req, res) => {
  try {
    let pageNo = req.query.pageNo || 1;
    let pageSize = req.query.pageSize || 10;
    let skipRecords = pageNo * pageSize;

    let searchBy = req.query.searchBy || "name";
    let searchText = req.query.searchText || "";

    const count = await Party.countDocuments();
    let data = null;

    if (searchText !== "") {
      data = await Party.find({ name: { $regex: searchText, $options: "i" } })
        .skip(parseInt(skipRecords))
        .limit(parseInt(pageSize));
    } else {
      data = await Party.find().skip(parseInt(skipRecords)).limit(parseInt(pageSize));
    }
    const resp = {
      totalRecords: count || 0,
      data,
    };

    res.status(200).send(resp);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateParty = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    const exists = await Party.findOne({ _id: { $ne: mongoose.Types.ObjectId(id) }, data });
    if (exists) {
      return badRequet400(res, null, null);
    }

    const updated = await Party.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {
      new: true, // Return the updated document
      runValidators: true, // Validate before update
    });

    

    if (!updated) {
      return notFound404(res, null, null);
    }

    return ok200(res, null, updated);
    
  } catch (error) {
    console.log(error.message);
    return internalServerError500(res, null, null);
  }
};

exports.findPartyById = async (req, res) => {
  const { id } = req.params;
  try {
    const party = await Party.findOne({ _id: mongoose.Types.ObjectId(id) });

    if (!party) {
      return notFound404(res, null, null);
    }

    return ok200(res, "Success", party);
  } catch (error) {
    return internalServerError500(res, null, null);
  }
};

exports.deletePartyById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedParty = await Party.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id),
    });

    if (!deletedParty) {
      return notFound404(res, null, null);
    }

    res.status(200).json(deletedParty);
  } catch (error) {
    return internalServerError500(res, null, null);
  }
};
