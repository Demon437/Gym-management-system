import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "fitcore_gym/trainers",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    resource_type: "auto",
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const uploadTrainerImage = multer({
  storage,
  fileFilter,
});

export default uploadTrainerImage;