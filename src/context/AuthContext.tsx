import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import * as authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      
      if (response.requiresOTP) {
        toast.success('OTP kod emailingizga yuborildi');
        throw new Error('OTP_REQUIRED');
      }
      
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      toast.success('Muvaffaqiyatli kirildi');
    } catch (error: any) {
      if (error.message === 'OTP_REQUIRED') {
        throw error;
      }
      toast.error('Login xatosi: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      await authService.register(data);
      toast.success('Ro\'yxatdan o\'tish muvaffaqiyatli. OTP kod emailingizga yuborildi');
    } catch (error: any) {
      toast.error('Ro\'yxatdan o\'tish xatosi: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setLoading(true);
      const response = await authService.verifyOTP(email, otp);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      toast.success('OTP muvaffaqiyatli tasdiqlandi');
    } catch (error: any) {
      toast.error('OTP tasdiqlanmadi: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    toast.success('Tizimdan chiqildi');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    verifyOTP,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};