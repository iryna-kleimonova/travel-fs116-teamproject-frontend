import { User } from '@/types/user';
import { api } from './api';
import { LoginRequest, RegisterRequest } from '@/types/auth';
import { extractUser } from './errorHandler';

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
    // const axiosError = error as ApiError;
    console.log(error);

    return false;
  }
};
