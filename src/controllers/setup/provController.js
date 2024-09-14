const { Provence } = require("../../models/provence");
const {BAD_REQUEST, OK, NOT_FOUND,INTERNAL_SERVER_ERROR} = require("../../constants/httpCodes");
const {ok200, badRequet400, internalServerError500, notFound404} =  require('../../response-handlers/response-handler')
const AppMessages =  require("../../constants/appMessages");
const mongoose = require("mongoose");

exports.createProvence = async (req, res) => {
  try {
    let data = req.body;
    data.created_at = new Date();
    data.updated_at = new Date();

    const exists = await Provence.findOne({ name: data.name });
    if (exists) {
      return res.status(200).send({ status: "error", message: "Provence already exists" });
    }
    let result = await new Provence(data).save();
    return res.status(200).send({ status: "success", message: "Record created", result });
  } catch (error) {
    return res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

exports.listProvences = async (req, res) => {
  try {
    let pageNo = req.query.pageNo || 1;
    let pageSize = req.query.pageSize || 0;
    let skipRecords = pageNo * pageSize;

    let searchBy = req.query.searchBy || "name";
    let searchText = req.query.searchText || "";

    const count = await Provence.countDocuments();
    let data = null;

    if (searchText !== "") {
      data = await Provence.find({ name: { $regex: searchText, $options: "i" } })
        .skip(parseInt(skipRecords))
        .limit(parseInt(pageSize));
    } else {
      data = await Provence.find().skip(parseInt(skipRecords)).limit(parseInt(pageSize));
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

exports.listProvencesForSelect = async (req, res) => {
  try {
  
    let resp = await Provence.aggregate([
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

exports.updateProvence = async (req, res) => {
  const { id } = req.params;
  const {data} = req.body;

  try {

    const exists = await Provence.findOne({ _id: { $ne: mongoose.Types.ObjectId(id) }, name: data.name });
    if (exists) {
      return  badRequet400(res,null, null)  
    }

    const updatedProv = await Provence.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {
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

exports.findProvenceById = async (req, res) => {
  const { id } = req.params;
  try {
    const provence = await Provence.findOne({ _id: mongoose.Types.ObjectId(id) });

    if (!provence) {
      return notFound404(res, null, null);
    }

    return ok200(res,'Success', provence); 

  } catch (error) {
    return internalServerError500(res, null,null);
  }
};

exports.deleteProvenceById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProv = await Provence.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id),
    });

    if (!deletedProv) {
      return notFound404(res,null, null);
    }

    res.status(200).json(deletedProv);
  } catch (error) {
    return internalServerError500(res, null,null);
  }
};
