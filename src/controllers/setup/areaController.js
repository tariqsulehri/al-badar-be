const { Area } = require("../../models/area.model");
const {BAD_REQUEST, OK, NOT_FOUND,INTERNAL_SERVER_ERROR} = require("../../constants/httpCodes");
const {ok200, badRequet400, internalServerError500, notFound404} =  require('../../response-handlers/response-handler')
const AppMessages =  require("../../constants/appMessages");
const mongoose = require("mongoose");

exports.createArea = async (req, res) => {
  try {
    let data = req.body;
    data.created_at = new Date();
    data.updated_at = new Date();

    const exists = await Area.findOne({ name: data.name });
    if (exists) {
      return res.status(200).send({ status: "error", message: "Area already exists" });
    }
    let result = await new Area(data).save();
    return res.status(200).send({ status: "success", message: "Record created", result });
  } catch (error) {
    return res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

exports.listAreasForSelect = async (req, res) => {
  try {
  
    let resp = await Area.aggregate([
      {
        $project: {
          label: "$name", // Renames 'name' to 'label'
          value: "$name", 
          _id:0             
        }
      }])
    
    res.status(200).send(resp);

  } catch (error) {
    console.log(error.message);
    res.status(401).send("Error");
  }
};


exports.listAreas = async (req, res) => {
  try {


    let pageNo = req.query.pageNo || 1;
    let pageSize = req.query.pageSize || 0;
    let skipRecords = pageNo * pageSize;

    let searchBy = req.query.searchBy || "name";
    let searchText = req.query.searchText || "";

    const count = await Area.countDocuments();
    let data = null;

    if (searchText !== "") {
      data = await Area.find({ name: { $regex: searchText, $options: "i" } })
        .skip(parseInt(skipRecords))
        .limit(parseInt(pageSize));
    } else {
      data = await Area.find().skip(parseInt(skipRecords)).limit(parseInt(pageSize));
    }
    const resp = {
      totalRecords: count || 0,
      data,
    };

    res.status(200).send(resp);
  } catch (error) {
    console.log(error);
    res.status(401).send("Error");
  }
};

exports.updateArea = async (req, res) => {
  const { id } = req.params;
  const {data} = req.body;

  try {

    const exists = await Area.findOne({ _id: { $ne: mongoose.Types.ObjectId(id) }, name: data.name });
    if (exists) {
      return  badRequet400(res,null, null)  
    }

    const updatedProv = await Area.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {
      new: true, // Return the updated document
      runValidators: true, // Validate before update
    });

    if (!updatedProv) {
      return notFound404(res,null, null);
    }

    return ok200(res,null, updatedProv);


  } catch (error) {
    console.log(error.message);
    return internalServerError500(res, null,null);
  }
};

exports.findAreaById = async (req, res) => {
  const { id } = req.params;
  try {
    const subArea = await Area.findOne({ _id: mongoose.Types.ObjectId(id) });

    if (!subArea) {
      return notFound404(res, null, null);
    }

    return ok200(res,'Success', subArea); 

  } catch (error) {
    return internalServerError500(res, null,null);
  }
};

exports.deleteAreaById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Area.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id),
    });

    if (!deleted) {
      return notFound404(res,null, null);
    }

    res.status(200).json(deleted);
  } catch (error) {
    return internalServerError500(res, null,null);
  }
};
