'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  FileText,
  Briefcase,
  Wrench,
  Search,
  ClipboardCopy,
  Check,
  Loader2,
  X,
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
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    id: 'improveDescription',
    icon: Briefcase,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
  },
  {
    id: 'suggestSkills',
    icon: Wrench,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    id: 'atsKeywords',
    icon: Search,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
  },
] as const;

export function AIAssistant({ open, onOpenChange }: AIAssistantProps) {
  const language = useAppStore((s) => s.language);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);
  const aiLoading = useAppStore((s) => s.aiLoading);
  const setAiLoading = useAppStore((s) => s.setAiLoading);

  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const isRtl = language === 'ar';

  const resume = getCurrentResume();

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
      <DialogContent className="sm:max-w-lg max-h-[85vh]" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            {t('ai.title', language)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            {AI_ACTIONS.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className={cn(
                  'h-auto py-3 flex flex-col items-center gap-2 text-center',
                  selectedAction === action.id && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                )}
                onClick={() => handleAction(action.id)}
                disabled={aiLoading}
              >
                <div className={cn('p-2 rounded-lg', action.bgColor)}>
                  <action.icon className={cn('h-4 w-4', action.color)} />
                </div>
                <span className="text-xs">
                  {t(`ai.${action.id}`, language)}
                </span>
              </Button>
            ))}
          </div>

          {/* Loading state */}
          {aiLoading && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm text-muted-foreground">
                {t('ai.loading', language)}
              </p>
            </div>
          )}

          {/* Result */}
          {result && !aiLoading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{t('ai.result', language)}</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-3 w-3 me-1" />
                    ) : (
                      <ClipboardCopy className="h-3 w-3 me-1" />
                    )}
                    {copied
                      ? language === 'ar'
                        ? 'تم النسخ'
                        : 'Copied'
                      : language === 'ar'
                      ? 'نسخ'
                      : 'Copy'}
                  </Button>
                  {(selectedAction === 'suggestSummary') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplySummary}
                      className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                    >
                      {language === 'ar' ? 'تطبيق كملخص' : 'Apply as Summary'}
                    </Button>
                  )}
                  {(selectedAction === 'suggestSkills' || selectedAction === 'atsKeywords') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplySkills}
                      className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                    >
                      {language === 'ar' ? 'إضافة كمهارات' : 'Add as Skills'}
                    </Button>
                  )}
                </div>
              </div>
              <ScrollArea className="max-h-64">
                <div className="rounded-lg bg-muted p-4 text-sm whitespace-pre-wrap">
                  {result}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
