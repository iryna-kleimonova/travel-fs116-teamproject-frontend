import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';
import { parseCookieOptions } from '../../_utils/cookieUtils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post('auth/login', body);

    const setCookie = apiRes.headers['set-cookie'];

    const response = NextResponse.json(apiRes.data, { status: apiRes.status });

    // If backend returned cookies, set them
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      const isLocalhost = process.env.NODE_ENV === 'development';

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
      const errorData = error.response?.data || { error: error.message };

      return NextResponse.json(
        {
          error: error.message,
          response: errorData,
        },
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
