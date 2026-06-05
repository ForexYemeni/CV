'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { TEMPLATES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, LayoutTemplate, Lock, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MiniTemplatePreview } from './MiniTemplatePreview';

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
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold">{t('templates.title', language)}</h1>
          <p className="text-muted-foreground mt-1">
            {language === 'ar'
              ? 'اختر من بين مجموعة من القوالب الاحترافية'
              : 'Choose from a collection of professional templates'}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
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
              placeholder={language === 'ar' ? 'ابحث عن قالب...' : 'Search templates...'}
              className={cn('rounded-xl bg-white/50 dark:bg-white/5', isRtl ? 'pr-10' : 'pl-10')}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-4 py-1.5 rounded-xl text-xs font-medium transition-all',
                  selectedCategory === cat.id
                    ? 'gradient-brand text-white shadow-md'
                    : 'border border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground'
                )}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredTemplates.map((tmpl, i) => {
            const activeResume = currentResumeId
              ? resumes.find((r) => r.id === currentResumeId)
              : null;
            const isActive = activeResume?.template === tmpl.id;

            return (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -4 }}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={cn(
                  'group cursor-pointer rounded-2xl overflow-hidden transition-all shadow-premium hover:shadow-glow border',
                  isActive ? 'ring-2 ring-primary border-primary' : 'border-border/30 hover:border-primary/30'
                )}
              >
                {/* Template Preview - Real rendered template */}
                <div className="aspect-[3/4] relative overflow-hidden bg-white">
                  <MiniTemplatePreview
                    templateId={tmpl.id}
                    primaryColor={tmpl.colors[0]}
                    language={language}
                    width={300}
                    height={400}
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity gradient-brand text-white rounded-xl px-4 py-2 text-xs font-medium shadow-lg"
                    >
                      {t('templates.select', language)}
                    </motion.button>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-2 end-2 flex h-6 w-6 items-center justify-center rounded-full gradient-brand text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}

                  {/* Premium badge */}
                  {tmpl.isPremium && (
                    <div className="absolute top-2 start-2">
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-[10px] gap-1 rounded-lg"
                      >
                        <Lock className="h-2.5 w-2.5" />
                        {t('templates.premium', language)}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="glass-strong p-3">
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
                        className="w-4 h-4 rounded-full border border-border/30"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
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
