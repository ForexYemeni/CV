'use client';

import { useAppStore } from '@/lib/store';
import { AppHeader } from '@/components/layout/AppHeader';
import { DashboardView } from '@/components/resume/DashboardView';
import { EditorView } from '@/components/resume/EditorView';
import { TemplatesView } from '@/components/resume/TemplatesView';
import { SettingsView } from '@/components/resume/SettingsView';
import { AdminView } from '@/components/resume/AdminView';

export default function Home() {
  const currentView = useAppStore((s) => s.currentView);

  const renderView = () => {
    switch (currentView) {
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
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1">{renderView()}</main>
    </div>
  );
}
