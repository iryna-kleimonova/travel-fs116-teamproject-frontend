'use client';

import Link from 'next/link';
import css from './AuthNavigation.module.css';
import ProfileAndLogoutLinks from './ProfileAndLogoutLinks/ProfileAndLogoutLinks';
import { useAuthStore } from '@/lib/store/authStore';

type NavProps = {
  variant?: 'header-main-page' | 'mobile-menu';
};

export default function AuthNavigation({ variant }: NavProps) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  if (isLoading) {
    // Можна показати skeleton або просто не показувати нічого
    return null; // або <li>Завантаження...</li>
  }

  return (
    <>
      {!isAuthenticated && (
        <>
          <li className={css.loginItem}>
            <Link
              href="/auth/login"
              prefetch={false}
              className={`${css.loginLink} ${variant === 'header-main-page' ? css.loginLinkMainPage : ''}`}
            >
              Вхід
            </Link>
          </li>
          <li className={`${css.loginItem} ${css.loginItemRegister}`}>
            <Link
              href="/auth/register"
              prefetch={false}
              className={`${css.loginLink} ${css.loginLinkRegister} ${variant === 'header-main-page' ? css.loginLinkRegisterMainPage : ''} ${variant === 'mobile-menu' ? css.loginLinkRegisterMobileMenu : ''}`}
            >
              Реєстрація
            </Link>
          </li>
        </>
      )}

      {isAuthenticated && (
        <>
          <li
            className={`${css.publichStoryItem} ${variant === 'header-main-page' ? css.publichStoryItemMainPage : ''}`}
          >
            <Link
              className={`${css.publichStoryLink} ${variant === 'header-main-page' ? css.publichStoryLinkMainPage : ''}`}
              href="/stories/create"
            >
              Опублікувати історію
            </Link>
          </li>
          <li>
            <ProfileAndLogoutLinks variant={variant} />
          </li>
        </>
      )}
    </>
  );
}
