'use client';

import { useAppStore, useCurrentResume } from '@/lib/store';
import { t } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn, ZoomOut, Maximize, Minimize,
} from 'lucide-react';
import {
  AafiatakProTemplate, ClassicTemplate, ModernTemplate, ExecutiveTemplate,
  CreativeTemplate, MinimalTemplate, CorporateTemplate, ATSTemplate,
  MedicalTemplate, EngineeringTemplate, AcademicTemplate, ElegantTemplate,
  PremiumDarkTemplate, LuxuryTemplate, StartupTemplate, ConsultantTemplate,
  SoftwareTemplate, NurseTemplate, HealthcareTemplate, MarketingTemplate,
  FinanceTemplate,
} from '@/components/templates';
import type { TemplateProps } from '@/components/templates';

const TEMPLATE_MAP: Record<string, React.ComponentType<TemplateProps>> = {
  aafiatakpro: AafiatakProTemplate, classic: ClassicTemplate, modern: ModernTemplate,
  executive: ExecutiveTemplate, creative: CreativeTemplate, minimal: MinimalTemplate,
  corporate: CorporateTemplate, ats: ATSTemplate, medical: MedicalTemplate,
  engineering: EngineeringTemplate, academic: AcademicTemplate, elegant: ElegantTemplate,
  premiumdark: PremiumDarkTemplate, luxury: LuxuryTemplate, startup: StartupTemplate,
  consultant: ConsultantTemplate, software: SoftwareTemplate, nurse: NurseTemplate,
  healthcare: HealthcareTemplate, marketing: MarketingTemplate, finance: FinanceTemplate,
  manager: CorporateTemplate,
};

export function ResumePreview() {
  const language = useAppStore((s) => s.language);
  const resume = useCurrentResume();
  const previewZoom = useAppStore((s) => s.previewZoom);
  const setPreviewZoom = useAppStore((s) => s.setPreviewZoom);
  const isFullscreen = useAppStore((s) => s.isFullscreen);
  const setIsFullscreen = useAppStore((s) => s.setIsFullscreen);

  const zoomIn = () => setPreviewZoom(Math.min(previewZoom + 0.15, 2));
  const zoomOut = () => setPreviewZoom(Math.max(previewZoom - 0.15, 0.3));

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {t('common.noData', language)}
      </div>
    );
  }

  const TemplateComponent = TEMPLATE_MAP[resume.template] || AafiatakProTemplate;

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Preview toolbar */}
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shrink-0">
        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground hidden sm:inline">
          {t('preview.title', language)}
        </span>

        <div className="flex-1" />

        {/* Zoom controls */}
        <div className="hidden sm:flex items-center gap-1">
          <button onClick={zoomOut} className="flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted/50 transition-colors">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] text-muted-foreground w-10 text-center font-medium">
            {Math.round(previewZoom * 100)}%
          </span>
          <button onClick={zoomIn} className="flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted/50 transition-colors">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="w-px h-4 bg-border hidden sm:block" />

        {/* Fullscreen toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted/50 transition-colors"
        >
          {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
        </button>
        {isFullscreen && (
          <button
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium hover:bg-muted/50"
            onClick={() => setIsFullscreen(false)}
          >
            {t('common.close', language)}
          </button>
        )}
      </div>

      {/* Preview content - all templates are now responsive */}
      <div className="flex-1 overflow-y-auto overscroll-y-contain custom-scrollbar min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={resume.template}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 sm:p-4 md:p-6"
          >
            <div
              data-resume-preview
              className="origin-top transition-transform duration-300"
              style={{ transform: `scale(${previewZoom})`, transformOrigin: 'top center' }}
            >
              <TemplateComponent
                data={resume.data}
                primaryColor={resume.primaryColor}
                fontFamily={resume.fontFamily}
                fontSize={resume.fontSize}
                language={resume.language}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
