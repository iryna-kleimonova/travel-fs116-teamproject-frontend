// Components/AuthNavigation/AuthNavigation.tsx

'use client';

import Link from 'next/link';
import css from './AuthNavigation.module.css';
import ProfileAndLogoutLinks from './ProfileAndLogoutLinks/ProfileAndLogoutLinks';
import { useAuthStore } from '@/lib/store/authStore';
import PublishStoryLink from '../Navigation/PublishStoryLink/PublishStoryLink';

type NavProps = {
  variant?: 'header-main-page' | 'mobile-menu';
  handleClick: (value: boolean) => void;
};

export default function AuthNavigation({ variant, handleClick }: NavProps) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <>
      {!isAuthenticated && (
        <>
          <li className={css.loginItem}>
            <Link
              href="/auth/login"
              prefetch={false}
              className={`${css.loginLink} ${variant === 'header-main-page' ? css.loginLinkMainPage : ''}`}
              onClick={() => {
                handleClick(false);
              }}
            >
              Вхід
            </Link>
          </li>
          <li className={`${css.loginItem} ${css.loginItemRegister}`}>
            <Link
              href="/auth/register"
              prefetch={false}
              className={`${css.loginLink} ${css.loginLinkRegister} ${variant === 'header-main-page' ? css.loginLinkRegisterMainPage : ''} ${variant === 'mobile-menu' ? css.loginLinkRegisterMobileMenu : ''}`}
              onClick={() => {
                handleClick(false);
              }}
            >
              Реєстрація
            </Link>
          </li>
        </>
      )}

      {isAuthenticated && (
        <>
          <li
            className={` ${css.loginItem} ${variant === 'mobile-menu' ? css.loginItemPublishStoryMobileMenu : ''}`}
          >
            <PublishStoryLink />
          </li>
          <li>
            <ProfileAndLogoutLinks variant={variant} />
          </li>
        </>
      )}
    </>
  );
}
