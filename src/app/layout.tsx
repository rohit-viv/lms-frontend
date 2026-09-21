import type { Metadata } from 'next';
import './globals.css';

import ReduxProvider from '@/store/provider';

export const metadata: Metadata = {
  title: 'LMS',
  description: 'Learning Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}