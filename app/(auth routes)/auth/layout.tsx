import AuthRoute from '@/components/AuthRoute/AuthRoute';
import { ReactNode } from 'react';

interface AuthLayoutWrapperProps {
  children: ReactNode;
}

export default function AuthLayoutWrapper({
  children,
}: AuthLayoutWrapperProps) {
  return <AuthRoute>{children}</AuthRoute>;
}
