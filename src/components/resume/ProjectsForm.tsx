'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Project, generateId } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, FolderKanban, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function ProjectsForm() {
  const language = useAppStore((s) => s.language);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);

  const resume = getCurrentResume();
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
        <Button variant="outline" size="sm" onClick={addProject}>
          <Plus className="h-3 w-3 me-1" />
          {t('project.add', language)}
        </Button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FolderKanban className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t('common.noData', language)}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={addProject}>
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
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-2 p-3 cursor-pointer">
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
          <CardContent className="pt-0 pb-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">{t('project.name', language)}</Label>
                <Input
                  value={project.name}
                  onChange={(e) => onUpdate(project.id, { name: e.target.value })}
                  placeholder={language === 'ar' ? 'نظام إدارة المهام' : 'Task Management System'}
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">{t('project.url', language)}</Label>
                <Input
                  value={project.url}
                  onChange={(e) => onUpdate(project.id, { url: e.target.value })}
                  placeholder="https://github.com/..."
                  dir="ltr"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">{t('project.description', language)}</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => onUpdate(project.id, { description: e.target.value })}
                  placeholder={
                    language === 'ar'
                      ? 'نظام متكامل لإدارة المشاريع مع لوحة تحكم تفاعلية...'
                      : 'A comprehensive project management system with interactive dashboard...'
                  }
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="mt-1 min-h-20 text-sm"
                />
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
                    placeholder={language === 'ar' ? 'React, Node.js...' : 'React, Node.js...'}
                    dir="ltr"
                    className="h-9 text-sm flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={addTech} className="h-9 px-3">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-xs gap-1 py-0.5 px-2"
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
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onRemove(project.id)}
              >
                <Trash2 className="h-3 w-3 me-1" />
                {t('project.remove', language)}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
