import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Wrench,
  MapPin,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';
import { DashboardStats, AdminOrder } from '../../types/admin';
import { getDashboardStats, getRecentOrders, getActiveOrdersMap } from '../../services/adminService';
import { useAdmin } from '../../context/AdminContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { darkMode } = useAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, recentOrdersData, activeOrdersData] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(5),
        getActiveOrdersMap()
      ]);
      
      setStats(statsData);
      setRecentOrders(recentOrdersData);
      setActiveOrders(activeOrdersData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Dashboard
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Welcome back! Here's what's happening with AutoLife today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Revenue
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{stats?.revenueGrowth || 0}% from last month
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Users
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats?.totalUsers?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{stats?.userGrowth || 0}% from last month
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Orders
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats?.totalOrders?.toLocaleString() || 0}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                This month
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Services
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats?.activeServices || 0}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Currently available
              </p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
              <Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart */}
        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Monthly Revenue
            </h3>
            <button className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-600`}>
              <Eye className="w-4 h-4" />
            </button>
          </div>
          
          {/* Simple chart placeholder */}
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="text-center">
              <TrendingUp className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Revenue Chart
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Chart.js or similar library integration
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Orders
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {order.customerName}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {order.serviceName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(order.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Orders Map */}
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } p-6 rounded-xl border shadow-sm`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Active Orders Map
          </h3>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {activeOrders.length} active orders
            </span>
          </div>
        </div>
        
        {/* Map placeholder */}
        <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Interactive Map
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Google Maps integration showing active order locations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;