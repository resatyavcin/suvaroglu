"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import * as React from "react";
const inter = Inter({ subsets: ["latin"] });
import {QueryClientProvider , QueryClient } from '@tanstack/react-query'
import {Metadata} from "next";



const queryClient = new QueryClient()


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <QueryClientProvider client={queryClient}>
          <html lang="en">
          <head>
              <link rel="manifest" href="/manifest.json"/>
              <title>Suvaroglu</title>
          </head>
          <body className={cn(inter.className)}>
                  <div className="bg-white min-h-[100vh]">
                      {children}
                  </div>
              </body>
          </html>
      </QueryClientProvider>
  );
}
