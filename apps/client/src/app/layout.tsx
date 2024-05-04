import '@/styles/globals.css';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { AppLayout } from '@/modules/ui/layouts/app-layout';
import { Toaster } from '@/modules/ui/components/toaster';
import { Providers } from '@/providers';

export const metadata = {
  description: 'CrunchyFans',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  title: 'CrunchyFans',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body suppressHydrationWarning={true}>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
