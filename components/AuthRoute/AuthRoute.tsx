'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

type AuthRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

/**
 * Redirects authenticated users away from auth pages (login/register)
 */
export default function AuthRoute({
  children,
  redirectTo = '/',
}: AuthRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <p>Завантаження...</p>
      </div>
    );
  }

  // Don't render auth forms if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
