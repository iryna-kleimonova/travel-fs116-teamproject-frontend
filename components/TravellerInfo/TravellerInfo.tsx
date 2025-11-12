// components/TravellerInfo/TravellerInfo.tsx
import Image from 'next/image';
import type { User } from '@/types/user';
import defaultStyles from '../TravellersList/TravellersList.module.css';
import React from 'react';

interface TravellerInfoProps {
  user: User;
  className?: {
    name?: string;
    text?: string;
    container?: string;
  };
  imageSize?: {
    width: number;
    height: number;
  };
  useDefaultStyles?: boolean;
  priority?: boolean; // Додаємо пропс priority
}

export default function TravellerInfo({
  user,
  className = {},
  imageSize = { width: 112, height: 112 },
  useDefaultStyles = true,
  priority = false,
}: TravellerInfoProps) {
  console.log('SSR SERVER:', user);

  const avatarSrc =
    user.avatarUrl && user.avatarUrl.trim() !== ''
      ? user.avatarUrl
      : '/img/default-avatar.webp';

  const nameClassName = useDefaultStyles
    ? defaultStyles.traveller__name
    : className?.name;

  const textClassName = useDefaultStyles
    ? defaultStyles.traveller__text
    : className?.text;

  return (
    <>
      <Image
        src={avatarSrc}
        alt={user.name || 'Traveller'}
        width={imageSize.width}
        height={imageSize.height}
        priority={priority}
        style={{ borderRadius: '100%', marginBottom: '24px' }}
      />
      <strong className={nameClassName}>{user.name}</strong>
      <p className={textClassName}>{user.description}</p>
    </>
  );
}
