const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === "image") {
        cb(null, "uploads/");
      } else if (file.fieldname === "video") {
        cb(null, "videos/");
      }
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + path.extname(file.originalname));
    },
  }),
}).fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

const outputPath = `${process.cwd()}/uploads/`;

const uploadFile = (req, res, next) => {
  uploadMiddleware(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(400).json({ message: "File upload error" });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
    
    if (req.files['image']) {
      const { format = "webp" } = req.query;
      const images = [];
      for (let i = 0; i < req.files['image'].length; i++) {
        const image = {};
        switch (format.toLowerCase()) {
          case "jpg":
          case "jpeg":
            const filenameJPEG = `${Date.now()}_${i}.jpeg`;
            const convertedImageBufferJPEG = await sharp(req.files['image'][i].path)
              .resize(1200, 1000, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .jpeg()
              .toBuffer();
            fs.writeFileSync(
              `${outputPath}${filenameJPEG}`,
              convertedImageBufferJPEG
            );
            image.large = `${process.env.URL}${filenameJPEG}`;
            const mediumJPEG = `${Date.now()}_${i}_medium.jpeg`;
            const convertedImageBufferMediumJPEG = await sharp(req.files['image'][i].path)
              .resize(600, 600, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .jpeg()
              .toBuffer();
            fs.writeFileSync(
              `${outputPath}${mediumJPEG}`,
              convertedImageBufferMediumJPEG
            );
            image.medium = `${process.env.URL}${mediumJPEG}`;
            const smallJPEG = `${Date.now()}_${i}_small.jpeg`;
            const convertedImageBufferSmallJPEG = await sharp(req.files['image'][i].path)
              .resize(300, 300, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .jpeg()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${smallJPEG}`, convertedImageBufferSmallJPEG);
            image.small = `${process.env.URL}${smallJPEG}`;
            images.push(image);
            break;
          case "png":
            const filenamePNG = `${Date.now()}_${i}.png`;
            const convertedImageBufferPNG = await sharp(req.files['image'][i].path)
              .resize(1200, 1000, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .png()
              .toBuffer();
            fs.writeFileSync(
              `${outputPath}${filenamePNG}`,
              convertedImageBufferPNG
            );
            image.large = `${process.env.URL}${filenamePNG}`;
            const mediumPNG = `${Date.now()}_${i}_medium.png`;
            const convertedImageBufferMediumPNG = await sharp(req.files['image'][i].path)
              .resize(600, 600, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .png()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${mediumPNG}`, convertedImageBufferMediumPNG);
            image.medium = `${process.env.URL}${mediumPNG}`;
            const smallPNG = `${Date.now()}_${i}_small.png`;
            const convertedImageBufferSmallPNG = await sharp(req.files['image'][i].path)
              .resize(300, 300, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .png()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${smallPNG}`, convertedImageBufferSmallPNG);
            image.small = `${process.env.URL}${smallPNG}`;
            images.push(image);
            break;
          case "webp":
            const filenameWEBP = `${Date.now()}_${i}.webp`;
            const convertedImageBufferWEBP = await sharp(req.files['image'][i].path)
              .resize(1200, 1000, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .webp()
              .toBuffer();
            fs.writeFileSync(
              `${outputPath}${filenameWEBP}`,
              convertedImageBufferWEBP
            );
            image.large = `${process.env.URL}${filenameWEBP}`;
            const mediumWEBP = `${Date.now()}_${i}_medium.webp`;
            const convertedImageBufferMediumWEBP = await sharp(req.files['image'][i].path)
              .resize(600, 600, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .webp()
              .toBuffer();
            fs.writeFileSync(
              `${outputPath}${mediumWEBP}`,
              convertedImageBufferMediumWEBP
            );
            image.medium = `${process.env.URL}${mediumWEBP}`;
            const smallWEBP = `${Date.now()}_${i}_small.webp`;
            const convertedImageBufferSmallWEBP = await sharp(req.files['image'][i].path)
              .resize(300, 300, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .webp()
              .toBuffer();
            fs.writeFileSync(`${outputPath}${smallWEBP}`, convertedImageBufferSmallWEBP);
            image.small = `${process.env.URL}${smallWEBP}`;
            images.push(image);
            break;
          default:
            return res.status(400).json({ error: "Unsupported format" });
        }
      }
      req.images = images;
    } else {
      req.images = [];
    }
    
    if (req.files['video']) {
      req.video = `${process.env.VIDEO_URL}${req.files['video'][0].filename}`;
    } else {
      req.video = null;
    }

    next();
  });
};

module.exports = uploadFile;