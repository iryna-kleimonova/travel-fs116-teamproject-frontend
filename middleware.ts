import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile'];
const publicRoutes = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  console.log('🧩 Middleware triggered:', request.nextUrl.pathname);

  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  console.log('🍪 Raw cookies:', cookieStore.getAll());
  console.log('🍪 accessToken:', accessToken ? '✅ exists' : '❌ missing');
  console.log('🍪 refreshToken:', refreshToken ? '✅ exists' : '❌ missing');

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!accessToken) {
    if (refreshToken) {
      console.log('🔁 Trying to refresh session via /auth/refresh ...');
      try {
        const data = await checkServerSession();
        console.log('✅ Refresh response status:', data.status);

        const setCookie = data.headers['set-cookie'];

        if (setCookie) {
          console.log('📦 Received new cookies from backend');
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];
          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path || '/',
              maxAge: Number(parsed['Max-Age']) || undefined,
            };
            if (parsed.accessToken)
              cookieStore.set('accessToken', parsed.accessToken, options);
            if (parsed.refreshToken)
              cookieStore.set('refreshToken', parsed.refreshToken, options);
            if (parsed.sessionId)
              cookieStore.set('sessionId', parsed.sessionId, options);
          }
          if (isPublicRoute) {
            console.log('↪️ Redirecting (active session) → /');
            return NextResponse.redirect(new URL('/', request.url), {
              headers: {
                Cookie: cookieStore.toString(),
              },
            });
          }
          if (isPrivateRoute) {
            console.log('✅ Allowing access to private route');
            return NextResponse.next({
              headers: {
                Cookie: cookieStore.toString(),
              },
            });
          }
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : JSON.stringify(err);
        console.error('❌ Refresh error:', errorMessage);
      }
    }

    if (isPublicRoute) {
      console.log('🟢 Public route — allowed');
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      console.log('🔒 Private route without tokens — redirecting to /auth/login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (isPublicRoute) {
    console.log('🔄 Redirecting from public route to / (already logged in)');
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isPrivateRoute) {
    console.log('✅ Private route access granted');
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/auth/login', '/auth/register'],
};