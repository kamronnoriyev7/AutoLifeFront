import api from './api';
import { Partnership } from '../types';

interface CreatePartnershipRequest {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  serviceType: string;
  description: string;
}

export const createPartnership = async (data: CreatePartnershipRequest): Promise<Partnership> => {
  const response = await api.post('/partnerships', data);
  return response.data;
};

export const getPartnerships = async (): Promise<Partnership[]> => {
  const response = await api.get('/partnerships');
  return response.data;
};