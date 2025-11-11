import { cookies } from 'next/headers';
import { User } from '@/types/user';
import axios from 'axios';

// ✅ окремий instance для серверних запитів
export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * 🔁 Refresh session tokens (server-side)
 * Використовується у middleware для оновлення accessToken через httpOnly cookies
 */
export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await serverApi.post(
    '/auth/refresh',
    {},
    {
      headers: {
        Cookie: cookieHeader, // 🔥 важливо передавати поточні куки
      },
      withCredentials: true,
    }
  );

  return res;
};

/**
 * 👤 Get current user (server-side)
 * Використовується у SSR для отримання профілю користувача
 */
export const getServerMe = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const { data } = await serverApi.get<User>('/users/me/profile', {
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
  });

  return data;
};