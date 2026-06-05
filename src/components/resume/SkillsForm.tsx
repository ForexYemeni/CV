'use client';

import { useAppStore, useCurrentResume } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Skill, generateId, SkillLevel, SKILL_LEVEL_LABELS } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const inputClass = "rounded-xl border border-border/60 bg-white/50 dark:bg-white/5 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

export function SkillsForm() {
  const language = useAppStore((s) => s.language);
  const resume = useCurrentResume();
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);
  const isRtl = language === 'ar';

  if (!resume) return null;

  const { skills } = resume.data;

  const levelLabels = SKILL_LEVEL_LABELS[language];

  const addSkill = (category: string = 'technical') => {
    const newSkill: Skill = {
      id: generateId(),
      name: '',
      level: 'intermediate',
      category,
    };
    updateCurrentResumeData({
      skills: [...skills, newSkill],
    });
  };

  const removeSkill = (id: string) => {
    updateCurrentResumeData({
      skills: skills.filter((s) => s.id !== id),
    });
  };

  const updateSkill = (id: string, data: Partial<Skill>) => {
    updateCurrentResumeData({
      skills: skills.map((s) => (s.id === id ? { ...s, ...data } : s)),
    });
  };

  const technicalSkills = skills.filter((s) => s.category === 'technical');
  const softSkills = skills.filter((s) => s.category === 'soft');

  const getLevelColor = (level: SkillLevel) => {
    switch (level) {
      case 'expert': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'advanced': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'intermediate': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'beginner': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-5">
      {/* Technical Skills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5 shadow-premium"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <Wrench className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">{t('skills.technical', language)}</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addSkill('technical')}
            className="flex items-center gap-1 gradient-brand text-white rounded-xl px-3 py-1.5 text-xs font-medium"
          >
            <Plus className="h-3 w-3" />
            {t('skills.add', language)}
          </motion.button>
        </div>
        <div className="space-y-3">
          {technicalSkills.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3">{t('common.noData', language)}</p>
          )}
          {technicalSkills.map((skill) => (
            <SkillRow
              key={skill.id}
              skill={skill}
              language={language}
              isRtl={isRtl}
              levelLabels={levelLabels}
              getLevelColor={getLevelColor}
              onUpdate={updateSkill}
              onRemove={removeSkill}
            />
          ))}
        </div>
      </motion.div>

      {/* Soft Skills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-5 shadow-premium"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Wrench className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">{t('skills.soft', language)}</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addSkill('soft')}
            className="flex items-center gap-1 gradient-brand text-white rounded-xl px-3 py-1.5 text-xs font-medium"
          >
            <Plus className="h-3 w-3" />
            {t('skills.add', language)}
          </motion.button>
        </div>
        <div className="space-y-3">
          {softSkills.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3">{t('common.noData', language)}</p>
          )}
          {softSkills.map((skill) => (
            <SkillRow
              key={skill.id}
              skill={skill}
              language={language}
              isRtl={isRtl}
              levelLabels={levelLabels}
              getLevelColor={getLevelColor}
              onUpdate={updateSkill}
              onRemove={removeSkill}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SkillRow({
  skill,
  language,
  isRtl,
  levelLabels,
  getLevelColor,
  onUpdate,
  onRemove,
}: {
  skill: Skill;
  language: 'ar' | 'en';
  isRtl: boolean;
  levelLabels: Record<SkillLevel, string>;
  getLevelColor: (level: SkillLevel) => string;
  onUpdate: (id: string, data: Partial<Skill>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Input
          value={skill.name}
          onChange={(e) => onUpdate(skill.id, { name: e.target.value })}
          placeholder={t('skills.name', language)}
          dir={isRtl ? 'rtl' : 'ltr'}
          className={inputClass}
        />
      </div>
      <div className="w-32">
        <Select
          value={skill.level}
          onValueChange={(v) => onUpdate(skill.id, { level: v as SkillLevel })}
        >
          <SelectTrigger className="h-10 text-sm rounded-xl">{<SelectValue />}</SelectTrigger>
          <SelectContent>
            {(Object.keys(levelLabels) as SkillLevel[]).map((key) => (
              <SelectItem key={key} value={key}>{levelLabels[key]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 text-destructive hover:text-destructive rounded-xl"
        onClick={() => onRemove(skill.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
