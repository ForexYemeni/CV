import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  Globe2,
  FolderKanban,
  Link as LinkIcon,
  FileText,
  Star,
  Clock,
  CheckCircle2,
  Building2,
  Calendar,
  Shield,
  BookOpen,
  Trophy,
} from 'lucide-react';
import type { ResumeData, SkillLevel, LanguageLevel, DegreeType } from '@/lib/types';
import { SKILL_LEVEL_LABELS, LANGUAGE_LEVEL_LABELS, DEGREE_LABELS } from '@/lib/types';

/* -------------------------------------------------------------------------- */
/*  Shared Types & Helpers                                                    */
/* -------------------------------------------------------------------------- */

export interface TemplateProps {
  data: ResumeData;
  primaryColor: string;
  fontFamily: string;
  fontSize: string;
  language: 'ar' | 'en';
}

const FONT_MAP: Record<string, string> = {
  inter: 'var(--font-inter)',
  roboto: 'Roboto, sans-serif',
  cairo: 'var(--font-cairo)',
  tajawal: 'var(--font-tajawal)',
  'noto-kufi': '"Noto Kufi Arabic", sans-serif',
  georgia: 'Georgia, serif',
  playfair: '"Playfair Display", serif',
};

function resolveFont(fontFamily: string): string {
  return FONT_MAP[fontFamily] || fontFamily;
}

function fontSizeBase(size: string): number {
  return size === 'small' ? 11 : size === 'large' ? 15 : 13;
}

function getSkillWidth(level: SkillLevel): string {
  switch (level) {
    case 'beginner': return '25%';
    case 'intermediate': return '50%';
    case 'advanced': return '75%';
    case 'expert': return '100%';
    default: return '50%';
  }
}

function getLanguageDots(level: LanguageLevel): number {
  switch (level) {
    case 'native': return 5;
    case 'fluent': return 4;
    case 'advanced': return 3;
    case 'intermediate': return 2;
    case 'basic': return 1;
    default: return 3;
  }
}

function formatDateRange(start: string, end: string, current: boolean, lang: 'ar' | 'en'): string {
  const present = lang === 'ar' ? 'حتى الآن' : 'Present';
  return `${start} - ${current ? present : end}`;
}

function sectionLabel(type: string, lang: 'ar' | 'en'): string {
  const labels: Record<string, Record<'ar' | 'en', string>> = {
    personalInfo: { ar: 'المعلومات الشخصية', en: 'Personal Information' },
    experience: { ar: 'الخبرات العملية', en: 'Work Experience' },
    education: { ar: 'المؤهلات التعليمية', en: 'Education' },
    skills: { ar: 'المهارات', en: 'Skills' },
    certifications: { ar: 'الشهادات', en: 'Certifications' },
    languages: { ar: 'اللغات', en: 'Languages' },
    projects: { ar: 'المشاريع', en: 'Projects' },
  };
  return labels[type]?.[lang] || type;
}

/** Return visible sections sorted by order, excluding personalInfo which is rendered by the header */
function getVisibleSections(sections: ResumeData['sections']): string[] {
  return sections
    .filter((s) => s.visible && s.type !== 'personalInfo')
    .sort((a, b) => a.order - b.order)
    .map((s) => s.type);
}

const A4: React.CSSProperties = {
  width: '210mm',
  minHeight: '297mm',
  backgroundColor: '#ffffff',
  color: '#1a1a1a',
  lineHeight: 1.5,
  boxSizing: 'border-box' as const,
};

const isRtl = (lang: 'ar' | 'en') => lang === 'ar';
const dir = (lang: 'ar' | 'en') => isRtl(lang) ? 'rtl' as const : 'ltr' as const;

/* -------------------------------------------------------------------------- */
/*  Contact Info helper – renders a row of contact items                      */
/* -------------------------------------------------------------------------- */

function ContactItems({ info, color, lang, size, iconSize = 10 }: {
  info: ResumeData['personalInfo'];
  color: string;
  lang: 'ar' | 'en';
  size: number;
  iconSize?: number;
}) {
  const items: React.ReactNode[] = [];
  const s: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: size, color: '#555' };

  if (info.email) items.push(<span key="email" style={s}><Mail size={iconSize} style={{ color }} />{info.email}</span>);
  if (info.phone) items.push(<span key="phone" style={s}><Phone size={iconSize} style={{ color }} />{info.phone}</span>);
  if (info.city || info.country) items.push(<span key="loc" style={s}><MapPin size={iconSize} style={{ color }} />{[info.city, info.country].filter(Boolean).join(', ')}</span>);
  if (info.website) items.push(<span key="web" style={s}><Globe size={iconSize} style={{ color }} />{info.website}</span>);
  if (info.linkedin) items.push(<span key="li" style={s}><Linkedin size={iconSize} style={{ color }} />{info.linkedin}</span>);
  if (info.github) items.push(<span key="gh" style={s}><Github size={iconSize} style={{ color }} />{info.github}</span>);
  if (info.otherLinks?.length > 0) {
    info.otherLinks.forEach((l, i) => {
      if (l.url) items.push(<span key={`ol${i}`} style={s}><LinkIcon size={iconSize} style={{ color }} />{l.label || l.url}</span>);
    });
  }

  return <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: isRtl(lang) ? '4px 14px' : '4px 14px' }}>{items}</div>;
}

/* -------------------------------------------------------------------------- */
/*  Section renderer helpers                                                  */
/* -------------------------------------------------------------------------- */

function ExperienceSection({ data, color, lang, size }: { data: ResumeData; color: string; lang: 'ar' | 'en'; size: number }) {
  if (!data.experience.length) return null;
  return (
    <div>
      {data.experience.map((exp) => (
        <div key={exp.id} style={{ marginBottom: size * 0.7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: size + 1 }}>{exp.jobTitle}</div>
              <div style={{ fontSize: size, color: '#555' }}>{exp.company}</div>
            </div>
            <div style={{ fontSize: size - 1, color: '#999', whiteSpace: 'nowrap' as const }}>
              {formatDateRange(exp.startDate, exp.endDate, exp.current, lang)}
            </div>
          </div>
          {exp.description && (
            <div style={{ fontSize: size - 1, color: '#666', marginTop: 2, whiteSpace: 'pre-line' as const }}>{exp.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationSection({ data, color, lang, size }: { data: ResumeData; color: string; lang: 'ar' | 'en'; size: number }) {
  if (!data.education.length) return null;
  return (
    <div>
      {data.education.map((edu) => (
        <div key={edu.id} style={{ marginBottom: size * 0.7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: size + 1 }}>{edu.major}</div>
              <div style={{ fontSize: size, color: '#555' }}>{edu.institution}{edu.degree ? ` — ${DEGREE_LABELS[lang][edu.degree as DegreeType] || edu.degree}` : ''}</div>
            </div>
            <div style={{ fontSize: size - 1, color: '#999', whiteSpace: 'nowrap' as const }}>
              {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
            </div>
          </div>
          {edu.description && (
            <div style={{ fontSize: size - 1, color: '#666', marginTop: 2 }}>{edu.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillsBadges({ data, color, lang, size }: { data: ResumeData; color: string; lang: 'ar' | 'en'; size: number }) {
  if (!data.skills.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
      {data.skills.map((sk) => (
        <span key={sk.id} style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: size - 1,
          fontWeight: 500,
          backgroundColor: color + '18',
          color: color,
        }}>
          {sk.name}<span style={{ opacity: 0.6, marginInlineStart: 3 }}>· {SKILL_LEVEL_LABELS[lang][sk.level]}</span>
        </span>
      ))}
    </div>
  );
}

function SkillsBars({ data, color, lang, size }: { data: ResumeData; color: string; lang: 'ar' | 'en'; size: number }) {
  if (!data.skills.length) return null;
  return (
    <div>
      {data.skills.map((sk) => (
        <div key={sk.id} style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: size - 1, marginBottom: 2 }}>
            <span style={{ fontWeight: 500 }}>{sk.name}</span>
            <span style={{ color: '#888' }}>{SKILL_LEVEL_LABELS[lang][sk.level]}</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, width: getSkillWidth(sk.level), backgroundColor: color, transition: 'width 0.3s' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CertificationsSection({ data, color, lang, size }: { data: ResumeData; color: string; lang: 'ar' | 'en'; size: number }) {
  if (!data.certifications.length) return null;
  return (
    <div>
      {data.certifications.map((c) => (
        <div key={c.id} style={{ marginBottom: size * 0.5 }}>
          <span style={{ fontWeight: 600, fontSize: size }}>{c.name}</span>
          <span style={{ fontSize: size - 1, color: '#888', marginInlineStart: 6 }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</span>
          {c.description && <div style={{ fontSize: size - 1, color: '#666', marginTop: 1 }}>{c.description}</div>}
        </div>
      ))}
    </div>
  );
}

function LanguagesSection({ data, color, lang, size }: { data: ResumeData; color: string; lang: 'ar' | 'en'; size: number }) {
  if (!data.languages.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px 16px' }}>
      {data.languages.map((l) => (
        <div key={l.id} style={{ fontSize: size }}>
          <span style={{ fontWeight: 500 }}>{l.name}</span>
          <span style={{ fontSize: size - 1, color: '#888', marginInlineStart: 4 }}>({LANGUAGE_LEVEL_LABELS[lang][l.level]})</span>
        </div>
      ))}
    </div>
  );
}

function LanguagesDots({ data, color, lang, size }: { data: ResumeData; color: string; lang: 'ar' | 'en'; size: number }) {
  if (!data.languages.length) return null;
  return (
    <div>
      {data.languages.map((l) => {
        const filled = getLanguageDots(l.level);
        return (
          <div key={l.id} style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: size - 1, fontWeight: 500, minWidth: 80 }}>{l.name}</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {[1, 2, 3, 4, 5].map((d) => (
                <div key={d} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  backgroundColor: d <= filled ? color : '#e5e7eb',
                }} />
              ))}
            </div>
            <span style={{ fontSize: size - 2, color: '#999' }}>{LANGUAGE_LEVEL_LABELS[lang][l.level]}</span>
          </div>
        );
      })}
    </div>
  );
}

function ProjectsSection({ data, color, lang, size }: { data: ResumeData; color: string; lang: 'ar' | 'en'; size: number }) {
  if (!data.projects.length) return null;
  return (
    <div>
      {data.projects.map((p) => (
        <div key={p.id} style={{ marginBottom: size * 0.7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontWeight: 700, fontSize: size + 1 }}>{p.name}</span>
            {p.url && <ExternalLink size={10} style={{ color: '#aaa' }} />}
          </div>
          {p.description && <div style={{ fontSize: size - 1, color: '#666', marginTop: 1 }}>{p.description}</div>}
          {p.technologies.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 3, marginTop: 3 }}>
              {p.technologies.map((t) => (
                <span key={t} style={{ fontSize: size - 2, padding: '1px 6px', borderRadius: 3, backgroundColor: '#f3f4f6', color: '#555' }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section heading styles for different templates                            */
/* -------------------------------------------------------------------------- */

function HeadingUnderline({ title, color, size }: { title: string; color: string; size: number }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontWeight: 700, fontSize: size + 3, textTransform: 'uppercase' as const, letterSpacing: 1, color, paddingBottom: 4, borderBottom: `2px solid ${color}` }}>{title}</div>
    </div>
  );
}

function HeadingLine({ title, color, size }: { title: string; color: string; size: number }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontWeight: 700, fontSize: size + 3, textTransform: 'uppercase' as const, letterSpacing: 0.5, color, paddingBottom: 4, borderBottom: `1px solid ${color}40` }}>{title}</div>
    </div>
  );
}

function HeadingMinimal({ title, color, size }: { title: string; color: string; size: number }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontWeight: 600, fontSize: size + 2, textTransform: 'uppercase' as const, letterSpacing: 2, color, paddingBottom: 4 }}>{title}</div>
    </div>
  );
}

function HeadingBox({ title, color, size }: { title: string; color: string; size: number }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontWeight: 700, fontSize: size + 2, textTransform: 'uppercase' as const, letterSpacing: 0.5, color: '#fff', backgroundColor: color, padding: '4px 12px', borderRadius: 3, display: 'inline-block' }}>{title}</div>
    </div>
  );
}

function HeadingAccent({ title, color, size }: { title: string; color: string; size: number }) {
  return (
    <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: color }} />
      <div style={{ fontWeight: 700, fontSize: size + 2, textTransform: 'uppercase' as const, letterSpacing: 0.5, color: '#1a1a1a' }}>{title}</div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   1. CLASSIC TEMPLATE                                                        */
/*                                                                              */
/* ============================================================================ */

export function ClassicTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'skills': return <SkillsBadges data={data} color={primaryColor} lang={language} size={sz} />;
      case 'certifications': return <CertificationsSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'languages': return <LanguagesSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={primaryColor} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Header */}
      <div style={{ padding: '28px 32px 20px', borderBottom: `3px solid ${primaryColor}`, display: 'flex', gap: 20, alignItems: 'center' }}>
        {p.photo && (
          <div style={{ flexShrink: 0 }}>
            <img src={p.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${primaryColor}` }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: sz + 14, fontWeight: 800, color: '#1a1a1a', marginBottom: 2, letterSpacing: 0.5 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
          <div style={{ fontSize: sz + 4, fontWeight: 500, color: primaryColor, marginBottom: 8, borderBottom: `1px solid ${primaryColor}40`, paddingBottom: 6, display: 'inline-block' }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
          <ContactItems info={p} color={primaryColor} lang={language} size={sz - 1} />
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '16px 32px 8px' }}>
          <HeadingUnderline title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} color={primaryColor} size={sz} />
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 32px 32px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 14 }}>
            <HeadingUnderline title={sectionLabel(type, language)} color={primaryColor} size={sz} />
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   2. MODERN TEMPLATE – Dark sidebar + main content                          */
/*                                                                              */
/* ============================================================================ */

export function ModernTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const isR = isRtl(language);

  const sidebarBg = primaryColor;
  const mainSections = ['experience', 'education', 'projects'];
  const sideSections = ['skills', 'certifications', 'languages'];

  const sidebarItems = sideSections.filter((s) => sections.includes(s));
  const mainItems = mainSections.filter((s) => sections.includes(s));

  const renderSideSection = (type: string) => {
    switch (type) {
      case 'skills': return (
        <div>
          {data.skills.map((sk) => (
            <div key={sk.id} style={{ marginBottom: 7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: sz - 1, marginBottom: 3 }}>
                <span>{sk.name}</span>
                <span style={{ opacity: 0.7 }}>{SKILL_LEVEL_LABELS[language][sk.level]}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, width: getSkillWidth(sk.level), backgroundColor: 'rgba(255,255,255,0.85)' }} />
              </div>
            </div>
          ))}
        </div>
      );
      case 'certifications': return (
        <div>
          {data.certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: 6, fontSize: sz - 1 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ opacity: 0.7 }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
            </div>
          ))}
        </div>
      );
      case 'languages': return (
        <div>
          {data.languages.map((l) => {
            const filled = getLanguageDots(l.level);
            return (
              <div key={l.id} style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: sz - 1, minWidth: 70 }}>{l.name}</span>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div key={dot} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: dot <= filled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)' }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
      default: return null;
    }
  };

  const renderMainSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={primaryColor} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d, display: 'flex' }}>
      {/* Sidebar */}
      <div style={{
        width: '35%',
        backgroundColor: sidebarBg,
        color: '#ffffff',
        padding: '28px 20px',
        boxSizing: 'border-box' as const,
      }}>
        {/* Photo */}
        {p.photo && (
          <div style={{ textAlign: 'center' as const, marginBottom: 16 }}>
            <img src={p.photo} alt="" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)', margin: '0 auto', display: 'block' }} />
          </div>
        )}

        {/* Name & Title */}
        <div style={{ textAlign: 'center' as const, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: sz + 8, fontWeight: 800, marginBottom: 4 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
          <div style={{ fontSize: sz + 1, opacity: 0.85, fontWeight: 400 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: sz + 1, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 10, paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
            {language === 'ar' ? 'معلومات التواصل' : 'Contact'}
          </div>
          {p.email && <div style={{ fontSize: sz - 1, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6, wordBreak: 'break-all' as const }}><Mail size={11} /> {p.email}</div>}
          {p.phone && <div style={{ fontSize: sz - 1, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={11} /> {p.phone}</div>}
          {(p.city || p.country) && <div style={{ fontSize: sz - 1, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={11} /> {[p.city, p.country].filter(Boolean).join(', ')}</div>}
          {p.website && <div style={{ fontSize: sz - 1, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6, wordBreak: 'break-all' as const }}><Globe size={11} /> {p.website}</div>}
          {p.linkedin && <div style={{ fontSize: sz - 1, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6, wordBreak: 'break-all' as const }}><Linkedin size={11} /> {p.linkedin}</div>}
          {p.github && <div style={{ fontSize: sz - 1, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6, wordBreak: 'break-all' as const }}><Github size={11} /> {p.github}</div>}
        </div>

        {/* Sidebar sections */}
        {sidebarItems.map((type) => (
          <div key={type} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: sz + 1, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
              {sectionLabel(type, language)}
            </div>
            {renderSideSection(type)}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ width: '65%', padding: '28px 24px' }}>
        {/* Summary */}
        {p.summary && (
          <div style={{ marginBottom: 18 }}>
            <HeadingAccent title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} color={primaryColor} size={sz} />
            <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
          </div>
        )}

        {/* Main sections */}
        {mainItems.map((type) => (
          <div key={type} style={{ marginBottom: 18 }}>
            <HeadingAccent title={sectionLabel(type, language)} color={primaryColor} size={sz} />
            {renderMainSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   3. EXECUTIVE TEMPLATE – Bold top banner                                   */
/*                                                                              */
/* ============================================================================ */

export function ExecutiveTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'skills': return <SkillsBadges data={data} color={primaryColor} lang={language} size={sz} />;
      case 'certifications': return <CertificationsSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'languages': return <LanguagesSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={primaryColor} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Top banner */}
      <div style={{ backgroundColor: primaryColor, color: '#ffffff', padding: '32px 36px 24px', position: 'relative' as const }}>
        <div style={{ fontSize: sz + 18, fontWeight: 800, letterSpacing: 0.5, marginBottom: 4 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
        <div style={{ fontSize: sz + 4, fontWeight: 300, opacity: 0.9, marginBottom: 14, letterSpacing: 1 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px 16px', fontSize: sz - 1, opacity: 0.85 }}>
          {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={10} /> {p.email}</span>}
          {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} /> {p.phone}</span>}
          {(p.city || p.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Globe size={10} /> {p.website}</span>}
          {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={10} /> {p.linkedin}</span>}
          {p.github && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Github size={10} /> {p.github}</span>}
        </div>
        {/* Thin gold accent line at bottom */}
        <div style={{ position: 'absolute' as const, bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'rgba(255,255,255,0.3)' }} />
      </div>

      {/* Photo floating */}
      {p.photo && (
        <div style={{ position: 'relative' as const, marginTop: -30, marginInlineEnd: 36, float: isRtl(language) ? 'left' : 'right' }}>
          <img src={p.photo} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${primaryColor}`, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
        </div>
      )}

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '20px 36px 8px', clear: 'both' as const }}>
          <HeadingLine title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} color={primaryColor} size={sz} />
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 36px 32px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 16 }}>
            <HeadingLine title={sectionLabel(type, language)} color={primaryColor} size={sz} />
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   4. CREATIVE TEMPLATE – Geometric accent, skill bars                       */
/*                                                                              */
/* ============================================================================ */

export function CreativeTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'skills': return <SkillsBars data={data} color={primaryColor} lang={language} size={sz} />;
      case 'certifications': return <CertificationsSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'languages': return <LanguagesDots data={data} color={primaryColor} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={primaryColor} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d, position: 'relative' as const, overflow: 'hidden' as const }}>
      {/* Geometric corner accent */}
      <div style={{
        position: 'absolute' as const,
        top: 0,
        [isRtl(language) ? 'left' : 'right']: 0,
        width: 120,
        height: 120,
        backgroundColor: primaryColor,
        clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
        [isRtl(language) ? 'clipPath' : 'clipPath']: isRtl(language) ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)',
        opacity: 0.15,
      }} />
      <div style={{
        position: 'absolute' as const,
        top: 0,
        [isRtl(language) ? 'left' : 'right']: 0,
        width: 80,
        height: 80,
        backgroundColor: primaryColor,
        clipPath: isRtl(language) ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)',
      }} />

      {/* Header */}
      <div style={{ padding: '28px 32px 16px', display: 'flex', gap: 20, alignItems: 'center' }}>
        {p.photo && (
          <div style={{ flexShrink: 0 }}>
            <img src={p.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${primaryColor}`, boxShadow: `0 0 0 4px ${primaryColor}20` }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: sz + 14, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
          <div style={{ fontSize: sz + 3, fontWeight: 500, color: primaryColor, marginBottom: 8 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
          <ContactItems info={p} color={primaryColor} lang={language} size={sz - 1} />
        </div>
      </div>

      {/* Colored divider with creative pattern */}
      <div style={{ margin: '0 32px', height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}60, ${primaryColor}20)` }} />

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '16px 32px 8px' }}>
          <div style={{ fontSize: sz + 3, fontWeight: 700, color: primaryColor, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 20, height: 3, borderRadius: 2, backgroundColor: primaryColor }} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </div>
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 32px 32px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 14 }}>
            <div style={{ fontSize: sz + 3, fontWeight: 700, color: primaryColor, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 20, height: 3, borderRadius: 2, backgroundColor: primaryColor }} />
              {sectionLabel(type, language)}
            </div>
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   5. MINIMAL TEMPLATE – Ultra-clean, font-focused                           */
/*                                                                              */
/* ============================================================================ */

export function MinimalTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'skills': return (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 8px' }}>
          {data.skills.map((sk) => (
            <span key={sk.id} style={{ fontSize: sz, color: '#444' }}>{sk.name}<span style={{ color: '#aaa', marginInlineStart: 2 }}>·</span></span>
          ))}
        </div>
      );
      case 'certifications': return <CertificationsSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'languages': return <LanguagesSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={primaryColor} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Header – super clean */}
      <div style={{ padding: '40px 40px 20px' }}>
        <div style={{ fontSize: sz + 16, fontWeight: 300, color: '#1a1a1a', marginBottom: 4, letterSpacing: 2 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
        <div style={{ fontSize: sz + 2, fontWeight: 400, color: primaryColor, marginBottom: 12, letterSpacing: 1 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
        <div style={{ height: 1, backgroundColor: '#e0e0e0', marginBottom: 10 }} />
        <ContactItems info={p} color={primaryColor} lang={language} size={sz - 1} iconSize={9} />
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '8px 40px' }}>
          <HeadingMinimal title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} color={primaryColor} size={sz} />
          <div style={{ fontSize: sz, color: '#555', whiteSpace: 'pre-line' as const, lineHeight: 1.7 }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 40px 40px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 18 }}>
            <HeadingMinimal title={sectionLabel(type, language)} color={primaryColor} size={sz} />
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   6. CORPORATE TEMPLATE – Top bar + side accent, box sections               */
/*                                                                              */
/* ============================================================================ */

export function CorporateTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'skills': return <SkillsBadges data={data} color={primaryColor} lang={language} size={sz} />;
      case 'certifications': return <CertificationsSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'languages': return <LanguagesSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={primaryColor} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Top color bar */}
      <div style={{ height: 6, backgroundColor: primaryColor }} />

      <div style={{ display: 'flex' }}>
        {/* Side accent line */}
        <div style={{ width: 4, backgroundColor: primaryColor, flexShrink: 0 }} />

        <div style={{ flex: 1 }}>
          {/* Header */}
          <div style={{ padding: '24px 28px 16px', display: 'flex', gap: 16, alignItems: 'center' }}>
            {p.photo && (
              <div style={{ flexShrink: 0 }}>
                <img src={p.photo} alt="" style={{ width: 64, height: 64, borderRadius: 4, objectFit: 'cover', border: `2px solid ${primaryColor}30` }} />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: sz + 10, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
              <div style={{ fontSize: sz + 2, fontWeight: 500, color: primaryColor, marginBottom: 6 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
              <ContactItems info={p} color={primaryColor} lang={language} size={sz - 1} />
            </div>
          </div>

          {/* Summary */}
          {p.summary && (
            <div style={{ padding: '4px 28px 8px' }}>
              <HeadingBox title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} color={primaryColor} size={sz} />
              <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
            </div>
          )}

          {/* Sections in a grid-like layout */}
          <div style={{ padding: '4px 28px 28px' }}>
            {sections.map((type) => (
              <div key={type} style={{ marginTop: 14, padding: 12, backgroundColor: '#f9fafb', borderRadius: 4, borderLeft: `3px solid ${primaryColor}` }}>
                <HeadingBox title={sectionLabel(type, language)} color={primaryColor} size={sz} />
                {renderSection(type)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   7. ATS TEMPLATE – Maximum parseability                                    */
/*                                                                              */
/* ============================================================================ */

export function ATSTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return (
        <div>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: sz + 1 }}>{exp.jobTitle}</div>
              <div style={{ fontSize: sz, color: '#333' }}>{exp.company}</div>
              <div style={{ fontSize: sz - 1, color: '#666' }}>{formatDateRange(exp.startDate, exp.endDate, exp.current, language)}</div>
              {exp.description && <div style={{ fontSize: sz, color: '#444', marginTop: 3, whiteSpace: 'pre-line' as const }}>{exp.description}</div>}
            </div>
          ))}
        </div>
      );
      case 'education': return (
        <div>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: sz + 1 }}>{edu.major}</div>
              <div style={{ fontSize: sz, color: '#333' }}>{edu.institution}{edu.degree ? ` — ${DEGREE_LABELS[language][edu.degree as DegreeType] || edu.degree}` : ''}</div>
              <div style={{ fontSize: sz - 1, color: '#666' }}>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</div>
              {edu.description && <div style={{ fontSize: sz, color: '#444', marginTop: 2 }}>{edu.description}</div>}
            </div>
          ))}
        </div>
      );
      case 'skills': return (
        <div style={{ fontSize: sz, color: '#333' }}>
          {data.skills.map((sk, i) => (
            <span key={sk.id}>{sk.name}{i < data.skills.length - 1 ? ' | ' : ''}</span>
          ))}
        </div>
      );
      case 'certifications': return (
        <div>
          {data.certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{c.name}</span>{c.issuer ? ` — ${c.issuer}` : ''}{c.date ? ` (${c.date})` : ''}
            </div>
          ))}
        </div>
      );
      case 'languages': return (
        <div style={{ fontSize: sz, color: '#333' }}>
          {data.languages.map((l, i) => (
            <span key={l.id}>{l.name}: {LANGUAGE_LEVEL_LABELS[language][l.level]}{i < data.languages.length - 1 ? ' | ' : ''}</span>
          ))}
        </div>
      );
      case 'projects': return (
        <div>
          {data.projects.map((p) => (
            <div key={p.id} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: sz + 1 }}>{p.name}</span>
              {p.url && <span style={{ fontSize: sz - 1, color: '#666', marginInlineStart: 6 }}>({p.url})</span>}
              {p.description && <div style={{ fontSize: sz, color: '#444', marginTop: 2 }}>{p.description}</div>}
              {p.technologies.length > 0 && <div style={{ fontSize: sz - 1, color: '#666', marginTop: 1 }}>Technologies: {p.technologies.join(', ')}</div>}
            </div>
          ))}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d, padding: '32px 40px' }}>
      {/* Header – plain text, no graphics */}
      <div style={{ marginBottom: 16, textAlign: 'center' as const }}>
        <div style={{ fontSize: sz + 12, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
        <div style={{ fontSize: sz + 2, fontWeight: 500, color: '#333', marginBottom: 8 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
        <div style={{ fontSize: sz - 1, color: '#555', display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: '4px 14px' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {(p.city || p.country) && <span>{[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.website && <span>{p.website}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#1a1a1a', marginBottom: 12 }} />

      {/* Summary */}
      {p.summary && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4, color: '#1a1a1a' }}>
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </div>
          <div style={{ fontSize: sz, color: '#333', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      {sections.map((type) => (
        <div key={type} style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6, color: '#1a1a1a', borderBottom: '1px solid #1a1a1a', paddingBottom: 2 }}>
            {sectionLabel(type, language)}
          </div>
          {renderSection(type)}
        </div>
      ))}
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   8. MEDICAL TEMPLATE – Clinical feel, cross accent                         */
/*                                                                              */
/* ============================================================================ */

export function MedicalTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'skills': return <SkillsBars data={data} color={primaryColor} lang={language} size={sz} />;
      case 'certifications': return <CertificationsSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'languages': return <LanguagesDots data={data} color={primaryColor} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={primaryColor} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Medical cross accent in header */}
      <div style={{ backgroundColor: primaryColor, padding: '24px 32px 20px', position: 'relative' as const, overflow: 'hidden' as const }}>
        {/* Decorative cross */}
        <div style={{ position: 'absolute' as const, top: 10, [isRtl(language) ? 'left' : 'right']: 20, opacity: 0.12 }}>
          <div style={{ width: 60, height: 20, backgroundColor: '#fff', borderRadius: 3, position: 'absolute' as const, top: 20, left: 0 }} />
          <div style={{ width: 20, height: 60, backgroundColor: '#fff', borderRadius: 3, position: 'absolute' as const, top: 0, left: 20 }} />
        </div>

        <div style={{ display: 'flex', gap: 18, alignItems: 'center', position: 'relative' as const, zIndex: 1 }}>
          {p.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={p.photo} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)' }} />
            </div>
          )}
          <div style={{ flex: 1, color: '#ffffff' }}>
            <div style={{ fontSize: sz + 12, fontWeight: 800, marginBottom: 2 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
            <div style={{ fontSize: sz + 3, fontWeight: 400, opacity: 0.9, marginBottom: 8 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px', fontSize: sz - 1, opacity: 0.85 }}>
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={10} /> {p.email}</span>}
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} /> {p.phone}</span>}
              {(p.city || p.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Globe size={10} /> {p.website}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={10} /> {p.linkedin}</span>}
              {p.github && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Github size={10} /> {p.github}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Thin accent line */}
      <div style={{ height: 3, backgroundColor: primaryColor, opacity: 0.3 }} />

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '16px 32px 8px' }}>
          <HeadingLine title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} color={primaryColor} size={sz} />
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 32px 32px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 14 }}>
            <HeadingLine title={sectionLabel(type, language)} color={primaryColor} size={sz} />
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   9. ENGINEERING TEMPLATE – Blueprint-style header, grid feel               */
/*                                                                              */
/* ============================================================================ */

export function EngineeringTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'skills': return <SkillsBars data={data} color={primaryColor} lang={language} size={sz} />;
      case 'certifications': return <CertificationsSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'languages': return <LanguagesDots data={data} color={primaryColor} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={primaryColor} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Blueprint-style header with grid pattern */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '28px 32px 20px', position: 'relative' as const, overflow: 'hidden' as const }}>
        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }} />

        <div style={{ display: 'flex', gap: 18, alignItems: 'center', position: 'relative' as const, zIndex: 1 }}>
          {p.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={p.photo} alt="" style={{ width: 72, height: 72, borderRadius: 4, objectFit: 'cover', border: `2px solid ${primaryColor}` }} />
            </div>
          )}
          <div style={{ flex: 1, color: '#ffffff' }}>
            <div style={{ fontSize: sz + 12, fontWeight: 800, letterSpacing: 1, marginBottom: 2 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
            <div style={{ fontSize: sz + 2, fontWeight: 400, color: primaryColor, fontFamily: '"Courier New", monospace', marginBottom: 8, letterSpacing: 0.5 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px', fontSize: sz - 1, color: '#aaa' }}>
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={10} /> {p.email}</span>}
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} /> {p.phone}</span>}
              {(p.city || p.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Globe size={10} /> {p.website}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={10} /> {p.linkedin}</span>}
              {p.github && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Github size={10} /> {p.github}</span>}
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{ position: 'absolute' as const, bottom: 0, left: 0, right: 0, height: 3, backgroundColor: primaryColor }} />
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '16px 32px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, backgroundColor: primaryColor, transform: 'rotate(45deg)' }} />
            <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 1, color: '#1a1a1a' }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</div>
          </div>
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const, borderLeft: `2px solid ${primaryColor}30`, paddingInlineStart: 12 }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 32px 32px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, backgroundColor: primaryColor, transform: 'rotate(45deg)' }} />
              <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 1, color: '#1a1a1a' }}>{sectionLabel(type, language)}</div>
            </div>
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   10. ACADEMIC TEMPLATE – Publication-style, no photo default               */
/*                                                                              */
/* ============================================================================ */

export function AcademicTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'education': return (
        <div>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: sz + 1 }}>{edu.major}</div>
                  <div style={{ fontSize: sz, color: '#555', fontStyle: 'italic' }}>{edu.institution}{edu.degree ? ` — ${DEGREE_LABELS[language][edu.degree as DegreeType] || edu.degree}` : ''}</div>
                </div>
                <div style={{ fontSize: sz - 1, color: '#888', whiteSpace: 'nowrap' as const }}>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</div>
              </div>
              {edu.description && <div style={{ fontSize: sz - 1, color: '#666', marginTop: 2, fontStyle: 'italic' }}>{edu.description}</div>}
            </div>
          ))}
        </div>
      );
      case 'skills': return (
        <div>
          {data.skills.reduce<string[][]>((acc, sk, i) => {
            const col = i % 2;
            if (!acc[col]) acc[col] = [];
            acc[col].push(sk.name);
            return acc;
          }, []).map((col, ci) => (
            <div key={ci} style={{ flex: 1, fontSize: sz, color: '#444' }}>
              {col.map((name, ni) => <div key={ni} style={{ marginBottom: 2, paddingInlineStart: 12, position: 'relative' as const }}>• {name}</div>)}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 24 }}>
            {data.skills.reduce<string[][]>((acc, sk, i) => {
              const col = i % 2;
              if (!acc[col]) acc[col] = [];
              acc[col].push(sk.name);
              return acc;
            }, []).map((col, ci) => (
              <div key={ci} style={{ flex: 1, fontSize: sz, color: '#444' }}>
                {col.map((name, ni) => <div key={ni} style={{ marginBottom: 2, paddingInlineStart: 12 }}>• {name}</div>)}
              </div>
            ))}
          </div>
        </div>
      );
      case 'certifications': return <CertificationsSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'languages': return <LanguagesSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'projects': return (
        <div>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: sz + 1, fontStyle: 'italic' }}>{proj.name}</div>
              {proj.description && <div style={{ fontSize: sz, color: '#444', marginTop: 2 }}>{proj.description}</div>}
              {proj.technologies.length > 0 && <div style={{ fontSize: sz - 1, color: '#777', marginTop: 2, fontStyle: 'italic' }}>Keywords: {proj.technologies.join(', ')}</div>}
            </div>
          ))}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Header – academic, centered, no photo */}
      <div style={{ padding: '36px 40px 20px', textAlign: 'center' as const, borderBottom: `2px solid ${primaryColor}` }}>
        <div style={{ fontSize: sz + 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4, letterSpacing: 0.5 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
        {p.jobTitle && <div style={{ fontSize: sz + 2, color: primaryColor, marginBottom: 8, fontStyle: 'italic' }}>{p.jobTitle}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: '4px 16px', fontSize: sz - 1, color: '#555' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {(p.city || p.country) && <span>{[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.website && <span>{p.website}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '16px 40px 8px' }}>
          <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 1, color: primaryColor, marginBottom: 6, textAlign: 'center' as const }}>
            {language === 'ar' ? 'نبذة احترافية' : 'Research Interests & Summary'}
          </div>
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const, textAlign: 'justify' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Sections – education first is typical for academic */}
      <div style={{ padding: '8px 40px 40px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 1, color: primaryColor, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${primaryColor}40` }}>
              {sectionLabel(type, language)}
            </div>
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   11. ELEGANT TEMPLATE – Gradient header, serif headings                    */
/*                                                                              */
/* ============================================================================ */

export function ElegantTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  const serifFont = '"Playfair Display", Georgia, serif';

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'skills': return <SkillsBadges data={data} color={primaryColor} lang={language} size={sz} />;
      case 'certifications': return <CertificationsSection data={data} color={primaryColor} lang={language} size={sz} />;
      case 'languages': return <LanguagesDots data={data} color={primaryColor} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={primaryColor} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Gradient header */}
      <div style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc, ${primaryColor}88)`,
        padding: '32px 36px 24px',
        position: 'relative' as const,
        overflow: 'hidden' as const,
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute' as const,
          top: -30,
          [isRtl(language) ? 'left' : 'right']: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.1)',
        }} />
        <div style={{
          position: 'absolute' as const,
          top: -10,
          [isRtl(language) ? 'left' : 'right']: -10,
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.08)',
        }} />

        <div style={{ display: 'flex', gap: 20, alignItems: 'center', position: 'relative' as const, zIndex: 1 }}>
          {p.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={p.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
            </div>
          )}
          <div style={{ flex: 1, color: '#ffffff' }}>
            <div style={{ fontFamily: serifFont, fontSize: sz + 16, fontWeight: 700, marginBottom: 2, letterSpacing: 0.5 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
            <div style={{ fontSize: sz + 2, fontWeight: 300, opacity: 0.9, marginBottom: 10, letterSpacing: 1 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px', fontSize: sz - 1, opacity: 0.85 }}>
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={10} /> {p.email}</span>}
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} /> {p.phone}</span>}
              {(p.city || p.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Globe size={10} /> {p.website}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={10} /> {p.linkedin}</span>}
              {p.github && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Github size={10} /> {p.github}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Thin gold/accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${primaryColor}, transparent)` }} />

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '16px 36px 8px' }}>
          <div style={{ fontFamily: serifFont, fontWeight: 700, fontSize: sz + 4, color: primaryColor, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
            <div style={{ flex: 1, height: 1, backgroundColor: `${primaryColor}30` }} />
          </div>
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 36px 36px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 14 }}>
            <div style={{ fontFamily: serifFont, fontWeight: 700, fontSize: sz + 4, color: primaryColor, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              {sectionLabel(type, language)}
              <div style={{ flex: 1, height: 1, backgroundColor: `${primaryColor}30` }} />
            </div>
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   12. PREMIUM DARK TEMPLATE – Dark theme, gold/amber accents                */
/*                                                                              */
/* ============================================================================ */

export function PremiumDarkTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  const darkBg = '#1a1a2e';
  const darkerBg = '#16162a';
  const cardBg = '#222240';
  const textPrimary = '#f0f0f0';
  const textSecondary = '#a0a0b8';

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return (
        <div>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 12, padding: 10, backgroundColor: cardBg, borderRadius: 6, borderLeft: `3px solid ${primaryColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: sz + 1, color: textPrimary }}>{exp.jobTitle}</div>
                  <div style={{ fontSize: sz, color: primaryColor, fontWeight: 500 }}>{exp.company}</div>
                </div>
                <div style={{ fontSize: sz - 1, color: textSecondary, whiteSpace: 'nowrap' as const }}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current, language)}
                </div>
              </div>
              {exp.description && (
                <div style={{ fontSize: sz - 1, color: textSecondary, marginTop: 4, whiteSpace: 'pre-line' as const }}>{exp.description}</div>
              )}
            </div>
          ))}
        </div>
      );
      case 'education': return (
        <div>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 10, padding: 10, backgroundColor: cardBg, borderRadius: 6, borderLeft: `3px solid ${primaryColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: sz + 1, color: textPrimary }}>{edu.major}</div>
                  <div style={{ fontSize: sz, color: textSecondary }}>{edu.institution}{edu.degree ? ` — ${DEGREE_LABELS[language][edu.degree as DegreeType] || edu.degree}` : ''}</div>
                </div>
                <div style={{ fontSize: sz - 1, color: textSecondary, whiteSpace: 'nowrap' as const }}>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      );
      case 'skills': return (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
          {data.skills.map((sk) => (
            <span key={sk.id} style={{
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: sz - 1,
              fontWeight: 500,
              backgroundColor: primaryColor + '20',
              color: primaryColor,
              border: `1px solid ${primaryColor}30`,
            }}>
              {sk.name}
            </span>
          ))}
        </div>
      );
      case 'certifications': return (
        <div>
          {data.certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: 6, padding: 8, backgroundColor: cardBg, borderRadius: 6 }}>
              <span style={{ fontWeight: 600, fontSize: sz, color: textPrimary }}>{c.name}</span>
              <span style={{ fontSize: sz - 1, color: textSecondary, marginInlineStart: 6 }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</span>
            </div>
          ))}
        </div>
      );
      case 'languages': return (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px 16px' }}>
          {data.languages.map((l) => {
            const filled = getLanguageDots(l.level);
            return (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: sz, fontWeight: 500, color: textPrimary }}>{l.name}</span>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div key={dot} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: dot <= filled ? primaryColor : '#333355' }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
      case 'projects': return (
        <div>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 10, padding: 10, backgroundColor: cardBg, borderRadius: 6, borderLeft: `3px solid ${primaryColor}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: sz + 1, color: textPrimary }}>{proj.name}</span>
                {proj.url && <ExternalLink size={10} style={{ color: primaryColor }} />}
              </div>
              {proj.description && <div style={{ fontSize: sz - 1, color: textSecondary, marginTop: 2 }}>{proj.description}</div>}
              {proj.technologies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginTop: 4 }}>
                  {proj.technologies.map((t) => (
                    <span key={t} style={{ fontSize: sz - 2, padding: '2px 6px', borderRadius: 3, backgroundColor: primaryColor + '15', color: primaryColor, border: `1px solid ${primaryColor}25` }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d, backgroundColor: darkBg, color: textPrimary }}>
      {/* Dark header */}
      <div style={{ backgroundColor: darkerBg, padding: '28px 32px 20px', position: 'relative' as const, overflow: 'hidden' as const }}>
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute' as const,
          top: -40,
          [isRtl(language) ? 'left' : 'right']: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}15, transparent)`,
        }} />

        <div style={{ display: 'flex', gap: 18, alignItems: 'center', position: 'relative' as const, zIndex: 1 }}>
          {p.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={p.photo} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${primaryColor}`, boxShadow: `0 0 20px ${primaryColor}30` }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: sz + 14, fontWeight: 800, color: textPrimary, marginBottom: 2, letterSpacing: 0.5 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
            <div style={{ fontSize: sz + 2, fontWeight: 400, color: primaryColor, marginBottom: 10, letterSpacing: 1 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px', fontSize: sz - 1, color: textSecondary }}>
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={10} style={{ color: primaryColor }} /> {p.email}</span>}
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} style={{ color: primaryColor }} /> {p.phone}</span>}
              {(p.city || p.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} style={{ color: primaryColor }} /> {[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Globe size={10} style={{ color: primaryColor }} /> {p.website}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={10} style={{ color: primaryColor }} /> {p.linkedin}</span>}
              {p.github && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Github size={10} style={{ color: primaryColor }} /> {p.github}</span>}
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{ position: 'absolute' as const, bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}40, transparent)` }} />
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '16px 32px 8px' }}>
          <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 1.5, color: primaryColor, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 16, height: 2, backgroundColor: primaryColor, display: 'inline-block' }} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </div>
          <div style={{ fontSize: sz, color: textSecondary, whiteSpace: 'pre-line' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 32px 32px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 1.5, color: primaryColor, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 16, height: 2, backgroundColor: primaryColor, display: 'inline-block' }} />
              {sectionLabel(type, language)}
            </div>
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   13. LUXURY TEMPLATE – Dark navy/charcoal with gold accents                 */
/*                                                                              */
/* ============================================================================ */

export function LuxuryTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const gold = '#D97706';
  const darkBg = '#1B2A4A';
  const charcoalBg = '#0F1B33';

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return (
        <div>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 10, padding: '8px 10px', borderLeft: `2px solid ${gold}`, backgroundColor: 'rgba(217,119,6,0.04)', borderRadius: '0 4px 4px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a' }}>{exp.jobTitle}</div>
                  <div style={{ fontSize: sz, color: gold, fontWeight: 500 }}>{exp.company}</div>
                </div>
                <div style={{ fontSize: sz - 1, color: '#999', whiteSpace: 'nowrap' as const }}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current, language)}
                </div>
              </div>
              {exp.description && (
                <div style={{ fontSize: sz - 1, color: '#666', marginTop: 2, whiteSpace: 'pre-line' as const }}>{exp.description}</div>
              )}
            </div>
          ))}
        </div>
      );
      case 'education': return (
        <div>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 8, padding: '6px 10px', borderLeft: `2px solid ${gold}`, backgroundColor: 'rgba(217,119,6,0.04)', borderRadius: '0 4px 4px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a' }}>{edu.major}</div>
                  <div style={{ fontSize: sz, color: '#555' }}>{edu.institution}{edu.degree ? ` — ${DEGREE_LABELS[language][edu.degree as DegreeType] || edu.degree}` : ''}</div>
                </div>
                <div style={{ fontSize: sz - 1, color: '#999', whiteSpace: 'nowrap' as const }}>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      );
      case 'skills': return (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
          {data.skills.map((sk) => (
            <span key={sk.id} style={{
              padding: '3px 10px',
              borderRadius: 3,
              fontSize: sz - 1,
              fontWeight: 500,
              border: `1px solid ${gold}40`,
              color: darkBg,
              backgroundColor: 'rgba(217,119,6,0.08)',
            }}>
              {sk.name}<span style={{ opacity: 0.5, marginInlineStart: 3 }}>· {SKILL_LEVEL_LABELS[language][sk.level]}</span>
            </span>
          ))}
        </div>
      );
      case 'certifications': return <CertificationsSection data={data} color={gold} lang={language} size={sz} />;
      case 'languages': return <LanguagesDots data={data} color={gold} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={gold} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Dark navy header */}
      <div style={{ backgroundColor: darkBg, color: '#f5f0e8', padding: '32px 32px 24px', position: 'relative' as const }}>
        {/* Gold decorative line at top */}
        <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${gold}, ${gold}80, ${gold}20, transparent)` }} />

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {p.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={p.photo} alt="" style={{ width: 82, height: 82, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${gold}`, boxShadow: `0 0 0 3px ${gold}30` }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: sz + 16, fontWeight: 800, color: '#f5f0e8', marginBottom: 2, fontFamily: 'Georgia, serif', letterSpacing: 1 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
            <div style={{ fontSize: sz + 3, fontWeight: 400, color: gold, marginBottom: 10, letterSpacing: 1.5, textTransform: 'uppercase' as const }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px', fontSize: sz - 1, color: 'rgba(245,240,232,0.7)' }}>
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={10} style={{ color: gold }} /> {p.email}</span>}
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} style={{ color: gold }} /> {p.phone}</span>}
              {(p.city || p.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} style={{ color: gold }} /> {[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Globe size={10} style={{ color: gold }} /> {p.website}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={10} style={{ color: gold }} /> {p.linkedin}</span>}
              {p.github && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Github size={10} style={{ color: gold }} /> {p.github}</span>}
            </div>
          </div>
        </div>

        {/* Gold decorative bottom border */}
        <div style={{ position: 'absolute' as const, bottom: 0, left: 32, right: 32, height: 1, backgroundColor: `${gold}40` }} />
        <div style={{ position: 'absolute' as const, bottom: -1, left: 32, width: 60, height: 2, backgroundColor: gold }} />
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '20px 32px 8px' }}>
          <div style={{ fontWeight: 700, fontSize: sz + 3, fontFamily: 'Georgia, serif', textTransform: 'uppercase' as const, letterSpacing: 1.5, color: darkBg, marginBottom: 6, paddingBottom: 4, borderBottom: `1px solid ${gold}30`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 24, height: 2, backgroundColor: gold }} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </div>
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const, lineHeight: 1.6 }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 32px 32px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 700, fontSize: sz + 3, fontFamily: 'Georgia, serif', textTransform: 'uppercase' as const, letterSpacing: 1.5, color: darkBg, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${gold}30`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 24, height: 2, backgroundColor: gold }} />
              {sectionLabel(type, language)}
            </div>
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   14. STARTUP TEMPLATE – Fresh green, card-style, tech-forward               */
/*                                                                              */
/* ============================================================================ */

export function StartupTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const green = '#059669';

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={green} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={green} lang={language} size={sz} />;
      case 'skills': return (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
          {data.skills.map((sk) => (
            <span key={sk.id} style={{
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: sz - 1,
              fontWeight: 500,
              backgroundColor: '#ECFDF5',
              color: green,
              border: `1px solid ${green}30`,
            }}>
              {sk.name}
            </span>
          ))}
        </div>
      );
      case 'certifications': return <CertificationsSection data={data} color={green} lang={language} size={sz} />;
      case 'languages': return <LanguagesDots data={data} color={green} lang={language} size={sz} />;
      case 'projects': return (
        <div>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 10, padding: 12, borderLeft: `3px solid ${green}`, backgroundColor: '#F0FDF4', borderRadius: '0 6px 6px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a' }}>{proj.name}</span>
                {proj.url && <ExternalLink size={10} style={{ color: green }} />}
              </div>
              {proj.description && <div style={{ fontSize: sz - 1, color: '#555', marginTop: 2 }}>{proj.description}</div>}
              {proj.technologies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginTop: 4 }}>
                  {proj.technologies.map((t) => (
                    <span key={t} style={{ fontSize: sz - 2, padding: '1px 8px', borderRadius: 10, backgroundColor: '#D1FAE5', color: '#065F46' }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Bold green top section */}
      <div style={{ backgroundColor: green, color: '#ffffff', padding: '28px 32px 22px', position: 'relative' as const }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          {p.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={p.photo} alt="" style={{ width: 78, height: 78, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.6)' }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: sz + 14, fontWeight: 800, marginBottom: 2, letterSpacing: 0.5 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
            <div style={{ fontSize: sz + 2, fontWeight: 400, opacity: 0.9, marginBottom: 8, letterSpacing: 0.5 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px', fontSize: sz - 1, opacity: 0.85 }}>
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={10} /> {p.email}</span>}
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} /> {p.phone}</span>}
              {(p.city || p.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Globe size={10} /> {p.website}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={10} /> {p.linkedin}</span>}
              {p.github && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Github size={10} /> {p.github}</span>}
            </div>
          </div>
        </div>
        {/* Subtle pattern at bottom */}
        <div style={{ position: 'absolute' as const, bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'rgba(0,0,0,0.15)' }} />
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '18px 32px 8px' }}>
          <HeadingAccent title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} color={green} size={sz} />
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 32px 32px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 14, padding: '10px 14px', borderLeft: `3px solid ${green}`, backgroundColor: '#FAFAFA', borderRadius: '0 6px 6px 0' }}>
            <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 0.5, color: green, marginBottom: 6 }}>
              {sectionLabel(type, language)}
            </div>
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   15. CONSULTANT TEMPLATE – Deep blue, sidebar, diamond markers              */
/*                                                                              */
/* ============================================================================ */

export function ConsultantTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const deepBlue = '#1E3A5F';

  const sideSections = ['skills', 'certifications', 'languages'];
  const mainSections = ['experience', 'education', 'projects'];
  const sidebarItems = sideSections.filter((s) => sections.includes(s));
  const mainItems = mainSections.filter((s) => sections.includes(s));

  const renderSideSection = (type: string) => {
    switch (type) {
      case 'skills': return (
        <div>
          {data.skills.map((sk) => (
            <div key={sk.id} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: sz - 1, marginBottom: 2 }}>
                <span style={{ fontWeight: 500 }}>{sk.name}</span>
                <span style={{ opacity: 0.7, fontSize: sz - 2 }}>{SKILL_LEVEL_LABELS[language][sk.level]}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, width: getSkillWidth(sk.level), backgroundColor: 'rgba(255,255,255,0.7)' }} />
              </div>
            </div>
          ))}
        </div>
      );
      case 'certifications': return (
        <div>
          {data.certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: 6, fontSize: sz - 1 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ opacity: 0.7 }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
            </div>
          ))}
        </div>
      );
      case 'languages': return (
        <div>
          {data.languages.map((l) => {
            const filled = getLanguageDots(l.level);
            return (
              <div key={l.id} style={{ marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: sz - 1, minWidth: 60 }}>{l.name}</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div key={dot} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: dot <= filled ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.15)' }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
      default: return null;
    }
  };

  const renderMainSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={deepBlue} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={deepBlue} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={deepBlue} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d, display: 'flex' }}>
      {/* Sidebar – narrow ~25% */}
      <div style={{
        width: '25%',
        backgroundColor: deepBlue,
        color: '#ffffff',
        padding: '28px 16px',
        boxSizing: 'border-box' as const,
      }}>
        {p.photo && (
          <div style={{ textAlign: 'center' as const, marginBottom: 14 }}>
            <img src={p.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)', margin: '0 auto', display: 'block' }} />
          </div>
        )}

        <div style={{ textAlign: 'center' as const, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: sz + 6, fontWeight: 800, marginBottom: 3 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
          <div style={{ fontSize: sz, opacity: 0.8, fontWeight: 400 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: sz, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, backgroundColor: '#ffffff', transform: 'rotate(45deg)' }} />
            {language === 'ar' ? 'تواصل' : 'Contact'}
          </div>
          {p.email && <div style={{ fontSize: sz - 2, marginBottom: 4, wordBreak: 'break-all' as const }}>{p.email}</div>}
          {p.phone && <div style={{ fontSize: sz - 2, marginBottom: 4 }}>{p.phone}</div>}
          {(p.city || p.country) && <div style={{ fontSize: sz - 2, marginBottom: 4 }}>{[p.city, p.country].filter(Boolean).join(', ')}</div>}
          {p.website && <div style={{ fontSize: sz - 2, marginBottom: 4, wordBreak: 'break-all' as const }}>{p.website}</div>}
          {p.linkedin && <div style={{ fontSize: sz - 2, marginBottom: 4, wordBreak: 'break-all' as const }}>{p.linkedin}</div>}
          {p.github && <div style={{ fontSize: sz - 2, marginBottom: 4, wordBreak: 'break-all' as const }}>{p.github}</div>}
        </div>

        {/* Sidebar sections */}
        {sidebarItems.map((type) => (
          <div key={type} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: sz, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, backgroundColor: '#ffffff', transform: 'rotate(45deg)' }} />
              {sectionLabel(type, language)}
            </div>
            {renderSideSection(type)}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ width: '75%', padding: '28px 24px' }}>
        {p.summary && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 0.5, color: deepBlue, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, backgroundColor: deepBlue, transform: 'rotate(45deg)' }} />
              {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
            </div>
            <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
          </div>
        )}

        {mainItems.map((type) => (
          <div key={type} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 0.5, color: deepBlue, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, backgroundColor: deepBlue, transform: 'rotate(45deg)' }} />
              {sectionLabel(type, language)}
            </div>
            {renderMainSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   16. SOFTWARE TEMPLATE – Blue/cyan tech, grid lines, monospace              */
/*                                                                              */
/* ============================================================================ */

export function SoftwareTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const blue = '#2563EB';
  const cyan = '#06B6D4';

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return (
        <div>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 12, padding: '8px 12px', borderLeft: `2px solid ${blue}`, backgroundColor: '#F8FAFC', borderRadius: '0 4px 4px 0', position: 'relative' as const }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a', fontFamily: '"Courier New", monospace' }}>{exp.jobTitle}</div>
                  <div style={{ fontSize: sz, color: blue, fontWeight: 500 }}>{exp.company}</div>
                </div>
                <div style={{ fontSize: sz - 1, color: '#999', whiteSpace: 'nowrap' as const, fontFamily: '"Courier New", monospace' }}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current, language)}
                </div>
              </div>
              {exp.description && (
                <div style={{ fontSize: sz - 1, color: '#666', marginTop: 3, whiteSpace: 'pre-line' as const }}>{exp.description}</div>
              )}
            </div>
          ))}
        </div>
      );
      case 'education': return <EducationSection data={data} color={blue} lang={language} size={sz} />;
      case 'skills': return (
        <div>
          {data.skills.map((sk) => (
            <div key={sk.id} style={{ marginBottom: 7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: sz - 1, marginBottom: 2 }}>
                <span style={{ fontWeight: 500, fontFamily: '"Courier New", monospace' }}>{sk.name}</span>
                <span style={{ color: '#888', fontSize: sz - 2 }}>{SKILL_LEVEL_LABELS[language][sk.level]}</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, backgroundColor: '#E2E8F0', overflow: 'hidden', position: 'relative' as const }}>
                <div style={{ height: '100%', borderRadius: 3, width: getSkillWidth(sk.level), background: `linear-gradient(90deg, ${blue}, ${cyan})` }} />
              </div>
            </div>
          ))}
        </div>
      );
      case 'certifications': return <CertificationsSection data={data} color={blue} lang={language} size={sz} />;
      case 'languages': return <LanguagesDots data={data} color={blue} lang={language} size={sz} />;
      case 'projects': return (
        <div>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 10, padding: 10, border: `1px solid #E2E8F0`, borderRadius: 6, position: 'relative' as const }}>
              <div style={{ position: 'absolute' as const, top: 0, [isRtl(language) ? 'right' : 'left']: 0, width: 3, height: '100%', backgroundColor: cyan, borderRadius: isRtl(language) ? '0 6px 6px 0' : '6px 0 0 6px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingInlineStart: 8 }}>
                <span style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a' }}>{proj.name}</span>
                {proj.url && <ExternalLink size={10} style={{ color: cyan }} />}
              </div>
              {proj.description && <div style={{ fontSize: sz - 1, color: '#666', marginTop: 2, paddingInlineStart: 8 }}>{proj.description}</div>}
              {proj.technologies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginTop: 4, paddingInlineStart: 8 }}>
                  {proj.technologies.map((t) => (
                    <span key={t} style={{ fontSize: sz - 2, padding: '2px 8px', borderRadius: 3, backgroundColor: '#EFF6FF', color: blue, fontFamily: '"Courier New", monospace' }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d, position: 'relative' as const }}>
      {/* Subtle grid background */}
      <div style={{
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `linear-gradient(${blue}06 1px, transparent 1px), linear-gradient(90deg, ${blue}06 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        pointerEvents: 'none' as const,
      }} />

      {/* Header */}
      <div style={{ padding: '28px 32px 18px', position: 'relative' as const, zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          {p.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={p.photo} alt="" style={{ width: 78, height: 78, borderRadius: 8, objectFit: 'cover', border: `2px solid ${blue}`, boxShadow: `0 0 0 3px ${cyan}30` }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: sz + 14, fontWeight: 800, color: '#0F172A', marginBottom: 2, letterSpacing: 0.5 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
            <div style={{ fontSize: sz + 2, fontWeight: 500, color: blue, marginBottom: 8, fontFamily: '"Courier New", monospace' }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
            <ContactItems info={p} color={blue} lang={language} size={sz - 1} />
          </div>
        </div>
      </div>

      {/* Code-style divider */}
      <div style={{ margin: '0 32px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: cyan, fontFamily: '"Courier New", monospace', fontSize: sz - 2 }}>{'//'}</span>
        <div style={{ flex: 1, height: 1, backgroundColor: `${blue}20` }} />
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '16px 32px 8px', position: 'relative' as const, zIndex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 0.5, color: blue, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"Courier New", monospace' }}>
            <span style={{ color: cyan }}>{'<'}</span>{language === 'ar' ? 'نبذة احترافية' : 'Summary'}<span style={{ color: cyan }}>{' />'}</span>
          </div>
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 32px 32px', position: 'relative' as const, zIndex: 1 }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 0.5, color: blue, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"Courier New", monospace' }}>
              <span style={{ color: cyan }}>{'<'}</span>{sectionLabel(type, language)}<span style={{ color: cyan }}>{' />'}</span>
            </div>
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   17. NURSE TEMPLATE – Pink/rose, soft rounded, compassionate                */
/*                                                                              */
/* ============================================================================ */

export function NurseTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const pink = '#DB2777';

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={pink} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={pink} lang={language} size={sz} />;
      case 'skills': return (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
          {data.skills.map((sk) => (
            <span key={sk.id} style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: sz - 1,
              fontWeight: 500,
              backgroundColor: '#FDF2F8',
              color: pink,
              border: `1px solid ${pink}25`,
            }}>
              {sk.name}<span style={{ opacity: 0.5, marginInlineStart: 3 }}>· {SKILL_LEVEL_LABELS[language][sk.level]}</span>
            </span>
          ))}
        </div>
      );
      case 'certifications': return (
        <div>
          {data.certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: 8, padding: '8px 12px', backgroundColor: '#FDF2F8', borderRadius: 10, borderLeft: `3px solid ${pink}` }}>
              <div style={{ fontWeight: 600, fontSize: sz, color: '#1a1a1a' }}>{c.name}</div>
              <div style={{ fontSize: sz - 1, color: '#888' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
              {c.description && <div style={{ fontSize: sz - 1, color: '#666', marginTop: 2 }}>{c.description}</div>}
            </div>
          ))}
        </div>
      );
      case 'languages': return <LanguagesDots data={data} color={pink} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={pink} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Soft pink header */}
      <div style={{ background: `linear-gradient(135deg, ${pink}, #EC4899)`, color: '#ffffff', padding: '28px 32px 22px', borderRadius: '0 0 20px 0', position: 'relative' as const }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          {p.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={p.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.6)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: sz + 14, fontWeight: 800, marginBottom: 2 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
            <div style={{ fontSize: sz + 3, fontWeight: 400, opacity: 0.9, marginBottom: 10, letterSpacing: 0.5 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px', fontSize: sz - 1, opacity: 0.85 }}>
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={10} /> {p.email}</span>}
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} /> {p.phone}</span>}
              {(p.city || p.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Globe size={10} /> {p.website}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={10} /> {p.linkedin}</span>}
            </div>
          </div>
        </div>
        {/* Heart-inspired divider */}
        <div style={{ position: 'absolute' as const, bottom: -1, left: 32, right: 32, height: 2, borderRadius: 1, background: `linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2), transparent)` }} />
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '18px 32px 8px' }}>
          <HeadingAccent title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} color={pink} size={sz} />
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 32px 32px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 0.5, color: pink, marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${pink}20`, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: pink, opacity: 0.3 }} />
              {sectionLabel(type, language)}
            </div>
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   18. HEALTHCARE TEMPLATE – Teal, medical cross, two-column                  */
/*                                                                              */
/* ============================================================================ */

export function HealthcareTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const teal = '#0D9488';

  const leftCols = ['skills', 'languages'];
  const rightCols = ['experience', 'education', 'certifications', 'projects'];
  const leftItems = leftCols.filter((s) => sections.includes(s));
  const rightItems = rightCols.filter((s) => sections.includes(s));

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return <ExperienceSection data={data} color={teal} lang={language} size={sz} />;
      case 'education': return <EducationSection data={data} color={teal} lang={language} size={sz} />;
      case 'skills': return (
        <div>
          {data.skills.map((sk) => (
            <div key={sk.id} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: sz - 1, fontWeight: 500, marginBottom: 2 }}>{sk.name}</div>
              <div style={{ height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, width: getSkillWidth(sk.level), backgroundColor: teal }} />
              </div>
            </div>
          ))}
        </div>
      );
      case 'certifications': return <CertificationsSection data={data} color={teal} lang={language} size={sz} />;
      case 'languages': return <LanguagesDots data={data} color={teal} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={teal} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Header with medical cross accent */}
      <div style={{ padding: '28px 32px 20px', borderBottom: `3px solid ${teal}`, position: 'relative' as const }}>
        {/* Medical cross decoration */}
        <div style={{ position: 'absolute' as const, top: 14, [isRtl(language) ? 'left' : 'right']: 32, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' as const }}>
          <div style={{ position: 'absolute' as const, width: 14, height: 36, backgroundColor: `${teal}15`, borderRadius: 3 }} />
          <div style={{ position: 'absolute' as const, width: 36, height: 14, backgroundColor: `${teal}15`, borderRadius: 3 }} />
        </div>

        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          {p.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={p.photo} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${teal}` }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: sz + 14, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
            <div style={{ fontSize: sz + 3, fontWeight: 500, color: teal, marginBottom: 8 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
            <ContactItems info={p} color={teal} lang={language} size={sz - 1} />
          </div>
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '16px 32px 8px' }}>
          <HeadingUnderline title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} color={teal} size={sz} />
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const }}>{p.summary}</div>
        </div>
      )}

      {/* Two-column layout for sections */}
      <div style={{ padding: '8px 32px 32px', display: 'flex', gap: 24 }}>
        {/* Left column – skills & languages */}
        {leftItems.length > 0 && (
          <div style={{ width: '35%' }}>
            {leftItems.map((type) => (
              <div key={type} style={{ marginTop: 14 }}>
                <HeadingUnderline title={sectionLabel(type, language)} color={teal} size={sz} />
                {renderSection(type)}
              </div>
            ))}
          </div>
        )}

        {/* Right column – main content */}
        <div style={{ flex: 1 }}>
          {rightItems.map((type) => (
            <div key={type} style={{ marginTop: 14 }}>
              <HeadingUnderline title={sectionLabel(type, language)} color={teal} size={sz} />
              {renderSection(type)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   19. MARKETING TEMPLATE – Orange, diagonal blocks, vibrant                  */
/*                                                                              */
/* ============================================================================ */

export function MarketingTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const orange = '#EA580C';

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return (
        <div>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 12, position: 'relative' as const, padding: '10px 12px', backgroundColor: '#FFF7ED', borderRadius: 6, borderLeft: `4px solid ${orange}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a' }}>{exp.jobTitle}</div>
                  <div style={{ fontSize: sz, color: orange, fontWeight: 500 }}>{exp.company}</div>
                </div>
                <div style={{ fontSize: sz - 1, color: '#999', whiteSpace: 'nowrap' as const }}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current, language)}
                </div>
              </div>
              {exp.description && (
                <div style={{ fontSize: sz - 1, color: '#666', marginTop: 3, whiteSpace: 'pre-line' as const }}>{exp.description}</div>
              )}
            </div>
          ))}
        </div>
      );
      case 'education': return <EducationSection data={data} color={orange} lang={language} size={sz} />;
      case 'skills': return (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
          {data.skills.map((sk) => (
            <span key={sk.id} style={{
              padding: '4px 12px',
              borderRadius: 6,
              fontSize: sz - 1,
              fontWeight: 600,
              backgroundColor: orange,
              color: '#ffffff',
            }}>
              {sk.name}
            </span>
          ))}
        </div>
      );
      case 'certifications': return <CertificationsSection data={data} color={orange} lang={language} size={sz} />;
      case 'languages': return <LanguagesDots data={data} color={orange} lang={language} size={sz} />;
      case 'projects': return (
        <div>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 10, padding: 10, backgroundColor: '#FFF7ED', borderRadius: 8, position: 'relative' as const }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, backgroundColor: orange, transform: 'rotate(45deg)' }} />
                <span style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a' }}>{proj.name}</span>
                {proj.url && <ExternalLink size={10} style={{ color: orange }} />}
              </div>
              {proj.description && <div style={{ fontSize: sz - 1, color: '#666', marginTop: 2, marginInlineStart: 16 }}>{proj.description}</div>}
              {proj.technologies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginTop: 4, marginInlineStart: 16 }}>
                  {proj.technologies.map((t) => (
                    <span key={t} style={{ fontSize: sz - 2, padding: '2px 8px', borderRadius: 4, backgroundColor: '#FFEDD5', color: '#C2410C' }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d, position: 'relative' as const, overflow: 'hidden' as const }}>
      {/* Diagonal color block in top-right */}
      <div style={{
        position: 'absolute' as const,
        top: 0,
        [isRtl(language) ? 'left' : 'right']: 0,
        width: '55%',
        height: 140,
        backgroundColor: orange,
        clipPath: isRtl(language)
          ? 'polygon(0 0, 100% 0, 100% 100%, 80px 100%)'
          : 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
      }} />

      {/* Header */}
      <div style={{ padding: '28px 32px 18px', position: 'relative' as const, zIndex: 1, display: 'flex', gap: 18, alignItems: 'center' }}>
        {p.photo && (
          <div style={{ flexShrink: 0 }}>
            <img src={p.photo} alt="" style={{ width: 78, height: 78, borderRadius: 10, objectFit: 'cover', border: `3px solid ${orange}`, boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: sz + 16, fontWeight: 800, color: '#1a1a1a', marginBottom: 2, position: 'relative' as const }}>
            <span style={{ position: 'relative' as const, zIndex: 2 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</span>
          </div>
          <div style={{ fontSize: sz + 3, fontWeight: 600, color: orange, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 1 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
          <ContactItems info={p} color={orange} lang={language} size={sz - 1} />
        </div>
      </div>

      {/* Vibrant section divider */}
      <div style={{ margin: '0 32px 4px', height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${orange}, ${orange}50, transparent)` }} />

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '14px 32px 8px' }}>
          <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 0.5, color: orange, marginBottom: 6, padding: '4px 12px', backgroundColor: '#FFF7ED', borderRadius: 4, display: 'inline-block' }}>
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </div>
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const, marginTop: 6 }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 32px 32px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, fontSize: sz + 3, textTransform: 'uppercase' as const, letterSpacing: 0.5, color: orange, marginBottom: 8, padding: '4px 12px', backgroundColor: '#FFF7ED', borderRadius: 4, display: 'inline-block' }}>
              {sectionLabel(type, language)}
            </div>
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   20. FINANCE TEMPLATE – Dark navy, gold lines, serif, conservative          */
/*                                                                              */
/* ============================================================================ */

export function FinanceTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const navy = '#1E293B';
  const goldAccent = '#B45309';

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return (
        <div>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid #E2E8F0` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>{exp.jobTitle}</div>
                  <div style={{ fontSize: sz, color: navy, fontWeight: 500 }}>{exp.company}</div>
                </div>
                <div style={{ fontSize: sz - 1, color: '#999', whiteSpace: 'nowrap' as const, fontFamily: 'Georgia, serif' }}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current, language)}
                </div>
              </div>
              {exp.description && (
                <div style={{ fontSize: sz - 1, color: '#666', marginTop: 3, whiteSpace: 'pre-line' as const }}>{exp.description}</div>
              )}
            </div>
          ))}
        </div>
      );
      case 'education': return (
        <div>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid #E2E8F0` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>{edu.major}</div>
                  <div style={{ fontSize: sz, color: '#555' }}>{edu.institution}{edu.degree ? ` — ${DEGREE_LABELS[language][edu.degree as DegreeType] || edu.degree}` : ''}</div>
                </div>
                <div style={{ fontSize: sz - 1, color: '#999', whiteSpace: 'nowrap' as const }}>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      );
      case 'skills': return (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
          {data.skills.map((sk) => (
            <span key={sk.id} style={{
              padding: '3px 10px',
              fontSize: sz - 1,
              fontWeight: 500,
              color: navy,
              border: `1px solid ${navy}30`,
              borderRadius: 2,
              backgroundColor: '#F8FAFC',
            }}>
              {sk.name}<span style={{ color: '#999', marginInlineStart: 3 }}>· {SKILL_LEVEL_LABELS[language][sk.level]}</span>
            </span>
          ))}
        </div>
      );
      case 'certifications': return <CertificationsSection data={data} color={navy} lang={language} size={sz} />;
      case 'languages': return <LanguagesSection data={data} color={navy} lang={language} size={sz} />;
      case 'projects': return <ProjectsSection data={data} color={navy} lang={language} size={sz} />;
      default: return null;
    }
  };

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d }}>
      {/* Conservative dark navy header */}
      <div style={{ backgroundColor: navy, color: '#ffffff', padding: '30px 36px 24px', position: 'relative' as const }}>
        {/* Thin gold accent line at top */}
        <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: 3, backgroundColor: goldAccent }} />

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {p.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={p.photo} alt="" style={{ width: 76, height: 76, borderRadius: 4, objectFit: 'cover', border: `2px solid ${goldAccent}` }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: sz + 16, fontWeight: 800, fontFamily: 'Georgia, serif', letterSpacing: 1, marginBottom: 3 }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</div>
            <div style={{ fontSize: sz + 2, fontWeight: 300, opacity: 0.9, letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 10 }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px 16px', fontSize: sz - 1, opacity: 0.8 }}>
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={10} /> {p.email}</span>}
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} /> {p.phone}</span>}
              {(p.city || p.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Globe size={10} /> {p.website}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={10} /> {p.linkedin}</span>}
              {p.github && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Github size={10} /> {p.github}</span>}
            </div>
          </div>
        </div>

        {/* Gold accent line at bottom */}
        <div style={{ position: 'absolute' as const, bottom: 0, left: 36, right: 36, height: 1, backgroundColor: `${goldAccent}40` }} />
      </div>

      {/* Summary */}
      {p.summary && (
        <div style={{ padding: '20px 36px 8px' }}>
          <div style={{ fontWeight: 700, fontSize: sz + 3, fontFamily: 'Georgia, serif', textTransform: 'uppercase' as const, letterSpacing: 1, color: navy, marginBottom: 6, paddingBottom: 4, borderBottom: `1px solid ${goldAccent}30`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 20, height: 1, backgroundColor: goldAccent }} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </div>
          <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const, lineHeight: 1.6 }}>{p.summary}</div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: '8px 36px 32px' }}>
        {sections.map((type) => (
          <div key={type} style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 700, fontSize: sz + 3, fontFamily: 'Georgia, serif', textTransform: 'uppercase' as const, letterSpacing: 1, color: navy, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${goldAccent}30`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 20, height: 1, backgroundColor: goldAccent }} />
              {sectionLabel(type, language)}
            </div>
            {renderSection(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*                                                                              */
/*   Template Selector Function                                                 */
/*                                                                              */
/* ============================================================================ */

/* ============================================================================ */
/*                                                                              */
/*   AAFIATAK PRO TEMPLATE – Gradient banner, timeline, progress bars, dots     */
/*                                                                              */
/* ============================================================================ */

/** Helper: compute years of experience from experience entries */
function computeYears(experience: ResumeData['experience']): number {
  if (!experience.length) return 0;
  let totalMonths = 0;
  experience.forEach((exp) => {
    const start = new Date(exp.startDate + '-01');
    const end = exp.current ? new Date() : new Date(exp.endDate + '-01');
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      totalMonths += (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    }
  });
  return Math.max(1, Math.round(totalMonths / 12));
}

/** Skill level color mapping for AafiatakPro */
function aafiSkillColor(level: SkillLevel, primary: string): { bar: string; badge: string; badgeText: string } {
  switch (level) {
    case 'beginner': return { bar: '#94a3b8', badge: '#f1f5f9', badgeText: '#64748b' };
    case 'intermediate': return { bar: '#38bdf8', badge: '#e0f2fe', badgeText: '#0284c7' };
    case 'advanced': return { bar: '#0ea5e9', badge: '#e0f2fe', badgeText: '#0284c7' };
    case 'expert': return { bar: primary, badge: primary + '18', badgeText: primary };
    default: return { bar: '#94a3b8', badge: '#f1f5f9', badgeText: '#64748b' };
  }
}

/** Language level color mapping for AafiatakPro */
function aafiLangColor(level: LanguageLevel): { dot: string; badge: string; badgeText: string } {
  switch (level) {
    case 'native': return { dot: '#0ea5e9', badge: '#e0f2fe', badgeText: '#0284c7' };
    case 'fluent': return { dot: '#10b981', badge: '#d1fae5', badgeText: '#059669' };
    case 'advanced': return { dot: '#38bdf8', badge: '#e0f2fe', badgeText: '#0284c7' };
    case 'intermediate': return { dot: '#f59e0b', badge: '#fef3c7', badgeText: '#d97706' };
    case 'basic': return { dot: '#94a3b8', badge: '#f1f5f9', badgeText: '#64748b' };
    default: return { dot: '#94a3b8', badge: '#f1f5f9', badgeText: '#64748b' };
  }
}

export function AafiatakProTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const isR = isRtl(language);

  // Gradient colors
  const gradFrom = primaryColor;
  const gradVia = '#0ea5e9';
  const gradTo = '#14b8a6';

  // Stats
  const yearsExp = computeYears(data.experience);
  const completedJobs = data.experience.filter((e) => !e.current).length || data.experience.length;

  // Section header render helper (not a component, just a function)
  const renderSectionHeader = (icon: React.ReactNode, title: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${primaryColor}15` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, backgroundColor: primaryColor + '12', color: primaryColor, flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ fontWeight: 700, fontSize: sz + 2, color: '#1a1a1a', textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{title}</div>
    </div>
  );

  // GlassCard render helper (not a component, just a function)
  const renderGlassCard = (children: React.ReactNode, style?: React.CSSProperties) => (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: '16px 18px',
      marginBottom: 14,
      border: '1px solid #f0f0f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      ...style,
    }}>
      {children}
    </div>
  );

  // ---- Render different section types ----
  const renderAafiatakSkills = () => {
    if (!data.skills.length) return null;
    return renderGlassCard(
      <>
        {renderSectionHeader(<Wrench size={14} />, language === 'ar' ? 'المهارات' : 'Skills')}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
          {data.skills.map((sk) => {
            const colors = aafiSkillColor(sk.level, primaryColor);
            return (
              <div key={sk.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: sz, fontWeight: 600, color: '#1a1a1a' }}>{sk.name}</span>
                  <span style={{
                    fontSize: sz - 3,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 10,
                    backgroundColor: colors.badge,
                    color: colors.badgeText,
                  }}>
                    {SKILL_LEVEL_LABELS[language][sk.level]}
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 4, backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    borderRadius: 4,
                    width: getSkillWidth(sk.level),
                    background: `linear-gradient(90deg, ${colors.bar}, ${colors.bar}cc)`,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderAafiatakExperience = () => {
    if (!data.experience.length) return null;
    return renderGlassCard(
      <>
        {renderSectionHeader(<Briefcase size={14} />, language === 'ar' ? 'الخبرات العملية' : 'Work Experience')}
        <div style={{ position: 'relative' as const, paddingRight: isR ? 0 : 24, paddingLeft: isR ? 24 : 0 }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute' as const,
            top: 6,
            bottom: 6,
            width: 2,
            backgroundColor: primaryColor + '20',
            ...(isR ? { right: 8 } : { left: 8 }),
          }} />
          {data.experience.map((exp, idx) => (
            <div key={exp.id} style={{ position: 'relative' as const, marginBottom: idx < data.experience.length - 1 ? 16 : 0 }}>
              {/* Timeline dot */}
              <div style={{
                position: 'absolute' as const,
                top: 6,
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: `2px solid ${idx === 0 ? primaryColor : primaryColor + '40'}`,
                backgroundColor: idx === 0 ? primaryColor : '#ffffff',
                ...(isR ? { right: 3 } : { left: 3 }),
                zIndex: 1,
              }} />
              {/* Content */}
              <div style={{ ...(isR ? { paddingRight: 28 } : { paddingLeft: 28 }) }}>
                <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a', marginBottom: 2 }}>{exp.jobTitle}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <Building2 size={10} style={{ color: primaryColor, flexShrink: 0 }} />
                  <span style={{ fontSize: sz - 1, color: '#555', fontWeight: 500 }}>{exp.company}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                  <Calendar size={10} style={{ color: '#999', flexShrink: 0 }} />
                  <span style={{ fontSize: sz - 2, color: '#999' }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current, language)}
                  </span>
                </div>
                {exp.description && (
                  <div style={{
                    fontSize: sz - 1,
                    color: '#666',
                    whiteSpace: 'pre-line' as const,
                    backgroundColor: '#f8fafc',
                    padding: '6px 10px',
                    borderRadius: 8,
                    lineHeight: 1.6,
                  }}>
                    {exp.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderAafiatakEducation = () => {
    if (!data.education.length) return null;
    return renderGlassCard(
      <>
        {renderSectionHeader(<GraduationCap size={14} />, language === 'ar' ? 'المؤهلات التعليمية' : 'Education')}
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a', marginBottom: 2 }}>{edu.major}</div>
            <div style={{ fontSize: sz - 1, color: '#555', marginBottom: 2 }}>
              {edu.institution}{edu.degree ? ` — ${DEGREE_LABELS[language][edu.degree as DegreeType] || edu.degree}` : ''}
            </div>
            <div style={{ fontSize: sz - 2, color: '#999' }}>
              {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
            </div>
            {edu.description && <div style={{ fontSize: sz - 1, color: '#666', marginTop: 3 }}>{edu.description}</div>}
          </div>
        ))}
      </>
    );
  };

  const renderAafiatakCertifications = () => {
    if (!data.certifications.length) return null;

    const certTypeColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      certificate: { bg: '#fef3c7', text: '#d97706', icon: <Award size={12} /> },
      course: { bg: '#dbeafe', text: '#2563eb', icon: <BookOpen size={12} /> },
      license: { bg: '#d1fae5', text: '#059669', icon: <Shield size={12} /> },
      training: { bg: '#ede9fe', text: '#7c3aed', icon: <Trophy size={12} /> },
    };
    const defaultCert = certTypeColors.certificate;

    return renderGlassCard(
      <>
        {renderSectionHeader(<Award size={14} />, language === 'ar' ? 'الشهادات' : 'Certifications')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {data.certifications.map((c) => {
            const typeStyle = defaultCert;
            return (
              <div key={c.id} style={{
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid #f0f0f0',
                backgroundColor: '#fafafa',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 6, backgroundColor: typeStyle.bg, color: typeStyle.text, flexShrink: 0 }}>
                    {typeStyle.icon}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: sz - 1, color: '#1a1a1a', lineHeight: 1.3 }}>{c.name}</span>
                </div>
                {c.issuer && <div style={{ fontSize: sz - 2, color: '#888', marginBottom: 2 }}>{c.issuer}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{
                    fontSize: sz - 3,
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: 6,
                    backgroundColor: typeStyle.bg,
                    color: typeStyle.text,
                  }}>
                    {language === 'ar' ? 'شهادة' : 'Certificate'}
                  </span>
                  {c.date && <span style={{ fontSize: sz - 3, color: '#aaa' }}>{c.date}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderAafiatakLanguages = () => {
    if (!data.languages.length) return null;
    return renderGlassCard(
      <>
        {renderSectionHeader(<Globe2 size={14} />, language === 'ar' ? 'اللغات' : 'Languages')}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {data.languages.map((l) => {
            const filled = getLanguageDots(l.level);
            const colors = aafiLangColor(l.level);
            return (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: sz, fontWeight: 600, color: '#1a1a1a', minWidth: 65 }}>{l.name}</span>
                <span style={{
                  fontSize: sz - 3,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 10,
                  backgroundColor: colors.badge,
                  color: colors.badgeText,
                }}>
                  {LANGUAGE_LEVEL_LABELS[language][l.level]}
                </span>
                <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' as const }}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div key={dot} style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: dot <= filled ? colors.dot : '#e2e8f0',
                      transition: 'background-color 0.2s',
                    }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderAafiatakProjects = () => {
    if (!data.projects.length) return null;
    return renderGlassCard(
      <>
        {renderSectionHeader(<FolderKanban size={14} />, language === 'ar' ? 'المشاريع' : 'Projects')}
        {data.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a' }}>{proj.name}</span>
              {proj.url && <ExternalLink size={10} style={{ color: '#aaa' }} />}
            </div>
            {proj.description && <div style={{ fontSize: sz - 1, color: '#666', marginTop: 2 }}>{proj.description}</div>}
            {proj.technologies.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 3, marginTop: 4 }}>
                {proj.technologies.map((t) => (
                  <span key={t} style={{ fontSize: sz - 2, padding: '1px 7px', borderRadius: 6, backgroundColor: primaryColor + '10', color: primaryColor, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience': return renderAafiatakExperience();
      case 'education': return renderAafiatakEducation();
      case 'skills': return renderAafiatakSkills();
      case 'certifications': return renderAafiatakCertifications();
      case 'languages': return renderAafiatakLanguages();
      case 'projects': return renderAafiatakProjects();
      default: return null;
    }
  };

  // Compute stats for the header
  const avgRating = data.experience.length > 0 ? '4.9' : '—';

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d, overflow: 'hidden' }}>
      {/* ============ GRADIENT BANNER HEADER ============ */}
      <div style={{
        background: `linear-gradient(135deg, ${gradFrom}, ${gradVia}, ${gradTo})`,
        color: '#ffffff',
        padding: '28px 28px 22px',
        position: 'relative' as const,
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute' as const, top: -30, right: -20, width: 120, height: 120, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', filter: 'blur(2px)' }} />
        <div style={{ position: 'absolute' as const, bottom: -40, left: -15, width: 100, height: 100, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)', filter: 'blur(2px)' }} />
        <div style={{ position: 'absolute' as const, top: 20, right: 80, width: 60, height: 60, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', filter: 'blur(1px)' }} />

        {/* Header content */}
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', position: 'relative' as const, zIndex: 1 }}>
          {/* Photo with gradient ring */}
          <div style={{ flexShrink: 0 }}>
            {p.photo ? (
              <div style={{
                width: 84,
                height: 84,
                borderRadius: '50%',
                padding: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              }}>
                <img src={p.photo} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffffff' }} />
              </div>
            ) : (
              <div style={{
                width: 84,
                height: 84,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid rgba(255,255,255,0.5)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              }}>
                <span style={{ fontSize: sz + 16, fontWeight: 800, color: '#ffffff' }}>
                  {(p.fullName || '?').charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Name, title, badges */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: sz + 14, fontWeight: 800, marginBottom: 2, letterSpacing: 0.3, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              {p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}
            </div>
            <div style={{ fontSize: sz + 3, fontWeight: 400, opacity: 0.92, marginBottom: 8, letterSpacing: 0.5 }}>
              {p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}
            </div>

            {/* Specialization badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5, marginBottom: 8 }}>
              {data.skills.slice(0, 3).map((sk) => (
                <span key={sk.id} style={{
                  fontSize: sz - 3,
                  fontWeight: 500,
                  padding: '2px 10px',
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  backdropFilter: 'blur(4px)',
                }}>
                  {sk.name}
                </span>
              ))}
            </div>

            {/* Location + Experience row */}
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px', fontSize: sz - 1, opacity: 0.88 }}>
              {(p.city || p.country) && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={10} /> {[p.city, p.country].filter(Boolean).join(', ')}
                </span>
              )}
              {data.experience.length > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Briefcase size={10} /> {yearsExp}+ {language === 'ar' ? 'سنة خبرة' : 'yrs exp'}
                </span>
              )}
              {p.email && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Mail size={10} /> {p.email}
                </span>
              )}
              {p.phone && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Phone size={10} /> {p.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Statistics row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          marginTop: 16,
          position: 'relative' as const,
          zIndex: 1,
        }}>
          <div style={{ textAlign: 'center' as const, padding: '8px 4px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
              <CheckCircle2 size={11} style={{ opacity: 0.9 }} />
              <span style={{ fontSize: sz + 6, fontWeight: 800 }}>{completedJobs}</span>
            </div>
            <div style={{ fontSize: sz - 3, opacity: 0.8, fontWeight: 500 }}>
              {language === 'ar' ? 'أعمال مكتملة' : 'Completed Jobs'}
            </div>
          </div>
          <div style={{ textAlign: 'center' as const, padding: '8px 4px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
              <Star size={11} style={{ opacity: 0.9 }} />
              <span style={{ fontSize: sz + 6, fontWeight: 800 }}>{avgRating}</span>
            </div>
            <div style={{ fontSize: sz - 3, opacity: 0.8, fontWeight: 500 }}>
              {language === 'ar' ? 'التقييم' : 'Rating'}
            </div>
          </div>
          <div style={{ textAlign: 'center' as const, padding: '8px 4px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
              <Clock size={11} style={{ opacity: 0.9 }} />
              <span style={{ fontSize: sz + 6, fontWeight: 800 }}>{yearsExp}+</span>
            </div>
            <div style={{ fontSize: sz - 3, opacity: 0.8, fontWeight: 500 }}>
              {language === 'ar' ? 'سنوات الخبرة' : 'Years Exp'}
            </div>
          </div>
        </div>
      </div>

      {/* ============ BODY CONTENT ============ */}
      <div style={{ padding: '16px 20px 28px' }}>
        {/* Summary / Bio section */}
        {p.summary && renderGlassCard(
          <>
            {renderSectionHeader(<FileText size={14} />, language === 'ar' ? 'نبذة احترافية' : 'Professional Summary')}
            <div style={{ fontSize: sz, color: '#444', whiteSpace: 'pre-line' as const, lineHeight: 1.7 }}>{p.summary}</div>
          </>
        )}

        {/* Other sections */}
        {sections.map((type) => (
          <div key={type}>{renderSection(type)}</div>
        ))}

        {/* Contact footer row */}
        {renderGlassCard(
          <>
            {renderSectionHeader(<Phone size={14} />, language === 'ar' ? 'معلومات التواصل' : 'Contact Information')}
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px 16px' }}>
              {p.email && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: sz - 1, color: '#555' }}>
                  <Mail size={11} style={{ color: primaryColor }} /> {p.email}
                </span>
              )}
              {p.phone && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: sz - 1, color: '#555' }}>
                  <Phone size={11} style={{ color: primaryColor }} /> {p.phone}
                </span>
              )}
              {p.website && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: sz - 1, color: '#555' }}>
                  <Globe size={11} style={{ color: primaryColor }} /> {p.website}
                </span>
              )}
              {p.linkedin && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: sz - 1, color: '#555' }}>
                  <Linkedin size={11} style={{ color: primaryColor }} /> {p.linkedin}
                </span>
              )}
              {p.github && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: sz - 1, color: '#555' }}>
                  <Github size={11} style={{ color: primaryColor }} /> {p.github}
                </span>
              )}
              {(p.city || p.country || p.address) && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: sz - 1, color: '#555' }}>
                  <MapPin size={11} style={{ color: primaryColor }} /> {[p.address, p.city, p.country].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </>,
          { marginBottom: 0 }
        )}
      </div>
    </div>
  );
}

export function getTemplateComponent(slug: string): React.ComponentType<TemplateProps> {
  const map: Record<string, React.ComponentType<TemplateProps>> = {
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
  };
  return map[slug] || AafiatakProTemplate;
}
