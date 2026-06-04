'use client';

import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { useAppStore } from '@/lib/store';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const language = useAppStore((s) => s.language);

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    const lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [language]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
