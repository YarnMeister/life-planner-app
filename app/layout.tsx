import { Inter } from 'next/font/google';
import './globals.css';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'React + Next.js + Neon Template',
  description: 'A production-ready starter template with React, TypeScript, Drizzle ORM, PostgreSQL, Email Auth, and Mantine UI components.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
