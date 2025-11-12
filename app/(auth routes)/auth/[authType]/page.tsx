import { notFound } from 'next/navigation';
import AuthLayout from '@/components/AuthForms/AuthLayout/AuthLayout';
import RegistrationForm from '@/components/AuthForms/RegistrationForm/RegistrationForm';
import LoginForm from '@/components/AuthForms/LoginForm/LoginForm';
import AuthRoute from '@/components/AuthRoute/AuthRoute';
import { Metadata } from 'next';

type AuthPageProps = {
  params: Promise<{ authType: string }>;
};

export async function generateMetadata({
  params,
}: AuthPageProps): Promise<Metadata> {
  const { authType } = await params;

  const titles = {
    register: 'Реєстрація | Подорожники',
    login: 'Вхід | Подорожники',
  };

  const descriptions = {
    register: 'Зареєструйтеся та приєднайтесь до спільноти мандрівників',
    login: 'Увійдіть до спільноти подорожників України',
  };

  return {
    title: titles[authType as keyof typeof titles] || 'Подорожники',
    description: descriptions[authType as keyof typeof descriptions] || '',
  };
}

export default async function AuthPage({ params }: AuthPageProps) {
  const { authType } = await params;

  if (authType !== 'register' && authType !== 'login') {
    notFound();
  }

  return (
    <AuthRoute>
      <AuthLayout>
        {authType === 'register' ? <RegistrationForm /> : <LoginForm />}
      </AuthLayout>
    </AuthRoute>
  );
}
