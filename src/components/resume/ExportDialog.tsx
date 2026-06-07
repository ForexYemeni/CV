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
import { getTemplateComponent } from '@/components/templates';
import { createRoot } from 'react-dom/client';
import React from 'react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** A4 width in pixels at 96 DPI: 210mm * 96 / 25.4 ≈ 794px */
const A4_WIDTH_PX = 794;
/** Letter width in pixels at 96 DPI: 215.9mm * 96 / 25.4 ≈ 816px */
const LETTER_WIDTH_PX = 816;

/** PDF margins in mm - professional resume standard */
const PDF_MARGIN_MM = 8;
/** PDF margins in pixels at 96 DPI */
const PDF_MARGIN_PX = Math.round(PDF_MARGIN_MM * 96 / 25.4); // ≈ 30px

/**
 * Safely capture a DOM element as a canvas.
 * Uses html-to-image first (supports modern CSS), falls back to html2canvas.
 */
async function captureElement(element: HTMLElement, scale: number = 2): Promise<HTMLCanvasElement> {
  // Attempt 1: html-to-image
  try {
    const { toCanvas } = await import('html-to-image');
    const canvas = await toCanvas(element, {
      pixelRatio: scale,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      skipAutoScale: true,
    });
    if (canvas.width > 0 && canvas.height > 0) return canvas;
  } catch (e) {
    console.warn('html-to-image failed, trying html2canvas:', e);
  }

  // Attempt 2: html2canvas fallback
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
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const cs = window.getComputedStyle(htmlEl);
          if (cs.opacity === '0') htmlEl.style.opacity = '1';
          if (cs.visibility === 'hidden') htmlEl.style.visibility = 'visible';
        });
      },
    });
    if (canvas.width > 0 && canvas.height > 0) return canvas;
  } catch (e) {
    console.warn('html2canvas also failed:', e);
  }

  throw new Error('All capture methods failed');
}

/**
 * Find a safe Y position to break a page - scans pixel rows for whitespace gaps.
 */
function findSafeBreakPoint(
  canvas: HTMLCanvasElement,
  idealY: number,
  searchRange: number = 80
): number {
  const ctx = canvas.getContext('2d');
  if (!ctx) return idealY;

  const width = canvas.width;
  const startY = Math.max(0, idealY - searchRange);
  const endY = Math.min(canvas.height, idealY + searchRange);

  let bestY = idealY;
  let bestScore = Infinity;

  for (let y = startY; y < endY; y++) {
    const rowData = ctx.getImageData(0, y, width, 1).data;
    let nonWhitePixels = 0;
    for (let x = 0; x < width; x += 4) {
      const idx = x * 4;
      const r = rowData[idx], g = rowData[idx + 1], b = rowData[idx + 2];
      if (r < 240 || g < 240 || b < 240) {
        nonWhitePixels++;
      }
    }
    const distancePenalty = Math.abs(y - idealY) * 0.3;
    const score = nonWhitePixels + distancePenalty;
    if (score < bestScore) {
      bestScore = score;
      bestY = y;
    }
  }

  return bestY;
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

      // Determine the A4-correct width for this paper size
      const targetWidthPx = paperSize === 'a4' ? A4_WIDTH_PX : LETTER_WIDTH_PX;
      // Content width = full page width minus margins on both sides
      const contentWidthPx = targetWidthPx - (PDF_MARGIN_PX * 2);

      // ===== Step 1: Create a dedicated export container =====
      // This container is sized exactly to A4 width with proper margins
      // so the PDF captures a perfectly centered, full-width resume
      tempContainer = document.createElement('div');
      tempContainer.id = 'export-temp-container';

      // Set RTL direction for Arabic content
      if (isRtl) {
        tempContainer.setAttribute('dir', 'rtl');
      }

      tempContainer.style.cssText = [
        'position: fixed',
        'left: 0',
        'top: 0',
        `width: ${targetWidthPx}px`,
        `padding: ${PDF_MARGIN_PX}px`,
        'z-index: -9999',
        'opacity: 1',
        'pointer-events: none',
        'background-color: #ffffff',
        'overflow: visible',
        'box-sizing: border-box',
        'display: block',
        ...(isRtl ? ['direction: rtl', 'text-align: right'] : ['direction: ltr', 'text-align: left']),
      ].join(';');
      document.body.appendChild(tempContainer);

      setProgress(5);

      tempRoot = createRoot(tempContainer);

      // Render the selected template into the export container
      const TemplateComponent = getTemplateComponent(resume.template);

      if (TemplateComponent) {
        tempRoot.render(
          React.createElement(TemplateComponent, {
            data: resume.data,
            primaryColor: resume.primaryColor,
            fontFamily: resume.fontFamily,
            fontSize: resume.fontSize,
            language: resume.language,
          })
        );
      } else {
        // Fallback: render a simple text-based resume
        tempRoot.render(
          React.createElement('div', {
            style: { padding: '20px', fontFamily: 'sans-serif', direction: isRtl ? 'rtl' : 'ltr' },
          },
            React.createElement('h1', null, resume.data.personalInfo.fullName || 'Resume'),
            React.createElement('p', null, resume.data.personalInfo.jobTitle || '')
          )
        );
      }

      // Wait for render to complete
      setProgress(10);
      await new Promise<void>((resolve) => {
        let checks = 0;
        const checkRender = () => {
          checks++;
          const el = tempContainer!.firstElementChild;
          if (el && el.children.length > 0) {
            resolve();
          } else if (checks < 40) {
            setTimeout(checkRender, 100);
          } else {
            resolve();
          }
        };
        setTimeout(checkRender, 300);
      });

      setProgress(20);

      // Force all max-width constraints to allow full-width rendering
      // and ensure all elements fill the full content width
      const allElements = tempContainer.querySelectorAll('*');
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const computed = window.getComputedStyle(htmlEl);
        const maxW = computed.maxWidth;
        if (maxW && maxW !== 'none') {
          const maxVal = parseFloat(maxW);
          if (!isNaN(maxVal) && maxVal < contentWidthPx) {
            htmlEl.style.maxWidth = '100%';
          }
        }
      });

      // CRITICAL: Ensure the root resume element fills the full content width
      // This fixes RTL content appearing shifted to one side
      const cvRoot = tempContainer.firstElementChild;
      if (cvRoot) {
        const cvEl = cvRoot as HTMLElement;
        cvEl.style.width = '100%';
        cvEl.style.maxWidth = '100%';
        cvEl.style.minWidth = `${contentWidthPx}px`;
        cvEl.style.marginLeft = '0';
        cvEl.style.marginRight = '0';
        cvEl.style.paddingLeft = '0';
        cvEl.style.paddingRight = '0';
        cvEl.style.boxSizing = 'border-box';
        if (isRtl) {
          cvEl.setAttribute('dir', 'rtl');
          cvEl.style.direction = 'rtl';
        }
      }

      // Ensure all card children fill full width
      const directCards = tempContainer.querySelectorAll('.rounded-2xl, .rounded-xl, [class*="rounded-"]');
      directCards.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.width = '100%';
        htmlEl.style.maxWidth = '100%';
        htmlEl.style.boxSizing = 'border-box';
      });

      const captureTarget: HTMLElement = tempContainer;

      // ===== Step 2: Capture as Canvas =====
      setProgress(30);
      const canvas = await captureElement(captureTarget, 2);
      setProgress(55);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error(language === 'ar' ? 'فشل في التقاط الصورة' : 'Capture produced empty result');
      }

      // ===== Step 3: Export in chosen format =====
      if (format === 'pdf') {
        const jsPDF = (await import('jspdf')).default;
        setProgress(65);

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // PDF dimensions in mm
        const pdfWidth = paperSize === 'a4' ? 210 : 215.9;
        const pdfHeight = paperSize === 'a4' ? 297 : 279.4;

        // The canvas was captured at pixelRatio=2, so CSS width = imgWidth / 2
        // The container was: width=targetWidthPx (border-box, includes padding)
        const actualCssWidth = imgWidth / 2;

        // Scale: how many mm per CSS pixel
        const scaleRatio = pdfWidth / actualCssWidth;

        // Content height in mm
        const totalContentHeightMm = (imgHeight / 2) * scaleRatio;

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: paperSize === 'a4' ? 'a4' : 'letter',
        });

        if (totalContentHeightMm <= pdfHeight) {
          // Single page - content fills the page width with proper margins
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, totalContentHeightMm);
        } else {
          // Multi-page PDF with smart page breaks
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d')!;

          // How many canvas pixels correspond to one PDF page height
          const pixelsPerMm = imgWidth / pdfWidth;
          const pageHeightPixels = pdfHeight * pixelsPerMm;

          let currentY = 0;
          let pageNum = 0;

          while (currentY < imgHeight) {
            let sliceHeight = Math.min(pageHeightPixels, imgHeight - currentY);

            // For all pages except the last, find a safe break point
            if (currentY + sliceHeight < imgHeight) {
              const safeY = findSafeBreakPoint(canvas, currentY + sliceHeight, 100);
              const adjustedSliceHeight = safeY - currentY;
              if (adjustedSliceHeight > pageHeightPixels * 0.5) {
                sliceHeight = adjustedSliceHeight;
              }
            }

            sliceHeight = Math.min(sliceHeight, imgHeight - currentY);
            if (sliceHeight <= 0) break;

            // Create page canvas
            pageCanvas.width = imgWidth;
            pageCanvas.height = sliceHeight;

            // White background
            pageCtx.fillStyle = '#ffffff';
            pageCtx.fillRect(0, 0, imgWidth, sliceHeight);

            // Draw the slice from the source canvas
            pageCtx.drawImage(canvas, 0, currentY, imgWidth, sliceHeight, 0, 0, imgWidth, sliceHeight);

            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            const pageScaledHeightMm = (sliceHeight / 2) * scaleRatio;

            if (pageNum > 0) pdf.addPage();

            // Add image filling the full page width from x=0
            pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pageScaledHeightMm);

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
                {language === 'ar' ? 'يتم التصدير بنفس تصميم القالب المختار' : 'Exports using the selected template design'}
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
