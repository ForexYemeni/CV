'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { TEMPLATES } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, LayoutTemplate, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TemplateSelector() {
  const language = useAppStore((s) => s.language);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);
  const updateCurrentResumeSettings = useAppStore((s) => s.updateCurrentResumeSettings);

  const resume = getCurrentResume();
  const isRtl = language === 'ar';

  if (!resume) return null;

  const categories = [...new Set(TEMPLATES.map((t) => t.category))];
  const categoryLabels: Record<string, string> = {
    professional: language === 'ar' ? 'احترافي' : 'Professional',
    creative: language === 'ar' ? 'إبداعي' : 'Creative',
    minimal: language === 'ar' ? 'بسيط' : 'Minimal',
    industry: language === 'ar' ? 'صناعي' : 'Industry',
    academic: language === 'ar' ? 'أكاديمي' : 'Academic',
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{t('templates.title', language)}</h3>

      {categories.map((category) => (
        <div key={category}>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {categoryLabels[category] || category}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TEMPLATES.filter((t) => t.category === category).map((tmpl) => {
              const isActive = resume.template === tmpl.id;
              return (
                <Card
                  key={tmpl.id}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    isActive && 'ring-2 ring-emerald-500 border-emerald-500'
                  )}
                  onClick={() => updateCurrentResumeSettings({ template: tmpl.id })}
                >
                  <CardContent className="p-3">
                    {/* Preview thumbnail */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-md mb-2 flex items-center justify-center relative overflow-hidden">
                      <div className="w-3/4 space-y-1.5">
                        <div
                          className="h-2 rounded-sm w-3/4"
                          style={{ backgroundColor: tmpl.colors[0] + '30' }}
                        />
                        <div
                          className="h-1 rounded-sm w-full"
                          style={{ backgroundColor: tmpl.colors[0] + '15' }}
                        />
                        <div
                          className="h-1 rounded-sm w-5/6"
                          style={{ backgroundColor: tmpl.colors[0] + '15' }}
                        />
                        <div className="pt-1 space-y-1">
                          <div
                            className="h-1.5 rounded-sm w-1/2"
                            style={{ backgroundColor: tmpl.colors[0] + '40' }}
                          />
                          <div className="h-1 rounded-sm w-full bg-gray-200 dark:bg-gray-700" />
                          <div className="h-1 rounded-sm w-4/5 bg-gray-200 dark:bg-gray-700" />
                        </div>
                        <div className="pt-1 space-y-1">
                          <div
                            className="h-1.5 rounded-sm w-1/2"
                            style={{ backgroundColor: tmpl.colors[0] + '40' }}
                          />
                          <div className="h-1 rounded-sm w-full bg-gray-200 dark:bg-gray-700" />
                          <div className="h-1 rounded-sm w-3/4 bg-gray-200 dark:bg-gray-700" />
                        </div>
                      </div>
                      {isActive && (
                        <div className="absolute top-1 end-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      {tmpl.isPremium && (
                        <div className="absolute top-1 start-1">
                          <Lock className="h-3 w-3 text-amber-500" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs font-medium truncate">
                      {language === 'ar' ? tmpl.nameAr : tmpl.name}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {tmpl.colors.slice(0, 3).map((color) => (
                        <div
                          key={color}
                          className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-700"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
