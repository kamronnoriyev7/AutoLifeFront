import api from './api';
import { Event } from '../types';

export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get('/events');
  return response.data;
};

export const getEventById = async (id: string): Promise<Event> => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const getActiveEvents = async (): Promise<Event[]> => {
  const response = await api.get('/events/active');
  return response.data;
};