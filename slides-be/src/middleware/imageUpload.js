const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const HttpError = require("../utils/httpError");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "public", "uploads", "slides", "images");
const PUBLIC_PATH = "/uploads/slides/images";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const ALLOWED_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
};

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  // Never trust the client's filename: random name + extension derived from the checked MIME type.
  filename: (req, file, cb) => cb(null, crypto.randomBytes(18).toString("hex") + ALLOWED_TYPES[file.mimetype]),
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES[file.mimetype]) return cb(null, true);
  return cb(HttpError.badRequest("Only JPEG, PNG or GIF images are allowed"));
};

/** Accepts a single image in the multipart field "image". */
const uploadSingleImage = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE, files: 1 } }).single("image");

module.exports = { uploadSingleImage, PUBLIC_PATH };
