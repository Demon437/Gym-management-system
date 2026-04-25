import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    checkIn: {
      type: Date,
      default: null
    },
    checkOut: {
      type: Date,
      default: null
    },
    duration: {
      type: String,
      default: "0m"
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Checked-In", "Checked-Out"],
      default: "Checked-In"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);