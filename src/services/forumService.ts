import api from './api';
import { ForumPost, ForumReply } from '../types';

interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
}

interface CreateReplyRequest {
  postId: string;
  content: string;
}

export const getForumPosts = async (): Promise<ForumPost[]> => {
  const response = await api.get('/forum/posts');
  return response.data;
};

export const getForumPostById = async (id: string): Promise<ForumPost> => {
  const response = await api.get(`/forum/posts/${id}`);
  return response.data;
};

export const createForumPost = async (data: CreatePostRequest): Promise<ForumPost> => {
  const response = await api.post('/forum/posts', data);
  return response.data;
};

export const createForumReply = async (data: CreateReplyRequest): Promise<ForumReply> => {
  const response = await api.post('/forum/replies', data);
  return response.data;
};

export const likeForumPost = async (postId: string): Promise<void> => {
  await api.post(`/forum/posts/${postId}/like`);
};