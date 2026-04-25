import express from "express";
import {
  getPlans,
  getSinglePlan,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/planController.js";

const router = express.Router();

router.get("/", getPlans);
router.get("/:id", getSinglePlan);
router.post("/", createPlan);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);

export default router;