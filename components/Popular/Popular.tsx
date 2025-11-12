'use client';

import { useEffect, useState } from 'react';
import TravellersStories from '../TravellersStories/TravellersStories';
import css from './Popular.module.css';
import { fetchStories } from '@/lib/api/clientApi';
import { Story } from '@/types/story';
import { useBreakpointStore } from '@/lib/store/breakpointStore';
import { useAuthStore } from '@/lib/store/authStore';

export default function Popular() {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { screenSize, screenSizeReady } = useBreakpointStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const perPage = screenSize === 'tablet' ? 4 : 3;

  useEffect(() => {
    if (!screenSizeReady) return;

    const loadStories = async () => {
      setLoading(true);
      try {
        const newStories = await fetchStories(1, perPage);
        setStories(newStories);
        setPage(1);
        setHasMore(newStories.length >= perPage);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [screenSizeReady, screenSize, perPage]);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const newStories = await fetchStories(nextPage, perPage);
      if (newStories.length === 0) {
        setHasMore(false);
      } else {
        setStories(prev => [...prev, ...newStories]);
        setPage(nextPage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="stories">
      <div className="container">
        <h2 className={css.stories__title}>Популярні історії</h2>
        <TravellersStories
          stories={stories}
          isAuthenticated={isAuthenticated}
        />
        {hasMore && (
          <div className={css.stories__footer}>
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className={css.stories__more}
            >
              {loading ? 'Завантаження...' : 'Переглянути всі'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
