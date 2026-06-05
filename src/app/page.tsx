'use client';

import { useAppStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { DashboardView } from '@/components/resume/DashboardView';
import { EditorView } from '@/components/resume/EditorView';
import { TemplatesView } from '@/components/resume/TemplatesView';
import { SettingsView } from '@/components/resume/SettingsView';
import { AdminView } from '@/components/resume/AdminView';
import { LandingPage } from '@/components/landing/LandingPage';

export default function Home() {
  const currentView = useAppStore((s) => s.currentView);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardView />;
      case 'editor':
        return <EditorView />;
      case 'templates':
        return <TemplatesView />;
      case 'settings':
        return <SettingsView />;
      case 'admin':
        return <AdminView />;
      default:
        return <LandingPage />;
    }
  };

  const isEditorLike = ['editor'].includes(currentView);

  return (
    <div className={isEditorLike ? 'h-dvh flex flex-col bg-background overflow-hidden' : 'min-h-screen flex flex-col bg-background'}>
      {currentView !== 'landing' && <AppHeader />}
      <main className={isEditorLike ? 'flex-1 min-h-0 overflow-hidden' : 'flex-1'}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={isEditorLike ? 'h-full' : ''}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
