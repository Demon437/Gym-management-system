import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, CreditCard,
  Calendar, DollarSign, Dumbbell, Settings, X, Activity, LogOut,
  IndianRupee,
} from 'lucide-react';
import { MessageSquare} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard',            icon: LayoutDashboard, label: 'Dashboard'        },
    { path: '/dashboard/members',    icon: Users,           label: 'Members'          },
    { path: '/dashboard/trainers',   icon: UserCheck,       label: 'Trainers'         },
    { path: '/dashboard/plans',      icon: CreditCard,      label: 'Membership Plans' },
    { path: '/dashboard/attendance', icon: Calendar,        label: 'Attendance'       },
    { path: '/dashboard/payments',   icon: IndianRupee,     label: 'Payments'         },
    { path: '/dashboard/classes',    icon: Dumbbell,        label: 'Classes'          },
    { path: '/dashboard/inquiries',  icon: MessageSquare,   label: 'Inquiries'        },
    { path: '/dashboard/expenses',   icon: IndianRupee,     label: 'Expenses'         }, 
    { path: '/dashboard/settings',   icon: Settings,        label: 'Settings'         },
   
  ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-dark-100 border-r border-gray-200 dark:border-dark-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>

        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-dark-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Webix_Gym</h1>
              <p className="text-xs text-gray-500 dark:text-dark-500">Gym Management</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-dark-500 dark:hover:text-dark-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* {user && (
            <div className="mx-1 mb-4 p-3 rounded-lg bg-gray-50 dark:bg-dark-50 border border-gray-200 dark:border-dark-200">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-dark-500 truncate">{user.role}</p>
            </div>
          )} */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'text-gray-700 dark:text-dark-700 hover:bg-gray-100 dark:hover:bg-dark-50'
                  } group
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-dark-200 space-y-3">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Need Help?</h3>
            <p className="text-xs text-gray-600 dark:text-dark-600 mb-3">Contact support for assistance</p>
            <button className="w-full bg-white dark:bg-dark-100 text-primary-600 dark:text-primary-400 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-50 transition-colors">
              Contact Support
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                       text-red-600 dark:text-red-400 font-medium text-sm
                       border border-red-200 dark:border-red-900/50
                       hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
