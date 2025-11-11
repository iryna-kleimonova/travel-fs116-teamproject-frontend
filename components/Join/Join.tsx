'use client';

import { useRouter } from 'next/navigation';

import styles from './Join.module.css';
import { useAuthStore } from '@/lib/store/authStore';

const Join = () => {
  const router = useRouter();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      router.push('/api/users/me/profile');
    } else {
      router.push('/auth/register');
    }
  };

  const buttonText = isAuthenticated ? 'Збережені' : 'Зареєструватися';

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.joinCard}>
          <h2 className={styles.title}>Приєднуйтесь до нашої спільноти</h2>
          <p className={styles.description}>
            Долучайтеся до мандрівників, які діляться своїми історіями та
            надихають на нові пригоди.
          </p>
          <button
            type="button"
            className={styles.button}
            onClick={handleButtonClick}
            disabled={isLoading}
            aria-label={buttonText}
          >
            {isLoading ? 'Завантаження...' : buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Join;
