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
// lib/api/serverApi.ts
export async function checkServerSession() {
  const backend =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://travel-fs116-teamproject-backend.onrender.com';

  const refreshUrl = `${backend}/api/auth/refresh`;

  const response = await fetch(refreshUrl, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh session: ${response.status}`);
  }

  return response;
}

/**
 * 👤 Get current user (server-side)
 * Використовується у SSR для отримання профілю користувача
 */
export const getServerMe = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const { data } = await serverApi.get<User>('/api/users/me/profile', {
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
  });

  return data;
};