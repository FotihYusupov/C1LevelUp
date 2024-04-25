const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "videos/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const uploadMiddleware = multer({ storage: storage }).array("video", 5);

const uploadFile = (req, res, next) => {
  uploadMiddleware(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error" });
    } else if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    req.video = `${process.env.URL}${req.files[0].filename}`;
    next();
  });
};

module.exports = uploadFile;
