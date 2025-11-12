import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';
import { parseCookieOptions } from '../../_utils/cookieUtils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Make request to backend
    const apiRes = await api.post('auth/register', body);

    // Log response for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('Registration response status:', apiRes.status);
      console.log(
        'Registration response headers:',
        Object.keys(apiRes.headers)
      );
      console.log(
        'Registration response data:',
        JSON.stringify(apiRes.data, null, 2)
      );
    }

    const cookieStore = await cookies();
    const setCookie = apiRes.headers['set-cookie'];

    // If backend returned cookies, set them
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const options = parseCookieOptions(cookieStr);

        // Set accessToken cookie
        if (parsed.accessToken) {
          cookieStore.set('accessToken', parsed.accessToken, options);
        }

        // Set refreshToken cookie
        if (parsed.refreshToken) {
          cookieStore.set('refreshToken', parsed.refreshToken, options);
        }

        // Set sessionId cookie
        if (parsed.sessionId) {
          cookieStore.set('sessionId', parsed.sessionId, options);
        }
      }
    }

    // Always return the backend response, even if no cookies were set
    // Registration might succeed but not auto-login (depends on backend)
    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      // Return the actual backend error response
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
