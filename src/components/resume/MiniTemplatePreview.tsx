'use client';

import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import {
  getTemplateComponent,
} from '@/components/templates';
import type { TemplateProps } from '@/components/templates';
import { getSampleResumeData } from '@/lib/types';
import type { ResumeData, Language } from '@/lib/types';

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
 * Renders a responsive template component at a small scale with sample data.
 * The template renders at a fixed internal width and is scaled down via CSS transform.
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
  const TemplateComponent = getTemplateComponent(templateId);
  const sampleData = useMemo(() => getSampleData(language), [language]);
  const innerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(600);

  // Internal render width – templates are responsive and will adapt to this
  const renderWidth = 400;

  // Measure the actual rendered height of the template
  const measureHeight = useCallback(() => {
    if (innerRef.current) {
      const h = innerRef.current.scrollHeight;
      if (h > 0) setContentHeight(h);
    }
  }, []);

  useEffect(() => {
    measureHeight();
    // Also measure after a short delay to account for fonts/images loading
    const timer = setTimeout(measureHeight, 200);
    return () => clearTimeout(timer);
  }, [measureHeight, templateId, language, primaryColor]);

  // Calculate scale to fit the thumbnail container
  const scale = Math.min(width / renderWidth, height / contentHeight);

  const color = primaryColor || '#2563EB';

  return (
    <div
      className={`relative overflow-hidden bg-white dark:bg-gray-900 ${className}`}
      style={{ width, height }}
      onClick={onClick}
    >
      <div
        style={{
          width: renderWidth,
          minHeight: contentHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <div ref={innerRef} style={{ width: renderWidth }}>
          <TemplateComponent
            data={sampleData}
            primaryColor={color}
            fontFamily="inter"
            fontSize="small"
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
