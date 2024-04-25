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
      return res.status(400).json({ message: "File upload error" });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
    const { format = "webp" } = req.query;
    const files = [];
    let convertedImageBuffer;
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const image = {};
        switch (format.toLowerCase()) {
          case "jpg":
          case "jpeg":
            const filenameJPEG = `${Date.now()}_${i}.jpeg`;
            convertedImageBuffer = await sharp(req.files[i].path)
              .resize(1200, 1000, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .jpeg()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${filenameJPEG}`, convertedImageBuffer);
            image.large = `${process.env.URL}${filenameJPEG}`;
            const mediumJPEG = `${Date.now()}_${i}.jpeg`;
            convertedImageBuffer = await sharp(req.files[i].path)
              .resize(600, 600, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .jpeg()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${mediumJPEG}`, convertedImageBuffer);
            image.medium = `${process.env.URL}${mediumJPEG}`;
            const smallJPEG = `${Date.now()}_${i}.jpeg`;
            convertedImageBuffer = await sharp(req.files[i].path)
              .resize(300, 300, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .jpeg()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${smallJPEG}`, convertedImageBuffer);
            image.small = `${process.env.URL}${smallJPEG}`;
            files.push(image);
            fs.unlinkSync(`${process.cwd()}/${req.files[i].path}`);
            break;
          case "png":
            const filenamePNG = `${Date.now()}_${i}.png`;
            convertedImageBuffer = await sharp(req.files[i].path)
              .resize(1200, 1000, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .png()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${filenamePNG}`, convertedImageBuffer);
            image.large = `${process.env.URL}${filenamePNG}`;
            const mediumPNG = `${Date.now()}_${i}.png`;
            convertedImageBuffer = await sharp(req.files[i].path)
              .resize(600, 600, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .png()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${mediumPNG}`, convertedImageBuffer);
            image.medium = `${process.env.URL}${mediumPNG}`;
            const smallPNG = `${Date.now()}_${i}.png`;
            convertedImageBuffer = await sharp(req.files[i].path)
              .resize(300, 300, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .png()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${smallPNG}`, convertedImageBuffer);
            image.small = `${process.env.URL}${smallPNG}`;
            files.push(image);
            fs.unlinkSync(`${process.cwd()}/${req.files[i].path}`);
            break;
          case "webp":
            const filenameWEBP = `${Date.now()}_${i}.webp`;
            convertedImageBuffer = await sharp(req.files[i].path)
              .resize(1200, 1000, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .webp()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${filenameWEBP}`, convertedImageBuffer);
            image.large = `${process.env.URL}${filenameWEBP}`;
            const mediumWEBP = `${Date.now()}_${i}.webp`;
            convertedImageBuffer = await sharp(req.files[i].path)
              .resize(600, 600, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .webp()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${mediumWEBP}`, convertedImageBuffer);
            image.medium = `${process.env.URL}${mediumWEBP}`;
            const smallWEBP = `${Date.now()}_${i}.webp`;
            convertedImageBuffer = await sharp(req.files[i].path)
              .resize(300, 300, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .webp()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${smallWEBP}`, convertedImageBuffer);
            image.small = `${process.env.URL}${smallWEBP}`;
            files.push(image);
            fs.unlinkSync(`${process.cwd()}/${req.files[i].path}`);
            break;
          default:
            return res.status(400).json({ error: "Unsupported format" });
        }
      }
      req.images = files;
    } else {
      req.images = [];
    }
    next();
  });
};

module.exports = uploadFile;
