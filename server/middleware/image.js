const multer = require("multer");

const MIME_TYPE = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images"),
  filename: (req, file, cb) => cb(null, `${Math.random()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  const isValid = !!MIME_TYPE[file.mimetype];
  const error = isValid ? null : new Error("invalid mime type");
  cb(error, isValid);
};

module.exports = multer({ storage: storage, fileFilter: fileFilter }).single(
  "image"
);
