'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';

/**
 * Prevents rendering children until Zustand persist store has hydrated from localStorage.
 * This avoids hydration mismatches between server-rendered HTML and client state.
 */
export function HydrationGuard({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Manually hydrate the Zustand store from localStorage
    useAppStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl gradient-brand animate-pulse-glow flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-32 bg-muted rounded-full mx-auto overflow-hidden">
              <div className="h-full gradient-brand rounded-full animate-shimmer" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
