import Expense from "../models/Expense.js";

export const getExpenses = async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;

    const query = {};
    const today = new Date();

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    if (filter === "today") {
      const startOfToday = new Date(today);
      startOfToday.setHours(0, 0, 0, 0);

      query.expenseDate = {
        $gte: startOfToday,
        $lte: endOfToday,
      };
    }

    if (filter === "week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      query.expenseDate = {
        $gte: startOfWeek,
        $lte: endOfToday,
      };
    }

    if (filter === "month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      query.expenseDate = {
        $gte: startOfMonth,
        $lte: endOfToday,
      };
    }

    if (startDate && endDate) {
      const customStart = new Date(startDate);
      customStart.setHours(0, 0, 0, 0);

      const customEnd = new Date(endDate);
      customEnd.setHours(23, 59, 59, 999);

      query.expenseDate = {
        $gte: customStart,
        $lte: customEnd,
      };
    }

    const expenses = await Expense.find(query).sort({
      expenseDate: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
};

export const getExpenseCategories = async (req, res) => {
  try {
    const categories = await Expense.distinct("category");

    const cleanCategories = categories
      .filter(Boolean)
      .map((item) => item.trim())
      .filter(Boolean);

    const uniqueCategories = [...new Set(cleanCategories)].sort();

    res.status(200).json({
      success: true,
      categories: uniqueCategories,
    });
  } catch (error) {
    console.error("Get Expense Categories Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expense categories",
    });
  }
};

export const getSingleExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error("Get Single Expense Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expense",
    });
  }
};

export const createExpense = async (req, res) => {
  try {
    const {
      title,
      category,
      amount,
      expenseDate,
      paymentMethod,
      vendor,
      addedBy,
      note,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Expense title is required",
      });
    }

    if (amount === undefined || amount === "" || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const finalCategory =
      category && category.trim() ? category.trim() : "Miscellaneous";

    const finalStatus = status || "Paid";

    const expense = await Expense.create({
      title: title.trim(),
      category: finalCategory,
      amount: Number(amount),
      expenseDate: expenseDate || new Date(),
      paymentMethod: finalStatus === "Pending" ? "" : paymentMethod || "Cash",
      vendor: vendor?.trim() || "",
      addedBy: addedBy?.trim() || "Admin",
      note: note?.trim() || "",
      status: finalStatus,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    console.error("Create Expense Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create expense",
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.title !== undefined) {
      if (!updates.title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Expense title is required",
        });
      }

      updates.title = updates.title.trim();
    }

    if (updates.category !== undefined) {
      updates.category =
        updates.category && updates.category.trim()
          ? updates.category.trim()
          : "Miscellaneous";
    }

    if (updates.amount !== undefined) {
      if (updates.amount === "" || Number(updates.amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Valid amount is required",
        });
      }

      updates.amount = Number(updates.amount);
    }

    if (updates.status === "Pending") {
      updates.paymentMethod = "";
    }

    if (updates.status === "Paid" && !updates.paymentMethod) {
      updates.paymentMethod = "Cash";
    }

    if (updates.vendor !== undefined) {
      updates.vendor = updates.vendor?.trim() || "";
    }

    if (updates.addedBy !== undefined) {
      updates.addedBy = updates.addedBy?.trim() || "Admin";
    }

    if (updates.note !== undefined) {
      updates.note = updates.note?.trim() || "";
    }

    const expense = await Expense.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update expense",
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
    });
  }
};