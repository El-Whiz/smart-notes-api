const fs = require("fs");
const path = require("path");
const multer = require("multer");

const tmpDir = path.join(__dirname, "..", "tmp");
const avatarDir = path.join(tmpDir, "avatars");
const imageDir = path.join(tmpDir, "images");

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

const avatar_storage = multer.diskStorage({
  destination: avatarDir,
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, safeName);
  },
});

const image_storage = multer.diskStorage({
  destination: imageDir,
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, safeName);
  },
});

const upload_avatar = multer({
  storage: avatar_storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"), false);
    }
  },
});

const upload_image = multer({
  storage: image_storage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  },
});

const upload_file = multer({
  storage: multer.diskStorage({
    destination: tmpDir,
    filename: (req, file, cb) => {
      const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
      cb(null, safeName);
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = { upload_avatar, upload_image, upload_file };
