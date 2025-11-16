'use client';

import { Icon } from '@/components/Icon/Icon';
import css from './ProfileAndLogoutLinks.module.css';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';
import { useState } from 'react';
import { useMobileMenuOpen } from '@/lib/store/MobileMenuStore';
import Image from 'next/image';

type ProfileAndLogoutLinksProps = {
  variant?: 'header-main-page' | 'mobile-menu';
};

export default function ProfileAndLogoutLinks({
  variant,
}: ProfileAndLogoutLinksProps) {
  const { logout } = useAuth();
  const user = useAuthStore(state => state.user);
  const closeMobileMenu = useMobileMenuOpen(state => state.closeMobileMenu);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isLoggingOut) return; // Запобігаємо подвійному кліку

    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Отримуємо ім'я користувача або дефолтне значення
  let userName = 'Користувач';
  if (user) {
    if (
      'data' in user &&
      typeof user.data === 'object' &&
      user.data !== null &&
      'name' in user.data
    ) {
      userName = (user.data as { name: string }).name;
    } else if ('name' in user && typeof user.name === 'string') {
      // Якщо це валідний User об'єкт
      userName = user.name;
    }
  }
  const userAvatar =
    user && 'avatarUrl' in user
      ? user.avatarUrl
      : user &&
          'data' in user &&
          typeof user.data === 'object' &&
          user.data !== null &&
          'avatarUrl' in user.data
        ? (user.data as { avatarUrl?: string }).avatarUrl
        : undefined;

  return (
    <div className={css.container}>
      <Link
        onClick={closeMobileMenu}
        href="/profile"
        className={css.profileLink}
      >
        {userAvatar ? (
          <Image
            src={userAvatar}
            alt={userName}
            className={css.avatar}
            width={32}
            height={32}
          />
        ) : (
          <Icon name="avatar" className={css.avatar} />
        )}
        <p
          className={`${css.name} ${variant === 'header-main-page' ? css.nameMainPage : ''}`}
        >
          {userName}
        </p>
      </Link>
      <div
        className={`${css.divider} ${variant === 'header-main-page' ? css.dividerMainPage : ''}`}
      ></div>

      <button
        onClick={e => {
          handleLogout(e);
          closeMobileMenu();
        }}
        className={css.logoutLink}
        type="button"
        disabled={isLoggingOut}
        aria-label="Вийти з облікового запису"
      >
        <Icon
          name="icon-logout"
          className={`${css.logoutIcon} ${variant === 'header-main-page' ? css.logoutIconMainPage : ''}`}
        />
      </button>
    </div>
  );
}
