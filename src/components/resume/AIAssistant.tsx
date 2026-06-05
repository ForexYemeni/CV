'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, useCurrentResume } from '@/lib/store';
import { t } from '@/lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles,
  FileText,
  Briefcase,
  Wrench,
  Search,
  ClipboardCopy,
  Check,
  Loader2,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AI_ACTIONS = [
  {
    id: 'suggestSummary',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    key: 'ai.suggestSummary',
  },
  {
    id: 'improveDescription',
    icon: Briefcase,
    gradient: 'from-purple-500 to-pink-500',
    key: 'ai.improveDescription',
  },
  {
    id: 'suggestSkills',
    icon: Wrench,
    gradient: 'from-green-500 to-emerald-500',
    key: 'ai.suggestSkills',
  },
  {
    id: 'atsKeywords',
    icon: Search,
    gradient: 'from-amber-500 to-orange-500',
    key: 'ai.atsKeywords',
  },
] as const;

export function AIAssistant({ open, onOpenChange }: AIAssistantProps) {
  const language = useAppStore((s) => s.language);
  const resume = useCurrentResume();
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);
  const aiLoading = useAppStore((s) => s.aiLoading);
  const setAiLoading = useAppStore((s) => s.setAiLoading);

  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const isRtl = language === 'ar';

  const handleAction = async (actionId: string) => {
    if (!resume) return;
    setSelectedAction(actionId);
    setAiLoading(true);
    setResult('');

    try {
      const context: Record<string, string> = {
        language: resume.language,
        description: resume.data.experience
          .map((e) => e.description)
          .filter(Boolean)
          .join('\n'),
        resumeData: JSON.stringify(resume.data, null, 2),
      };

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionId,
          context,
          jobTitle: resume.data.personalInfo.jobTitle || 'Professional',
        }),
      });

      const data = await response.json();
      if (data.result) {
        setResult(data.result);
      } else if (data.error) {
        setResult(
          language === 'ar'
            ? `خطأ: ${data.error}`
            : `Error: ${data.error}`
        );
      }
    } catch {
      setResult(
        language === 'ar'
          ? 'حدث خطأ أثناء الاتصال بالمساعد الذكي'
          : 'An error occurred while connecting to AI assistant'
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplySummary = () => {
    if (!resume || !result) return;
    updateCurrentResumeData({
      personalInfo: { ...resume.data.personalInfo, summary: result },
    });
    setResult('');
  };

  const handleApplySkills = () => {
    if (!resume || !result) return;
    const skills = result
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const newSkills = skills.map((skill, i) => ({
      id: `ai-${Date.now()}-${i}`,
      name: skill,
      level: 'intermediate' as const,
      category: i < 10 ? 'technical' : 'soft',
    }));
    updateCurrentResumeData({
      skills: [...resume.data.skills, ...newSkills],
    });
    setResult('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] glass-strong border-border/30" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Gradient header */}
        <div className="gradient-brand-accent rounded-t-xl -m-6 mb-4 p-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold">
              {t('ai.title', language)}
            </DialogTitle>
            <p className="text-white/70 text-xs mt-0.5">
              {language === 'ar' ? 'اختر ميزة للبدء' : 'Choose a feature to start'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Action cards */}
          <div className="grid grid-cols-2 gap-3">
            {AI_ACTIONS.map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAction(action.id)}
                disabled={aiLoading}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center',
                  selectedAction === action.id
                    ? 'border-primary bg-primary/5 shadow-glow'
                    : 'border-border/50 hover:border-primary/30 hover:shadow-premium'
                )}
              >
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white', action.gradient)}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">
                  {t(action.key, language)}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Loading state */}
          <AnimatePresence>
            {aiLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col items-center gap-3 py-6"
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-full gradient-brand-accent flex items-center justify-center animate-pulse">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {t('ai.loading', language)}
                </p>
                <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-animated rounded-full" style={{ width: '60%' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          {result && !aiLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{t('ai.result', language)}</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="rounded-xl h-8">
                    {copied ? (
                      <Check className="h-3 w-3 me-1 text-green-500" />
                    ) : (
                      <ClipboardCopy className="h-3 w-3 me-1" />
                    )}
                    {copied
                      ? language === 'ar' ? 'تم النسخ' : 'Copied'
                      : language === 'ar' ? 'نسخ' : 'Copy'}
                  </Button>
                  {(selectedAction === 'suggestSummary') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplySummary}
                      className="text-primary border-primary/30 hover:bg-primary/5 rounded-xl h-8"
                    >
                      {language === 'ar' ? 'تطبيق كملخص' : 'Apply as Summary'}
                    </Button>
                  )}
                  {(selectedAction === 'suggestSkills' || selectedAction === 'atsKeywords') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplySkills}
                      className="text-primary border-primary/30 hover:bg-primary/5 rounded-xl h-8"
                    >
                      {language === 'ar' ? 'إضافة كمهارات' : 'Add as Skills'}
                    </Button>
                  )}
                </div>
              </div>
              <ScrollArea className="max-h-64">
                <div className="rounded-xl bg-muted/50 p-4 text-sm whitespace-pre-wrap border border-border/30">
                  {result}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
