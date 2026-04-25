import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600 shadow-primary-500/30',
    green: 'from-green-500 to-green-600 shadow-green-500/30',
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/30',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/30',
    pink: 'from-pink-500 to-pink-600 shadow-pink-500/30',
  };

  return (
    <div className="stat-card">
      {/* Decorative gradient background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}></div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-dark-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
          </div>
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Trend */}
        {trend && (
          <div className="flex items-center gap-2">
            {trend === 'up' ? (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
            <span className="text-sm text-gray-500 dark:text-dark-500">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
