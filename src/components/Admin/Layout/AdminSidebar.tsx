import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Wrench,
  CreditCard,
  UserCheck,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Car
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

const AdminSidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, darkMode, hasPermission } = useAdmin();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      permission: 'dashboard.read'
    },
    {
      title: 'Users',
      icon: Users,
      path: '/admin/users',
      permission: 'users.read'
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      path: '/admin/orders',
      permission: 'orders.read'
    },
    {
      title: 'Services',
      icon: Wrench,
      path: '/admin/services',
      permission: 'services.read'
    },
    {
      title: 'Payments',
      icon: CreditCard,
      path: '/admin/payments',
      permission: 'payments.read'
    },
    {
      title: 'Staff',
      icon: UserCheck,
      path: '/admin/staff',
      permission: 'staff.read'
    },
    {
      title: 'Notifications',
      icon: Bell,
      path: '/admin/notifications',
      permission: 'notifications.read'
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      permission: 'settings.read'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

  return (
    <div className={`${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    } min-h-screen border-r transition-all duration-300 flex flex-col`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <Car className="w-8 h-8 text-blue-600" />
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                AutoLife
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                  }`}
                  title={sidebarCollapsed ? item.title : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            AutoLife Admin v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;