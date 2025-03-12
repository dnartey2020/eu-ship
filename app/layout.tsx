"use client";

import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clearAuth } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          // Token is missing or invalid, clear the auth state
          clearAuth();
        }
      } catch (error) {
        clearAuth();
      }
    };

    verifyAuth();
  }, [clearAuth]);

  const metadata = {
    title: "Euroswrift",
    description: "Your shipping solution",
    icons: {
      icon: "/favicon.ico", // Path to your favicon (placed in the public folder)
    },
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`dark:bg-black ${inter.className}`}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            enableSystem={false}
            attribute="class"
            defaultTheme="light"
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
