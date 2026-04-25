import Member from "../models/Member.js";
import Payment from "../models/Payment.js";
import Attendance from "../models/Attendance.js";
import MembershipPlan from "../models/MembershipPlan.js";


export const getDashboardData = async (req, res) => {
  try {
    const today = new Date();

    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalMembers = await Member.countDocuments();

    const activeMembers = await Member.countDocuments({
      status: { $in: ["Active", "active"] }
    });

    // IMPORTANT: attendance status fixed
    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: startOfToday, $lte: endOfToday },
      status: { $in: ["Checked-In", "Checked-Out", "Present"] }
    });

    // IMPORTANT: payment date field check
    const monthlyPayments = await Payment.find({
      $or: [
        { date: { $gte: startOfMonth } },
        { createdAt: { $gte: startOfMonth } }
      ]
    });

    const monthlyRevenue = monthlyPayments.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const revenueChart = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

      const payments = await Payment.find({
        $or: [
          { date: { $gte: start, $lt: end } },
          { createdAt: { $gte: start, $lt: end } }
        ]
      });

      const revenue = payments.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

      revenueChart.push({
        month: start.toLocaleString("en-US", { month: "short" }),
        revenue
      });
    }

    const attendanceChart = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(today.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await Attendance.countDocuments({
        date: { $gte: dayStart, $lte: dayEnd },
        status: { $in: ["Checked-In", "Checked-Out", "Present"] }
      });

      attendanceChart.push({
        day: days[dayStart.getDay()],
        count
      });
    }

    const plans = await MembershipPlan.find();

    const membershipDistribution = await Promise.all(
      plans.map(async (plan, index) => {
        const value = await Member.countDocuments({
          membershipPlan: plan._id
        });

        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

        return {
          name: plan.name,
          value,
          color: colors[index % colors.length]
        };
      })
    );

    const recentAttendance = await Attendance.find({
      status: { $in: ["Checked-In", "Checked-Out", "Present"] }
    })
      .populate("member", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivity = recentAttendance.map((item) => ({
      _id: item._id,
      name: item.member?.name || "Member",
      action:
        item.status === "Checked-Out"
          ? "checked out"
          : "checked in",
      time: new Date(item.createdAt).toLocaleString("en-IN"),
      color: item.status === "Checked-Out" ? "blue" : "green"
    }));

    res.status(200).json({
      stats: {
        totalMembers,
        activeMembers,
        monthlyRevenue,
        todayAttendance,
        totalMembersChange: 0,
        activeMembersChange: 0,
        monthlyRevenueChange: 0,
        todayAttendanceChange: 0
      },
      revenueChart,
      attendanceChart,
      membershipDistribution,
      recentActivity
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};