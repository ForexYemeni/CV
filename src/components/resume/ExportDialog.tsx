'use client';

import { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { ExportFormat, PaperSize } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Image, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const language = useAppStore((s) => s.language);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);

  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const isRtl = language === 'ar';

  const resume = getCurrentResume();

  const handleExport = async () => {
    if (!resume) return;
    setGenerating(true);
    setProgress(10);

    try {
      // Find the preview element
      const previewEl = document.querySelector('[data-resume-preview]') as HTMLElement;
      if (!previewEl) {
        // Fallback: try to get the A4 page element
        const pageEl = document.querySelector('.shadow-xl') as HTMLElement;
        if (!pageEl) {
          setGenerating(false);
          return;
        }
        await generateFromElement(pageEl);
      } else {
        await generateFromElement(previewEl);
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  const generateFromElement = async (element: HTMLElement) => {
    setProgress(30);

    const html2canvas = (await import('html2canvas')).default;
    setProgress(50);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    setProgress(70);

    if (format === 'pdf') {
      const jsPDF = (await import('jspdf')).default;
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdfWidth = paperSize === 'a4' ? 210 : 215.9;
      const pdfHeight = paperSize === 'a4' ? 297 : 279.4;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: paperSize === 'a4' ? 'a4' : 'letter',
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      setProgress(90);
      pdf.save(`${resume.title}.pdf`);
    } else {
      const link = document.createElement('a');
      link.download = `${resume.title}.${format}`;
      link.href = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
      link.click();
    }

    setProgress(100);
    setTimeout(() => onOpenChange(false), 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-emerald-600" />
            {language === 'ar' ? 'تصدير السيرة الذاتية' : 'Export Resume'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar'
              ? 'اختر صيغة التصدير وحجم الورقة'
              : 'Choose export format and paper size'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Format selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              {language === 'ar' ? 'صيغة التصدير' : 'Export Format'}
            </Label>
            <RadioGroup
              value={format}
              onValueChange={(v) => setFormat(v as ExportFormat)}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { value: 'pdf', label: 'PDF', icon: FileText, desc: language === 'ar' ? 'مستند' : 'Document' },
                { value: 'png', label: 'PNG', icon: Image, desc: language === 'ar' ? 'صورة عالية الجودة' : 'High quality image' },
                { value: 'jpg', label: 'JPG', icon: Image, desc: language === 'ar' ? 'صورة مضغوطة' : 'Compressed image' },
              ].map((item) => (
                <Label
                  key={item.value}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors',
                    format === item.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                      : 'border-border hover:border-emerald-300'
                  )}
                >
                  <RadioGroupItem value={item.value} className="sr-only" />
                  <item.icon className={cn('h-6 w-6', format === item.value && 'text-emerald-600')} />
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Paper size */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              {language === 'ar' ? 'حجم الورقة' : 'Paper Size'}
            </Label>
            <RadioGroup
              value={paperSize}
              onValueChange={(v) => setPaperSize(v as PaperSize)}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { value: 'a4', label: 'A4', desc: '210 × 297 mm' },
                { value: 'letter', label: 'Letter', desc: '216 × 279 mm' },
              ].map((item) => (
                <Label
                  key={item.value}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-lg border cursor-pointer transition-colors',
                    paperSize === item.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                      : 'border-border hover:border-emerald-300'
                  )}
                >
                  <RadioGroupItem value={item.value} className="sr-only" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Progress */}
          {generating && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {t('download.generating', language)} {progress}%
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={generating}
          >
            {t('common.cancel', language)}
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleExport}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
                {t('download.generating', language)}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 me-2" />
                {language === 'ar' ? 'تصدير' : 'Export'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
