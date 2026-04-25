import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    members: [],
    trainers: [],
    membershipPlans: [],
    attendance: [],
    attendanceSummary: {
      todaysCheckins: 0,
      activeNow: 0,
      avgDuration: "0m",
    },
    payments: [],
    expenses: [],
    classes: [],
    inquiries: [],
    settings: {},
    dashboard: {
      stats: {},
      revenueChart: [],
      expenseChart: [],
      profitTrendChart: [],
      attendanceChart: [],
      membershipDistribution: [],
      expenseDistribution: [],
      recentActivity: [],
      recentExpenses: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [trainersLoading, setTrainersLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState([]);

  const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });

      const contentType = response.headers.get("content-type") || "";
      const rawText = await response.text();

      let result = {};
      if (rawText) {
        if (contentType.includes("application/json")) {
          result = JSON.parse(rawText);
        } else {
          console.error(`❌ Non-JSON response from ${url}:`, rawText);
          throw new Error(
            `Server returned non-JSON response for ${endpoint}. Check backend route and API URL.`
          );
        }
      }

      if (!response.ok) {
        throw new Error(result.message || `Request failed for ${endpoint}`);
      }

      return result;
    } catch (error) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          `Cannot connect to backend at ${API_BASE_URL}. Please check backend server, port, and CORS.`
        );
      }
      throw error;
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        await Promise.allSettled([
          fetchDashboardData(),
          fetchMembershipPlans(),
          fetchMembers(),
          fetchTrainers(),
          fetchClasses(),
          fetchAttendanceByDate(new Date().toISOString().split("T")[0]),
          fetchPayments(),
          fetchExpenses(),
          fetchExpenseCategories(),
        ]);
      } catch (error) {
        console.error("❌ Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);

      const result = await apiRequest("/dashboard");

      setData((prev) => ({
        ...prev,
        dashboard: {
          stats: result.stats || {},
          revenueChart: result.revenueChart || [],
          expenseChart: result.expenseChart || [],
          profitTrendChart: result.profitTrendChart || [],
          attendanceChart: result.attendanceChart || [],
          membershipDistribution: result.membershipDistribution || [],
          expenseDistribution: result.expenseDistribution || [],
          recentActivity: result.recentActivity || [],
          recentExpenses: result.recentExpenses || [],
        },
      }));

      return { success: true, dashboard: result };
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      return { success: false, message: error.message };
    } finally {
      setDashboardLoading(false);
    }
  };

  const fetchMembershipPlans = async () => {
    try {
      setPlansLoading(true);
      const result = await apiRequest("/membership-plans");

      setData((prev) => ({
        ...prev,
        membershipPlans: result.plans || [],
      }));

      return { success: true, plans: result.plans || [] };
    } catch (error) {
      console.error("❌ Error fetching membership plans:", error);
      return { success: false, message: error.message };
    } finally {
      setPlansLoading(false);
    }
  };

  const addMembershipPlan = async (planData) => {
    try {
      const result = await apiRequest("/membership-plans", {
        method: "POST",
        body: JSON.stringify(planData),
      });

      setData((prev) => ({
        ...prev,
        membershipPlans: [result.plan, ...(prev.membershipPlans || [])],
      }));

      await fetchDashboardData();
      return { success: true, plan: result.plan };
    } catch (error) {
      console.error("❌ Error adding membership plan:", error);
      return { success: false, message: error.message };
    }
  };

  const updateMembershipPlan = async (id, updates) => {
    try {
      const result = await apiRequest(`/membership-plans/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });

      setData((prev) => ({
        ...prev,
        membershipPlans: (prev.membershipPlans || []).map((plan) =>
          plan._id === id ? result.plan : plan
        ),
      }));

      await fetchDashboardData();
      return { success: true, plan: result.plan };
    } catch (error) {
      console.error("❌ Error updating membership plan:", error);
      return { success: false, message: error.message };
    }
  };

  const deleteMembershipPlan = async (id) => {
    try {
      await apiRequest(`/membership-plans/${id}`, {
        method: "DELETE",
      });

      setData((prev) => ({
        ...prev,
        membershipPlans: (prev.membershipPlans || []).filter(
          (plan) => plan._id !== id
        ),
      }));

      await fetchDashboardData();
      return { success: true };
    } catch (error) {
      console.error("❌ Error deleting membership plan:", error);
      return { success: false, message: error.message };
    }
  };

  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      const result = await apiRequest("/members");

      setData((prev) => ({
        ...prev,
        members: result.members || [],
      }));

      return { success: true, members: result.members || [] };
    } catch (error) {
      console.error("❌ Error fetching members:", error);
      return { success: false, message: error.message };
    } finally {
      setMembersLoading(false);
    }
  };

  const addMember = async (memberData) => {
    try {
      const payload = {
        ...memberData,
        joinDate: memberData.joinDate || new Date().toISOString().split("T")[0],
        avatar:
          memberData.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            memberData.name || "member"
          )}`,
      };

      const result = await apiRequest("/members", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setData((prev) => ({
        ...prev,
        members: [result.member, ...(prev.members || [])],
      }));

      await Promise.allSettled([
        fetchDashboardData(),
        fetchAttendanceByDate(new Date().toISOString().split("T")[0]),
        fetchPayments(),
      ]);

      return { success: true, member: result.member };
    } catch (error) {
      console.error("❌ Error adding member:", error);
      return { success: false, message: error.message };
    }
  };

  const updateMember = async (id, updates) => {
    try {
      const result = await apiRequest(`/members/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });

      setData((prev) => ({
        ...prev,
        members: (prev.members || []).map((member) =>
          member._id === id ? result.member : member
        ),
      }));

      await fetchDashboardData();
      return { success: true, member: result.member };
    } catch (error) {
      console.error("❌ Error updating member:", error);
      return { success: false, message: error.message };
    }
  };

  const deleteMember = async (id) => {
    try {
      await apiRequest(`/members/${id}`, {
        method: "DELETE",
      });

      setData((prev) => ({
        ...prev,
        members: (prev.members || []).filter((member) => member._id !== id),
      }));

      await Promise.allSettled([
        fetchDashboardData(),
        fetchAttendanceByDate(new Date().toISOString().split("T")[0]),
        fetchPayments(),
      ]);

      return { success: true };
    } catch (error) {
      console.error("❌ Error deleting member:", error);
      return { success: false, message: error.message };
    }
  };

  const fetchTrainers = async () => {
    try {
      setTrainersLoading(true);
      const result = await apiRequest("/trainers");

      setData((prev) => ({
        ...prev,
        trainers: result.trainers || [],
      }));

      return { success: true, trainers: result.trainers || [] };
    } catch (error) {
      console.error("❌ Error fetching trainers:", error);
      return { success: false, message: error.message };
    } finally {
      setTrainersLoading(false);
    }
  };

  const addTrainer = async (trainerData) => {
    try {
      const payload = {
        ...trainerData,
        joinDate:
          trainerData.joinDate || new Date().toISOString().split("T")[0],
        avatar:
          trainerData.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            trainerData.name || "trainer"
          )}`,
      };

      const result = await apiRequest("/trainers", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setData((prev) => ({
        ...prev,
        trainers: [result.trainer, ...(prev.trainers || [])],
      }));

      return { success: true, trainer: result.trainer };
    } catch (error) {
      console.error("❌ Error adding trainer:", error);
      return { success: false, message: error.message };
    }
  };

  const updateTrainer = async (id, updates) => {
    try {
      const result = await apiRequest(`/trainers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });

      setData((prev) => ({
        ...prev,
        trainers: (prev.trainers || []).map((trainer) =>
          trainer._id === id ? result.trainer : trainer
        ),
      }));

      return { success: true, trainer: result.trainer };
    } catch (error) {
      console.error("❌ Error updating trainer:", error);
      return { success: false, message: error.message };
    }
  };

  const deleteTrainer = async (id) => {
    try {
      await apiRequest(`/trainers/${id}`, {
        method: "DELETE",
      });

      setData((prev) => ({
        ...prev,
        trainers: (prev.trainers || []).filter((trainer) => trainer._id !== id),
      }));

      return { success: true };
    } catch (error) {
      console.error("❌ Error deleting trainer:", error);
      return { success: false, message: error.message };
    }
  };

  const fetchClasses = async () => {
    try {
      setClassesLoading(true);
      const result = await apiRequest("/classes");

      setData((prev) => ({
        ...prev,
        classes: result.classes || [],
      }));

      return { success: true, classes: result.classes || [] };
    } catch (error) {
      console.error("❌ Error fetching classes:", error);
      return { success: false, message: error.message };
    } finally {
      setClassesLoading(false);
    }
  };

  const addClass = async (classData) => {
    try {
      const result = await apiRequest("/classes", {
        method: "POST",
        body: JSON.stringify(classData),
      });

      setData((prev) => ({
        ...prev,
        classes: [result.classItem, ...(prev.classes || [])],
      }));

      return { success: true, classItem: result.classItem };
    } catch (error) {
      console.error("❌ Error adding class:", error);
      return { success: false, message: error.message };
    }
  };

  const updateClass = async (id, updates) => {
    try {
      const result = await apiRequest(`/classes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });

      setData((prev) => ({
        ...prev,
        classes: (prev.classes || []).map((classItem) =>
          classItem._id === id ? result.classItem : classItem
        ),
      }));

      return { success: true, classItem: result.classItem };
    } catch (error) {
      console.error("❌ Error updating class:", error);
      return { success: false, message: error.message };
    }
  };

  const deleteClass = async (id) => {
    try {
      await apiRequest(`/classes/${id}`, {
        method: "DELETE",
      });

      setData((prev) => ({
        ...prev,
        classes: (prev.classes || []).filter(
          (classItem) => classItem._id !== id
        ),
      }));

      return { success: true };
    } catch (error) {
      console.error("❌ Error deleting class:", error);
      return { success: false, message: error.message };
    }
  };

  const fetchAttendanceByDate = async (date) => {
    try {
      setAttendanceLoading(true);

      const selectedDate = date || new Date().toISOString().split("T")[0];
      const result = await apiRequest(`/attendance?date=${selectedDate}`);

      setData((prev) => ({
        ...prev,
        attendance: result.attendance || [],
        attendanceSummary: result.summary || {
          todaysCheckins: 0,
          activeNow: 0,
          avgDuration: "0m",
        },
      }));

      return {
        success: true,
        attendance: result.attendance || [],
        summary: result.summary || {},
      };
    } catch (error) {
      console.error("❌ Error fetching attendance:", error);
      return { success: false, message: error.message };
    } finally {
      setAttendanceLoading(false);
    }
  };

  const fetchAttendance = async () => {
    return fetchAttendanceByDate(new Date().toISOString().split("T")[0]);
  };

  const addAttendance = async (attendanceData) => {
    try {
      const result = await apiRequest("/attendance/check-in", {
        method: "POST",
        body: JSON.stringify({
          memberId: attendanceData.member,
          date: attendanceData.date,
        }),
      });

      await Promise.allSettled([
        fetchAttendanceByDate(attendanceData.date),
        fetchDashboardData(),
      ]);

      return { success: true, attendance: result.attendance };
    } catch (error) {
      console.error("❌ Error adding attendance:", error);
      return { success: false, message: error.message };
    }
  };

  const checkOutAttendance = async (memberId, date) => {
    try {
      const result = await apiRequest("/attendance/check-out", {
        method: "POST",
        body: JSON.stringify({ memberId, date }),
      });

      await Promise.allSettled([
        fetchAttendanceByDate(date),
        fetchDashboardData(),
      ]);

      return { success: true, attendance: result.attendance };
    } catch (error) {
      console.error("❌ Error checking out attendance:", error);
      return { success: false, message: error.message };
    }
  };

  const updateAttendance = async () => {
    return { success: false, message: "Use check-in/check-out flow instead." };
  };

  const deleteAttendance = async () => {
    return {
      success: false,
      message: "Delete attendance endpoint not configured.",
    };
  };

  const fetchPayments = async () => {
    try {
      setPaymentsLoading(true);
      const result = await apiRequest("/payments");

      setData((prev) => ({
        ...prev,
        payments: result.payments || [],
      }));

      return { success: true, payments: result.payments || [] };
    } catch (error) {
      console.error("❌ Error fetching payments:", error);
      return { success: false, message: error.message };
    } finally {
      setPaymentsLoading(false);
    }
  };

  const addPayment = async (paymentData) => {
    try {
      const result = await apiRequest("/payments", {
        method: "POST",
        body: JSON.stringify(paymentData),
      });

      setData((prev) => ({
        ...prev,
        payments: [result.payment, ...(prev.payments || [])],
      }));

      await fetchDashboardData();
      return { success: true, payment: result.payment };
    } catch (error) {
      console.error("❌ Error adding payment:", error);
      return { success: false, message: error.message };
    }
  };

  const updatePayment = async (id, updates) => {
    try {
      const result = await apiRequest(`/payments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });

      setData((prev) => ({
        ...prev,
        payments: (prev.payments || []).map((item) =>
          item._id === id ? result.payment : item
        ),
      }));

      await fetchDashboardData();
      return { success: true, payment: result.payment };
    } catch (error) {
      console.error("❌ Error updating payment:", error);
      return { success: false, message: error.message };
    }
  };

  const deletePayment = async (id) => {
    try {
      await apiRequest(`/payments/${id}`, {
        method: "DELETE",
      });

      setData((prev) => ({
        ...prev,
        payments: (prev.payments || []).filter((item) => item._id !== id),
      }));

      await fetchDashboardData();
      return { success: true };
    } catch (error) {
      console.error("❌ Error deleting payment:", error);
      return { success: false, message: error.message };
    }
  };

  const fetchExpenses = async (params = {}) => {
    try {
      setExpensesLoading(true);

      const searchParams = new URLSearchParams();

      if (params.filter) {
        searchParams.append("filter", params.filter);
      }

      if (params.startDate && params.endDate) {
        searchParams.append("startDate", params.startDate);
        searchParams.append("endDate", params.endDate);
      }

      const queryString = searchParams.toString();
      const endpoint = queryString ? `/expenses?${queryString}` : "/expenses";

      const result = await apiRequest(endpoint);

      setData((prev) => ({
        ...prev,
        expenses: result.expenses || [],
      }));

      return { success: true, expenses: result.expenses || [] };
    } catch (error) {
      console.error("❌ Error fetching expenses:", error);
      return { success: false, message: error.message };
    } finally {
      setExpensesLoading(false);
    }
  };

  const fetchExpenseCategories = async () => {
    try {
      const result = await apiRequest("/expenses/categories");

      setExpenseCategories(result.categories || []);

      return { success: true, categories: result.categories || [] };
    } catch (error) {
      console.error("❌ Error fetching expense categories:", error);
      return { success: false, message: error.message };
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const result = await apiRequest("/expenses", {
        method: "POST",
        body: JSON.stringify(expenseData),
      });

      setData((prev) => ({
        ...prev,
        expenses: [result.expense, ...(prev.expenses || [])],
      }));

      await Promise.allSettled([
        fetchDashboardData(),
        fetchExpenseCategories(),
      ]);

      return { success: true, expense: result.expense };
    } catch (error) {
      console.error("❌ Error adding expense:", error);
      return { success: false, message: error.message };
    }
  };

  const updateExpense = async (id, updates) => {
    try {
      const result = await apiRequest(`/expenses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });

      setData((prev) => ({
        ...prev,
        expenses: (prev.expenses || []).map((item) =>
          item._id === id ? result.expense : item
        ),
      }));

      await Promise.allSettled([
        fetchDashboardData(),
        fetchExpenseCategories(),
      ]);

      return { success: true, expense: result.expense };
    } catch (error) {
      console.error("❌ Error updating expense:", error);
      return { success: false, message: error.message };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await apiRequest(`/expenses/${id}`, {
        method: "DELETE",
      });

      setData((prev) => ({
        ...prev,
        expenses: (prev.expenses || []).filter((item) => item._id !== id),
      }));

      await Promise.allSettled([
        fetchDashboardData(),
        fetchExpenseCategories(),
      ]);

      return { success: true };
    } catch (error) {
      console.error("❌ Error deleting expense:", error);
      return { success: false, message: error.message };
    }
  };

  const fetchInquiries = async () => {
    try {
      setInquiriesLoading(true);
      const result = await apiRequest("/inquiries");

      setData((prev) => ({
        ...prev,
        inquiries: result.inquiries || result.contacts || [],
      }));

      return {
        success: true,
        inquiries: result.inquiries || result.contacts || [],
      };
    } catch (error) {
      console.error("❌ Error fetching inquiries:", error);
      return { success: false, message: error.message };
    } finally {
      setInquiriesLoading(false);
    }
  };

  const value = {
    data,
    loading,
    plansLoading,
    membersLoading,
    trainersLoading,
    classesLoading,
    attendanceLoading,
    paymentsLoading,
    expensesLoading,
    dashboardLoading,
    inquiriesLoading,
    expenseCategories,
    setData,

    fetchDashboardData,

    fetchMembershipPlans,
    addMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan,

    fetchMembers,
    addMember,
    updateMember,
    deleteMember,

    fetchTrainers,
    addTrainer,
    updateTrainer,
    deleteTrainer,

    fetchClasses,
    addClass,
    updateClass,
    deleteClass,

    fetchAttendance,
    fetchAttendanceByDate,
    addAttendance,
    checkOutAttendance,
    updateAttendance,
    deleteAttendance,

    fetchPayments,
    addPayment,
    updatePayment,
    deletePayment,

    fetchExpenses,
    fetchExpenseCategories,
    addExpense,
    updateExpense,
    deleteExpense,

    fetchInquiries,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};