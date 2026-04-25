import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  Plus,
  Edit,
  Trash2,
  Download,
  Wallet,
  CheckCircle,
  Clock,
  CalendarDays,
  Search,
  User,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const paymentMethods = ["Cash", "Card", "UPI", "Bank Transfer"];
const statusOptions = ["Paid", "Pending"];
const COLORS = ["#2563eb", "#22c55e", "#f97316", "#a855f7", "#ef4444", "#14b8a6"];

const initialForm = {
  title: "",
  category: "",
  newCategory: "",
  amount: "",
  expenseDate: "",
  paymentMethod: "Cash",
  vendor: "",
  addedBy: "",
  note: "",
  status: "Paid",
};

const Expenses = () => {
  const {
    data,
    expensesLoading,
    expenseCategories = [],
    fetchExpenses,
    fetchExpenseCategories,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useData();

  const [showModal, setShowModal] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    paymentMethod: "",
  });

  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchExpenses();
    fetchExpenseCategories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowNewCategoryInput(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setShowNewCategoryInput(false);
    setForm(initialForm);
  };

  const formatCurrency = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN")}`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category" && value === "__new__") {
      setShowNewCategoryInput(true);
      setForm((prev) => ({
        ...prev,
        category: "",
        newCategory: "",
      }));
      return;
    }

    if (name === "status") {
      setForm((prev) => ({
        ...prev,
        status: value,
        paymentMethod: value === "Pending" ? "" : prev.paymentMethod || "Cash",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setShowNewCategoryInput(false);

    setForm({
      title: item.title || "",
      category: item.category || "",
      newCategory: "",
      amount: item.amount || "",
      expenseDate: item.expenseDate
        ? new Date(item.expenseDate).toISOString().split("T")[0]
        : "",
      paymentMethod: item.paymentMethod || "Cash",
      vendor: item.vendor || "",
      addedBy: item.addedBy || "",
      note: item.note || "",
      status: item.status || "Paid",
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory =
      form.newCategory.trim() || form.category || "Miscellaneous";

    if (!form.title.trim()) {
      alert("Expense title is required");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Valid amount is required");
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: finalCategory.trim(),
      amount: Number(form.amount),
      expenseDate: form.expenseDate || new Date().toISOString().split("T")[0],
      paymentMethod: form.status === "Pending" ? "" : form.paymentMethod,
      vendor: form.vendor,
      addedBy: form.addedBy || "Admin",
      note: form.note,
      status: form.status,
    };

    const response = editingId
      ? await updateExpense(editingId, payload)
      : await addExpense(payload);

    if (response?.success) {
      await fetchExpenses();
      await fetchExpenseCategories();
      closeModal();
    } else {
      alert(response?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    const response = await deleteExpense(id);

    if (response?.success) {
      await fetchExpenses();
      await fetchExpenseCategories();
    }
  };

  const handleDateFilterChange = async (value) => {
    setDateFilter(value);

    if (value === "all") {
      await fetchExpenses();
      return;
    }

    if (value === "custom") return;

    await fetchExpenses({ filter: value });
  };

  const applyCustomDateFilter = async () => {
    if (!customDate.startDate || !customDate.endDate) {
      alert("Please select start and end date");
      return;
    }

    await fetchExpenses({
      startDate: customDate.startDate,
      endDate: customDate.endDate,
    });
  };

  const resetFilters = async () => {
    setFilters({
      search: "",
      category: "",
      status: "",
      paymentMethod: "",
    });

    setDateFilter("all");
    setCustomDate({
      startDate: "",
      endDate: "",
    });

    await fetchExpenses();
  };

  const filteredExpenses = useMemo(() => {
    return (data.expenses || []).filter((item) => {
      const search = filters.search.toLowerCase();

      const matchesSearch =
        !search ||
        item.title?.toLowerCase().includes(search) ||
        item.vendor?.toLowerCase().includes(search) ||
        item.addedBy?.toLowerCase().includes(search);

      const matchesCategory =
        !filters.category || item.category === filters.category;

      const matchesStatus = !filters.status || item.status === filters.status;

      const matchesMethod =
        !filters.paymentMethod || item.paymentMethod === filters.paymentMethod;

      return matchesSearch && matchesCategory && matchesStatus && matchesMethod;
    });
  }, [data.expenses, filters]);

  const totalExpenses = filteredExpenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalPaid = filteredExpenses
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalPending = filteredExpenses
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const thisMonthTotal = filteredExpenses
    .filter((item) => {
      const date = new Date(item.expenseDate || item.createdAt);
      const now = new Date();

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const categoryChartData = useMemo(() => {
    const map = {};

    filteredExpenses.forEach((item) => {
      const category = item.category || "Other";
      map[category] = (map[category] || 0) + Number(item.amount || 0);
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const monthlyChartData = useMemo(() => {
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const months = {};

    filteredExpenses.forEach((item) => {
      const date = new Date(item.expenseDate || item.createdAt);
      const month = date.toLocaleString("en-IN", { month: "short" });

      if (!months[month]) {
        months[month] = { month, Paid: 0, Pending: 0 };
      }

      if (item.status === "Paid") {
        months[month].Paid += Number(item.amount || 0);
      } else {
        months[month].Pending += Number(item.amount || 0);
      }
    });

    return Object.values(months).sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );
  }, [filteredExpenses]);

  const topExpense = filteredExpenses.length
    ? [...filteredExpenses].sort((a, b) => Number(b.amount) - Number(a.amount))[0]
    : null;

  const recentExpenses = [...filteredExpenses].slice(0, 5);

  const getReportTitle = () => {
    if (dateFilter === "today") return "Today Expenses Report";
    if (dateFilter === "week") return "Weekly Expenses Report";
    if (dateFilter === "month") return "Monthly Expenses Report";
    if (dateFilter === "custom") {
      return `Expenses Report (${customDate.startDate || "-"} to ${
        customDate.endDate || "-"
      })`;
    }
    return "All Expenses Report";
  };

  const getExportRows = () => {
    return filteredExpenses.map((item, index) => ({
      srNo: index + 1,
      title: item.title || "-",
      category: item.category || "-",
      amount: Number(item.amount || 0),
      date: item.expenseDate
        ? new Date(item.expenseDate).toLocaleDateString("en-IN")
        : "-",
      method: item.paymentMethod || (item.status === "Pending" ? "Not Paid" : "-"),
      vendor: item.vendor || "-",
      addedBy: item.addedBy || "-",
      status: item.status || "-",
      note: item.note || "-",
    }));
  };

  const exportToExcel = () => {
    const rows = getExportRows();

    if (!rows.length) {
      alert("No expenses available to export");
      return;
    }

    const excelData = rows.map((row) => ({
      "Sr No": row.srNo,
      Title: row.title,
      Category: row.category,
      Amount: row.amount,
      Date: row.date,
      Method: row.method,
      Vendor: row.vendor,
      "Added By": row.addedBy,
      Status: row.status,
      Note: row.note,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 28 },
      { wch: 20 },
      { wch: 12 },
      { wch: 14 },
      { wch: 16 },
      { wch: 22 },
      { wch: 18 },
      { wch: 12 },
      { wch: 35 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    XLSX.writeFile(workbook, `${getReportTitle().replaceAll(" ", "_")}.xlsx`);
  };

  const exportToPDF = () => {
    const rows = getExportRows();

    if (!rows.length) {
      alert("No expenses available to export");
      return;
    }

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text(getReportTitle(), 14, 15);

    doc.setFontSize(10);
    doc.text(`Total Records: ${rows.length}`, 14, 23);
    doc.text(`Total Amount: Rs. ${totalExpenses}`, 14, 30);
    doc.text(`Paid: Rs. ${totalPaid}`, 90, 30);
    doc.text(`Pending: Rs. ${totalPending}`, 150, 30);

    autoTable(doc, {
      startY: 38,
      head: [[
        "Sr No",
        "Title",
        "Category",
        "Amount",
        "Date",
        "Method",
        "Vendor",
        "Added By",
        "Status",
        "Note",
      ]],
      body: rows.map((row) => [
        row.srNo,
        row.title,
        row.category,
        `Rs. ${row.amount}`,
        row.date,
        row.method,
        row.vendor,
        row.addedBy,
        row.status,
        row.note,
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [37, 99, 235],
      },
    });

    doc.save(`${getReportTitle().replaceAll(" ", "_")}.pdf`);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Expense Management
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Expenses Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track gym expenses, vendors, payment status and monthly spending.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-200 transition"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Expenses</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatCurrency(totalExpenses)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Paid</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(totalPaid)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <h3 className="text-2xl font-bold text-orange-500 mt-1">
                {formatCurrency(totalPending)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">This Month</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">
                {formatCurrency(thisMonthTotal)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Monthly Expense Trend
              </h2>
              <p className="text-sm text-slate-500">
                Paid and pending expenses by month
              </p>
            </div>
          </div>

          <div className="h-[310px]">
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="Paid" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Pending" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No chart data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Category Split
            </h2>
            <p className="text-sm text-slate-500">
              Expenses grouped by category
            </p>
          </div>

          <div className="h-[240px]">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No chart data available
              </div>
            )}
          </div>

          <div className="space-y-2 mt-3">
            {categoryChartData.slice(0, 5).map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <div className="relative xl:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search title, vendor or added by"
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full border border-slate-200 rounded-2xl pl-9 pr-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {expenseCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={filters.paymentMethod}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value,
                }))
              }
              className="border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Methods</option>
              {paymentMethods.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
              className="border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Date</option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="border border-slate-200 rounded-2xl px-4 py-3 hover:bg-slate-50"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={exportToExcel}
              className="inline-flex items-center justify-center gap-2 border border-green-200 text-green-700 rounded-2xl px-4 py-3 hover:bg-green-50"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>

            <button
              type="button"
              onClick={exportToPDF}
              className="inline-flex items-center justify-center gap-2 border border-red-200 text-red-700 rounded-2xl px-4 py-3 hover:bg-red-50"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>

            {dateFilter === "custom" && (
              <div className="md:col-span-3 xl:col-span-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="date"
                  value={customDate.startDate}
                  onChange={(e) =>
                    setCustomDate((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="date"
                  value={customDate.endDate}
                  onChange={(e) =>
                    setCustomDate((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={applyCustomDateFilter}
                  className="bg-blue-600 text-white rounded-2xl px-4 py-3 hover:bg-blue-700"
                >
                  Apply Date
                </button>
              </div>
            )}
          </div>

          <div className="overflow-auto mt-5">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="text-left p-4 rounded-l-2xl">Title</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Method</th>
                  <th className="text-left p-4">Vendor</th>
                  <th className="text-left p-4">Added By</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Note</th>
                  <th className="text-left p-4 rounded-r-2xl">Actions</th>
                </tr>
              </thead>

              <tbody>
                {expensesLoading ? (
                  <tr>
                    <td colSpan="10" className="p-8 text-center text-slate-500">
                      Loading expenses...
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-8 text-center text-slate-500">
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="p-4 font-semibold text-slate-800">
                        {item.title}
                      </td>
                      <td className="p-4">{item.category}</td>
                      <td className="p-4 font-semibold">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="p-4">
                        {item.expenseDate
                          ? new Date(item.expenseDate).toLocaleDateString("en-IN")
                          : "-"}
                      </td>
                      <td className="p-4">{item.paymentMethod || "-"}</td>
                      <td className="p-4">{item.vendor || "-"}</td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </span>
                          {item.addedBy || "Admin"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 max-w-[200px] truncate">
                        {item.note || "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Quick Insights</h2>
          <p className="text-sm text-slate-500 mb-4">
            Recent records and top expense
          </p>

          <div className="bg-blue-50 rounded-2xl p-4 mb-5">
            <p className="text-sm text-blue-600 font-medium">Highest Expense</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {topExpense ? topExpense.title : "-"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {topExpense ? formatCurrency(topExpense.amount) : "No data found"}
            </p>
          </div>

          <div className="space-y-3">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3"
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.category} • {item.addedBy || "Admin"}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No recent expense found</p>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId ? "Edit Expense" : "Add Expense"}
                </h2>
                <p className="text-sm text-slate-500">
                  Fill the details below to save expense record
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Expense Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. April Electricity Bill"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category *
                  </label>
                  {!showNewCategoryInput ? (
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {expenseCategories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                      <option value="__new__">+ Add New Category</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="newCategory"
                        placeholder="Enter new category"
                        value={form.newCategory}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategoryInput(false);
                          setForm((prev) => ({ ...prev, newCategory: "" }));
                        }}
                        className="px-3 py-3 border rounded-2xl hover:bg-slate-50"
                      >
                        Back
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="e.g. 3500"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    name="expenseDate"
                    value={form.expenseDate}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={form.status === "Pending" ? "" : form.paymentMethod}
                    onChange={handleChange}
                    disabled={form.status === "Pending"}
                    className={`w-full border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                      form.status === "Pending"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {form.status === "Pending" ? (
                      <option value="">Not Paid Yet</option>
                    ) : (
                      paymentMethods.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Vendor / Person Name
                  </label>
                  <input
                    type="text"
                    name="vendor"
                    placeholder="e.g. Electricity Board"
                    value={form.vendor}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Added By
                  </label>
                  <input
                    type="text"
                    name="addedBy"
                    placeholder="e.g. Admin / Staff Name"
                    value={form.addedBy}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Note
                  </label>
                  <textarea
                    name="note"
                    placeholder="Write note..."
                    value={form.note}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-slate-200 rounded-2xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 border rounded-2xl hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
                >
                  {editingId ? "Update Expense" : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;