import api from './api';
import { Location, RouteInfo } from '../types';

interface RouteRequest {
  origin: Location;
  destination: Location;
  waypoints?: Location[];
  vehicleType?: 'car' | 'truck' | 'motorcycle';
}

export const calculateRoute = async (data: RouteRequest): Promise<RouteInfo> => {
  const response = await api.post('/routes/calculate', data);
  return response.data;
};

export const findOptimalRoute = async (data: RouteRequest): Promise<RouteInfo> => {
  const response = await api.post('/routes/optimal', data);
  return response.data;
};