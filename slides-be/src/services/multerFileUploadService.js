const multer = require("multer");

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
      cb('Error');
    }
  }


  exports.multerUploadFile = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // 1MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).single("image");

  exports.multerUploadFiles = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // 1MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).array("image");