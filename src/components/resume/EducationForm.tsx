'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Education, generateId, DegreeType, DEGREE_LABELS } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';

const inputClass = "rounded-xl border border-border/60 bg-white/50 dark:bg-white/5 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

export function EducationForm() {
  const language = useAppStore((s) => s.language);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);

  const resume = getCurrentResume();
  const isRtl = language === 'ar';

  if (!resume) return null;

  const { education } = resume.data;

  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: '',
      major: '',
      degree: 'bachelor',
      startDate: '',
      endDate: '',
      description: '',
      order: education.length,
    };
    updateCurrentResumeData({
      education: [...education, newEdu],
    });
  };

  const removeEducation = (id: string) => {
    updateCurrentResumeData({
      education: education.filter((e) => e.id !== id),
    });
  };

  const updateEducation = (id: string, data: Partial<Education>) => {
    updateCurrentResumeData({
      education: education.map((e) => (e.id === id ? { ...e, ...data } : e)),
    });
  };

  const degreeLabels = DEGREE_LABELS[language];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t('section.education', language)}</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addEducation}
          className="flex items-center gap-1 gradient-brand text-white rounded-xl px-3 py-1.5 text-xs font-medium"
        >
          <Plus className="h-3 w-3" />
          {t('education.add', language)}
        </motion.button>
      </div>

      {education.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t('common.noData', language)}</p>
          <Button variant="outline" size="sm" className="mt-3 rounded-xl" onClick={addEducation}>
            <Plus className="h-3 w-3 me-1" />
            {t('education.add', language)}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {education.map((edu) => (
          <EducationItem
            key={edu.id}
            edu={edu}
            language={language}
            isRtl={isRtl}
            degreeLabels={degreeLabels}
            onUpdate={updateEducation}
            onRemove={removeEducation}
          />
        ))}
      </div>
    </div>
  );
}

function EducationItem({
  edu,
  language,
  isRtl,
  degreeLabels,
  onUpdate,
  onRemove,
}: {
  edu: Education;
  language: 'ar' | 'en';
  isRtl: boolean;
  degreeLabels: Record<DegreeType, string>;
  onUpdate: (id: string, data: Partial<Education>) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(!edu.institution);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass rounded-2xl overflow-hidden shadow-premium',
        open && 'border-s-4 border-s-amber-500'
      )}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-2 p-4 cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 text-start">
              <p className="text-sm font-medium truncate">
                {edu.institution || (language === 'ar' ? 'المؤسسة التعليمية' : 'Institution')}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {edu.major
                  ? `${edu.major} - ${degreeLabels[edu.degree]}`
                  : language === 'ar'
                  ? 'التخصص والدرجة'
                  : 'Major & Degree'}
              </p>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                open && 'rotate-180'
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pt-0 pb-4 px-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label className="text-xs">{t('education.institution', language)}</Label>
                <Input value={edu.institution} onChange={(e) => onUpdate(edu.id, { institution: e.target.value })} placeholder={language === 'ar' ? 'جامعة الملك سعود' : 'Harvard University'} dir={isRtl ? 'rtl' : 'ltr'} className={cn('mt-1', inputClass)} />
              </div>
              <div>
                <Label className="text-xs">{t('education.major', language)}</Label>
                <Input value={edu.major} onChange={(e) => onUpdate(edu.id, { major: e.target.value })} placeholder={language === 'ar' ? 'علوم الحاسب' : 'Computer Science'} dir={isRtl ? 'rtl' : 'ltr'} className={cn('mt-1', inputClass)} />
              </div>
              <div>
                <Label className="text-xs">{t('education.degree', language)}</Label>
                <Select value={edu.degree} onValueChange={(v) => onUpdate(edu.id, { degree: v as DegreeType })}>
                  <SelectTrigger className="mt-1 h-10 text-sm rounded-xl">{<SelectValue />}</SelectTrigger>
                  <SelectContent>
                    {(Object.keys(degreeLabels) as DegreeType[]).map((key) => (
                      <SelectItem key={key} value={key}>{degreeLabels[key]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">{t('education.startDate', language)}</Label>
                <Input value={edu.startDate} onChange={(e) => onUpdate(edu.id, { startDate: e.target.value })} placeholder={language === 'ar' ? '٢٠١٨' : '2018'} dir="ltr" className={cn('mt-1', inputClass)} />
              </div>
              <div>
                <Label className="text-xs">{t('education.endDate', language)}</Label>
                <Input value={edu.endDate} onChange={(e) => onUpdate(edu.id, { endDate: e.target.value })} placeholder={language === 'ar' ? '٢٠٢٢' : '2022'} dir="ltr" className={cn('mt-1', inputClass)} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">{t('education.description', language)}</Label>
                <Textarea value={edu.description} onChange={(e) => onUpdate(edu.id, { description: e.target.value })} placeholder={language === 'ar' ? 'المعدل التراكمي: 3.8/4.0، أنشطة طلابية...' : 'GPA: 3.8/4.0, Student activities...'} dir={isRtl ? 'rtl' : 'ltr'} className="mt-1 rounded-xl border border-border/60 bg-white/50 dark:bg-white/5 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-16" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive rounded-xl" onClick={() => onRemove(edu.id)}>
                <Trash2 className="h-3 w-3 me-1" />
                {t('education.remove', language)}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}
