'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Skill, generateId, SkillLevel, SKILL_LEVEL_LABELS } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SkillsForm() {
  const language = useAppStore((s) => s.language);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);

  const resume = getCurrentResume();
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
      case 'expert': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'advanced': return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300';
      case 'intermediate': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'beginner': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Technical Skills */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {t('skills.technical', language)}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => addSkill('technical')}>
              <Plus className="h-3 w-3 me-1" />
              {t('skills.add', language)}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {technicalSkills.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3">
              {t('common.noData', language)}
            </p>
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
        </CardContent>
      </Card>

      {/* Soft Skills */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {t('skills.soft', language)}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => addSkill('soft')}>
              <Plus className="h-3 w-3 me-1" />
              {t('skills.add', language)}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {softSkills.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3">
              {t('common.noData', language)}
            </p>
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
        </CardContent>
      </Card>
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
          className="h-9 text-sm"
        />
      </div>
      <div className="w-32">
        <Select
          value={skill.level}
          onValueChange={(v) => onUpdate(skill.id, { level: v as SkillLevel })}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(levelLabels) as SkillLevel[]).map((key) => (
              <SelectItem key={key} value={key}>
                {levelLabels[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
        onClick={() => onRemove(skill.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
