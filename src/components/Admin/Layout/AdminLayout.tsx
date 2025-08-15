import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAdmin } from '../../../context/AdminContext';

const AdminLayout: React.FC = () => {
  const { darkMode, sidebarCollapsed } = useAdmin();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        <AdminSidebar />
        <div className={`flex-1 ${sidebarCollapsed ? 'ml-0' : 'ml-0'}`}>
          <AdminHeader />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;