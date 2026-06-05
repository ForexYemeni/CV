'use client';

import { useAppStore, useCurrentResume } from '@/lib/store';
import { t } from '@/lib/i18n';
import { TEMPLATES, FONT_OPTIONS, FONT_SIZE_OPTIONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  User, Briefcase, GraduationCap, Wrench, Award, Globe2, FolderKanban,
  ArrowLeft, Eye, EyeOff, Download, Sparkles, LayoutTemplate,
  Wand2, Lock, Check, Settings2,
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
import { MiniTemplatePreview } from './MiniTemplatePreview';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';

const SECTIONS = [
  { id: 'personalInfo', icon: User, gradient: 'from-blue-500 to-cyan-500', labelAr: 'شخصي', labelEn: 'Personal' },
  { id: 'experience', icon: Briefcase, gradient: 'from-purple-500 to-pink-500', labelAr: 'خبرات', labelEn: 'Exp' },
  { id: 'education', icon: GraduationCap, gradient: 'from-amber-500 to-orange-500', labelAr: 'تعليم', labelEn: 'Edu' },
  { id: 'skills', icon: Wrench, gradient: 'from-green-500 to-emerald-500', labelAr: 'مهارات', labelEn: 'Skills' },
  { id: 'certifications', icon: Award, gradient: 'from-red-500 to-rose-500', labelAr: 'شهادات', labelEn: 'Certs' },
  { id: 'languages', icon: Globe2, gradient: 'from-cyan-500 to-teal-500', labelAr: 'لغات', labelEn: 'Lang' },
  { id: 'projects', icon: FolderKanban, gradient: 'from-indigo-500 to-violet-500', labelAr: 'مشاريع', labelEn: 'Projects' },
];

export function EditorView() {
  const language = useAppStore((s) => s.language);
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const activeSection = useAppStore((s) => s.activeSection);
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const showPreview = useAppStore((s) => s.showPreview);
  const setShowPreview = useAppStore((s) => s.setShowPreview);
  const resume = useCurrentResume();
  const updateCurrentResumeSettings = useAppStore((s) => s.updateCurrentResumeSettings);

  const [exportOpen, setExportOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fillWithSampleData = useAppStore((s) => s.fillWithSampleData);
  const isRtl = language === 'ar';

  const hasData = useMemo(() => {
    if (!resume) return false;
    const d = resume.data;
    return !!(d.personalInfo.fullName || d.experience.length > 0 || d.education.length > 0 || d.skills.length > 0);
  }, [resume]);

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">{t('common.noData', language)}</p>
          <Button className="mt-4 gradient-brand text-white rounded-xl" onClick={() => setCurrentView('dashboard')}>
            {t('common.back', language)}
          </Button>
        </div>
      </div>
    );
  }

  const getSectionLabel = (id: string) => {
    const section = SECTIONS.find(s => s.id === id);
    return language === 'ar' ? (section?.labelAr || id) : (section?.labelEn || id);
  };

  const getFullSectionLabel = (id: string) => {
    const keyMap: Record<string, string> = {
      personalInfo: 'section.personalInfo', experience: 'section.experience',
      education: 'section.education', skills: 'section.skills',
      certifications: 'section.certifications', languages: 'section.languages',
      projects: 'section.projects',
    };
    return t(keyMap[id] || id, language);
  };

  const handleColorChange = (color: string) => {
    updateCurrentResumeSettings({ primaryColor: color });
  };

  return (
    <div className="flex flex-col h-full">
      {/* ========= Editor Toolbar - Mobile Compact ========= */}
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg overflow-x-auto scrollbar-none shrink-0">
        {/* Back */}
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs hover:bg-muted/50 transition-colors shrink-0"
        >
          <ArrowLeft className={cn('h-4 w-4', isRtl && 'rotate-180')} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-1.5 min-w-0 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: resume.primaryColor }} />
          <span className="text-xs font-medium truncate max-w-20 sm:max-w-32 lg:max-w-48">{resume.title}</span>
        </div>

        <div className="flex-1" />

        {/* Settings Popover */}
        <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs hover:bg-muted/50 transition-colors shrink-0">
              <Settings2 className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4 space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
            <div>
              <p className="text-xs font-medium mb-2">{language === 'ar' ? 'اللون' : 'Color'}</p>
              <div className="flex flex-wrap gap-2">
                {['#0ea5e9', '#2563eb', '#059669', '#0d9488', '#7c3aed', '#be185d', '#b45309', '#18181b'].map((color) => (
                  <button
                    key={color}
                    className={cn(
                      'w-7 h-7 rounded-full border-2 transition-all hover:scale-110',
                      resume.primaryColor === color ? 'border-foreground ring-2 ring-primary/30' : 'border-transparent'
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-2">{language === 'ar' ? 'الخط' : 'Font'}</p>
              <Select value={resume.fontFamily} onValueChange={(v) => updateCurrentResumeSettings({ fontFamily: v })}>
                <SelectTrigger className="w-full h-8 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{language === 'ar' ? f.labelAr : f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs font-medium mb-2">{language === 'ar' ? 'الحجم' : 'Size'}</p>
              <Select value={resume.fontSize} onValueChange={(v) => updateCurrentResumeSettings({ fontSize: v })}>
                <SelectTrigger className="w-full h-8 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_SIZE_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{language === 'ar' ? f.labelAr : f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Template */}
        <button
          onClick={() => setTemplateOpen(true)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs hover:bg-muted/50 transition-colors shrink-0"
        >
          <LayoutTemplate className="h-4 w-4" />
          <span className="hidden md:inline">{language === 'ar' ? 'القوالب' : 'Templates'}</span>
        </button>

        {/* Auto Fill */}
        {!hasData && (
          <button
            onClick={fillWithSampleData}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0"
          >
            <Wand2 className="h-3.5 w-3.5" />
          </button>
        )}

        {/* AI */}
        <button
          onClick={() => setAiOpen(true)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs gradient-brand-accent text-white shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{language === 'ar' ? 'ذكاء' : 'AI'}</span>
        </button>

        {/* Preview toggle */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0',
            showPreview ? 'gradient-brand text-white' : 'hover:bg-muted/50'
          )}
        >
          {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">
            {showPreview ? (language === 'ar' ? 'تعديل' : 'Edit') : (language === 'ar' ? 'معاينة' : 'View')}
          </span>
        </button>

        {/* Export */}
        <button
          onClick={() => setExportOpen(true)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs hover:bg-muted/50 transition-colors shrink-0"
        >
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">{language === 'ar' ? 'تصدير' : 'Export'}</span>
        </button>
      </div>

      {/* ========= Editor Body ========= */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Form Panel */}
        <div
          className={cn(
            'w-full md:w-[45%] flex flex-col min-h-0 border-e',
            showPreview ? 'hidden md:flex' : 'flex'
          )}
        >
          {/* Section tabs */}
          <div className="border-b px-1.5 sm:px-2 py-1.5 sm:py-2 bg-muted/30 shrink-0">
            <div className="flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-none -webkit-overflow-scrolling-touch">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap shrink-0',
                    activeSection === section.id
                      ? 'gradient-brand text-white shadow-sm sm:shadow-md'
                      : 'hover:bg-muted/50 text-muted-foreground'
                  )}
                >
                  <section.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{getSectionLabel(section.id)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form content - using native scroll for mobile compatibility */}
          <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch overscroll-y-contain custom-scrollbar">
            <div className="p-3 sm:p-4 md:p-6 max-w-3xl mx-auto">
              {/* Section Header */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className={cn(
                  'flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br text-white',
                  SECTIONS.find(s => s.id === activeSection)?.gradient || 'from-blue-500 to-cyan-500'
                )}>
                  {(() => {
                    const SectionIcon = SECTIONS.find(s => s.id === activeSection)?.icon || User;
                    return <SectionIcon className="h-4 w-4 sm:h-5 sm:w-5" />;
                  })()}
                </div>
                <h3 className="font-semibold text-sm sm:text-lg">{getFullSectionLabel(activeSection)}</h3>
                <div className="flex-1" />
                <button
                  onClick={() => setAiOpen(true)}
                  className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium gradient-brand-accent text-white"
                >
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden sm:inline">{language === 'ar' ? 'اقتراح' : 'AI'}</span>
                </button>
              </div>

              {activeSection === 'personalInfo' && <PersonalInfoForm />}
              {activeSection === 'experience' && <ExperienceForm />}
              {activeSection === 'education' && <EducationForm />}
              {activeSection === 'skills' && <SkillsForm />}
              {activeSection === 'certifications' && <CertificationsForm />}
              {activeSection === 'languages' && <LanguagesForm />}
              {activeSection === 'projects' && <ProjectsForm />}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div
          className={cn(
            'w-full md:w-[55%] bg-muted/20 flex flex-col min-h-0',
            !showPreview ? 'hidden md:flex' : 'flex'
          )}
        >
          <ResumePreview />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-1 sm:py-1.5 border-t bg-muted/20 text-[10px] sm:text-xs text-muted-foreground shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500 animate-pulse" />
          <span>{language === 'ar' ? 'حفظ تلقائي' : 'Auto-saved'}</span>
        </div>
        <span className="truncate max-w-40 sm:max-w-none">{resume.data.personalInfo.fullName || (language === 'ar' ? 'بدون عنوان' : 'Untitled')}</span>
      </div>

      {/* Dialogs */}
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
      <AIAssistant open={aiOpen} onOpenChange={setAiOpen} />

      {templateOpen && (
        <TemplateSelectorDialog
          open={templateOpen}
          onOpenChange={setTemplateOpen}
          language={language}
          currentTemplate={resume.template}
          onSelect={(templateId) => {
            const tmplInfo = TEMPLATES.find((t) => t.id === templateId);
            updateCurrentResumeSettings({
              template: templateId,
              primaryColor: tmplInfo?.colors?.[0] || resume.primaryColor,
            });
            setTemplateOpen(false);
          }}
        />
      )}
    </div>
  );
}

function TemplateSelectorDialog({ open, onOpenChange, language, currentTemplate, onSelect }: {
  open: boolean; onOpenChange: (open: boolean) => void;
  language: 'ar' | 'en'; currentTemplate: string; onSelect: (templateId: string) => void;
}) {
  const categories = [...new Set(TEMPLATES.map((t) => t.category))];
  const categoryLabels: Record<string, string> = {
    professional: language === 'ar' ? 'احترافي' : 'Professional',
    creative: language === 'ar' ? 'إبداعي' : 'Creative',
    minimal: language === 'ar' ? 'بسيط' : 'Minimal',
    industry: language === 'ar' ? 'صناعي' : 'Industry',
    academic: language === 'ar' ? 'أكاديمي' : 'Academic',
    premium: language === 'ar' ? 'فاخر' : 'Premium',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] glass-strong border-border/30" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl gradient-brand text-white">
              <LayoutTemplate className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            {language === 'ar' ? 'اختر قالب' : 'Choose Template'}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          <div className="space-y-6 py-2">
            {categories.map((category) => (
              <div key={category}>
                <p className="text-sm font-semibold text-muted-foreground mb-3">{categoryLabels[category] || category}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {TEMPLATES.filter((t) => t.category === category).map((tmpl) => {
                    const isActive = currentTemplate === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        onClick={() => onSelect(tmpl.id)}
                        className={cn(
                          'relative rounded-xl sm:rounded-2xl overflow-hidden transition-all text-start border',
                          isActive
                            ? 'border-primary ring-2 ring-primary/30 shadow-glow'
                            : 'border-border/50 hover:border-primary/30'
                        )}
                      >
                        <div className="aspect-[3/4] relative overflow-hidden bg-white">
                          <MiniTemplatePreview templateId={tmpl.id} primaryColor={tmpl.colors[0]} language={language} width={240} height={320} />
                          {isActive && (
                            <div className="absolute top-1.5 end-1.5 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full gradient-brand text-white">
                              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          )}
                          {tmpl.isPremium && (
                            <div className="absolute top-1.5 start-1.5 flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-[8px] sm:text-[9px] font-bold">
                              <Lock className="h-2 w-2 sm:h-2.5 sm:w-2.5" />PRO
                            </div>
                          )}
                        </div>
                        <div className="p-2 sm:p-2.5">
                          <p className="text-[10px] sm:text-xs font-semibold truncate">{language === 'ar' ? tmpl.nameAr : tmpl.name}</p>
                          <div className="flex gap-1 mt-1">
                            {tmpl.colors.slice(0, 3).map((color) => (
                              <div key={color} className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-border/30" style={{ backgroundColor: color }} />
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
