import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Bank Transfer"],
      default: "Cash"
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Paid"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);