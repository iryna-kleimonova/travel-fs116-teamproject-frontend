import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <h2>Profile</h2>
    </ProtectedRoute>
  );
}
