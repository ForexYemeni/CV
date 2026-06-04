'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { TEMPLATES } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, LayoutTemplate, Lock, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TemplatesView() {
  const language = useAppStore((s) => s.language);
  const resumes = useAppStore((s) => s.resumes);
  const currentResumeId = useAppStore((s) => s.currentResumeId);
  const updateResume = useAppStore((s) => s.updateResume);
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const setCurrentResumeId = useAppStore((s) => s.setCurrentResumeId);
  const createNewResume = useAppStore((s) => s.createNewResume);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const isRtl = language === 'ar';

  const categories = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
    ...([...new Set(TEMPLATES.map((t) => t.category))].map((cat) => ({
      id: cat,
      label:
        language === 'ar'
          ? TEMPLATES.find((t) => t.category === cat)?.categoryAr || cat
          : cat.charAt(0).toUpperCase() + cat.slice(1),
    }))),
  ];

  const filteredTemplates = TEMPLATES.filter((tmpl) => {
    const matchesSearch =
      tmpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tmpl.nameAr.includes(search);
    const matchesCategory =
      selectedCategory === 'all' || tmpl.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (templateId: string) => {
    if (currentResumeId) {
      updateResume(currentResumeId, { template: templateId });
    } else {
      const id = createNewResume();
      updateResume(id, { template: templateId });
    }
    setCurrentView('editor');
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('templates.title', language)}</h1>
          <p className="text-muted-foreground mt-1">
            {language === 'ar'
              ? 'اختر من بين مجموعة من القوالب الاحترافية'
              : 'Choose from a collection of professional templates'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              className={cn(
                'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                isRtl ? 'right-3' : 'left-3'
              )}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                language === 'ar' ? 'ابحث عن قالب...' : 'Search templates...'
              }
              className={cn(isRtl ? 'pr-10' : 'pl-10')}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  selectedCategory === cat.id &&
                    'bg-emerald-600 hover:bg-emerald-700'
                )}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredTemplates.map((tmpl) => {
            const activeResume = currentResumeId
              ? resumes.find((r) => r.id === currentResumeId)
              : null;
            const isActive = activeResume?.template === tmpl.id;

            return (
              <Card
                key={tmpl.id}
                className={cn(
                  'group cursor-pointer transition-all hover:shadow-lg overflow-hidden',
                  isActive && 'ring-2 ring-emerald-500'
                )}
                onClick={() => handleSelectTemplate(tmpl.id)}
              >
                {/* Template Preview */}
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
                  {/* Simulated template layout */}
                  <div className="absolute inset-4 space-y-2">
                    {/* Header */}
                    <div
                      className="h-6 rounded-sm"
                      style={{ backgroundColor: tmpl.colors[0] + '20' }}
                    />
                    <div
                      className="h-2 rounded-sm w-3/4"
                      style={{ backgroundColor: tmpl.colors[0] + '30' }}
                    />
                    <div className="h-1.5 rounded-sm w-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-1.5 rounded-sm w-5/6 bg-gray-200 dark:bg-gray-700" />
                    {/* Section */}
                    <div className="pt-2">
                      <div
                        className="h-2 rounded-sm w-1/2 mb-1.5"
                        style={{ backgroundColor: tmpl.colors[0] + '40' }}
                      />
                      <div className="space-y-1">
                        <div className="h-1.5 rounded-sm w-full bg-gray-200 dark:bg-gray-700" />
                        <div className="h-1.5 rounded-sm w-4/5 bg-gray-200 dark:bg-gray-700" />
                        <div className="h-1.5 rounded-sm w-3/4 bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </div>
                    {/* Section */}
                    <div className="pt-1">
                      <div
                        className="h-2 rounded-sm w-1/2 mb-1.5"
                        style={{ backgroundColor: tmpl.colors[0] + '40' }}
                      />
                      <div className="flex flex-wrap gap-1">
                        <div
                          className="h-4 w-12 rounded-sm"
                          style={{ backgroundColor: tmpl.colors[0] + '15' }}
                        />
                        <div
                          className="h-4 w-16 rounded-sm"
                          style={{ backgroundColor: tmpl.colors[0] + '15' }}
                        />
                        <div
                          className="h-4 w-10 rounded-sm"
                          style={{ backgroundColor: tmpl.colors[0] + '15' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Button
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-600 hover:bg-emerald-700"
                    >
                      {t('templates.select', language)}
                    </Button>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-2 end-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}

                  {/* Premium badge */}
                  {tmpl.isPremium && (
                    <div className="absolute top-2 start-2">
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-[10px] gap-1"
                      >
                        <Lock className="h-2.5 w-2.5" />
                        {t('templates.premium', language)}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">
                    {language === 'ar' ? tmpl.nameAr : tmpl.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {language === 'ar' ? tmpl.descriptionAr : tmpl.description}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {tmpl.colors.slice(0, 3).map((color) => (
                      <div
                        key={color}
                        className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {language === 'ar' ? 'لا توجد قوالب مطابقة' : 'No matching templates'}
          </div>
        )}
      </div>
    </div>
  );
}
