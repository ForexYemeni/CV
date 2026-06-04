'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Experience, generateId } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Plus,
  Trash2,
  ChevronDown,
  GripVertical,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function ExperienceForm() {
  const language = useAppStore((s) => s.language);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const resume = getCurrentResume();
  const isRtl = language === 'ar';

  if (!resume) return null;

  const { experience } = resume.data;

  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      order: experience.length,
    };
    updateCurrentResumeData({
      experience: [...experience, newExp],
    });
  };

  const removeExperience = (id: string) => {
    updateCurrentResumeData({
      experience: experience.filter((e) => e.id !== id),
    });
  };

  const updateExperience = (id: string, data: Partial<Experience>) => {
    updateCurrentResumeData({
      experience: experience.map((e) => (e.id === id ? { ...e, ...data } : e)),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = experience.findIndex((e) => e.id === active.id);
    const newIndex = experience.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(experience, oldIndex, newIndex).map((e, i) => ({
      ...e,
      order: i,
    }));
    updateCurrentResumeData({ experience: reordered });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t('section.experience', language)}</h3>
        <Button variant="outline" size="sm" onClick={addExperience}>
          <Plus className="h-3 w-3 me-1" />
          {t('experience.add', language)}
        </Button>
      </div>

      {experience.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t('common.noData', language)}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={addExperience}>
            <Plus className="h-3 w-3 me-1" />
            {t('experience.add', language)}
          </Button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={experience.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {experience.map((exp) => (
              <SortableExperienceItem
                key={exp.id}
                exp={exp}
                language={language}
                isRtl={isRtl}
                onUpdate={updateExperience}
                onRemove={removeExperience}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableExperienceItem({
  exp,
  language,
  isRtl,
  onUpdate,
  onRemove,
}: {
  exp: Experience;
  language: 'ar' | 'en';
  isRtl: boolean;
  onUpdate: (id: string, data: Partial<Experience>) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(!exp.company);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exp.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn('transition-shadow', isDragging && 'shadow-lg opacity-50 z-50')}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-2 p-3 cursor-pointer">
            <div
              role="button"
              tabIndex={0}
              className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-muted rounded"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 text-start">
              <p className="text-sm font-medium truncate">
                {exp.jobTitle || (language === 'ar' ? 'مسمى وظيفي' : 'Job Title')}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {exp.company || (language === 'ar' ? 'اسم الشركة' : 'Company Name')}
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
          <CardContent className="pt-0 pb-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">{t('experience.jobTitle', language)}</Label>
                <Input
                  value={exp.jobTitle}
                  onChange={(e) => onUpdate(exp.id, { jobTitle: e.target.value })}
                  placeholder={language === 'ar' ? 'مهندس برمجيات' : 'Software Engineer'}
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">{t('experience.company', language)}</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => onUpdate(exp.id, { company: e.target.value })}
                  placeholder={language === 'ar' ? 'شركة التقنية' : 'Tech Company'}
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">{t('experience.startDate', language)}</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => onUpdate(exp.id, { startDate: e.target.value })}
                  className="mt-1 h-9 text-sm"
                  dir="ltr"
                />
              </div>
              <div>
                <Label className="text-xs">{t('experience.endDate', language)}</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => onUpdate(exp.id, { endDate: e.target.value })}
                  disabled={exp.current}
                  className="mt-1 h-9 text-sm"
                  dir="ltr"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) =>
                    onUpdate(exp.id, { current: !!checked, endDate: checked ? '' : exp.endDate })
                  }
                />
                <Label htmlFor={`current-${exp.id}`} className="text-xs cursor-pointer">
                  {t('experience.current', language)}
                </Label>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">{t('experience.description', language)}</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => onUpdate(exp.id, { description: e.target.value })}
                  placeholder={
                    language === 'ar'
                      ? 'صممت وطورت نظام إدارة المحتوى باستخدام React و Node.js...'
                      : 'Designed and developed a CMS using React and Node.js...'
                  }
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="mt-1 min-h-20 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onRemove(exp.id)}
              >
                <Trash2 className="h-3 w-3 me-1" />
                {t('experience.remove', language)}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
