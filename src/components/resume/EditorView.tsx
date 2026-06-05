'use client';

import { useAppStore, useCurrentResume } from '@/lib/store';
import { t } from '@/lib/i18n';
import { TEMPLATES, FONT_OPTIONS, FONT_SIZE_OPTIONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Save,
  Check,
  FileUser,
  Wand2,
  LayoutTemplate,
  Lock,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SECTIONS = [
  { id: 'personalInfo', icon: User, gradient: 'from-blue-500 to-cyan-500' },
  { id: 'experience', icon: Briefcase, gradient: 'from-purple-500 to-pink-500' },
  { id: 'education', icon: GraduationCap, gradient: 'from-amber-500 to-orange-500' },
  { id: 'skills', icon: Wrench, gradient: 'from-green-500 to-emerald-500' },
  { id: 'certifications', icon: Award, gradient: 'from-red-500 to-rose-500' },
  { id: 'languages', icon: Globe2, gradient: 'from-cyan-500 to-teal-500' },
  { id: 'projects', icon: FolderKanban, gradient: 'from-indigo-500 to-violet-500' },
];

export function EditorView() {
  const language = useAppStore((s) => s.language);
  const currentResumeId = useAppStore((s) => s.currentResumeId);
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
  const fillWithSampleData = useAppStore((s) => s.fillWithSampleData);
  const isRtl = language === 'ar';

  const hasData = useMemo(() => {
    if (!resume) return false;
    const d = resume.data;
    return !!(d.personalInfo.fullName || d.experience.length > 0 || d.education.length > 0 || d.skills.length > 0);
  }, [resume]);

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
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
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Editor Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className={cn('h-4 w-4', isRtl && 'rotate-180')} />
          <span className="hidden sm:inline">{t('common.back', language)}</span>
        </motion.button>

        <div className="h-5 w-px bg-border" />

        {/* Resume Title */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: resume.primaryColor }} />
          <span className="text-sm font-medium truncate max-w-32 lg:max-w-48">
            {resume.title}
          </span>
        </div>

        <div className="flex-1" />

        {/* Color Picker */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {['#0ea5e9', '#2563eb', '#059669', '#0d9488', '#7c3aed', '#be185d', '#b45309', '#18181b'].map((color) => (
              <button
                key={color}
                className={cn(
                  'w-5 h-5 rounded-full border-2 transition-all hover:scale-110',
                  resume.primaryColor === color ? 'border-foreground ring-2 ring-primary/30' : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </div>
        <div className="h-5 w-px bg-border hidden sm:block" />

        {/* Font selector */}
        <div className="hidden md:block">
          <Select
            value={resume.fontFamily}
            onValueChange={(v) => updateCurrentResumeSettings({ fontFamily: v })}
          >
            <SelectTrigger className="w-28 h-8 text-xs rounded-xl">
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
        <div className="hidden lg:block">
          <Select
            value={resume.fontSize}
            onValueChange={(v) => updateCurrentResumeSettings({ fontSize: v })}
          >
            <SelectTrigger className="w-24 h-8 text-xs rounded-xl">
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

        {/* Template selector */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTemplateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <LayoutTemplate className="h-4 w-4" />
          <span className="hidden lg:inline">{language === 'ar' ? 'القوالب' : 'Templates'}</span>
        </motion.button>

        {/* Fill with sample data */}
        {!hasData && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fillWithSampleData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <Wand2 className="h-4 w-4" />
            <span className="hidden lg:inline">{language === 'ar' ? 'تعبة تلقائية' : 'Auto Fill'}</span>
          </motion.button>
        )}

        {/* AI button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAiOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium gradient-brand-accent text-white hover:shadow-md transition-shadow"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden lg:inline">{language === 'ar' ? 'ذكاء اصطناعي' : 'AI'}</span>
        </motion.button>

        {/* Preview toggle - ALWAYS visible */}
        <Button
          variant={showPreview ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className={cn(
            'rounded-xl h-8 gap-1.5',
            showPreview && 'gradient-brand text-white'
          )}
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="hidden sm:inline">
            {showPreview
              ? (language === 'ar' ? 'المحرر' : 'Editor')
              : (language === 'ar' ? 'معاينة' : 'Preview')
            }
          </span>
        </Button>

        {/* Export button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExportOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="hidden lg:inline">{language === 'ar' ? 'تصدير' : 'Export'}</span>
        </motion.button>
      </div>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel */}
        <div
          className={cn(
            'w-full md:w-[45%] overflow-hidden border-e',
            showPreview ? 'hidden md:block' : 'block'
          )}
        >
          {/* Section tabs */}
          <div className="border-b px-2 py-2 bg-muted/30">
            <ScrollArea orientation="horizontal" className="w-full">
              <div className="flex gap-1 pb-1">
                {SECTIONS.map((section) => (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap',
                      activeSection === section.id
                        ? 'gradient-brand text-white shadow-md'
                        : 'hover:bg-muted/50 text-muted-foreground'
                    )}
                  >
                    <section.icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{getSectionLabel(section.id)}</span>
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 md:p-6 max-w-3xl mx-auto">
              {/* Section Header */}
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: isRtl ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white',
                  SECTIONS.find(s => s.id === activeSection)?.gradient || 'from-blue-500 to-cyan-500'
                )}>
                  {(() => {
                    const SectionIcon = SECTIONS.find(s => s.id === activeSection)?.icon || User;
                    return <SectionIcon className="h-5 w-5" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{getSectionLabel(activeSection)}</h3>
                </div>
                <div className="flex-1" />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAiOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium gradient-brand-accent text-white"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{language === 'ar' ? 'اقتراح ذكي' : 'AI Suggest'}</span>
                </motion.button>
              </motion.div>

              {activeSection === 'personalInfo' && <PersonalInfoForm />}
              {activeSection === 'experience' && <ExperienceForm />}
              {activeSection === 'education' && <EducationForm />}
              {activeSection === 'skills' && <SkillsForm />}
              {activeSection === 'certifications' && <CertificationsForm />}
              {activeSection === 'languages' && <LanguagesForm />}
              {activeSection === 'projects' && <ProjectsForm />}
            </div>
          </ScrollArea>
        </div>

        {/* Preview Panel */}
        <div
          className={cn(
            'w-full md:w-[55%] bg-muted/20 overflow-hidden',
            !showPreview ? 'hidden md:block' : 'block'
          )}
        >
          <ResumePreview />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t bg-muted/20 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>{language === 'ar' ? 'حفظ تلقائي' : 'Auto-saved'}</span>
        </div>
        <span>{resume.data.personalInfo.fullName || (language === 'ar' ? 'بدون عنوان' : 'Untitled')}</span>
      </div>

      {/* Dialogs */}
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
      <AIAssistant open={aiOpen} onOpenChange={setAiOpen} />

      {/* Template Selector Dialog */}
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

/** Template Selector Dialog for choosing templates from within the editor */
function TemplateSelectorDialog({
  open,
  onOpenChange,
  language,
  currentTemplate,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: 'ar' | 'en';
  currentTemplate: string;
  onSelect: (templateId: string) => void;
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand text-white">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            {language === 'ar' ? 'اختر قالب' : 'Choose Template'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-2">
          <div className="space-y-6 py-2">
            {categories.map((category) => (
              <div key={category}>
                <p className="text-sm font-semibold text-muted-foreground mb-3">
                  {categoryLabels[category] || category}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {TEMPLATES.filter((t) => t.category === category).map((tmpl) => {
                    const isActive = currentTemplate === tmpl.id;
                    return (
                      <motion.button
                        key={tmpl.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(tmpl.id)}
                        className={cn(
                          'relative rounded-2xl overflow-hidden transition-all text-start border',
                          isActive
                            ? 'border-primary ring-2 ring-primary/30 shadow-glow'
                            : 'border-border/50 hover:border-primary/30 shadow-premium hover:shadow-glow'
                        )}
                      >
                        {/* Real template preview */}
                        <div className="aspect-[3/4] relative overflow-hidden bg-white">
                          <MiniTemplatePreview
                            templateId={tmpl.id}
                            primaryColor={tmpl.colors[0]}
                            language={language}
                            width={240}
                            height={320}
                          />
                          {isActive && (
                            <div className="absolute top-2 end-2 flex h-6 w-6 items-center justify-center rounded-full gradient-brand text-white">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                          {tmpl.isPremium && (
                            <div className="absolute top-2 start-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-[9px] font-bold">
                              <Lock className="h-2.5 w-2.5" />
                              PRO
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="p-2.5">
                          <p className="text-xs font-semibold truncate">
                            {language === 'ar' ? tmpl.nameAr : tmpl.name}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {tmpl.colors.slice(0, 3).map((color) => (
                              <div
                                key={color}
                                className="w-3 h-3 rounded-full border border-border/30"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
