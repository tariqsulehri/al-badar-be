const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const appMessages = require("../constants/appMessages");
const { successResponse, internalServerError, genericErrorResponse, customSuccessResponse, badRequestResponse } = require("../helpers/responseHelper");
const slideService = require("../services/slideService");
const Slide = require("../models/slide.model");
const {multerUploadFile} = require("../services/multerFileUploadService");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/slides/images/");
  },
  filename: function (req, file, cb) {
    let customFileName = crypto.randomBytes(18).toString("hex");
    let fileExtension = path.extname(file.originalname).split(".")[1];
    cb(null, customFileName + "." + fileExtension);
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

exports.uploadImage = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const filePath = "http://localhost:3500/uploads/slides/images/" + req.file.filename;
    res.status(200).json({
      message: "File uploaded successfully",
      file: filePath,
    });

  });
};

exports.createSlide = async (req, res) => {
  try {
    let {data} = req.body;
   
    const exists = await Slide.findOne({ code: data.code });
    if (exists) {
      return genericErrorResponse(res, appMessages.DUPLICATE_RECORDS_MSG);
    }
    let result = await new Slide(data).save();
    return customSuccessResponse(res, result, appMessages.RECORD_SUCCESSFULY_CREATED);

  } catch (error) {
    return internalServerError(res);
  }
};

exports.listSlides = async (req, res) => {
  try {
    let pageNo = req.query?.pageNo ||  1;
    let pageSize = req.query.pageSize || 10;
    let skipRecords = ((pageNo-1) * pageSize) <= 0 ? 0 : (pageNo-1) * pageSize;

    let searchBy = req.query.searchBy || "name";
    let searchText = req.query.searchText || "";

    const count = await Slide.countDocuments();
    let data = null;

    if (searchText !== "") {
      data = await Slide.find({ name: { $regex: searchText, $options: "i" } })
        .skip(parseInt(skipRecords))
        .limit(parseInt(pageSize));
    } else {
      data = await Slide.find().skip(parseInt(skipRecords)).limit(parseInt(pageSize));
    }
    const resp = {
      totalRecords: count || 0,
      data,
    };

    return customSuccessResponse(res, resp, appMessages.SUCCESS);

  } catch (error) {
    console.log(error.message);
     return internalServerError();
  }
};

exports.updateSlide = async (req, res) => {
  const {_id } = req.body.data;
  const {data} = req.body;

  try {

    const exists = await Slide.findOne({ _id: mongoose.Types.ObjectId(_id) });
    if (!exists) {
      return genericErrorResponse(res, appMessages.DUPLICATE_RECORDS_MSG);
    }
    const updated = await Slide.findOneAndUpdate({ _id: mongoose.Types.ObjectId(_id) }, data, {
      new: true, // Return the updated document
      runValidators: true, // Validate before update
    });

    if (!updated) {
      return genericErrorResponse(res, appMessages.RECORD_NOT_FOUND_MSG);
    }

    return customSuccessResponse(res, updated, appMessages.RECORD_SUCCESSFULY_UPDATED);

  } catch (error) {
    console.log(error.message);
    return internalServerError();
  }
};

exports.findSlideById = async (req, res) => {
  const { id } = req.params;
  try {
    const slide = await Slide.findOne({ _id: mongoose.Types.ObjectId(id) });

    if (!slide) {
      return genericErrorResponse(res, appMessages.RECORD_NOT_FOUND_MSG);
    }

    return successResponse(res, slide, appMessages.SUCCESS);

  } catch (error) {
    return internalServerError(res);
  }
};

exports.deleteSlideById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSlide = await Slide.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id),
    });

    if (!deletedSlide) {
      return genericErrorResponse(res, appMessages.RECORD_NOT_FOUND_MSG);
    }

    return successResponse(res,appMessages.RECORD_SUCCESSFULY_DELETED);

  } catch (error) {
    return internalServerError(res);
  }
}
