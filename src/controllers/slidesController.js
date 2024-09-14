const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const {ok200, badRequet400, internalServerError500, notFound404} =  require('../response-handlers/response-handler')
const slideService = require("../services/slideService");
const Slide = require("../models/slide");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads/slides/images/')
//   },
//   filename: function (req, file, cb) {
//     let customFileName = crypto.randomBytes(18).toString('hex')
//     let fileExtension = path.extname(file.originalname).split('.')[1];
//     cb(null, customFileName + '.' + fileExtension)
//   }
// })

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
    let data = req.body;
    data.created_at = new Date();
    data.updated_at = new Date();

    const exists = await Slide.findOne({ name: data.name });
    if (exists) {
      return res.status(200).send({ status: "error", message: "Slide already exists" });
    }
    let result = await new Slide(data).save();
    return res.status(200).send({ status: "success", message: "Record created", result });
  } catch (error) {
    return res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

exports.listSlides = async (req, res) => {
  try {
    let pageNo = req.query.pageNo || 1;
    let pageSize = req.query.pageSize || 10;
    let skipRecords = pageNo * pageSize;

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

    res.status(200).send(resp);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateSlide = async (req, res) => {
  const { id } = req.params;
  const {data} = req.body;

  try {

    const exists = await Slide.findOne({ _id: { $ne: mongoose.Types.ObjectId(id) }, name: data.name });
    if (exists) {
      return  badRequet400(res,null, null)  
    }

    const updatedProv = await Slide.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {
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

exports.findSlideById = async (req, res) => {
  const { id } = req.params;
  try {
    const slide = await Slide.findOne({ _id: mongoose.Types.ObjectId(id) });

    if (!slide) {
      return notFound404(res, null, null);
    }

    return ok200(res,'Success', slide); 

  } catch (error) {
    return internalServerError500(res, null,null);
  }
};

exports.deleteSlideById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSlide = await Slide.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id),
    });

    if (!deletedSlide) {
      return notFound404(res,null, null);
    }

    res.status(200).json(deletedSlide);
  } catch (error) {
    return internalServerError500(res, null,null);
  }
}
