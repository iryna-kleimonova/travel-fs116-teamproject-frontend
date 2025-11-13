import TravellersListClient from './TravellersListClient';
import { getUsersServer } from '@/lib/api/serverApi';
import type { User } from '@/types/user';
import defaultStyles from './TravellersList.module.css';

interface Props {
  initialPerPage?: number; // для SSR
  loadMorePerPage: number; // для клієнта
  showLoadMoreOnMobile?: boolean;
  customStyles?: typeof defaultStyles;
}

export default async function TravellersList({
  initialPerPage = 12,
  loadMorePerPage,
  showLoadMoreOnMobile = false,
  customStyles,
}: Props) {
  let initialUsers: User[] = [];
  let totalPages = 1;

  try {
    const res = await getUsersServer(1, initialPerPage);
    initialUsers = res.data.users ?? [];
    totalPages = res.data.totalPages ?? 1;
  } catch (err) {
    console.error(err);
  }

  return (
    <TravellersListClient
      initialUsers={initialUsers}
      loadMorePerPage={loadMorePerPage}
      totalPages={totalPages}
      showLoadMoreOnMobile={showLoadMoreOnMobile}
      customStyles={customStyles}
    />
  );
}
