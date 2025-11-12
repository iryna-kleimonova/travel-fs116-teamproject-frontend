import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST() {
  const cookieStore = await cookies();

  try {
    const sessionId = cookieStore.get('sessionId')?.value;

    if (sessionId) {
      try {
        await api.post(
          'auth/logout',
          {},
          {
            headers: {
              Cookie: cookieStore.toString(),
            },
          }
        );
      } catch (error) {
        if (isAxiosError(error)) {
          logErrorResponse(error.response?.data);
        }
      }
    }
  } catch (error) {
    logErrorResponse({ message: (error as Error).message });
  } finally {
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('sessionId');
  }

  return NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
}
