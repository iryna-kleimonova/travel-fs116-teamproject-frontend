'use client';

import Link from 'next/link';
import styles from './Join.module.css';
import { useAuthStore } from '@/lib/store/authStore';

const JoinLink = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);

  const href = isAuthenticated ? '/profile' : '/auth/register';
  const linkText = isAuthenticated ? 'Збережені' : 'Зареєструватися';

  return (
    <Link
      href={href}
      className={styles.button}
      aria-label={linkText}
      aria-disabled={isLoading}
      onClick={e => {
        if (isLoading) {
          e.preventDefault();
        }
      }}
    >
      {isLoading ? 'Завантаження...' : linkText}
    </Link>
  );
};

export default JoinLink;
