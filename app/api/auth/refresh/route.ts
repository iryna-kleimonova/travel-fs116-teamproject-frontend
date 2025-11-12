import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';
import { parseCookieOptions } from '../../_utils/cookieUtils';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;

    if (!refreshToken || !sessionId) {
      return NextResponse.json(
        { error: 'Refresh token or session ID missing' },
        { status: 401 }
      );
    }

    const apiRes = await api.post(
      'auth/refresh',
      {},
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );
    const setCookie = apiRes.headers['set-cookie'];

    const response = NextResponse.json(
      {
        status: 200,
        message: 'Session refreshed successfully',
        data: apiRes.data,
      },
      { status: 200 }
    );

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      const isLocalhost = process.env.NODE_ENV === 'development';

      // Parse all cookies with proper options
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const options = parseCookieOptions(cookieStr);

        const cookieOptions = {
          ...options,
          secure: isLocalhost ? false : (options.secure ?? true),
          httpOnly: true,
          sameSite: (isLocalhost ? 'lax' : options.sameSite || 'none') as
            | 'strict'
            | 'lax'
            | 'none',
          path: '/',
        };

        // Set accessToken cookie
        // ✅ ВАЖЛИВО: Встановлюємо cookie через response.cookies.set()
        if (parsed.accessToken) {
          response.cookies.set(
            'accessToken',
            parsed.accessToken,
            cookieOptions
          );
        }
        if (parsed.refreshToken) {
          response.cookies.set(
            'refreshToken',
            parsed.refreshToken,
            cookieOptions
          );
        }
        if (parsed.sessionId) {
          response.cookies.set('sessionId', parsed.sessionId, cookieOptions);
        }
      }
    }
    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      const status = error.response?.status || 500;
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
