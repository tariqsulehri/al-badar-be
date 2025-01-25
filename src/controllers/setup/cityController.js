const { City } = require("../../models/city.model");
const {BAD_REQUEST, OK, NOT_FOUND,INTERNAL_SERVER_ERROR} = require("../../constants/httpCodes");
const {ok200, badRequet400, internalServerError500, notFound404} =  require('../../response-handlers/response-handler')
const AppMessages =  require("../../constants/appMessages");
const mongoose = require("mongoose");

exports.createCity = async (req, res) => {
  try {
    let data = req.body;
    data.created_at = new Date();
    data.updated_at = new Date();

    const exists = await City.findOne({ name: data.name });
    if (exists) {
      return res.status(200).send({ status: "error", message: "City already exists" });
    }
    let result = await new City(data).save();
    return res.status(200).send({ status: "success", message: "Record created", result });
  } catch (error) {
    return res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

exports.listCitiesForSelect = async (req, res) => {
  try {
  
    let resp = await City.aggregate([
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

exports.listCity = async (req, res) => {
  try {
    let pageNo = req.query.pageNo || 1;
    let pageSize = req.query.pageSize || 10;
    let skipRecords = pageNo * pageSize;

    let searchBy = req.query.searchBy || "name";
    let searchText = req.query.searchText || "";

    const count = await City.countDocuments();
    let data = null;

    if (searchText !== "") {
      data = await City.find({ name: { $regex: searchText, $options: "i" } })
        .skip(parseInt(skipRecords))
        .limit(parseInt(pageSize));
    } else {
      data = await City.find().skip(parseInt(skipRecords)).limit(parseInt(pageSize));
    }
    const resp = {
      totalRecords: count || 0,
      data,
    };

    console.log(resp);

    res.status(200).send(resp);
  } catch (error) {
    console.log(error);
    res.status(401).send("Error");
  }
};

exports.updateCity = async (req, res) => {
  const { id } = req.params;
  const {data} = req.body;

  try {

    const exists = await City.findOne({ _id: { $ne: mongoose.Types.ObjectId(id) }, name: data.name });
    if (exists) {
      return  badRequet400(res,null, null)  
    }

    const updatedProv = await City.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {
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

exports.findCityById = async (req, res) => {
  const { id } = req.params;
  try {
    const city = await City.findOne({ _id: mongoose.Types.ObjectId(id) });

    if (!city) {
      return notFound404(res, null, null);
    }

    return ok200(res,'Success', city); 

  } catch (error) {
    return internalServerError500(res, null,null);
  }
};

exports.deleteCityById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await City.findOneAndDelete({
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
