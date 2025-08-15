import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, UserRole } from '../types/admin';
import { useAuth } from './AuthContext';

interface AdminContextType {
  adminUser: AdminUser | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
  isManager: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Convert regular user to admin user if they have admin role
    if (user && (user as any).role) {
      setAdminUser({
        ...user,
        role: (user as any).role,
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        permissions: getPermissionsByRole((user as any).role)
      } as AdminUser);
    }
  }, [user]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('adminDarkMode', JSON.stringify(newDarkMode));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getPermissionsByRole = (role: UserRole): string[] => {
    switch (role) {
      case UserRole.ADMIN:
        return ['*']; // All permissions
      case UserRole.MANAGER:
        return ['users.read', 'orders.read', 'orders.update', 'services.read', 'services.update', 'staff.read'];
      case UserRole.OPERATOR:
        return ['orders.read', 'orders.update', 'services.read'];
      default:
        return [];
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!adminUser) return false;
    return adminUser.permissions.includes('*') || adminUser.permissions.includes(permission);
  };

  const isAdmin = adminUser?.role === UserRole.ADMIN;
  const isManager = adminUser?.role === UserRole.MANAGER || isAdmin;

  const value: AdminContextType = {
    adminUser,
    darkMode,
    toggleDarkMode,
    sidebarCollapsed,
    toggleSidebar,
    hasPermission,
    isAdmin,
    isManager,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};