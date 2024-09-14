const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads//slides/images/');
    },
    filename: function (req, file, cb) {
          let customFileName = crypto.randomBytes(18).toString('hex')
          let fileExtension = path.extname(file.originalname).split('.')[1];
          cb(null, customFileName + '.' + fileExtension)
    }
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
      cb('Error: Images Only!');
    }
  }
  
  // Init upload
  exports.upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // 2MB
    fileFilter: function(req, file, cb) {
      checkFileType(file, cb);
    }
  }).single('image');