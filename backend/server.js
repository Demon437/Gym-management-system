import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import membershipPlanRoutes from './routes/membershipPlanRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import expenseRoutes from "./routes/expenseRoutes.js";





dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "✅ FitCore Gym API running" });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use('/api/membership-plans', membershipPlanRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});