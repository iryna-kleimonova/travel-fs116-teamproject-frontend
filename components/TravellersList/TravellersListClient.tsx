'use client';
import { useState, useRef, useEffect } from 'react';
import type { User } from '@/types/user';
import { getUsersClient } from '@/lib/api/clientApi';
import TravellerInfo from '@/components/TravellerInfo/TravellerInfo';
import Link from 'next/link';
import Loader from '@/components/Loader/Loader';
import defaultStyles from './TravellersList.module.css';

interface Props {
  initialUsers: User[];
  loadMorePerPage: number;
  totalPages: number;
  showLoadMoreOnMobile?: boolean;
  customStyles?: typeof defaultStyles;
}

export default function TravellersListClient({
  initialUsers,
  loadMorePerPage,
  showLoadMoreOnMobile = false,
  customStyles,
}: Props) {
  const styles = customStyles || defaultStyles;

  // Не визначаємо isMobile на сервері, початково null
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  // Встановлюємо isMobile на клієнті та слухаємо resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize(); // початкове значення на клієнті
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Адаптивне обрізання першого завантаження, тільки на клієнті
  useEffect(() => {
    if (isMobile === null) return; // не рендеримо на сервері

    let count = initialUsers.length;

    if (window.innerWidth >= 1440) count = Math.min(initialUsers.length, 12);
    else if (window.innerWidth >= 768) count = Math.min(initialUsers.length, 8);
    else count = Math.min(initialUsers.length, 8);

    setUsers(initialUsers.slice(0, count));
  }, [initialUsers, isMobile]);

  const handleLoadMore = async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const offset = users.length;
      const res = await getUsersClient({
        page: Math.floor(offset / loadMorePerPage) + 1,
        perPage: loadMorePerPage,
      });

      const newUsersFromServer = res.data.users ?? [];

      setUsers(prev => {
        const existingIds = new Set(prev.map(u => u._id));
        const filteredNewUsers = newUsersFromServer.filter(
          u => !existingIds.has(u._id)
        );
        return [...prev, ...filteredNewUsers];
      });

      setHasMore(newUsersFromServer.length === loadMorePerPage);
    } catch (err) {
      console.error('Помилка підвантаження користувачів:', err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  // Чекаємо, поки isMobile визначиться на клієнті
  if (isMobile === null) return null;

  return (
    <>
      <ul className={styles.travellers__list}>
        {users.map(user => (
          <li key={user._id} className={styles.travellers__item}>
            <TravellerInfo user={user} useDefaultStyles />
            <Link
              href={`/travellers/${user._id}`}
              className={styles.traveller__btn}
            >
              Переглянути профіль
            </Link>
          </li>
        ))}
      </ul>

      {hasMore && (!isMobile || showLoadMoreOnMobile) && (
        <div className={styles.loadMoreWrapper}>
          {loading ? (
            <Loader className={styles.loader} />
          ) : (
            <button
              className={styles.traveller__btn__more}
              onClick={handleLoadMore}
            >
              Переглянути ще
            </button>
          )}
        </div>
      )}
    </>
  );
}
