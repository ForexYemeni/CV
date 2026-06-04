'use client';

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
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminView() {
  const language = useAppStore((s) => s.language);
  const resumes = useAppStore((s) => s.resumes);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const isRtl = language === 'ar';

  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-emerald-600" />
          {t('admin.title', language)}
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={FileDown}
            label={t('admin.pdfDownloads', language)}
            value={stats.totalResumes}
            color="text-emerald-600"
            bgColor="bg-emerald-50 dark:bg-emerald-950/30"
          />
          <StatCard
            icon={Users}
            label={t('admin.users', language)}
            value={1}
            color="text-teal-600"
            bgColor="bg-teal-50 dark:bg-teal-950/30"
          />
          <StatCard
            icon={LayoutTemplate}
            label={t('admin.templates', language)}
            value={stats.totalTemplates}
            color="text-amber-600"
            bgColor="bg-amber-50 dark:bg-amber-950/30"
          />
          <StatCard
            icon={HardDrive}
            label={language === 'ar' ? 'التخزين' : 'Storage'}
            value={Math.round(JSON.stringify(resumes).length / 1024)}
            unit="KB"
            color="text-purple-600"
            bgColor="bg-purple-50 dark:bg-purple-950/30"
          />
        </div>

        <Tabs defaultValue="templates" dir={isRtl ? 'rtl' : 'ltr'}>
          <TabsList>
            <TabsTrigger value="templates">
              <LayoutTemplate className="h-4 w-4 me-1" />
              {t('admin.templates', language)}
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 me-1" />
              {t('admin.stats', language)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {t('admin.templates', language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.templateUsage.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                    >
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: tmpl.colors[0] }}
                      />
                      <span className="text-sm flex-1">
                        {language === 'ar' ? tmpl.nameAr : tmpl.name}
                      </span>
                      {tmpl.isPremium && (
                        <Badge variant="secondary" className="text-[10px]">
                          {t('templates.premium', language)}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {tmpl.count} {language === 'ar' ? 'استخدام' : 'uses'}
                      </span>
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentResumes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {t('common.noData', language)}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {stats.recentResumes.map((resume) => (
                      <div
                        key={resume.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit = '',
  color,
  bgColor,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  unit?: string;
  color: string;
  bgColor: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', bgColor)}>
            <Icon className={cn('h-4 w-4', color)} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {value}
              {unit && <span className="text-sm font-normal text-muted-foreground ms-1">{unit}</span>}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
