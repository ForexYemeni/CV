'use client';

import { useAppStore, useCurrentResume } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Project, generateId } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, FolderKanban, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';

const inputClass = "rounded-xl border border-border/60 bg-white/50 dark:bg-white/5 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

export function ProjectsForm() {
  const language = useAppStore((s) => s.language);
  const resume = useCurrentResume();
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);
  const isRtl = language === 'ar';

  if (!resume) return null;

  const { projects } = resume.data;

  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: '',
      description: '',
      url: '',
      technologies: [],
    };
    updateCurrentResumeData({
      projects: [...projects, newProject],
    });
  };

  const removeProject = (id: string) => {
    updateCurrentResumeData({
      projects: projects.filter((p) => p.id !== id),
    });
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    updateCurrentResumeData({
      projects: projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t('section.projects', language)}</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addProject}
          className="flex items-center gap-1 gradient-brand text-white rounded-xl px-3 py-1.5 text-xs font-medium"
        >
          <Plus className="h-3 w-3" />
          {t('project.add', language)}
        </motion.button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FolderKanban className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t('common.noData', language)}</p>
          <Button variant="outline" size="sm" className="mt-3 rounded-xl" onClick={addProject}>
            <Plus className="h-3 w-3 me-1" />
            {t('project.add', language)}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            language={language}
            isRtl={isRtl}
            onUpdate={updateProject}
            onRemove={removeProject}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectItem({
  project,
  language,
  isRtl,
  onUpdate,
  onRemove,
}: {
  project: Project;
  language: 'ar' | 'en';
  isRtl: boolean;
  onUpdate: (id: string, data: Partial<Project>) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(!project.name);
  const [techInput, setTechInput] = useState('');

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !project.technologies.includes(tech)) {
      onUpdate(project.id, { technologies: [...project.technologies, tech] });
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    onUpdate(project.id, {
      technologies: project.technologies.filter((t) => t !== tech),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass rounded-2xl overflow-hidden shadow-premium',
        open && 'border-s-4 border-s-indigo-500'
      )}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-2 p-4 cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
              <FolderKanban className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 text-start">
              <p className="text-sm font-medium truncate">
                {project.name || (language === 'ar' ? 'اسم المشروع' : 'Project Name')}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {project.technologies.length > 0
                  ? project.technologies.slice(0, 3).join(', ') +
                    (project.technologies.length > 3 ? '...' : '')
                  : language === 'ar'
                  ? 'التقنيات المستخدمة'
                  : 'Technologies'}
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
              <div>
                <Label className="text-xs">{t('project.name', language)}</Label>
                <Input value={project.name} onChange={(e) => onUpdate(project.id, { name: e.target.value })} placeholder={language === 'ar' ? 'نظام إدارة المهام' : 'Task Management System'} dir={isRtl ? 'rtl' : 'ltr'} className={cn('mt-1', inputClass)} />
              </div>
              <div>
                <Label className="text-xs">{t('project.url', language)}</Label>
                <Input value={project.url} onChange={(e) => onUpdate(project.id, { url: e.target.value })} placeholder="https://github.com/..." dir="ltr" className={cn('mt-1', inputClass)} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">{t('project.description', language)}</Label>
                <Textarea value={project.description} onChange={(e) => onUpdate(project.id, { description: e.target.value })} placeholder={language === 'ar' ? 'نظام متكامل لإدارة المشاريع مع لوحة تحكم تفاعلية...' : 'A comprehensive project management system with interactive dashboard...'} dir={isRtl ? 'rtl' : 'ltr'} className="mt-1 rounded-xl border border-border/60 bg-white/50 dark:bg-white/5 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-20" />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">{t('project.technologies', language)}</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    placeholder="React, Node.js..."
                    dir="ltr"
                    className={cn('flex-1', inputClass)}
                  />
                  <Button variant="outline" onClick={addTech} className="h-10 px-3 rounded-xl">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-xs gap-1 py-0.5 px-2 rounded-lg"
                      >
                        {tech}
                        <button
                          onClick={() => removeTech(tech)}
                          className="hover:text-destructive"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive rounded-xl" onClick={() => onRemove(project.id)}>
                <Trash2 className="h-3 w-3 me-1" />
                {t('project.remove', language)}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}
