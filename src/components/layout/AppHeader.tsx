'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { ViewMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  FileText,
  Sun,
  Moon,
  Globe,
  Menu,
  LayoutDashboard,
  PenLine,
  LayoutTemplate,
  Settings,
  Shield,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS: { view: ViewMode; icon: typeof LayoutDashboard }[] = [
  { view: 'dashboard', icon: LayoutDashboard },
  { view: 'templates', icon: LayoutTemplate },
  { view: 'settings', icon: Settings },
];

export function AppHeader() {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const currentView = useAppStore((s) => s.currentView);
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const setIsLoggedIn = useAppStore((s) => s.setIsLoggedIn);
  const userName = useAppStore((s) => s.userName);
  const setUserName = useAppStore((s) => s.setUserName);
  const currentResumeId = useAppStore((s) => s.currentResumeId);

  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRtl = language === 'ar';

  const handleNavClick = (view: ViewMode) => {
    setCurrentView(view);
    setMobileOpen(false);
  };

  const updateCurrentResumeSettings = useAppStore((s) => s.updateCurrentResumeSettings);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    // Also update the current resume's language so the preview matches
    if (currentResumeId) {
      updateCurrentResumeSettings({ language: newLang });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setUserName('');
    } else {
      setIsLoggedIn(true);
      setUserName(language === 'ar' ? 'مستخدم' : 'User');
    }
  };

  const getNavLabel = (view: ViewMode) => {
    const keyMap: Record<ViewMode, string> = {
      dashboard: 'nav.dashboard',
      editor: 'nav.editor',
      templates: 'nav.templates',
      settings: 'nav.settings',
      admin: 'nav.admin',
      auth: 'auth.login',
    };
    return t(keyMap[view], language);
  };

  const visibleNavItems = currentResumeId
    ? [{ view: 'editor' as ViewMode, icon: PenLine }, ...NAV_ITEMS]
    : NAV_ITEMS;

  if (isLoggedIn) {
    visibleNavItems.push({ view: 'admin', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6 gap-2">
        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={isRtl ? 'right' : 'left'} className="w-72 pt-12">
            <SheetTitle className="sr-only">
              {t('app.title', language)}
            </SheetTitle>
            <nav className="flex flex-col gap-1">
              {visibleNavItems.map((item) => (
                <Button
                  key={item.view}
                  variant={currentView === item.view ? 'secondary' : 'ghost'}
                  className={cn(
                    'justify-start gap-3 h-11',
                    isRtl && 'flex-row-reverse'
                  )}
                  onClick={() => handleNavClick(item.view)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{getNavLabel(item.view)}</span>
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div
          className={cn(
            'flex items-center gap-2 cursor-pointer',
            isRtl && 'flex-row-reverse'
          )}
          onClick={() => handleNavClick('dashboard')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">
            {t('app.title', language)}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 mx-4">
          {visibleNavItems.map((item) => (
            <Button
              key={item.view}
              variant={currentView === item.view ? 'secondary' : 'ghost'}
              size="sm"
              className={cn('gap-2', isRtl && 'flex-row-reverse')}
              onClick={() => handleNavClick(item.view)}
            >
              <item.icon className="h-4 w-4" />
              <span>{getNavLabel(item.view)}</span>
            </Button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Language toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            <Globe className="h-4 w-4" />
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {isLoggedIn ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRtl ? 'start' : 'end'}>
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem className="gap-2">
                    <User className="h-4 w-4" />
                    <span>{userName}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavClick('settings')}>
                    <Settings className="h-4 w-4 me-2" />
                    {t('settings.title', language)}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLoginLogout}>
                    <LogOut className="h-4 w-4 me-2" />
                    {t('auth.logout', language)}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={handleLoginLogout}>
                  <LogIn className="h-4 w-4 me-2" />
                  {t('auth.login', language)}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
