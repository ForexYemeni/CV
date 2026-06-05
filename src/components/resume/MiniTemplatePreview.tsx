'use client';

import React, { useMemo } from 'react';
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
import { getSampleResumeData } from '@/lib/types';
import type { ResumeData, Language } from '@/lib/types';

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
  manager: CorporateTemplate,
};

// Cache sample data per language to avoid regeneration
const sampleDataCache: Record<string, ResumeData> = {};

function getSampleData(lang: Language): ResumeData {
  if (!sampleDataCache[lang]) {
    sampleDataCache[lang] = getSampleResumeData(lang);
  }
  return sampleDataCache[lang];
}

interface MiniTemplatePreviewProps {
  templateId: string;
  primaryColor?: string;
  language?: Language;
  /** Width of the preview container in pixels */
  width?: number;
  /** Height of the preview container in pixels */
  height?: number;
  className?: string;
  onClick?: () => void;
}

/**
 * Renders an actual template component at a small scale with sample data.
 * Uses CSS transform: scale() to shrink the full A4 template into a thumbnail.
 */
export function MiniTemplatePreview({
  templateId,
  primaryColor,
  language = 'ar',
  width = 220,
  height = 280,
  className = '',
  onClick,
}: MiniTemplatePreviewProps) {
  const TemplateComponent = TEMPLATE_MAP[templateId] || AafiatakProTemplate;
  const sampleData = useMemo(() => getSampleData(language), [language]);

  // A4 dimensions in mm; we render at ~1px per mm for the thumbnail base
  const a4Width = 210;
  const a4Height = 297;

  // Calculate scale to fit within the container
  const scale = Math.min(width / a4Width, height / a4Height);

  const color = primaryColor || (
    templateId === 'aafiatakpro' ? '#0ea5e9' :
    templateId === 'executive' ? '#0F172A' :
    templateId === 'creative' ? '#8B5CF6' :
    templateId === 'medical' ? '#0D9488' :
    templateId === 'engineering' ? '#B45309' :
    templateId === 'luxury' ? '#D97706' :
    templateId === 'premiumdark' ? '#F59E0B' :
    templateId === 'startup' ? '#059669' :
    templateId === 'software' ? '#2563EB' :
    templateId === 'nurse' ? '#DB2777' :
    templateId === 'healthcare' ? '#0D9488' :
    templateId === 'marketing' ? '#EA580C' :
    templateId === 'finance' ? '#1E293B' :
    templateId === 'academic' ? '#7C2D12' :
    templateId === 'elegant' ? '#18181B' :
    templateId === 'consultant' ? '#1E3A5F' :
    templateId === 'ats' ? '#1F2937' :
    templateId === 'corporate' ? '#0369A1' :
    '#2563EB'
  );

  return (
    <div
      className={`relative overflow-hidden bg-white ${className}`}
      style={{ width, height }}
      onClick={onClick}
    >
      <div
        style={{
          width: a4Width,
          height: a4Height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <TemplateComponent
          data={sampleData}
          primaryColor={color}
          fontFamily="inter"
          fontSize="small"
          language={language}
        />
      </div>
    </div>
  );
}

export { TEMPLATE_MAP };
