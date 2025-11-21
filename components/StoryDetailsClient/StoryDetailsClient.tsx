'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchSavedStoriesMe, fetchStoryByIdClient } from '@/lib/api/clientApi';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Image from 'next/image';
import { SaveStoryButton } from './SaveStoryButton/SaveStoryButton';
import { useAuthStore } from '@/lib/store/authStore';
import css from './StoryDetailsClient.module.css';

function formatDate(dateString: string): string {
  return dateString.slice(0, 10);
}

export const StoryDetailsClient = () => {


  return (
    <></>
  );
};
