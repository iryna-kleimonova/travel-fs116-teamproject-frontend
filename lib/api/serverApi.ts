import { cookies } from 'next/headers';
import { api } from '@/app/api/api';
import { User, GetUsersResponse } from '@/types/user';
import { isAxiosError } from 'axios';

/**
 * Refresh session tokens (server-side)
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
export const getServerMe = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Якщо немає жодного токена, не робити запит
    if (!accessToken && !refreshToken) {
      return null;
    }

    const { data } = await api.get<User>('/users/me/profile', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return data;
  } catch {
    return null;
  }
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
