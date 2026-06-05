'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { TEMPLATES } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Users,
  LayoutTemplate,
  Type,
  BarChart3,
  FileDown,
  Eye,
  TrendingUp,
  HardDrive,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminView() {
  const language = useAppStore((s) => s.language);
  const resumes = useAppStore((s) => s.resumes);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const isRtl = language === 'ar';

  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
            <Shield className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'تحتاج لتسجيل الدخول أولاً' : 'You need to sign in first'}
          </p>
        </div>
      </div>
    );
  }

  const stats = {
    totalResumes: resumes.length,
    totalTemplates: TEMPLATES.length,
    premiumTemplates: TEMPLATES.filter((t) => t.isPremium).length,
    templateUsage: TEMPLATES.map((tmpl) => ({
      ...tmpl,
      count: resumes.filter((r) => r.template === tmpl.id).length,
    })).sort((a, b) => b.count - a.count),
    recentResumes: resumes.slice(-5).reverse(),
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-white">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">{t('admin.title', language)}</h1>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileDown, label: t('admin.pdfDownloads', language), value: stats.totalResumes, gradient: 'from-blue-500 to-cyan-500' },
            { icon: Users, label: t('admin.users', language), value: 1, gradient: 'from-purple-500 to-pink-500' },
            { icon: LayoutTemplate, label: t('admin.templates', language), value: stats.totalTemplates, gradient: 'from-amber-500 to-orange-500' },
            { icon: HardDrive, label: language === 'ar' ? 'التخزين' : 'Storage', value: Math.round(JSON.stringify(resumes).length / 1024), unit: 'KB', gradient: 'from-green-500 to-emerald-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 shadow-premium"
            >
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white', stat.gradient)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stat.value}
                    {stat.unit && <span className="text-sm font-normal text-muted-foreground ms-1">{stat.unit}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="templates" dir={isRtl ? 'rtl' : 'ltr'}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="templates" className="rounded-lg">
              <LayoutTemplate className="h-4 w-4 me-1" />
              {t('admin.templates', language)}
            </TabsTrigger>
            <TabsTrigger value="stats" className="rounded-lg">
              <BarChart3 className="h-4 w-4 me-1" />
              {t('admin.stats', language)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 shadow-premium"
            >
              <h3 className="text-sm font-semibold mb-4">{t('admin.templates', language)}</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {stats.templateUsage.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: tmpl.colors[0] }}
                    />
                    <span className="text-sm flex-1">
                      {language === 'ar' ? tmpl.nameAr : tmpl.name}
                    </span>
                    {tmpl.isPremium && (
                      <Badge variant="secondary" className="text-[10px] rounded-lg">
                        {t('templates.premium', language)}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {tmpl.count} {language === 'ar' ? 'استخدام' : 'uses'}
                    </span>
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-brand rounded-full transition-all"
                        style={{
                          width: stats.totalResumes
                            ? `${(tmpl.count / stats.totalResumes) * 100}%`
                            : '0%',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 shadow-premium"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold">
                  {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                </h3>
              </div>
              {stats.recentResumes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t('common.noData', language)}
                </p>
              ) : (
                <div className="space-y-2">
                  {stats.recentResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: resume.primaryColor }}
                      />
                      <span className="text-sm flex-1 truncate">{resume.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(resume.updatedAt).toLocaleDateString(
                          language === 'ar' ? 'ar-SA' : 'en-US'
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
