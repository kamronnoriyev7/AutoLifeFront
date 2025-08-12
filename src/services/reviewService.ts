import api from './api';
import { Review } from '../types';

interface CreateReviewRequest {
  serviceId: string;
  rating: number;
  comment: string;
}

export const getServiceReviews = async (serviceId: string): Promise<Review[]> => {
  const response = await api.get(`/reviews/service/${serviceId}`);
  return response.data;
};

export const createReview = async (data: CreateReviewRequest): Promise<Review> => {
  const response = await api.post('/reviews', data);
  return response.data;
};

export const getUserReviews = async (): Promise<Review[]> => {
  const response = await api.get('/reviews/my');
  return response.data;
};