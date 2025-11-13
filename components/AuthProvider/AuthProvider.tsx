'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
  initialUser?: User | null;
};

const AuthProvider = ({ children, initialUser = null }: Props) => {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated
  );
  const setLoading = useAuthStore(state => state.setLoading);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (isInitialized) return;

      setLoading(true);

      if (initialUser) {
        setUser(initialUser);
        setLoading(false);
        setIsInitialized(true);
        return;
      }

      clearIsAuthenticated();
      setLoading(false);
      setIsInitialized(true);
    };

    fetchSession();
  }, [initialUser, clearIsAuthenticated, setUser, setLoading, isInitialized]);

  return <>{children}</>;
};

export default AuthProvider;
