'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, useCurrentResume } from '@/lib/store';
import { t } from '@/lib/i18n';
import { ExportFormat, PaperSize } from '@/lib/types';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Image, Loader2, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfessionalCVPreview } from './ProfessionalCVPreview';
import { createRoot } from 'react-dom/client';
import React from 'react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const language = useAppStore((s) => s.language);
  const resume = useCurrentResume();
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const isRtl = language === 'ar';

  const handleExport = async () => {
    if (!resume) return;
    setGenerating(true);
    setProgress(5);

    try {
      setProgress(10);

      // Create a hidden container to render the professional preview
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.zIndex = '-1';
      container.style.width = '800px'; // Fixed width for consistent rendering
      container.style.backgroundColor = '#f8fafc'; // Match the preview bg
      document.body.appendChild(container);

      setProgress(20);

      // Render ProfessionalCVPreview into the hidden container
      const root = createRoot(container);
      root.render(
        React.createElement(ProfessionalCVPreview, {
          data: resume.data,
          primaryColor: resume.primaryColor,
          language: resume.language,
        })
      );

      // Wait for render to complete
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(40);

      // Capture with html2canvas
      const html2canvas = (await import('html2canvas')).default;
      setProgress(50);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        logging: false,
      });

      setProgress(70);

      if (format === 'pdf') {
        const jsPDF = (await import('jspdf')).default;
        setProgress(80);

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Calculate PDF dimensions maintaining aspect ratio
        const pdfWidth = paperSize === 'a4' ? 210 : 215.9;
        const pdfHeight = paperSize === 'a4' ? 297 : 279.4;

        // Scale image to fit PDF width
        const scale = pdfWidth / (imgWidth / 2); // divide by 2 because of scale:2
        const scaledHeight = (imgHeight / 2) * scale;

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: paperSize === 'a4' ? 'a4' : 'letter',
        });

        // If content is taller than one page, split across pages
        if (scaledHeight <= pdfHeight) {
          // Single page
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, scaledHeight);
        } else {
          // Multi-page
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          if (!pageCtx) { setGenerating(false); return; }

          const pixelsPerMm = imgWidth / pdfWidth;
          const pageHeightPixels = pdfHeight * pixelsPerMm;
          let currentY = 0;
          let pageNum = 0;

          while (currentY < imgHeight) {
            const sliceHeight = Math.min(pageHeightPixels, imgHeight - currentY);

            pageCanvas.width = imgWidth;
            pageCanvas.height = sliceHeight;

            pageCtx.fillStyle = '#ffffff';
            pageCtx.fillRect(0, 0, imgWidth, sliceHeight);
            pageCtx.drawImage(canvas, 0, currentY, imgWidth, sliceHeight, 0, 0, imgWidth, sliceHeight);

            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            const pageScaledHeight = (sliceHeight / 2) * scale;

            if (pageNum > 0) pdf.addPage();
            pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pageScaledHeight);

            currentY += sliceHeight;
            pageNum++;
          }
        }

        setProgress(95);
        pdf.save(`${resume.title}.pdf`);
      } else {
        // PNG or JPG - just download the canvas
        const link = document.createElement('a');
        link.download = `${resume.title}.${format}`;
        link.href = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
        link.click();
      }

      // Cleanup
      root.unmount();
      document.body.removeChild(container);

      setProgress(100);
      setTimeout(() => onOpenChange(false), 500);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-strong border-border/30 max-w-[calc(100%-2rem)]" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl gradient-brand text-white">
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <span className="text-sm sm:text-base">{language === 'ar' ? 'تصدير السيرة الذاتية' : 'Export Resume'}</span>
              <DialogDescription className="text-[10px] sm:text-xs mt-0.5">
                {language === 'ar' ? 'يتم التصدير بنفس التصميم الاحترافي' : 'Exports exactly as shown in preview'}
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 py-2">
          {/* Format selection */}
          <div>
            <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">
              {language === 'ar' ? 'صيغة التصدير' : 'Export Format'}
            </Label>
            <RadioGroup
              value={format}
              onValueChange={(v) => setFormat(v as ExportFormat)}
              className="grid grid-cols-3 gap-2 sm:gap-3"
            >
              {[
                { value: 'pdf', label: 'PDF', icon: FileText, desc: language === 'ar' ? 'مستند' : 'Document' },
                { value: 'png', label: 'PNG', icon: FileImage, desc: language === 'ar' ? 'صورة عالية' : 'High quality' },
                { value: 'jpg', label: 'JPG', icon: Image, desc: language === 'ar' ? 'صورة مضغوطة' : 'Compressed' },
              ].map((item) => (
                <Label
                  key={item.value}
                  className={cn(
                    'flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all',
                    format === item.value
                      ? 'border-primary bg-primary/5 shadow-glow'
                      : 'border-border/50 hover:border-primary/30'
                  )}
                >
                  <RadioGroupItem value={item.value} className="sr-only" />
                  <item.icon className={cn('h-5 w-5 sm:h-7 sm:w-7', format === item.value && 'text-primary')} />
                  <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground">{item.desc}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Paper size */}
          <div>
            <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">
              {language === 'ar' ? 'حجم الورقة' : 'Paper Size'}
            </Label>
            <RadioGroup
              value={paperSize}
              onValueChange={(v) => setPaperSize(v as PaperSize)}
              className="grid grid-cols-2 gap-2 sm:gap-3"
            >
              {[
                { value: 'a4', label: 'A4', desc: '210 × 297 mm' },
                { value: 'letter', label: 'Letter', desc: '216 × 279 mm' },
              ].map((item) => (
                <Label
                  key={item.value}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all',
                    paperSize === item.value
                      ? 'border-primary bg-primary/5 shadow-glow'
                      : 'border-border/50 hover:border-primary/30'
                  )}
                >
                  <RadioGroupItem value={item.value} className="sr-only" />
                  <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground">{item.desc}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Progress */}
          {generating && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                {t('download.generating', language)} {progress}%
              </p>
            </motion.div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={generating} className="rounded-xl text-xs sm:text-sm">
            {t('common.cancel', language)}
          </Button>
          <button
            onClick={handleExport}
            disabled={generating}
            className="gradient-brand text-white rounded-xl px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('download.generating', language)}
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                {language === 'ar' ? 'تصدير' : 'Export'}
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
