import api from './api';
import { Booking } from '../types';

interface CreateBookingRequest {
  serviceId: string;
  bookingDate: string;
  notes?: string;
}

export const createBooking = async (data: CreateBookingRequest): Promise<Booking> => {
  const response = await api.post('/bookings', data);
  return response.data;
};

export const getUserBookings = async (): Promise<Booking[]> => {
  const response = await api.get('/bookings/my');
  return response.data;
};

export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const cancelBooking = async (id: string): Promise<void> => {
  await api.delete(`/bookings/${id}`);
};