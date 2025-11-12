import 'modern-normalize/modern-normalize.css';
import './globals.css';

import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import { Nunito_Sans } from 'next/font/google';
import { Sora } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import BreakpointInitializer from '@/components/Providers/BreakpointInitializer';

const nunitoSans = Nunito_Sans({
  subsets: ['cyrillic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Подорожники — Діліться враженнями від подорожей',
  description:
    'Платформа для мандрівників, де можна ділитися враженнями від подорожей, знаходити натхнення для нових пригод та відкривати цікаві місця.',
  openGraph: {
    title: 'Подорожники — Діліться враженнями від подорожей',
    description: 'NoteHub helps you create, browse and search personal notes.',
    url: 'https://localhost:3000',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Подорожники',
      },
    ],
    type: 'website',
  },

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${nunitoSans.variable} ${sora.variable}`}>
        <BreakpointInitializer />
        <TanStackProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  fontFamily: 'var(--font-nunito-sans), sans-serif',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4169e1',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#b00101',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
