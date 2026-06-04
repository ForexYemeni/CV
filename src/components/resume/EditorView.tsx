'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { TEMPLATES, FONT_OPTIONS, FONT_SIZE_OPTIONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  Globe2,
  FolderKanban,
  ArrowLeft,
  Eye,
  EyeOff,
  Download,
  Sparkles,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { CertificationsForm } from './CertificationsForm';
import { LanguagesForm } from './LanguagesForm';
import { ProjectsForm } from './ProjectsForm';
import { ResumePreview } from './ResumePreview';
import { TemplateSelector } from './TemplateSelector';
import { ExportDialog } from './ExportDialog';
import { AIAssistant } from './AIAssistant';
import { useState } from 'react';

const SECTIONS = [
  { id: 'personalInfo', icon: User },
  { id: 'experience', icon: Briefcase },
  { id: 'education', icon: GraduationCap },
  { id: 'skills', icon: Wrench },
  { id: 'certifications', icon: Award },
  { id: 'languages', icon: Globe2 },
  { id: 'projects', icon: FolderKanban },
];

export function EditorView() {
  const language = useAppStore((s) => s.language);
  const currentResumeId = useAppStore((s) => s.currentResumeId);
  const currentView = useAppStore((s) => s.currentView);
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const activeSection = useAppStore((s) => s.activeSection);
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const showPreview = useAppStore((s) => s.showPreview);
  const setShowPreview = useAppStore((s) => s.setShowPreview);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);
  const updateCurrentResumeSettings = useAppStore((s) => s.updateCurrentResumeSettings);

  const [exportOpen, setExportOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const isRtl = language === 'ar';

  const resume = getCurrentResume();

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="text-center">
          <p className="text-muted-foreground">{t('common.noData', language)}</p>
          <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => setCurrentView('dashboard')}>
            {t('common.back', language)}
          </Button>
        </div>
      </div>
    );
  }

  const getSectionLabel = (id: string) => {
    const keyMap: Record<string, string> = {
      personalInfo: 'section.personalInfo',
      experience: 'section.experience',
      education: 'section.education',
      skills: 'section.skills',
      certifications: 'section.certifications',
      languages: 'section.languages',
      projects: 'section.projects',
    };
    return t(keyMap[id] || id, language);
  };

  const handleColorChange = (color: string) => {
    updateCurrentResumeSettings({ primaryColor: color });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Editor Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-background/95">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView('dashboard')}
        >
          <ArrowLeft className={cn('h-4 w-4', isRtl ? 'ms-1 rotate-180' : 'me-1')} />
          {t('common.back', language)}
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <span className="text-sm font-medium truncate max-w-48">
          {resume.title}
        </span>
        <div className="flex-1" />

        {/* Color Picker */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {['#059669', '#0d9488', '#2563eb', '#7c3aed', '#be185d', '#b45309', '#18181b', '#374151'].map((color) => (
              <button
                key={color}
                className={cn(
                  'w-5 h-5 rounded-full border-2 transition-all hover:scale-110',
                  resume.primaryColor === color ? 'border-foreground' : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </div>
        <Separator orientation="vertical" className="h-6 hidden sm:block" />

        {/* Font selector */}
        <div className="hidden md:block">
          <Select
            value={resume.fontFamily}
            onValueChange={(v) => updateCurrentResumeSettings({ fontFamily: v })}
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {language === 'ar' ? f.labelAr : f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font size */}
        <div className="hidden md:block">
          <Select
            value={resume.fontSize}
            onValueChange={(v) => updateCurrentResumeSettings({ fontSize: v })}
          >
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZE_OPTIONS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {language === 'ar' ? f.labelAr : f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <Button variant="ghost" size="icon" onClick={() => setAiOpen(true)}>
          <Sparkles className="h-4 w-4 text-emerald-600" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowPreview(!showPreview)} className="md:hidden">
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setExportOpen(true)}>
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel */}
        <div
          className={cn(
            'flex-1 overflow-hidden',
            showPreview ? 'hidden md:block' : 'block'
          )}
        >
          <Tabs
            value={activeSection}
            onValueChange={setActiveSection}
            className="h-full flex flex-col"
          >
            <div className="border-b px-2">
              <ScrollArea className="w-full" orientation="horizontal">
                <TabsList className="h-10 bg-transparent gap-0.5 p-1">
                  {SECTIONS.map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="text-xs gap-1 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-300"
                    >
                      <section.icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{getSectionLabel(section.id)}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 md:p-6 max-w-3xl mx-auto">
                <TabsContent value="personalInfo" className="mt-0">
                  <PersonalInfoForm />
                </TabsContent>
                <TabsContent value="experience" className="mt-0">
                  <ExperienceForm />
                </TabsContent>
                <TabsContent value="education" className="mt-0">
                  <EducationForm />
                </TabsContent>
                <TabsContent value="skills" className="mt-0">
                  <SkillsForm />
                </TabsContent>
                <TabsContent value="certifications" className="mt-0">
                  <CertificationsForm />
                </TabsContent>
                <TabsContent value="languages" className="mt-0">
                  <LanguagesForm />
                </TabsContent>
                <TabsContent value="projects" className="mt-0">
                  <ProjectsForm />
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div
          className={cn(
            'w-1/2 border-s bg-muted/30 overflow-hidden',
            !showPreview ? 'hidden md:block' : 'block',
            isRtl ? 'border-e' : 'border-s'
          )}
        >
          <ResumePreview />
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />

      {/* AI Assistant */}
      <AIAssistant open={aiOpen} onOpenChange={setAiOpen} />
    </div>
  );
}
