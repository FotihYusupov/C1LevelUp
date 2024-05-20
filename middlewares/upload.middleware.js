const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const uploadMiddleware = multer({ storage: storage }).array("image", 5);
const outputPath = `${process.cwd()}/uploads/`;

const uploadFile = (req, res, next) => {
  uploadMiddleware(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err)
      return res.status(400).json({ message: "File upload error" });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
    const files = [];
    if (req.files) {
      req.images = files;
    } else {
      req.images = [];
    }
    next();
  });
};

module.exports = uploadFile;
