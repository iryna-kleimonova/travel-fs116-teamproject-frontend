'use client';
import { Icon } from '@/components/Icon/Icon';
import css from './ProfileAndLogoutLinks.module.css';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';
import Modal from '@/components/Modal/Modal';

import { useState } from 'react';

type ProfileAndLogoutLinksProps = {
  variant?: 'header-main-page' | 'mobile-menu';
};

export default function ProfileAndLogoutLinks({
  variant,
}: ProfileAndLogoutLinksProps) {
  const { logout } = useAuth();
  const user = useAuthStore(state => state.user);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    if (isLoggingOut) return; // Запобігаємо подвійному кліку

    try {
      setIsLoggingOut(true);
      setIsModalOpen(false);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };

  // Отримуємо ім'я користувача або дефолтне значення
  const userName = user?.name || 'Користувач';
  const userAvatar = user?.avatarUrl;

  return (
    <div className={css.container}>
      <Link href="/profile" className={css.profileLink}>
        {userAvatar ? (
          <img src={userAvatar} alt={userName} className={css.avatar} />
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
        onClick={handleLogoutClick}
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

      <Modal
        title="Ви точно хочете вийти?"
        message="Ми будемо сумувати за вами!"
        confirmButtonText="Вийти"
        cancelButtonText="Відмінити"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        isOpen={isModalOpen}
      />
    </div>
  );
}
