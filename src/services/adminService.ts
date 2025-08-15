import api from './api';
import { 
  AdminUser, 
  DashboardStats, 
  AdminOrder, 
  AdminService, 
  Transaction, 
  StaffMember, 
  NotificationCampaign,
  SystemSettings 
} from '../types/admin';

// Dashboard Services
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
};

export const getRecentOrders = async (limit: number = 10): Promise<AdminOrder[]> => {
  const response = await api.get(`/admin/dashboard/recent-orders?limit=${limit}`);
  return response.data;
};

export const getActiveOrdersMap = async (): Promise<AdminOrder[]> => {
  const response = await api.get('/admin/dashboard/active-orders-map');
  return response.data;
};

// Users Management
export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<{ users: AdminUser[]; total: number }> => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const getUserById = async (id: string): Promise<AdminUser> => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUserRole = async (id: string, role: string): Promise<AdminUser> => {
  const response = await api.put(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const suspendUser = async (id: string): Promise<void> => {
  await api.put(`/admin/users/${id}/suspend`);
};

export const exportUsers = async (format: 'csv' | 'excel'): Promise<Blob> => {
  const response = await api.get(`/admin/users/export?format=${format}`, {
    responseType: 'blob'
  });
  return response.data;
};

// Orders Management
export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  serviceType?: string;
}): Promise<{ orders: AdminOrder[]; total: number }> => {
  const response = await api.get('/admin/orders', { params });
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string): Promise<AdminOrder> => {
  const response = await api.put(`/admin/orders/${id}/status`, { status });
  return response.data;
};

export const assignWorker = async (orderId: string, workerId: string): Promise<AdminOrder> => {
  const response = await api.put(`/admin/orders/${orderId}/assign`, { workerId });
  return response.data;
};

// Services Management
export const getServices = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
}): Promise<{ services: AdminService[]; total: number }> => {
  const response = await api.get('/admin/services', { params });
  return response.data;
};

export const createService = async (data: Partial<AdminService>): Promise<AdminService> => {
  const response = await api.post('/admin/services', data);
  return response.data;
};

export const updateService = async (id: string, data: Partial<AdminService>): Promise<AdminService> => {
  const response = await api.put(`/admin/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: string): Promise<void> => {
  await api.delete(`/admin/services/${id}`);
};

// Payments
export const getTransactions = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<{ transactions: Transaction[]; total: number }> => {
  const response = await api.get('/admin/transactions', { params });
  return response.data;
};

export const refundTransaction = async (id: string, reason: string): Promise<Transaction> => {
  const response = await api.post(`/admin/transactions/${id}/refund`, { reason });
  return response.data;
};

// Staff Management
export const getStaff = async (): Promise<StaffMember[]> => {
  const response = await api.get('/admin/staff');
  return response.data;
};

export const createStaffMember = async (data: Partial<StaffMember>): Promise<StaffMember> => {
  const response = await api.post('/admin/staff', data);
  return response.data;
};

export const updateStaffMember = async (id: string, data: Partial<StaffMember>): Promise<StaffMember> => {
  const response = await api.put(`/admin/staff/${id}`, data);
  return response.data;
};

// Notifications
export const getNotificationCampaigns = async (): Promise<NotificationCampaign[]> => {
  const response = await api.get('/admin/notifications/campaigns');
  return response.data;
};

export const createNotificationCampaign = async (data: Partial<NotificationCampaign>): Promise<NotificationCampaign> => {
  const response = await api.post('/admin/notifications/campaigns', data);
  return response.data;
};

export const sendNotificationCampaign = async (id: string): Promise<void> => {
  await api.post(`/admin/notifications/campaigns/${id}/send`);
};

// Settings
export const getSystemSettings = async (): Promise<SystemSettings> => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateSystemSettings = async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
  const response = await api.put('/admin/settings', data);
  return response.data;
};

export const createBackup = async (): Promise<{ backupId: string; downloadUrl: string }> => {
  const response = await api.post('/admin/settings/backup');
  return response.data;
};