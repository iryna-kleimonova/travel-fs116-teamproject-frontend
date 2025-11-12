'use client';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import { useParams } from 'next/navigation';

export default function EditStoryPage() {
  const params = useParams();
  return (
    <ProtectedRoute>
      <h2>EditStory – {params.storyId}</h2>
    </ProtectedRoute>
  );
}
