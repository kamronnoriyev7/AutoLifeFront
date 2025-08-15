export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  avatar?: string;
  phoneNumber?: string;
  permissions: string[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  activeServices: number;
  monthlyRevenue: number[];
  monthlyOrders: number[];
  revenueGrowth: number;
  userGrowth: number;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  serviceCategory: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  createdAt: string;
  assignedWorker?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimatedDuration: number;
  notes?: string;
}

export interface AdminService {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  isActive: boolean;
  images: string[];
  videos?: string[];
  discount?: {
    percentage: number;
    validUntil: string;
  };
  rating: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'click' | 'payme' | 'stripe' | 'paypal' | 'cash';
  status: 'success' | 'pending' | 'failed' | 'refunded';
  transactionDate: string;
  refundable: boolean;
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'operator' | 'technician';
  department: string;
  status: 'active' | 'inactive';
  avatar?: string;
  phoneNumber: string;
  hireDate: string;
  schedule: WorkSchedule[];
  kpi: {
    completedOrders: number;
    customerRating: number;
    efficiency: number;
  };
}

export interface WorkSchedule {
  day: string;
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
}

export interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  type: 'push' | 'sms' | 'email';
  targetAudience: 'all' | 'active_users' | 'inactive_users' | 'premium_users';
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  openRate?: number;
  clickRate?: number;
}

export interface SystemSettings {
  brandName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  apiKeys: {
    googleMaps: string;
    stripe: string;
    payme: string;
    click: string;
  };
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    username: string;
    password: string;
  };
  smsSettings: {
    provider: string;
    apiKey: string;
  };
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  TECHNICIAN = 'technician'
}