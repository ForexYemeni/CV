'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
} from 'lucide-react';
import {
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
} from '@/components/templates';
import type { TemplateProps } from '@/components/templates';

const TEMPLATE_MAP: Record<string, React.ComponentType<TemplateProps>> = {
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
};

export function ResumePreview() {
  const language = useAppStore((s) => s.language);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);
  const previewZoom = useAppStore((s) => s.previewZoom);
  const setPreviewZoom = useAppStore((s) => s.setPreviewZoom);
  const isFullscreen = useAppStore((s) => s.isFullscreen);
  const setIsFullscreen = useAppStore((s) => s.setIsFullscreen);

  const resume = getCurrentResume();

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {t('common.noData', language)}
      </div>
    );
  }

  const zoomIn = () => setPreviewZoom(Math.min(previewZoom + 0.15, 2));
  const zoomOut = () => setPreviewZoom(Math.max(previewZoom - 0.15, 0.3));

  const TemplateComponent = TEMPLATE_MAP[resume.template] || ClassicTemplate;

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Preview toolbar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b bg-background/80">
        <span className="text-xs text-muted-foreground">
          {t('preview.title', language)}
        </span>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut}>
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs text-muted-foreground w-10 text-center">
          {Math.round(previewZoom * 100)}%
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn}>
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? (
            <Minimize className="h-3.5 w-3.5" />
          ) : (
            <Maximize className="h-3.5 w-3.5" />
          )}
        </Button>
        {isFullscreen && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
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
            className="origin-top transition-transform"
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
