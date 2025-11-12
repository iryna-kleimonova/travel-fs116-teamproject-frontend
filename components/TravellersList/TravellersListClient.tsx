'use client';

import { useState, useRef, useEffect } from 'react';
import type { User } from '@/types/user';
import { getUsersClient } from '@/lib/api/clientApi';
import Loader from '@/components/Loader/Loader';
import TravellerInfo from '@/components/TravellerInfo/TravellerInfo';
import Link from 'next/link';
import styles from './TravellersList.module.css';

interface Props {
  initialUsers: User[];
  perPage: number;
  totalPages: number;
  initialPage?: number;
}

export interface GetUsersClientResponse {
  data: {
    users: User[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  status: number;
  message: string;
}

export default function TravellersListClient({
  initialUsers,
  perPage,
  totalPages,
  initialPage = 1,
}: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const isFetchingRef = useRef(false);

  // Визначення мобільного екрану
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleLoadMore = async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const res = await getUsersClient({ page: nextPage, perPage: 12 }); // бекенд повертає до 12
      console.log('[CLIENT LOAD MORE] API response:', res.data.users);

      // Беремо масив користувачів з відповіді
      const newUsersFromServer = res?.data?.users ?? [];

      // Якщо сервер повернув порожній масив → кінець сторінок
      if (newUsersFromServer.length === 0) {
        setHasMore(false);
        return;
      }

      // беремо лише потрібну кількість (perPage, наприклад 4)
      const newUsers = newUsersFromServer.slice(0, perPage);

      setUsers(prev => {
        const existingIds = new Set(prev.map((u: User) => u._id));
        return [
          ...prev,
          ...newUsers.filter((u: User) => !existingIds.has(u._id)),
        ];
      });

      console.log('[CLIENT LOAD MORE] New users added:', newUsers);

      if (newUsers.length < perPage || nextPage >= totalPages) {
        setHasMore(false);
      }

      setPage(nextPage);
    } catch (err) {
      console.error('Помилка при завантаженні користувачів:', err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <>
      <ul className={styles.travellers__list}>
        {users.map(user => (
          <li key={user._id} className={styles.travellers__item}>
            <TravellerInfo user={user} useDefaultStyles={true} />
            <Link
              href={`/travellers/${user._id}`}
              className={styles.traveller__btn}
            >
              Переглянути профіль
            </Link>
          </li>
        ))}
      </ul>

      {/* Кнопка і лоадер тільки для десктопів */}
      {!isMobile && (
        <div className={styles.loadMoreWrapper}>
          {loading && <Loader className={styles.loader} />}
          {!loading && hasMore && (
            <button
              type="button"
              className={styles.traveller__btn__more}
              onClick={handleLoadMore}
            >
              Переглянути всіх
            </button>
          )}
        </div>
      )}
    </>
  );
}
