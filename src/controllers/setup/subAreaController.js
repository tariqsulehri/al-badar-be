const { SubArea } = require("../../models/subArea.model");
const {BAD_REQUEST, OK, NOT_FOUND,INTERNAL_SERVER_ERROR} = require("../../constants/httpCodes");
const {ok200, badRequet400, internalServerError500, notFound404} =  require('../../response-handlers/response-handler')
const AppMessages =  require("../../constants/appMessages");
const mongoose = require("mongoose");

exports.createSubArea = async (req, res) => {
  try {
    let data = req.body;
    data.created_at = new Date();
    data.updated_at = new Date();

    const exists = await SubArea.findOne({ name: data.name });
    if (exists) {
      return res.status(200).send({ status: "error", message: "SubArea already exists" });
    }
    let result = await new SubArea(data).save();
    return res.status(200).send({ status: "success", message: "Record created", result });
  } catch (error) {
    return res.status(500).send({ status: "error", message: "Internal server error" });
  }
};


exports.listSubAreaForSelect = async (req, res) => {
  try {
  
    let resp = await SubArea.aggregate([
      {
        $project: {
          label: "$name", // Renames 'name' to 'label'
          value: "$name", 
          _id:0             
        }
      }])
    
    res.status(200).send(resp);

  } catch (error) {
    console.log(error);
    res.status(401).send("Error");
  }
};


exports.listSubAreas = async (req, res) => {
  try {
    let pageNo = req.query.pageNo || 1;
    let pageSize = req.query.pageSize || 0;
    let skipRecords = pageNo * pageSize;

    let searchBy = req.query.searchBy || "name";
    let searchText = req.query.searchText || "";

    const count = await SubArea.countDocuments();
    let data = null;

    if (searchText !== "") {
      data = await SubArea.find({ name: { $regex: searchText, $options: "i" } })
        .skip(parseInt(skipRecords))
        .limit(parseInt(pageSize));
    } else {
      data = await SubArea.find().skip(parseInt(skipRecords)).limit(parseInt(pageSize));
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

exports.updateSubArea = async (req, res) => {
  const { id } = req.params;
  const {data} = req.body;

  try {

    const exists = await SubArea.findOne({ _id: { $ne: mongoose.Types.ObjectId(id) }, name: data.name });
    if (exists) {
      return  badRequet400(res,null, null)  
    }

    const updatedProv = await SubArea.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {
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

exports.findSubAreaById = async (req, res) => {
  const { id } = req.params;
  try {
    const provence = await SubArea.findOne({ _id: mongoose.Types.ObjectId(id) });

    if (!provence) {
      return notFound404(res, null, null);
    }

    return ok200(res,'Success', provence); 

  } catch (error) {
    return internalServerError500(res, null,null);
  }
};

exports.deleteSubAreaById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await SubArea.findOneAndDelete({
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
