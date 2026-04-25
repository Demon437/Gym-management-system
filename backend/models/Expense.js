import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      default: "Miscellaneous", // ✅ FIXED
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      set: (val) => Number(val),
    },

    expenseDate: {
      type: Date,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Bank Transfer"],
      default: "Cash",
    },

    vendor: {
      type: String,
      trim: true,
      default: "",
    },
    addedBy: {
      type: String,
      default: "Admin",
      required: true,
      trim: true,
      
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Paid",
    },
  },
  { timestamps: true },
);

// Optional but recommended for performance
expenseSchema.index({ expenseDate: -1 });
expenseSchema.index({ category: 1 });

export default mongoose.model("Expense", expenseSchema);
