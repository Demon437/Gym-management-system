import express from "express";
import {
  getExpenses,
  getExpenseCategories,
  getSingleExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", getExpenses);
router.get("/categories", getExpenseCategories);

router.get("/:id", getSingleExpense);
router.post("/", createExpense);
router.patch("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;