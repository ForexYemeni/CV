'use client';

import { useState } from 'react';
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
import { Download, FileText, Image, Loader2, FileImage, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfessionalCVPreview } from './ProfessionalCVPreview';
import { createRoot } from 'react-dom/client';
import React from 'react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Safely capture a DOM element as a canvas using html-to-image.
 * Falls back to html2canvas if html-to-image fails.
 */
async function captureElement(element: HTMLElement, scale: number = 2): Promise<HTMLCanvasElement> {
  // --- Attempt 1: html-to-image (SVG foreignObject - supports modern CSS) ---
  try {
    const { toCanvas } = await import('html-to-image');
    const canvas = await toCanvas(element, {
      pixelRatio: scale,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      skipAutoScale: true,
    });
    if (canvas.width > 0 && canvas.height > 0) {
      return canvas;
    }
  } catch (e) {
    console.warn('html-to-image failed, trying html2canvas fallback:', e);
  }

  // --- Attempt 2: html2canvas fallback ---
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Fix opacity:0 from Framer Motion animations
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const cs = window.getComputedStyle(htmlEl);
          if (cs.opacity === '0') htmlEl.style.opacity = '1';
          if (cs.visibility === 'hidden') htmlEl.style.visibility = 'visible';
        });
      },
    });
    if (canvas.width > 0 && canvas.height > 0) {
      return canvas;
    }
  } catch (e) {
    console.warn('html2canvas also failed:', e);
  }

  throw new Error('All capture methods failed');
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const language = useAppStore((s) => s.language);
  const resume = useCurrentResume();
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const isRtl = language === 'ar';

  const handleExport = async () => {
    if (!resume) return;
    setGenerating(true);
    setProgress(0);
    setErrorMsg('');

    let tempContainer: HTMLElement | null = null;
    let tempRoot: ReturnType<typeof createRoot> | null = null;

    try {
      setProgress(5);

      // ===== Step 1: Find or create the preview element to capture =====
      let captureTarget: HTMLElement | null = null;
      let usedVisiblePreview = false;
      let parentWithTransform: HTMLElement | null = null;
      let savedTransform = '';
      let savedTransformOrigin = '';

      // Try to find the visible professional preview
      const existingPreview = document.querySelector('[data-professional-cv]') as HTMLElement;
      if (existingPreview) {
        const style = window.getComputedStyle(existingPreview);
        if (style.display !== 'none' && style.visibility !== 'hidden' && existingPreview.offsetWidth > 0) {
          captureTarget = existingPreview;
          usedVisiblePreview = true;
          setProgress(10);

          // Temporarily reset any CSS transform on parent (zoom/scale interferes with capture)
          parentWithTransform = captureTarget.closest('[style*="transform"]') as HTMLElement;
          if (parentWithTransform) {
            savedTransform = parentWithTransform.style.transform;
            savedTransformOrigin = parentWithTransform.style.transformOrigin;
            parentWithTransform.style.transform = 'none';
            parentWithTransform.style.transformOrigin = 'top left';
          }
        }
      }

      // If no visible preview, render into a temp container
      if (!captureTarget) {
        setProgress(8);

        tempContainer = document.createElement('div');
        tempContainer.id = 'export-temp-container';
        tempContainer.style.cssText = [
          'position: fixed',
          'left: 0',
          'top: 0',
          'width: 800px',
          'z-index: -9999',
          'opacity: 1',
          'pointer-events: none',
          'background-color: #ffffff',
          'overflow: visible',
        ].join(';');
        document.body.appendChild(tempContainer);

        tempRoot = createRoot(tempContainer);
        tempRoot.render(
          React.createElement(ProfessionalCVPreview, {
            data: resume.data,
            primaryColor: resume.primaryColor,
            language: resume.language,
            disableAnimations: true,
          })
        );

        // Wait for render to complete
        setProgress(15);
        await new Promise<void>((resolve) => {
          let checks = 0;
          const checkRender = () => {
            checks++;
            const el = tempContainer!.querySelector('[data-professional-cv]');
            if (el && el.children.length > 0) {
              resolve();
            } else if (checks < 40) {
              setTimeout(checkRender, 100);
            } else {
              resolve(); // proceed anyway after 4s
            }
          };
          setTimeout(checkRender, 300);
        });

        setProgress(25);
        captureTarget = (tempContainer.querySelector('[data-professional-cv]') || tempContainer.firstElementChild) as HTMLElement;
      }

      if (!captureTarget) {
        throw new Error(language === 'ar' ? 'فشل في عرض السيرة الذاتية' : 'Failed to render resume');
      }

      // ===== Step 2: Capture as Canvas =====
      setProgress(30);
      const canvas = await captureElement(captureTarget, 2);
      setProgress(60);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error(language === 'ar' ? 'فشل في التقاط الصورة' : 'Capture produced empty result');
      }

      // Restore parent transform
      if (parentWithTransform) {
        parentWithTransform.style.transform = savedTransform;
        parentWithTransform.style.transformOrigin = savedTransformOrigin;
      }

      // ===== Step 3: Export in chosen format =====
      if (format === 'pdf') {
        const jsPDF = (await import('jspdf')).default;
        setProgress(70);

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const pdfWidth = paperSize === 'a4' ? 210 : 215.9;
        const pdfHeight = paperSize === 'a4' ? 297 : 279.4;

        const actualWidth = imgWidth / 2;
        const actualHeight = imgHeight / 2;
        const scaleRatio = pdfWidth / actualWidth;
        const scaledHeight = actualHeight * scaleRatio;

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: paperSize === 'a4' ? 'a4' : 'letter',
        });

        if (scaledHeight <= pdfHeight) {
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, scaledHeight);
        } else {
          // Multi-page
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d')!;
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
            const pageScaledHeight = (sliceHeight / 2) * scaleRatio;

            if (pageNum > 0) pdf.addPage();
            pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pageScaledHeight);

            currentY += sliceHeight;
            pageNum++;
          }
        }

        setProgress(95);
        pdf.save(`${resume.title || 'resume'}.pdf`);

      } else {
        // PNG or JPG image export
        setProgress(70);
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'png' ? undefined : 0.95;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => b ? resolve(b) : reject(new Error('Blob creation failed')),
            mimeType,
            quality
          );
        });

        setProgress(90);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume.title || 'resume'}.${format}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 1500);
      }

      setProgress(100);
      setTimeout(() => onOpenChange(false), 600);

    } catch (error: any) {
      console.error('Export error:', error);
      setErrorMsg(
        language === 'ar'
          ? `حدث خطأ أثناء التصدير: ${error?.message || 'خطأ غير معروف'}`
          : `Export failed: ${error?.message || 'Unknown error'}`
      );
    } finally {
      try {
        if (tempRoot) tempRoot.unmount();
        if (tempContainer?.parentNode) tempContainer.parentNode.removeChild(tempContainer);
      } catch (_) {}
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
                { value: 'a4', label: 'A4', desc: '210 x 297 mm' },
                { value: 'letter', label: 'Letter', desc: '216 x 279 mm' },
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

          {/* Error message */}
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-xs">{errorMsg}</p>
            </div>
          )}

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
