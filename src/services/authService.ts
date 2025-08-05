import api from './api';
import { RegisterData, User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
  requiresOTP?: boolean;
}

interface RegisterResponse {
  message: string;
  requiresOTP: boolean;
}

interface OTPResponse {
  token: string;
  user: User;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const verifyOTP = async (email: string, otp: string): Promise<OTPResponse> => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};