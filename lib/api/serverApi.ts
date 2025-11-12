import { cookies } from 'next/headers';
import { api } from '@/app/api/api';
import { User, GetUsersResponse } from '@/types/user';
import { isAxiosError } from 'axios';

/**
 * Refresh session tokens (server-side)
 * Backend expects POST /api/auth/refresh
 */
export const checkServerSession = async () => {
  const cookieStore = await cookies();

  const res = await api.post(
    '/auth/refresh',
    {},
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );
  return res;
};

/**
 * Get current user (server-side)
 */
export const getServerMe = async () => {
  const cookieStore = await cookies();
  // Backend endpoint is /users/me/profile, not /users/me
  const { data } = await api.get<User>('/users/me/profile', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export async function getUsersServer(
  page = 1,
  perPage = 4
): Promise<GetUsersResponse> {
  try {
    const res = await api.get<GetUsersResponse>('/users', {
      params: { page, perPage },
    });
    return res.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('[getUsersServer error]', error.message);
      throw new Error(
        error.response?.data?.error || 'Failed to fetch users from server'
      );
    } else {
      console.error('[getUsersServer unknown error]', error);
      throw new Error('Unknown server error');
    }
  }
}
