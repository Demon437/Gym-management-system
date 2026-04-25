import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";

const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return "0m";

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
};

export const checkInMember = async (req, res) => {
  try {
    const { memberId, date } = req.body;

    console.log("📥 Check-in request body:", req.body);

    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ message: "Invalid memberId" });
    }

    const selectedDate = date ? new Date(date) : new Date();

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const todayStart = new Date(selectedDate);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(selectedDate);
    todayEnd.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      member: memberId,
      date: { $gte: todayStart, $lte: todayEnd },
      status: { $in: ["Checked-In", "Present"] }
    });

    if (existing) {
      return res.status(400).json({
        message: "Member already checked in today"
      });
    }

    const attendance = await Attendance.create({
      member: memberId,
      date: selectedDate,
      checkIn: new Date(),
      checkOut: null,
      duration: "0m",
      status: "Checked-In"
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate("member", "name email phone membershipPlan status");

    console.log("✅ Check-in saved:", populatedAttendance);

    return res.status(201).json({
      message: "Check-in successful",
      attendance: populatedAttendance
    });
  } catch (error) {
    console.error("❌ Check-in error full:", error);
    return res.status(500).json({
      message: error.message || "Failed to check in member",
      error: error.message
    });
  }
};

export const checkOutMember = async (req, res) => {
  try {
    const { memberId, date } = req.body;

    console.log("📤 Check-out request body:", req.body);

    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ message: "Invalid memberId" });
    }

    const selectedDate = date ? new Date(date) : new Date();

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const todayStart = new Date(selectedDate);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(selectedDate);
    todayEnd.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      member: memberId,
      date: { $gte: todayStart, $lte: todayEnd },
      status: "Checked-In"
    });

    if (!attendance) {
      return res.status(404).json({ message: "No active check-in found" });
    }

    const checkOutTime = new Date();
    const durationInMinutes = Math.floor(
      (checkOutTime - new Date(attendance.checkIn)) / (1000 * 60)
    );

    attendance.checkOut = checkOutTime;
    attendance.duration = formatDuration(durationInMinutes);
    attendance.status = "Checked-Out";

    await attendance.save();

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate("member", "name email phone membershipPlan status");

    console.log("✅ Check-out saved:", populatedAttendance);

    return res.status(200).json({
      message: "Check-out successful",
      attendance: populatedAttendance
    });
  } catch (error) {
    console.error("❌ Check-out error full:", error);
    return res.status(500).json({
      message: error.message || "Failed to check out member",
      error: error.message
    });
  }
};

export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const selectedDate = date ? new Date(date) : new Date();

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: { $gte: start, $lte: end }
    })
      .populate("member", "name email phone membershipPlan status")
      .sort({ createdAt: -1 });

    const todaysCheckins = attendance.filter(
      (item) => item.status === "Checked-In" || item.status === "Checked-Out"
    ).length;

    const activeNow = attendance.filter(
      (item) => item.status === "Checked-In"
    ).length;

    let avgDuration = "0m";
    const checkedOutItems = attendance.filter(
      (item) => item.status === "Checked-Out" && item.duration
    );

    if (checkedOutItems.length > 0) {
      const totalMinutes = checkedOutItems.reduce((sum, item) => {
        if (typeof item.duration === "number") return sum + item.duration;

        if (typeof item.duration === "string") {
          const hourMatch = item.duration.match(/(\d+)h/);
          const minMatch = item.duration.match(/(\d+)m/);

          const hrs = hourMatch ? parseInt(hourMatch[1], 10) : 0;
          const mins = minMatch ? parseInt(minMatch[1], 10) : 0;

          return sum + hrs * 60 + mins;
        }

        return sum;
      }, 0);

      avgDuration = formatDuration(
        Math.floor(totalMinutes / checkedOutItems.length)
      );
    }

    return res.status(200).json({
      attendance,
      summary: {
        todaysCheckins,
        activeNow,
        avgDuration
      }
    });
  } catch (error) {
    console.error("❌ Get attendance error full:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch attendance",
      error: error.message
    });
  }
};