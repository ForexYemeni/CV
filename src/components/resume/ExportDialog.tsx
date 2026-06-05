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

      // Try to find the visible professional preview in the DOM
      const existingPreview = document.querySelector('[data-professional-cv]') as HTMLElement;
      if (existingPreview) {
        const style = window.getComputedStyle(existingPreview);
        if (style.display !== 'none' && style.visibility !== 'hidden' && existingPreview.offsetWidth > 0) {
          captureTarget = existingPreview;
          usedVisiblePreview = true;
          setProgress(15);
        }
      }

      // If visible preview not found, create a temporary off-screen container
      if (!captureTarget) {
        setProgress(10);

        tempContainer = document.createElement('div');
        tempContainer.id = 'export-temp-container';
        tempContainer.style.cssText = `
          position: fixed;
          left: 0;
          top: 0;
          width: 800px;
          z-index: -9999;
          opacity: 1;
          pointer-events: none;
          background-color: #ffffff;
          overflow: visible;
        `;
        document.body.appendChild(tempContainer);

        // Render static (no animations) ProfessionalCVPreview
        tempRoot = createRoot(tempContainer);
        tempRoot.render(
          React.createElement(ProfessionalCVPreview, {
            data: resume.data,
            primaryColor: resume.primaryColor,
            language: resume.language,
            disableAnimations: true,
          })
        );

        // Wait for React to render
        setProgress(20);
        await new Promise<void>((resolve) => {
          let checks = 0;
          const checkRender = () => {
            checks++;
            const el = tempContainer!.querySelector('[data-professional-cv]');
            if (el && el.children.length > 0) {
              resolve();
            } else if (checks < 30) {
              setTimeout(checkRender, 100);
            } else {
              resolve();
            }
          };
          setTimeout(checkRender, 200);
        });

        setProgress(30);

        captureTarget = tempContainer.querySelector('[data-professional-cv]') as HTMLElement;
        if (!captureTarget) {
          captureTarget = tempContainer.firstElementChild as HTMLElement;
        }
      }

      if (!captureTarget) {
        throw new Error(language === 'ar' ? 'فشل في عرض السيرة الذاتية' : 'Failed to render resume preview');
      }

      setProgress(35);

      // ===== Step 2: Capture with modern-screenshot (supports modern CSS like lab(), oklch()) =====
      const { domToPng, domToJpeg } = await import('modern-screenshot');
      setProgress(40);

      // For the visible preview, temporarily reset transform from parent
      let parentWithTransform: HTMLElement | null = null;
      let savedTransform = '';
      let savedTransformOrigin = '';

      if (usedVisiblePreview) {
        parentWithTransform = captureTarget.closest('[style*="transform"]') as HTMLElement;
        if (parentWithTransform) {
          savedTransform = parentWithTransform.style.transform;
          savedTransformOrigin = parentWithTransform.style.transformOrigin;
          parentWithTransform.style.transform = 'none';
          parentWithTransform.style.transformOrigin = 'top left';
        }
      }

      setProgress(50);

      // Capture using modern-screenshot - it handles lab(), oklch() etc.
      const captureOptions = {
        scale: 2,
        backgroundColor: '#ffffff',
        width: captureTarget.scrollWidth,
        height: captureTarget.scrollHeight,
        style: {
          transform: 'none',
        },
        fetchOptions: {
          cache: 'force-cache' as RequestCache,
        },
      };

      let canvas: HTMLCanvasElement;

      if (format === 'png') {
        // PNG - use domToPng then convert to canvas
        const dataUrl = await domToPng(captureTarget, captureOptions);
        setProgress(70);

        // Convert data URL to canvas for further processing
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load captured image'));
          img.src = dataUrl;
        });

        canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        // Download PNG directly
        setProgress(90);
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => b ? resolve(b) : reject(new Error('Failed to create PNG blob')),
            'image/png'
          );
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume.title || 'resume'}.png`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 1000);

        setProgress(100);
        setTimeout(() => onOpenChange(false), 600);
        return;

      } else if (format === 'jpg') {
        // JPG - use domToJpeg
        const dataUrl = await domToJpeg(captureTarget, { ...captureOptions, quality: 0.95 });
        setProgress(70);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load captured image'));
          img.src = dataUrl;
        });

        canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        setProgress(90);
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => b ? resolve(b) : reject(new Error('Failed to create JPG blob')),
            'image/jpeg',
            0.95
          );
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume.title || 'resume'}.jpg`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 1000);

        setProgress(100);
        setTimeout(() => onOpenChange(false), 600);
        return;
      }

      // ===== PDF Export =====
      // Use domToPng to capture, then convert to PDF with jsPDF
      const dataUrl = await domToPng(captureTarget, captureOptions);
      setProgress(60);

      // Convert data URL to Image then to Canvas
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load captured image'));
        img.src = dataUrl;
      });

      canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      setProgress(70);

      // Check if canvas is empty
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error(language === 'ar' ? 'فشل في التقاط الصورة' : 'Canvas capture failed - empty result');
      }

      const jsPDF = (await import('jspdf')).default;
      setProgress(80);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate PDF dimensions
      const pdfWidth = paperSize === 'a4' ? 210 : 215.9;
      const pdfHeight = paperSize === 'a4' ? 297 : 279.4;

      // Scale image to fit PDF width (divide by 2 because of scale:2)
      const actualWidth = imgWidth / 2;
      const actualHeight = imgHeight / 2;
      const scale = pdfWidth / actualWidth;
      const scaledHeight = actualHeight * scale;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: paperSize === 'a4' ? 'a4' : 'letter',
      });

      if (scaledHeight <= pdfHeight) {
        // Single page
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, scaledHeight);
      } else {
        // Multi-page PDF
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        if (!pageCtx) {
          throw new Error('Canvas 2D context not available');
        }

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
      pdf.save(`${resume.title || 'resume'}.pdf`);

      // Restore parent transform if we changed it
      if (parentWithTransform) {
        parentWithTransform.style.transform = savedTransform;
        parentWithTransform.style.transformOrigin = savedTransformOrigin;
      }

      setProgress(100);
      setTimeout(() => {
        onOpenChange(false);
      }, 600);

    } catch (error: any) {
      console.error('Export error:', error);
      setErrorMsg(
        language === 'ar'
          ? `حدث خطأ أثناء التصدير: ${error?.message || 'خطأ غير معروف'}`
          : `Export failed: ${error?.message || 'Unknown error'}`
      );
    } finally {
      // Cleanup temp container
      try {
        if (tempRoot) {
          tempRoot.unmount();
        }
        if (tempContainer && tempContainer.parentNode) {
          tempContainer.parentNode.removeChild(tempContainer);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
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
