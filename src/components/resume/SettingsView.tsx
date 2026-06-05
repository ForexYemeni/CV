'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Globe,
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  Trash2,
  User,
  Palette,
  Database,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsView() {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const setIsLoggedIn = useAppStore((s) => s.setIsLoggedIn);
  const userName = useAppStore((s) => s.userName);
  const setUserName = useAppStore((s) => s.setUserName);
  const resumes = useAppStore((s) => s.resumes);
  const setResumes = useAppStore((s) => s.setResumes);

  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRtl = language === 'ar';

  const handleExport = () => {
    const data = JSON.stringify(resumes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resumes-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (Array.isArray(data)) {
          setResumes(data);
        }
      } catch {
        // Invalid JSON
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('resume-builder-store');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold"
        >
          {t('settings.title', language)}
        </motion.h1>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-5 shadow-premium"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">{t('settings.language', language)}</CardTitle>
            </div>
          </div>
          <RadioGroup
            value={language}
            onValueChange={(v) => setLanguage(v as 'ar' | 'en')}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all',
                language === 'ar' ? 'border-primary bg-primary/5 shadow-glow' : 'border-border/50 hover:border-primary/30'
              )}
            >
              <RadioGroupItem value="ar" />
              <div>
                <p className="font-medium">العربية</p>
                <p className="text-xs text-muted-foreground">Arabic</p>
              </div>
              <div className="ms-auto text-2xl">🇸🇦</div>
            </Label>
            <Label
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all',
                language === 'en' ? 'border-primary bg-primary/5 shadow-glow' : 'border-border/50 hover:border-primary/30'
              )}
            >
              <RadioGroupItem value="en" />
              <div>
                <p className="font-medium">English</p>
                <p className="text-xs text-muted-foreground">الإنجليزية</p>
              </div>
              <div className="ms-auto text-2xl">🇺🇸</div>
            </Label>
          </RadioGroup>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 shadow-premium"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Palette className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-semibold">{t('settings.theme', language)}</CardTitle>
          </div>
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { value: 'light', icon: Sun, label: t('settings.light', language) },
              { value: 'dark', icon: Moon, label: t('settings.dark', language) },
              { value: 'system', icon: Monitor, label: t('settings.system', language) },
            ].map((item) => (
              <Label
                key={item.value}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all',
                  theme === item.value ? 'border-primary bg-primary/5 shadow-glow' : 'border-border/50 hover:border-primary/30'
                )}
              >
                <RadioGroupItem value={item.value} className="sr-only" />
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-5 shadow-premium"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <Database className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-semibold">
              {language === 'ar' ? 'إدارة البيانات' : 'Data Management'}
            </CardTitle>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={handleExport}>
                <Download className="h-4 w-4 me-2" />
                {t('settings.export', language)}
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 me-2" />
                {t('settings.import', language)}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </div>
            <Separator />
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive rounded-xl"
              onClick={handleClearData}
            >
              <Trash2 className="h-4 w-4 me-2" />
              {language === 'ar' ? 'مسح جميع البيانات' : 'Clear All Data'}
            </Button>
            <p className="text-xs text-muted-foreground">
              {language === 'ar'
                ? `${resumes.length} سيرة ذاتية محفوظة`
                : `${resumes.length} resumes saved`}
            </p>
          </div>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5 shadow-premium"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <User className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-semibold">{t('settings.account', language)}</CardTitle>
          </div>
          {isLoggedIn ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-white font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'مسجل الدخول' : 'Signed in'}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-xl" onClick={() => setIsLoggedIn(false)}>
                {t('auth.logout', language)}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {language === 'ar'
                  ? 'سجل دخولك لحفظ السير الذاتية عبر الأجهزة'
                  : 'Sign in to save resumes across devices'}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsLoggedIn(true);
                  setUserName(language === 'ar' ? 'مستخدم' : 'User');
                }}
                className="w-full gradient-brand text-white rounded-xl px-5 py-2.5 font-semibold"
              >
                {t('auth.login', language)}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
