'use client';

import { useAppStore, useCurrentResume } from '@/lib/store';
import { t } from '@/lib/i18n';
import { TEMPLATES } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, LayoutTemplate, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MiniTemplatePreview } from './MiniTemplatePreview';

export function TemplateSelector() {
  const language = useAppStore((s) => s.language);
  const resume = useCurrentResume();
  const updateCurrentResumeSettings = useAppStore((s) => s.updateCurrentResumeSettings);
  const isRtl = language === 'ar';

  if (!resume) return null;

  const categories = [...new Set(TEMPLATES.map((t) => t.category))];
  const categoryLabels: Record<string, string> = {
    professional: language === 'ar' ? 'احترافي' : 'Professional',
    creative: language === 'ar' ? 'إبداعي' : 'Creative',
    minimal: language === 'ar' ? 'بسيط' : 'Minimal',
    industry: language === 'ar' ? 'صناعي' : 'Industry',
    academic: language === 'ar' ? 'أكاديمي' : 'Academic',
    premium: language === 'ar' ? 'فاخر' : 'Premium',
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
                    'cursor-pointer transition-all hover:shadow-md overflow-hidden p-0',
                    isActive && 'ring-2 ring-primary border-primary'
                  )}
                  onClick={() => updateCurrentResumeSettings({ template: tmpl.id })}
                >
                  <CardContent className="p-0">
                    {/* Real template preview */}
                    <div className="aspect-[3/4] relative overflow-hidden bg-white">
                      <MiniTemplatePreview
                        templateId={tmpl.id}
                        primaryColor={tmpl.colors[0]}
                        language={language}
                        width={200}
                        height={267}
                      />
                      {isActive && (
                        <div className="absolute top-1 end-1 flex h-5 w-5 items-center justify-center rounded-full gradient-brand text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      {tmpl.isPremium && (
                        <div className="absolute top-1 start-1">
                          <Lock className="h-3 w-3 text-amber-500" />
                        </div>
                      )}
                    </div>

                    <div className="p-2">
                      <p className="text-xs font-medium truncate">
                        {language === 'ar' ? tmpl.nameAr : tmpl.name}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {tmpl.colors.slice(0, 3).map((color) => (
                          <div
                            key={color}
                            className="w-3 h-3 rounded-full border border-border/30"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
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
