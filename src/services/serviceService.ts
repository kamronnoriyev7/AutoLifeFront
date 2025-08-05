import api from './api';
import { Service, ServiceCategory, Location } from '../types';

interface ServiceFilters {
  category?: ServiceCategory;
  search?: string;
  location?: Location;
  radius?: number;
}

export const getServices = async (filters?: ServiceFilters): Promise<Service[]> => {
  const response = await api.get('/services', { params: filters });
  return response.data;
};

export const getServiceById = async (id: string): Promise<Service> => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

export const getNearbyServices = async (location: Location, radius: number = 10): Promise<Service[]> => {
  const response = await api.get('/services/nearby', {
    params: {
      latitude: location.latitude,
      longitude: location.longitude,
      radius,
    },
  });
  return response.data;
};