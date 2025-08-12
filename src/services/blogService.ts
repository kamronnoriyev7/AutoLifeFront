import api from './api';
import { BlogPost } from '../types';

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await api.get('/blog');
  return response.data;
};

export const getBlogPostById = async (id: string): Promise<BlogPost> => {
  const response = await api.get(`/blog/${id}`);
  return response.data;
};

export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const response = await api.get(`/blog/category/${category}`);
  return response.data;
};