export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: number;
  provider: ServiceProvider;
  rating: number;
  image: string;
  isAvailable: boolean;
}

export interface ServiceProvider {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  rating: number;
  workingHours: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  service: Service;
  userId: string;
  bookingDate: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
}

export enum ServiceCategory {
  TECHNICAL = 'technical',
  PARKING = 'parking',
  GAS_STATION = 'gas_station'
}

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Location {
  latitude: number;
  longitude: number;
}