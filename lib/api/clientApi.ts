import { User } from '@/types/user';
import { api } from './api';
import { LoginRequest, RegisterRequest } from '@/types/auth';
import { extractUser } from './errorHandler';
import { StoriesResponse, Story } from '@/types/story';

/**
 * Register user
 */
export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>('/auth/register', data);
  const user = extractUser(res.data) as User | null;
  return user;
};

/**
 * Login user
 */
export const login = async (data: LoginRequest) => {
  const res = await api.post<User>('/auth/login', data);
  const user = extractUser(res.data) as User | null;
  return user;
};

/**
 * Get current user
 */
export const getMe = async () => {
  const { data } = await api.get<User>('/users/me/profile');
  const user = extractUser(data) as User | null;
  return user;
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Ignore errors on logout
  }
};

/**
 * Check if session is valid (lightweight check)
 */
export const checkSession = async (): Promise<boolean> => {
  try {
    const response = await api.get('/users/me/profile');
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Fetch popular stories
 */
export async function fetchStories(page = 1, perPage = 3): Promise<Story[]> {
  const response = await api.get<StoriesResponse>('/stories', {
    params: { page, perPage, sort: 'favoriteCount' },
  });
  return response.data?.data || [];
}

/**
 * Add story to favorites
 */
export async function addStoryToFavorites(storyId: string): Promise<void> {
  await api.post(`/stories/${storyId}/favorite`);
}

/**
 * Remove story from favorites
 */
export async function removeStoryFromFavorites(storyId: string): Promise<void> {
  await api.delete(`/stories/${storyId}/favorite`);
}