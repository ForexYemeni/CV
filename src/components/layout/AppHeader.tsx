'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Home,
  X,
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
  const createNewResume = useAppStore((s) => s.createNewResume);
  const updateCurrentResumeSettings = useAppStore((s) => s.updateCurrentResumeSettings);

  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isRtl = language === 'ar';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNavClick = (view: ViewMode) => {
    setCurrentView(view);
    setMobileOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
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
      landing: 'nav.landing',
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
    <header
      className={cn(
        'shrink-0 z-50 w-full transition-all duration-300',
        currentView === 'editor' ? 'relative' : 'sticky top-0',
        scrolled || currentView === 'editor'
          ? 'glass-strong shadow-premium'
          : 'bg-background/80 backdrop-blur-sm'
      )}
    >
      <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 md:px-6 gap-2 sm:gap-3">
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
              <button
                onClick={() => handleNavClick('landing')}
                className={cn(
                  'flex items-center gap-3 h-11 px-4 rounded-xl text-sm transition-colors',
                  currentView === 'landing'
                    ? 'gradient-brand text-white font-medium'
                    : 'hover:bg-muted'
                )}
              >
                <Home className="h-5 w-5" />
                <span>{getNavLabel('landing')}</span>
              </button>
              {visibleNavItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={cn(
                    'flex items-center gap-3 h-11 px-4 rounded-xl text-sm transition-colors',
                    currentView === item.view
                      ? 'gradient-brand text-white font-medium'
                      : 'hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{getNavLabel(item.view)}</span>
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex items-center gap-2.5 cursor-pointer',
            isRtl && 'flex-row-reverse'
          )}
          onClick={() => handleNavClick('landing')}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-white shadow-md">
            <FileText className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">
            {t('app.title', language)}
          </span>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 mx-4">
          {visibleNavItems.map((item) => (
            <motion.button
              key={item.view}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavClick(item.view)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors',
                currentView === item.view
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{getNavLabel(item.view)}</span>
              {currentView === item.view && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 inset-x-2 h-0.5 gradient-brand rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Language toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-muted/50 transition-colors"
            title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-muted/50 transition-colors"
              >
                {isLoggedIn ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-white text-xs font-bold">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRtl ? 'start' : 'end'} className="w-48">
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

          {/* CTA button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => createNewResume()}
            className={cn(
              'hidden sm:flex items-center gap-2 gradient-brand text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-shadow',
              isRtl && 'flex-row-reverse'
            )}
          >
            <FileText className="h-4 w-4" />
            {language === 'ar' ? 'إنشاء سيرة ذاتية' : 'Create Resume'}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
