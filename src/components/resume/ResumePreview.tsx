'use client';

import { useAppStore, useCurrentResume } from '@/lib/store';
import { t } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  X,
} from 'lucide-react';
import {
  AafiatakProTemplate,
  ClassicTemplate,
  ModernTemplate,
  ExecutiveTemplate,
  CreativeTemplate,
  MinimalTemplate,
  CorporateTemplate,
  ATSTemplate,
  MedicalTemplate,
  EngineeringTemplate,
  AcademicTemplate,
  ElegantTemplate,
  PremiumDarkTemplate,
  LuxuryTemplate,
  StartupTemplate,
  ConsultantTemplate,
  SoftwareTemplate,
  NurseTemplate,
  HealthcareTemplate,
  MarketingTemplate,
  FinanceTemplate,
} from '@/components/templates';
import type { TemplateProps } from '@/components/templates';

const TEMPLATE_MAP: Record<string, React.ComponentType<TemplateProps>> = {
  aafiatakpro: AafiatakProTemplate,
  classic: ClassicTemplate,
  modern: ModernTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  minimal: MinimalTemplate,
  corporate: CorporateTemplate,
  ats: ATSTemplate,
  medical: MedicalTemplate,
  engineering: EngineeringTemplate,
  academic: AcademicTemplate,
  elegant: ElegantTemplate,
  premiumdark: PremiumDarkTemplate,
  luxury: LuxuryTemplate,
  startup: StartupTemplate,
  consultant: ConsultantTemplate,
  software: SoftwareTemplate,
  nurse: NurseTemplate,
  healthcare: HealthcareTemplate,
  marketing: MarketingTemplate,
  finance: FinanceTemplate,
  manager: CorporateTemplate, // Manager uses Corporate layout as base
};

export function ResumePreview() {
  const language = useAppStore((s) => s.language);
  const resume = useCurrentResume();
  const previewZoom = useAppStore((s) => s.previewZoom);
  const setPreviewZoom = useAppStore((s) => s.setPreviewZoom);
  const isFullscreen = useAppStore((s) => s.isFullscreen);
  const setIsFullscreen = useAppStore((s) => s.setIsFullscreen);

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {t('common.noData', language)}
      </div>
    );
  }

  const zoomIn = () => setPreviewZoom(Math.min(previewZoom + 0.15, 2));
  const zoomOut = () => setPreviewZoom(Math.max(previewZoom - 0.15, 0.3));

  const TemplateComponent = TEMPLATE_MAP[resume.template] || AafiatakProTemplate;

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Preview toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b glass-strong">
        <span className="text-xs font-medium text-muted-foreground">
          {t('preview.title', language)}
        </span>
        <div className="flex-1" />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={zoomOut}
          className="flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </motion.button>
        <span className="text-xs text-muted-foreground w-10 text-center font-medium">
          {Math.round(previewZoom * 100)}%
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={zoomIn}
          className="flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </motion.button>
        <div className="w-px h-4 bg-border" />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted/50 transition-colors"
        >
          {isFullscreen ? (
            <Minimize className="h-3.5 w-3.5" />
          ) : (
            <Maximize className="h-3.5 w-3.5" />
          )}
        </motion.button>
        {isFullscreen && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs rounded-lg"
            onClick={() => setIsFullscreen(false)}
          >
            {t('common.close', language)}
          </Button>
        )}
      </div>

      {/* Preview content */}
      <ScrollArea className="flex-1">
        <div className="flex items-start justify-center p-4 md:p-8">
          <div
            id="resume-preview"
            data-resume-preview
            className="origin-top transition-transform duration-300"
            style={{ transform: `scale(${previewZoom})` }}
          >
            <TemplateComponent
              data={resume.data}
              primaryColor={resume.primaryColor}
              fontFamily={resume.fontFamily}
              fontSize={resume.fontSize}
              language={resume.language}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
