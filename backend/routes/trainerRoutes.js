import express from "express";
import {
  getAllTrainers,
  getSingleTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from "../controllers/trainerController.js";
import uploadTrainerImage from "../middleware/uploadTrainerImage.js";

const router = express.Router();

router.get("/", getAllTrainers);
router.get("/:id", getSingleTrainer);
router.post("/", uploadTrainerImage.single("image"), createTrainer);
router.patch("/:id", uploadTrainerImage.single("image"), updateTrainer);
router.delete("/:id", deleteTrainer);

export default router;