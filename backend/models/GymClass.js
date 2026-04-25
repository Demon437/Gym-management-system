import mongoose from "mongoose";

const gymClassSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer"
    },
    time: { type: String, required: true },
    capacity: { type: Number, default: 20 },
    enrolled: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("GymClass", gymClassSchema);