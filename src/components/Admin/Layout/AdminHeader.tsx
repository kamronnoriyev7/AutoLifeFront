import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  User, 
  Settings, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { useAuth } from '../../../context/AuthContext';

const AdminHeader: React.FC = () => {
  const { darkMode, toggleDarkMode, adminUser } = useAdmin();
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New order received', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment completed', time: '5 min ago', unread: true },
    { id: 3, title: 'Service updated', time: '1 hour ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } border-b px-6 py-4`}>
      <div className="flex items-center justify-between">
        
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              } relative`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border rounded-lg shadow-lg z-50`}>
                <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${
                        notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      } hover:bg-gray-50 dark:hover:bg-gray-700`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {notification.title}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {adminUser?.firstName} {adminUser?.lastName}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {adminUser?.role}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>

            {showUserMenu && (
              <div className={`absolute right-0 mt-2 w-48 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border rounded-lg shadow-lg z-50`}>
                <div className="py-2">
                  <button className={`w-full text-left px-4 py-2 text-sm ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  } flex items-center space-x-2`}>
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className={`w-full text-left px-4 py-2 text-sm ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  } flex items-center space-x-2`}>
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <hr className={`my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                  <button
                    onClick={logout}
                    className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;