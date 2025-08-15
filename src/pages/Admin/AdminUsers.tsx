import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  MoreVertical
} from 'lucide-react';
import { AdminUser, UserRole } from '../../types/admin';
import { getUsers, updateUserRole, suspendUser, exportUsers } from '../../services/adminService';
import { useAdmin } from '../../context/AdminContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminUsers: React.FC = () => {
  const { darkMode, hasPermission } = useAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, selectedRole, selectedStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        role: selectedRole || undefined,
        status: selectedStatus || undefined
      });
      setUsers(response.users);
      setTotalUsers(response.total);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!hasPermission('users.update')) {
      toast.error('You do not have permission to update user roles');
      return;
    }

    try {
      await updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleSuspendUser = async (userId: string) => {
    if (!hasPermission('users.update')) {
      toast.error('You do not have permission to suspend users');
      return;
    }

    if (!confirm('Are you sure you want to suspend this user?')) {
      return;
    }

    try {
      await suspendUser(userId);
      toast.success('User suspended successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      const blob = await exportUsers(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Users exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export users');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case UserRole.MANAGER:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case UserRole.OPERATOR:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Users Management
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage user accounts, roles, and permissions
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className={`px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
                darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
              } flex items-center space-x-2`}
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className={`px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
                darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
              } flex items-center space-x-2`}
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
          
          {hasPermission('users.create') && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } p-6 rounded-xl border shadow-sm`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="operator">Operator</option>
            <option value="user">User</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <button className={`px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
            darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
          } flex items-center space-x-2`}>
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-xl border shadow-sm overflow-hidden`}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      User
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Role
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Status
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Last Login
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Created
                    </th>
                    <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
                  darkMode ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {users.map((user) => (
                    <tr key={user.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user.firstName} {user.lastName}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {hasPermission('users.update') && (
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {hasPermission('users.delete') && (
                            <button
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={`px-6 py-3 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                  >
                    Previous
                  </button>
                  <span className={`px-3 py-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded border ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  User Details
                </h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-medium">
                      {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Role
                    </label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => handleRoleChange(selectedUser.id, e.target.value as UserRole)}
                      disabled={!hasPermission('users.update')}
                      className={`mt-1 w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="operator">Operator</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedUser.phoneNumber || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Last Login
                    </label>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(selectedUser.lastLogin).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Permissions
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedUser.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowUserModal(false)}
                  className={`px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  Close
                </button>
                {hasPermission('users.update') && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;