'use client';

import { useRef } from 'react';
import { useTheme } from 'next-themes';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Language,
  Globe,
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  Trash2,
  User,
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
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">{t('settings.title', language)}</h1>

        {/* Language */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-600" />
              {t('settings.language', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={language}
              onValueChange={(v) => setLanguage(v as 'ar' | 'en')}
              className="grid grid-cols-2 gap-3"
            >
              <Label
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                  language === 'ar' && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                )}
              >
                <RadioGroupItem value="ar" />
                <div>
                  <p className="text-sm font-medium">العربية</p>
                  <p className="text-xs text-muted-foreground">Arabic</p>
                </div>
              </Label>
              <Label
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                  language === 'en' && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                )}
              >
                <RadioGroupItem value="en" />
                <div>
                  <p className="text-sm font-medium">English</p>
                  <p className="text-xs text-muted-foreground">الإنجليزية</p>
                </div>
              </Label>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-emerald-600" />
              ) : (
                <Sun className="h-4 w-4 text-emerald-600" />
              )}
              {t('settings.theme', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                    'flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors',
                    theme === item.value && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                  )}
                >
                  <RadioGroupItem value={item.value} className="sr-only" />
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {language === 'ar' ? 'إدارة البيانات' : 'Data Management'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex-1" onClick={handleExport}>
                <Download className="h-4 w-4 me-2" />
                {t('settings.export', language)}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
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
              className="w-full text-destructive hover:text-destructive"
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
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-600" />
              {t('settings.account', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'مسجل الدخول' : 'Signed in'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsLoggedIn(false)}
                >
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
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setIsLoggedIn(true);
                    setUserName(language === 'ar' ? 'مستخدم' : 'User');
                  }}
                >
                  {t('auth.login', language)}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
