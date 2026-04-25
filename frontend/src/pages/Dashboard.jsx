import React from 'react';
import {
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import StatCard from '../components/StatCard';
import { useData } from '../contexts/DataContext';

const Dashboard = () => {
  const { data, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const stats = data.dashboard?.stats || {};
  const revenueData = data.dashboard?.revenueChart || [];
  const attendanceData = data.dashboard?.attendanceChart || [];
  const membershipData = data.dashboard?.membershipDistribution || [];
  const recentActivity = data.dashboard?.recentActivity || [];

  const totalMembersChange = Number(stats.totalMembersChange || 0);
  const activeMembersChange = Number(stats.activeMembersChange || 0);
  const monthlyRevenueChange = Number(stats.monthlyRevenueChange || 0);
  const todayAttendanceChange = Number(stats.todayAttendanceChange || 0);

  const formatTrendValue = (value) => {
    const num = Number(value || 0);
    return `${num >= 0 ? '+' : ''}${num}%`;
  };

  const getTrendDirection = (value) => {
    return Number(value || 0) >= 0 ? 'up' : 'down';
  };

  const activityColorMap = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
    gray: 'bg-gray-500'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back! Here's what's happening with your gym today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={stats.totalMembers || 0}
          icon={Users}
          trend={getTrendDirection(totalMembersChange)}
          trendValue={formatTrendValue(totalMembersChange)}
          color="primary"
        />

        <StatCard
          title="Active Members"
          value={stats.activeMembers || 0}
          icon={Activity}
          trend={getTrendDirection(activeMembersChange)}
          trendValue={formatTrendValue(activeMembersChange)}
          color="green"
        />

        <StatCard
          title="Monthly Revenue"
         value={`₹${Number(stats.monthlyRevenue || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          trend={getTrendDirection(monthlyRevenueChange)}
          trendValue={formatTrendValue(monthlyRevenueChange)}
          color="orange"
        />

        <StatCard
          title="Today's Attendance"
          value={stats.todayAttendance || 0}
          icon={Calendar}
          trend={getTrendDirection(todayAttendanceChange)}
          trendValue={formatTrendValue(todayAttendanceChange)}
          color="blue"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Revenue Overview
              </h3>
              <p className="text-sm text-gray-500 dark:text-dark-500">
                Last 6 months performance
              </p>
            </div>

            <div
              className={`flex items-center gap-2 ${
                monthlyRevenueChange >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {monthlyRevenueChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">
                {formatTrendValue(monthlyRevenueChange)}
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Chart */}
        <div className="card p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Weekly Attendance
            </h3>
            <p className="text-sm text-gray-500 dark:text-dark-500">
              Current week overview
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="day"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership Distribution */}
        <div className="card p-6 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Membership Distribution
            </h3>
            <p className="text-sm text-gray-500 dark:text-dark-500">
              Current plan breakdown
            </p>
          </div>

          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={membershipData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {membershipData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || '#3b82f6'}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-500 dark:text-dark-500">
              Latest updates
            </p>
          </div>

          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div
                  key={activity._id || index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activityColorMap[activity.color] || 'bg-green-500'
                    }`}
                  ></div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.name || 'Unknown User'}{' '}
                      <span className="text-gray-500 dark:text-dark-500">
                        {activity.action || 'updated activity'}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-dark-400">
                      {activity.time || 'Just now'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 dark:text-dark-400">
                No recent activity available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;