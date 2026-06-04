'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { LanguageEntry, generateId, LanguageLevel, LANGUAGE_LEVEL_LABELS } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const inputClass = "rounded-xl border border-border/60 bg-white/50 dark:bg-white/5 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

export function LanguagesForm() {
  const language = useAppStore((s) => s.language);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);

  const resume = getCurrentResume();
  const isRtl = language === 'ar';

  if (!resume) return null;

  const { languages } = resume.data;
  const levelLabels = LANGUAGE_LEVEL_LABELS[language];

  const addLanguage = () => {
    const newLang: LanguageEntry = {
      id: generateId(),
      name: '',
      level: 'intermediate',
    };
    updateCurrentResumeData({
      languages: [...languages, newLang],
    });
  };

  const removeLanguage = (id: string) => {
    updateCurrentResumeData({
      languages: languages.filter((l) => l.id !== id),
    });
  };

  const updateLanguage = (id: string, data: Partial<LanguageEntry>) => {
    updateCurrentResumeData({
      languages: languages.map((l) => (l.id === id ? { ...l, ...data } : l)),
    });
  };

  const getLevelBarWidth = (level: LanguageLevel) => {
    switch (level) {
      case 'native': return '100%';
      case 'fluent': return '85%';
      case 'advanced': return '70%';
      case 'intermediate': return '50%';
      case 'basic': return '30%';
      default: return '50%';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t('section.languages', language)}</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addLanguage}
          className="flex items-center gap-1 gradient-brand text-white rounded-xl px-3 py-1.5 text-xs font-medium"
        >
          <Plus className="h-3 w-3" />
          {t('lang.add', language)}
        </motion.button>
      </div>

      {languages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Globe2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t('common.noData', language)}</p>
          <Button variant="outline" size="sm" className="mt-3 rounded-xl" onClick={addLanguage}>
            <Plus className="h-3 w-3 me-1" />
            {t('lang.add', language)}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {languages.map((lang) => (
          <motion.div
            key={lang.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 shadow-premium"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 text-white">
                <Globe2 className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1">
                <Input
                  value={lang.name}
                  onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                  placeholder={t('lang.name', language)}
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className={inputClass}
                />
              </div>
              <div className="w-32">
                <Select
                  value={lang.level}
                  onValueChange={(v) => updateLanguage(lang.id, { level: v as LanguageLevel })}
                >
                  <SelectTrigger className="h-10 text-sm rounded-xl">{<SelectValue />}</SelectTrigger>
                  <SelectContent>
                    {(Object.keys(levelLabels) as LanguageLevel[]).map((key) => (
                      <SelectItem key={key} value={key}>{levelLabels[key]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 text-destructive hover:text-destructive rounded-xl"
                onClick={() => removeLanguage(lang.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-brand rounded-full transition-all duration-500"
                style={{ width: getLevelBarWidth(lang.level) }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
