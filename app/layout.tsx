'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { MantineProvider, MantineColorSchemeScript } from '@/components/providers/MantineProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

// Client component wrapper for QueryClientProvider
function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <MantineColorSchemeScript />
        <title>React + Next.js + Neon Template</title>
        <meta name="description" content="A production-ready starter template with React, TypeScript, Drizzle ORM, PostgreSQL, Email Auth, and Mantine UI components." />
      </head>
      <body className={inter.className}>
        <MantineProvider>
          <QueryClientProviderWrapper>
            <TooltipProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </TooltipProvider>
          </QueryClientProviderWrapper>
        </MantineProvider>
      </body>
    </html>
  );
}

