'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import * as React from 'react';
const inter = Inter({ subsets: ['latin'] });
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { signOut } from 'next-auth/react';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <head>
            <title>Suvaroglu</title>
          </head>
          <body className={cn(inter.className)}>
            <div className="bg-white min-h-[100vh]">{children}</div>
          </body>
        </html>
      </QueryClientProvider>
    </SessionProvider>
  );
}
