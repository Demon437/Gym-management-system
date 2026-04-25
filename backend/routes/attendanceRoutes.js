import express from "express";
import {
  checkInMember,
  checkOutMember,
  getAttendanceByDate
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/check-in", checkInMember);
router.post("/check-out", checkOutMember);
router.get("/", getAttendanceByDate);

export default router;