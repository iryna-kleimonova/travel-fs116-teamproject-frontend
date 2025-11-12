import { User, GetUsersResponse } from '@/types/user';
import { api } from './api';
import { LoginRequest, RegisterRequest } from '@/types/auth';
import { extractUser } from './errorHandler';
import { StoriesResponse, Story } from '@/types/story';
import { AxiosError } from 'axios';

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
export const getMe = async (silent: boolean = false) => {
  try {
    const response = await api.get('/users/me');

    if (response.data && typeof response.data === 'object') {
      if ('data' in response.data && response.data.data) {
        const userData = response.data.data;
        if (
          userData &&
          typeof userData === 'object' &&
          '_id' in userData &&
          'name' in userData
        ) {
          return userData as User;
        }
      }

      const user = extractUser(response.data) as User | null;
      if (user) {
        return user;
      }
    }

    return null;
  } catch (error) {
    if (silent) {
      // Тиха обробка - не логуємо помилку
      return null;
    }
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      // 401 - це очікувано, якщо користувач не залогінений
      // Не логуємо як помилку
      return null;
    }

    // ✅ Логуємо інші помилки
    console.error('❌ Error in getMe:', error);
    throw error;
  }
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
    console.log('🔍 Checking session via /api/users/me');
    const response = await api.get('/users/me');
    console.log('✅ Session check response:', response.status);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.log('Session check failed:', error);

    return false;
  }
};

export async function fetchStories(page = 1, perPage = 3): Promise<Story[]> {
  const response = await api.get<StoriesResponse>(`/stories`, {
    params: { page, perPage, sort: 'favoriteCount' },
  });
  // console.log(response);
  return response.data?.data || [];
}

fetchStories(1, 3);

export async function addStoryToFavorites(storyId: string): Promise<void> {
  await api.post(`/stories/${storyId}/favorite`);
}

export async function removeStoryFromFavorites(storyId: string): Promise<void> {
  await api.delete(`/stories/${storyId}/favorite`);
}

export async function getUsersClient({
  page = 1,
  perPage = 4,
}: {
  page: number;
  perPage: number;
}): Promise<GetUsersResponse> {
  const res = await api.get<GetUsersResponse>('/users', {
    params: { page, perPage },
  });
  return res.data;
}
