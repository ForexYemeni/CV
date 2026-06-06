import React from 'react';
import {
  Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink,
  Briefcase, GraduationCap, Wrench, Award, Globe2, FolderKanban,
  Link as LinkIcon, FileText, Star, Clock, CheckCircle2, Building2,
  Calendar, Shield, BookOpen, Trophy, Zap, User, Sparkles, Heart,
  TrendingUp, Code, PieChart, Target, Cpu, BarChart3,
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

function getVisibleSections(sections: ResumeData['sections']): string[] {
  return sections
    .filter((s) => s.visible && s.type !== 'personalInfo')
    .sort((a, b) => a.order - b.order)
    .map((s) => s.type);
}

const isRtl = (lang: 'ar' | 'en') => lang === 'ar';
const dir = (lang: 'ar' | 'en') => isRtl(lang) ? 'rtl' as const : 'ltr' as const;

function computeYears(experience: { startDate: string; endDate: string; current: boolean }[]): number {
  if (!experience.length) return 0;
  let totalMonths = 0;
  for (const exp of experience) {
    const start = new Date(exp.startDate);
    const end = exp.current ? new Date() : new Date(exp.endDate || Date.now());
    if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;
    totalMonths += (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  }
  return Math.round(totalMonths / 12);
}

/* -------------------------------------------------------------------------- */
/*  Shared Reusable Components                                                */
/* -------------------------------------------------------------------------- */

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm ${className}`}>{children}</div>;
}

function SectionHeader({ icon, title, className = '' }: { icon: React.ReactNode; title: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 px-4 sm:px-5 pt-4 sm:pt-5 pb-0 ${className}`}>
      <div className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0">{icon}</div>
      <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
    </div>
  );
}

/* Contact items rendered as flex-wrap row */
function ContactRow({ info, color, lang, size }: { info: ResumeData['personalInfo']; color: string; lang: 'ar' | 'en'; size: number }) {
  const items: React.ReactNode[] = [];
  const cls = 'inline-flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400';
  if (info.email) items.push(<span key="email" className={cls}><Mail size={12} style={{ color }} />{info.email}</span>);
  if (info.phone) items.push(<span key="phone" className={cls}><Phone size={12} style={{ color }} />{info.phone}</span>);
  if (info.city || info.country) items.push(<span key="loc" className={cls}><MapPin size={12} style={{ color }} />{[info.city, info.country].filter(Boolean).join(', ')}</span>);
  if (info.website) items.push(<span key="web" className={cls}><Globe size={12} style={{ color }} />{info.website}</span>);
  if (info.linkedin) items.push(<span key="li" className={cls}><Linkedin size={12} style={{ color }} />{info.linkedin}</span>);
  if (info.github) items.push(<span key="gh" className={cls}><Github size={12} style={{ color }} />{info.github}</span>);
  if (info.otherLinks?.length > 0) {
    info.otherLinks.forEach((l, i) => {
      if (l.url) items.push(<span key={`ol${i}`} className={cls}><LinkIcon size={12} style={{ color }} />{l.label || l.url}</span>);
    });
  }
  return <div className="flex flex-wrap gap-x-3 gap-y-1">{items}</div>;
}

/* Avatar component */
function Avatar({ photo, name, color, size = 'md' }: { photo: string; name: string; color: string; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-20 h-20 sm:w-24 sm:h-24' : size === 'sm' ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-16 h-16 sm:w-20 sm:h-20';
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : '?';
  return (
    <div className={`${sz} rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-800 border-2`} style={{ borderColor: color + '40' }}>
      {photo ? <img src={photo} alt={name} className="w-full h-full object-cover" /> : <span className="text-sm sm:text-base font-bold" style={{ color }}>{initials}</span>}
    </div>
  );
}

/* Skill badges */
function SkillBadges({ data, color, lang }: { data: ResumeData; color: string; lang: 'ar' | 'en' }) {
  if (!data.skills.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {data.skills.map((sk) => (
        <span key={sk.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium" style={{ backgroundColor: color + '15', color }}>
          {sk.name}
          <span className="opacity-60 ms-1">· {SKILL_LEVEL_LABELS[lang][sk.level]}</span>
        </span>
      ))}
    </div>
  );
}

/* Skill bars */
function SkillBars({ data, color, lang }: { data: ResumeData; color: string; lang: 'ar' | 'en' }) {
  if (!data.skills.length) return null;
  return (
    <div className="space-y-2 sm:space-y-2.5">
      {data.skills.map((sk) => (
        <div key={sk.id}>
          <div className="flex justify-between text-xs sm:text-sm mb-1">
            <span className="font-medium">{sk.name}</span>
            <span className="text-gray-400 text-[10px] sm:text-xs">{SKILL_LEVEL_LABELS[lang][sk.level]}</span>
          </div>
          <div className="h-1.5 sm:h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: getSkillWidth(sk.level), backgroundColor: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Language dots */
function LanguageDots({ data, color, lang }: { data: ResumeData; color: string; lang: 'ar' | 'en' }) {
  if (!data.languages.length) return null;
  return (
    <div className="space-y-2">
      {data.languages.map((l) => {
        const filled = getLanguageDots(l.level);
        return (
          <div key={l.id} className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium min-w-[60px]">{l.name}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((d) => (
                <div key={d} className="w-2 h-2 rounded-full" style={{ backgroundColor: d <= filled ? color : '#e5e7eb' }} />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400">{LANGUAGE_LEVEL_LABELS[lang][l.level]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* Language list */
function LanguageList({ data, color, lang }: { data: ResumeData; color: string; lang: 'ar' | 'en' }) {
  if (!data.languages.length) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {data.languages.map((l) => (
        <div key={l.id} className="text-xs sm:text-sm">
          <span className="font-medium">{l.name}</span>
          <span className="text-gray-400 ms-1">({LANGUAGE_LEVEL_LABELS[lang][l.level]})</span>
        </div>
      ))}
    </div>
  );
}

/* Experience items */
function ExperienceItems({ data, color, lang }: { data: ResumeData; color: string; lang: 'ar' | 'en' }) {
  if (!data.experience.length) return null;
  return (
    <div className="space-y-3 sm:space-y-4">
      {data.experience.map((exp) => (
        <div key={exp.id}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-bold">{exp.jobTitle}</h4>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                <Building2 size={12} style={{ color: color + '80' }} />
                <span>{exp.company}</span>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 shrink-0 flex items-center gap-1">
              <Calendar size={10} />{formatDateRange(exp.startDate, exp.endDate, exp.current, lang)}
            </span>
          </div>
          {exp.description && (
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 whitespace-pre-line leading-relaxed bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
              {exp.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* Education items */
function EducationItems({ data, color, lang }: { data: ResumeData; color: string; lang: 'ar' | 'en' }) {
  if (!data.education.length) return null;
  return (
    <div className="space-y-2.5 sm:space-y-3">
      {data.education.map((edu) => (
        <div key={edu.id} className="pb-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-bold">{edu.major}</h4>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{edu.institution}</p>
              {edu.degree && (
                <span className="inline-block text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1" style={{ backgroundColor: color + '10', color }}>
                  {DEGREE_LABELS[lang][edu.degree as DegreeType] || edu.degree}
                </span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] text-gray-400 shrink-0">{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</span>
          </div>
          {edu.description && <p className="text-[11px] sm:text-xs text-gray-500 mt-1">{edu.description}</p>}
        </div>
      ))}
    </div>
  );
}

/* Certification items */
function CertItems({ data, color, lang }: { data: ResumeData; color: string; lang: 'ar' | 'en' }) {
  if (!data.certifications.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {data.certifications.map((c) => (
        <div key={c.id} className="rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-2.5 sm:p-3">
          <h4 className="text-xs sm:text-sm font-semibold leading-tight">{c.name}</h4>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{c.issuer}{c.date ? ` · ${c.date}` : ''}</p>
          {c.description && <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{c.description}</p>}
        </div>
      ))}
    </div>
  );
}

/* Project items */
function ProjectItems({ data, color }: { data: ResumeData; color: string }) {
  if (!data.projects.length) return null;
  return (
    <div className="space-y-2 sm:space-y-3">
      {data.projects.map((p) => (
        <div key={p.id} className="rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-2.5 sm:p-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs sm:text-sm font-semibold">{p.name}</h4>
            {p.url && <ExternalLink size={12} className="text-gray-400 shrink-0" />}
          </div>
          {p.description && <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-relaxed">{p.description}</p>}
          {p.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {p.technologies.map((t) => (
                <span key={t} className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: color + '10', color: color + 'cc' }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* Generic section renderer */
function renderSection(type: string, data: ResumeData, color: string, lang: 'ar' | 'en') {
  switch (type) {
    case 'experience': return <ExperienceItems data={data} color={color} lang={lang} />;
    case 'education': return <EducationItems data={data} color={color} lang={lang} />;
    case 'skills': return <SkillBadges data={data} color={color} lang={lang} />;
    case 'certifications': return <CertItems data={data} color={color} lang={lang} />;
    case 'languages': return <LanguageList data={data} color={color} lang={lang} />;
    case 'projects': return <ProjectItems data={data} color={color} />;
    default: return null;
  }
}

/* ============================================================================ */
/*   1. CLASSIC TEMPLATE - "الكلاسيكي"                                         */
/* ============================================================================ */

export function ClassicTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Header with photo and info */}
      <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 border-b-2" style={{ borderColor: primaryColor }}>
        <div className="flex items-center gap-3 sm:gap-4">
          {p.photo && <Avatar photo={p.photo} name={p.fullName} color={primaryColor} size="md" />}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white truncate">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <div className="text-xs sm:text-sm font-medium mt-0.5 inline-block border-b pb-0.5" style={{ color: primaryColor, borderColor: primaryColor + '40' }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</div>
            <div className="mt-2"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <div className="px-4 sm:px-6 pt-4">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider pb-1.5 mb-2 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      {/* Sections */}
      <div className="px-4 sm:px-6 pb-5 sm:pb-6 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider pb-1.5 mb-2 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>{sectionLabel(type, language)}</h2>
            {renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   2. MODERN TEMPLATE - "العصري"                                             */
/* ============================================================================ */

export function ModernTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const sideSections = ['skills', 'certifications', 'languages'];
  const mainSections = ['experience', 'education', 'projects'];
  const sidebarItems = sideSections.filter((s) => sections.includes(s));
  const mainItems = mainSections.filter((s) => sections.includes(s));

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col md:flex-row" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Sidebar - becomes top banner on mobile */}
      <div className="w-full md:w-[35%] text-white p-4 sm:p-5" style={{ backgroundColor: primaryColor }}>
        <div className="flex flex-col items-center text-center">
          {p.photo && (
            <div className="mb-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-white/40">
                <img src={p.photo} alt={p.fullName} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <h1 className="text-base sm:text-lg font-extrabold">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
          <p className="text-xs sm:text-sm opacity-85 mt-0.5">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
        </div>

        {/* Contact */}
        <div className="mt-4 pt-3 border-t border-white/20">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2">{language === 'ar' ? 'معلومات التواصل' : 'Contact'}</h3>
          <div className="space-y-1.5 text-[10px] sm:text-xs">
            {p.email && <div className="flex items-center gap-1.5"><Mail size={11} /><span className="break-all">{p.email}</span></div>}
            {p.phone && <div className="flex items-center gap-1.5"><Phone size={11} />{p.phone}</div>}
            {(p.city || p.country) && <div className="flex items-center gap-1.5"><MapPin size={11} />{[p.city, p.country].filter(Boolean).join(', ')}</div>}
            {p.website && <div className="flex items-center gap-1.5"><Globe size={11} /><span className="break-all">{p.website}</span></div>}
            {p.linkedin && <div className="flex items-center gap-1.5"><Linkedin size={11} /><span className="break-all">{p.linkedin}</span></div>}
            {p.github && <div className="flex items-center gap-1.5"><Github size={11} /><span className="break-all">{p.github}</span></div>}
          </div>
        </div>

        {/* Sidebar sections */}
        {sidebarItems.map((type) => (
          <div key={type} className="mt-4 pt-3 border-t border-white/20">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2">{sectionLabel(type, language)}</h3>
            {type === 'skills' && (
              <div className="space-y-2">
                {data.skills.map((sk) => (
                  <div key={sk.id}>
                    <div className="flex justify-between text-[10px] sm:text-xs mb-1"><span>{sk.name}</span><span className="opacity-70">{SKILL_LEVEL_LABELS[language][sk.level]}</span></div>
                    <div className="h-1.5 rounded-full bg-white/20 overflow-hidden"><div className="h-full rounded-full bg-white/85" style={{ width: getSkillWidth(sk.level) }} /></div>
                  </div>
                ))}
              </div>
            )}
            {type === 'certifications' && (
              <div className="space-y-1.5">
                {data.certifications.map((c) => (
                  <div key={c.id} className="text-[10px] sm:text-xs"><div className="font-semibold">{c.name}</div><div className="opacity-70">{c.issuer}{c.date ? ` · ${c.date}` : ''}</div></div>
                ))}
              </div>
            )}
            {type === 'languages' && (
              <div className="space-y-1.5">
                {data.languages.map((l) => {
                  const filled = getLanguageDots(l.level);
                  return (
                    <div key={l.id} className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-xs min-w-[50px]">{l.name}</span>
                      <div className="flex gap-1">{[1,2,3,4,5].map(d => <div key={d} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: d <= filled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)' }} />)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-5 space-y-4">
        {p.summary && (
          <div>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-2">
              <span className="w-1 h-4 rounded" style={{ backgroundColor: primaryColor }} />
              {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
          </div>
        )}
        {mainItems.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-2">
              <span className="w-1 h-4 rounded" style={{ backgroundColor: primaryColor }} />
              {sectionLabel(type, language)}
            </h2>
            {renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   3. EXECUTIVE TEMPLATE - "التنفيذي"                                        */
/* ============================================================================ */

export function ExecutiveTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Bold color banner */}
      <div className="px-5 sm:px-6 py-5 sm:py-6 text-white relative" style={{ backgroundColor: primaryColor }}>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
        <p className="text-sm sm:text-base font-light opacity-90 mt-1 tracking-wide">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm opacity-85">
          {p.email && <span className="flex items-center gap-1"><Mail size={11} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone size={11} />{p.phone}</span>}
          {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={11} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.website && <span className="flex items-center gap-1"><Globe size={11} />{p.website}</span>}
        </div>
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/30" />
      </div>

      {/* Photo floating */}
      {p.photo && (
        <div className="px-5 sm:px-6 -mt-8 flex justify-end">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-3 border-white shadow-lg" style={{ borderColor: primaryColor }}>
            <img src={p.photo} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Summary */}
      {p.summary && (
        <div className="px-5 sm:px-6 pt-4">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: primaryColor + '40' }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      {/* Sections */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: primaryColor + '40' }}>{sectionLabel(type, language)}</h2>
            {renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   4. CREATIVE TEMPLATE - "الإبداعي"                                         */
/* ============================================================================ */

export function CreativeTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto relative overflow-hidden" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Geometric corner accent */}
      <div className="absolute top-0 w-24 h-24 sm:w-32 sm:h-32 opacity-15" style={{ backgroundColor: primaryColor, [isR ? 'left' : 'right']: 0, clipPath: isR ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)' }} />
      <div className="absolute top-0 w-16 h-16 sm:w-20 sm:h-20" style={{ backgroundColor: primaryColor, [isR ? 'left' : 'right']: 0, clipPath: isR ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)' }} />

      {/* Header */}
      <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 relative">
        <div className="flex items-center gap-3 sm:gap-4">
          {p.photo && (
            <div className="rounded-full p-[3px]" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}60)` }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white dark:border-gray-900">
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="mt-2"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
          </div>
        </div>
      </div>

      {/* Gradient divider */}
      <div className="mx-4 sm:mx-6 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}60, ${primaryColor}10)` }} />

      {/* Summary */}
      {p.summary && (
        <div className="px-4 sm:px-6 pt-4">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold mb-2" style={{ color: primaryColor }}>
            <span className="w-5 h-1 rounded" style={{ backgroundColor: primaryColor }} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      {/* Sections */}
      <div className="px-4 sm:px-6 pb-5 sm:pb-6 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold mb-2" style={{ color: primaryColor }}>
              <span className="w-5 h-1 rounded" style={{ backgroundColor: primaryColor }} />
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? <SkillBars data={data} color={primaryColor} lang={language} /> :
             type === 'languages' ? <LanguageDots data={data} color={primaryColor} lang={language} /> :
             renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   5. MINIMAL TEMPLATE - "البسيط"                                            */
/* ============================================================================ */

export function MinimalTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-4">
        <h1 className="text-xl sm:text-2xl font-light tracking-widest text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
        <p className="text-xs sm:text-sm font-normal mt-1 tracking-wider" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
        <div className="h-px bg-gray-200 dark:bg-gray-700 mt-3 mb-2" />
        <ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} />
      </div>

      {p.summary && (
        <div className="px-6 sm:px-8 pt-2">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: primaryColor }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-6 sm:px-8 pb-8 sm:pb-10 space-y-5 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: primaryColor }}>{sectionLabel(type, language)}</h2>
            {type === 'skills' ? (
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                {data.skills.map((sk) => <span key={sk.id} className="text-xs sm:text-sm text-gray-600">{sk.name}<span className="text-gray-300 ms-1">·</span></span>)}
              </div>
            ) : renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   6. CORPORATE TEMPLATE - "المؤسسي"                                         */
/* ============================================================================ */

export function CorporateTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Top bar */}
      <div className="h-1.5" style={{ backgroundColor: primaryColor }} />
      <div className="flex">
        {/* Side accent */}
        <div className="w-1 shrink-0" style={{ backgroundColor: primaryColor }} />
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 flex items-center gap-3 sm:gap-4">
            {p.photo && <Avatar photo={p.photo} name={p.fullName} color={primaryColor} size="sm" />}
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
              <p className="text-xs sm:text-sm font-medium" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
              <div className="mt-1.5"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
            </div>
          </div>

          {/* Summary */}
          {p.summary && (
            <div className="px-4 sm:px-6 pt-2">
              <h2 className="inline-block text-xs sm:text-sm font-bold uppercase text-white px-2.5 py-1 rounded mb-2" style={{ backgroundColor: primaryColor }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
            </div>
          )}

          {/* Sections */}
          <div className="px-4 sm:px-6 pb-5 sm:pb-6 space-y-3 pt-2">
            {sections.map((type) => (
              <div key={type} className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 sm:p-4 border-s-2" style={{ borderStartColor: primaryColor }}>
                <h2 className="inline-block text-xs sm:text-sm font-bold uppercase text-white px-2.5 py-1 rounded mb-2" style={{ backgroundColor: primaryColor }}>{sectionLabel(type, language)}</h2>
                {renderSection(type, data, primaryColor, language)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   7. ATS TEMPLATE - "متوافق مع ATS"                                         */
/* ============================================================================ */

export function ATSTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Centered header - no graphics */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 text-center">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
        <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mt-1">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-gray-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {(p.city || p.country) && <span>{[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.website && <span>{p.website}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
      </div>
      <div className="h-px bg-gray-900 dark:bg-gray-100 mx-6 sm:mx-8" />

      {p.summary && (
        <div className="px-6 sm:px-8 pt-4">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-1.5">{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white pb-1 mb-2 border-b border-gray-900 dark:border-gray-100">{sectionLabel(type, language)}</h2>
            {type === 'skills' ? (
              <p className="text-xs sm:text-sm text-gray-700">{data.skills.map((sk, i) => <span key={sk.id}>{sk.name}{i < data.skills.length - 1 ? ' | ' : ''}</span>)}</p>
            ) : type === 'languages' ? (
              <p className="text-xs sm:text-sm text-gray-700">{data.languages.map((l, i) => <span key={l.id}>{l.name}: {LANGUAGE_LEVEL_LABELS[language][l.level]}{i < data.languages.length - 1 ? ' | ' : ''}</span>)}</p>
            ) : renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   8. MEDICAL TEMPLATE - "الطبي"                                             */
/* ============================================================================ */

export function MedicalTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Medical header */}
      <div className="px-5 sm:px-6 py-5 text-white relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
        {/* Medical cross motif */}
        <div className="absolute top-2 opacity-10" style={{ [isR ? 'left' : 'right']: '16px' }}>
          <div className="relative w-16 h-16">
            <div className="absolute top-1/2 left-0 w-full h-4 bg-white rounded -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 h-full w-4 bg-white rounded -translate-x-1/2" />
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 relative">
          {p.photo && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/40 shrink-0">
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-extrabold">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm opacity-90 mt-0.5">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] sm:text-xs opacity-85">
              {p.email && <span className="flex items-center gap-1"><Mail size={10} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone size={10} />{p.phone}</span>}
              {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={10} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="h-1" style={{ backgroundColor: primaryColor, opacity: 0.3 }} />

      {p.summary && (
        <div className="px-5 sm:px-6 pt-4">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: primaryColor + '40' }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: primaryColor + '40' }}>{sectionLabel(type, language)}</h2>
            {type === 'skills' ? <SkillBars data={data} color={primaryColor} lang={language} /> :
             type === 'languages' ? <LanguageDots data={data} color={primaryColor} lang={language} /> :
             renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   9. ENGINEERING TEMPLATE - "الهندسي"                                       */
/* ============================================================================ */

export function EngineeringTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Blueprint header */}
      <div className="bg-gray-900 dark:bg-black px-5 sm:px-6 py-5 relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="flex items-center gap-3 sm:gap-4 relative">
          {p.photo && (
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded overflow-hidden border-2 shrink-0" style={{ borderColor: primaryColor }}>
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1 text-white">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-wide">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm font-mono mt-0.5" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] sm:text-xs text-gray-400">
              {p.email && <span className="flex items-center gap-1"><Mail size={10} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone size={10} />{p.phone}</span>}
              {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={10} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-1" style={{ backgroundColor: primaryColor }} />
      </div>

      {p.summary && (
        <div className="px-5 sm:px-6 pt-4">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">
            <span className="w-2 h-2 rotate-45 shrink-0" style={{ backgroundColor: primaryColor }} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line ps-4 border-s-2" style={{ borderStartColor: primaryColor + '30' }}>{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">
              <span className="w-2 h-2 rotate-45 shrink-0" style={{ backgroundColor: primaryColor }} />
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? <SkillBars data={data} color={primaryColor} lang={language} /> :
             type === 'languages' ? <LanguageDots data={data} color={primaryColor} lang={language} /> :
             renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   10. ACADEMIC TEMPLATE - "الأكاديمي"                                       */
/* ============================================================================ */

export function AcademicTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Centered header, no photo */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 text-center border-b-2" style={{ borderColor: primaryColor }}>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
        {p.jobTitle && <p className="text-sm sm:text-base italic mt-1" style={{ color: primaryColor }}>{p.jobTitle}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-gray-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {(p.city || p.country) && <span>{[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.website && <span>{p.website}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </div>

      {p.summary && (
        <div className="px-6 sm:px-8 pt-4">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-center mb-2" style={{ color: primaryColor }}>{language === 'ar' ? 'نبذة احترافية' : 'Research Interests & Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line text-justify">{p.summary}</p>
        </div>
      )}

      <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: primaryColor + '40' }}>{sectionLabel(type, language)}</h2>
            {type === 'skills' ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {data.skills.map((sk) => <div key={sk.id} className="text-xs sm:text-sm text-gray-600 ps-3">• {sk.name}</div>)}
              </div>
            ) : type === 'projects' ? (
              <div className="space-y-2">
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <h4 className="text-xs sm:text-sm font-bold italic">{proj.name}</h4>
                    {proj.description && <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5">{proj.description}</p>}
                    {proj.technologies.length > 0 && <p className="text-[10px] sm:text-xs text-gray-400 italic mt-0.5">Keywords: {proj.technologies.join(', ')}</p>}
                  </div>
                ))}
              </div>
            ) : renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   11. ELEGANT TEMPLATE - "الأنيق"                                           */
/* ============================================================================ */

export function ElegantTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Gradient header */}
      <div className="relative px-5 sm:px-6 py-5 sm:py-6 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc, ${primaryColor}88)` }}>
        {/* Decorative circles */}
        <div className="absolute -top-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-white/10" style={{ [isR ? 'left' : 'right']: '-20px' }} />
        <div className="absolute -top-3 w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/8" style={{ [isR ? 'left' : 'right']: '-5px' }} />
        <div className="flex items-center gap-3 sm:gap-4 relative">
          {p.photo && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/50 shadow-lg shrink-0">
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm font-light opacity-90 mt-0.5 tracking-wide">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] sm:text-xs opacity-85">
              {p.email && <span className="flex items-center gap-1"><Mail size={10} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone size={10} />{p.phone}</span>}
              {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={10} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
            </div>
          </div>
        </div>
      </div>

      {p.summary && (
        <div className="px-5 sm:px-6 pt-4">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold mb-2" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: primaryColor }}>
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
            <span className="flex-1 h-px" style={{ backgroundColor: primaryColor + '30' }} />
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold mb-2" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: primaryColor }}>
              {sectionLabel(type, language)}
              <span className="flex-1 h-px" style={{ backgroundColor: primaryColor + '30' }} />
            </h2>
            {type === 'skills' ? <SkillBadges data={data} color={primaryColor} lang={language} /> :
             type === 'languages' ? <LanguageDots data={data} color={primaryColor} lang={language} /> :
             renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   12. PREMIUM DARK TEMPLATE - "داكن فاخر"                                   */
/* ============================================================================ */

export function PremiumDarkTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto bg-[#1a1a2e] text-white" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Header */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {p.photo && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: primaryColor, boxShadow: `0 0 12px ${primaryColor}40` }}>
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-extrabold">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[10px] sm:text-xs text-gray-400">
          {p.email && <span className="flex items-center gap-1"><Mail size={11} style={{ color: primaryColor + '80' }} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone size={11} style={{ color: primaryColor + '80' }} />{p.phone}</span>}
          {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={11} style={{ color: primaryColor + '80' }} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
        </div>
      </div>

      {/* Glow divider */}
      <div className="mx-5 sm:mx-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}60, transparent)` }} />

      {p.summary && (
        <div className="px-5 sm:px-6 pt-4">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type} className="bg-[#16213e] rounded-xl p-3 sm:p-4 border border-white/5">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{sectionLabel(type, language)}</h2>
            {type === 'skills' ? (
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((sk) => (
                  <span key={sk.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: primaryColor + '25', color: primaryColor, boxShadow: `0 0 6px ${primaryColor}20` }}>
                    {sk.name}
                  </span>
                ))}
              </div>
            ) : type === 'languages' ? <LanguageDots data={data} color={primaryColor} lang={language} /> :
              renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   13. LUXURY TEMPLATE - "الفاخر"                                            */
/* ============================================================================ */

export function LuxuryTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const gold = '#D4A853';

  return (
    <div className="w-full max-w-lg mx-auto bg-[#0f1729] text-white" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Luxury header */}
      <div className="px-5 sm:px-6 pt-6 sm:pt-8 pb-4 text-center">
        {p.photo && (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 mx-auto mb-3" style={{ borderColor: gold, boxShadow: `0 0 16px ${gold}30` }}>
            <img src={p.photo} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
        <p className="text-xs sm:text-sm font-light mt-1 tracking-widest uppercase" style={{ color: gold }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
        {/* Ornamental divider */}
        <div className="flex items-center gap-2 mt-3 justify-center">
          <div className="w-8 h-px" style={{ backgroundColor: gold + '40' }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: gold }} />
          <div className="w-8 h-px" style={{ backgroundColor: gold + '40' }} />
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3 text-[10px] sm:text-xs text-gray-400">
          {p.email && <span className="flex items-center gap-1"><Mail size={10} style={{ color: gold + '80' }} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone size={10} style={{ color: gold + '80' }} />{p.phone}</span>}
          {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={10} style={{ color: gold + '80' }} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
        </div>
      </div>

      {p.summary && (
        <div className="px-5 sm:px-6 pt-3">
          <h2 className="flex items-center justify-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-2" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: gold }}>
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line text-center">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3 pt-3">
        {sections.map((type) => (
          <div key={type} className="rounded-xl p-3 sm:p-4 border" style={{ borderColor: gold + '20', backgroundColor: 'rgba(212,168,83,0.04)' }}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-2" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: gold }}>
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? (
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((sk) => (
                  <span key={sk.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border" style={{ borderColor: gold + '30', color: gold, backgroundColor: gold + '10' }}>
                    {sk.name}
                  </span>
                ))}
              </div>
            ) : type === 'languages' ? <LanguageDots data={data} color={gold} lang={language} /> :
              renderSection(type, data, gold, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   14. STARTUP TEMPLATE - "الناشئ"                                           */
/* ============================================================================ */

export function StartupTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Vibrant header */}
      <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4" style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}08)` }}>
        <div className="flex items-center gap-3 sm:gap-4">
          {p.photo && (
            <div className="rounded-2xl overflow-hidden border-2 shrink-0 w-14 h-14 sm:w-18 sm:h-18" style={{ borderColor: primaryColor + '30' }}>
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm font-semibold mt-0.5" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
          </div>
        </div>
        <div className="mt-3"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
      </div>

      {p.summary && (
        <div className="px-4 sm:px-6 pt-3">
          <SectionCard>
            <SectionHeader icon={<User size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} />
            <div className="px-4 sm:px-5 pb-4 pt-2"><p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p></div>
          </SectionCard>
        </div>
      )}

      <div className="px-4 sm:px-6 pb-5 sm:pb-6 space-y-3 pt-3">
        {sections.map((type) => (
          <SectionCard key={type}>
            <SectionHeader icon={
              type === 'experience' ? <Briefcase size={12} style={{ color: primaryColor }} /> :
              type === 'education' ? <GraduationCap size={12} style={{ color: primaryColor }} /> :
              type === 'skills' ? <Zap size={12} style={{ color: primaryColor }} /> :
              type === 'certifications' ? <Award size={12} style={{ color: primaryColor }} /> :
              type === 'languages' ? <Globe2 size={12} style={{ color: primaryColor }} /> :
              <FolderKanban size={12} style={{ color: primaryColor }} />
            } title={sectionLabel(type, language)} />
            <div className="px-4 sm:px-5 pb-4 pt-2">
              {type === 'skills' ? (
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((sk) => (
                    <span key={sk.id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: primaryColor + 'cc' }}>
                      {sk.name}
                    </span>
                  ))}
                </div>
              ) : renderSection(type, data, primaryColor, language)}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   15. CONSULTANT TEMPLATE - "الاستشاري"                                     */
/* ============================================================================ */

export function ConsultantTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Header with subtle accent */}
      <div className="flex">
        <div className="w-1 shrink-0" style={{ backgroundColor: primaryColor + '30' }} />
        <div className="flex-1 min-w-0 px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {p.photo && <Avatar photo={p.photo} name={p.fullName} color={primaryColor} size="md" />}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
              <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
              <div className="mt-1.5"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px mx-5 sm:mx-6" style={{ backgroundColor: primaryColor + '20' }} />

      {p.summary && (
        <div className="px-5 sm:px-6 pt-4">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="w-1 h-4 rounded" style={{ backgroundColor: primaryColor }} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-4 rounded" style={{ backgroundColor: primaryColor }} />
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? <SkillBars data={data} color={primaryColor} lang={language} /> :
             renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   16. SOFTWARE TEMPLATE - "المبرمج"                                         */
/* ============================================================================ */

export function SoftwareTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Code-style dark header */}
      <div className="bg-gray-900 dark:bg-black px-4 sm:px-6 pt-4 sm:pt-5 pb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-[10px] text-gray-500 ms-2 font-mono">resume.tsx</span>
        </div>
        <div className="font-mono text-xs sm:text-sm">
          <span className="text-gray-500">{'// '}</span><span className="text-gray-400">{language === 'ar' ? 'السيرة الذاتية' : 'Resume'}</span>
        </div>
        <div className="mt-2 flex items-center gap-3 sm:gap-4">
          {p.photo && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border shrink-0" style={{ borderColor: primaryColor + '50' }}>
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-extrabold text-white font-mono">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm font-mono mt-0.5" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[10px] sm:text-xs text-gray-400 font-mono">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {(p.city || p.country) && <span>{[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.github && <span className="flex items-center gap-1"><Github size={10} />{p.github}</span>}
            </div>
          </div>
        </div>
      </div>

      {p.summary && (
        <div className="px-4 sm:px-6 pt-4">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold font-mono text-gray-900 dark:text-white mb-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: primaryColor + '15', color: primaryColor }}>{'>'}</span>
            {language === 'ar' ? 'نبذة احترافية' : 'Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5 font-mono">{p.summary}</p>
        </div>
      )}

      <div className="px-4 sm:px-6 pb-5 sm:pb-6 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold font-mono text-gray-900 dark:text-white mb-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: primaryColor + '15', color: primaryColor }}>{'>'}</span>
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? (
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((sk) => (
                  <span key={sk.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border" style={{ borderColor: primaryColor + '30', color: primaryColor, backgroundColor: primaryColor + '08' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sk.level === 'expert' ? '#22c55e' : sk.level === 'advanced' ? primaryColor : '#94a3b8' }} />
                    {sk.name}
                  </span>
                ))}
              </div>
            ) : renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   17. NURSE TEMPLATE - "التمريض"                                            */
/* ============================================================================ */

export function NurseTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Soft caring header */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)` }}>
        <div className="flex items-center gap-3 sm:gap-4">
          {p.photo && (
            <div className="rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: primaryColor + '30' }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20">
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Heart size={12} style={{ color: primaryColor }} />
              <p className="text-xs sm:text-sm font-medium" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            </div>
            <div className="mt-2"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
          </div>
        </div>
      </div>

      {p.summary && (
        <div className="px-5 sm:px-6 pt-3">
          <SectionCard>
            <SectionHeader icon={<Heart size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} />
            <div className="px-4 sm:px-5 pb-4 pt-2"><p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p></div>
          </SectionCard>
        </div>
      )}

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3 pt-3">
        {sections.map((type) => (
          <SectionCard key={type}>
            <SectionHeader icon={
              type === 'experience' ? <Briefcase size={12} style={{ color: primaryColor }} /> :
              type === 'education' ? <GraduationCap size={12} style={{ color: primaryColor }} /> :
              type === 'skills' ? <Heart size={12} style={{ color: primaryColor }} /> :
              type === 'certifications' ? <Award size={12} style={{ color: primaryColor }} /> :
              type === 'languages' ? <Globe2 size={12} style={{ color: primaryColor }} /> :
              <FolderKanban size={12} style={{ color: primaryColor }} />
            } title={sectionLabel(type, language)} />
            <div className="px-4 sm:px-5 pb-4 pt-2">
              {type === 'skills' ? <SkillBars data={data} color={primaryColor} lang={language} /> :
               type === 'languages' ? <LanguageDots data={data} color={primaryColor} lang={language} /> :
               renderSection(type, data, primaryColor, language)}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   18. HEALTHCARE TEMPLATE - "الرعاية الصحية"                                */
/* ============================================================================ */

export function HealthcareTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Clinical header */}
      <div className="text-white px-5 sm:px-6 py-4 sm:py-5" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center gap-3 sm:gap-4">
          {p.photo && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/40 shrink-0">
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-extrabold">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm opacity-90 mt-0.5">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] sm:text-xs opacity-85">
          {p.email && <span className="flex items-center gap-1"><Mail size={10} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone size={10} />{p.phone}</span>}
          {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={10} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-px" style={{ backgroundColor: primaryColor + '20' }}>
        {[
          { icon: <Briefcase size={14} style={{ color: primaryColor }} />, value: data.experience.length, label: language === 'ar' ? 'خبرة' : 'Exp' },
          { icon: <Award size={14} style={{ color: primaryColor }} />, value: data.certifications.length, label: language === 'ar' ? 'شهادة' : 'Certs' },
          { icon: <Globe2 size={14} style={{ color: primaryColor }} />, value: data.languages.length, label: language === 'ar' ? 'لغة' : 'Langs' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-2.5 sm:p-3 flex items-center gap-2 justify-center">
            {stat.icon}
            <div>
              <p className="text-sm sm:text-base font-bold">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {p.summary && (
        <div className="px-5 sm:px-6 pt-4">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold mb-2" style={{ color: primaryColor }}>
            <Shield size={14} />{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold mb-2" style={{ color: primaryColor }}>
              {type === 'experience' ? <Briefcase size={14} /> : type === 'education' ? <GraduationCap size={14} /> : type === 'skills' ? <Zap size={14} /> : type === 'certifications' ? <Award size={14} /> : type === 'languages' ? <Globe2 size={14} /> : <FolderKanban size={14} />}
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? <SkillBars data={data} color={primaryColor} lang={language} /> :
             type === 'languages' ? <LanguageDots data={data} color={primaryColor} lang={language} /> :
             renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   19. MARKETING TEMPLATE - "التسويق"                                        */
/* ============================================================================ */

export function MarketingTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Bold vibrant header */}
      <div className="relative px-5 sm:px-6 pt-6 sm:pt-8 pb-5 text-white overflow-hidden" style={{ backgroundColor: primaryColor }}>
        {/* Decorative shapes */}
        <div className="absolute -top-10 -end-10 w-32 h-32 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-8 -start-8 w-24 h-24 rounded-full opacity-10 bg-white" />
        <div className="relative">
          <div className="flex items-center gap-3 sm:gap-4">
            {p.photo && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white/30 shrink-0 rotate-3">
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-extrabold">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
              <p className="text-xs sm:text-sm font-semibold mt-0.5 opacity-90">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[10px] sm:text-xs opacity-85">
            {p.email && <span className="flex items-center gap-1"><Mail size={10} />{p.email}</span>}
            {p.phone && <span className="flex items-center gap-1"><Phone size={10} />{p.phone}</span>}
            {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={10} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
          </div>
        </div>
      </div>

      {p.summary && (
        <div className="px-5 sm:px-6 pt-4">
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
            <TrendingUp size={14} className="inline me-1" />{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 pt-3">
        {sections.map((type) => (
          <div key={type} className="rounded-xl p-3 sm:p-4 border-2" style={{ borderColor: primaryColor + '15' }}>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? (
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((sk) => (
                  <span key={sk.id} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}>
                    {sk.name}
                  </span>
                ))}
              </div>
            ) : renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   20. FINANCE TEMPLATE - "المالية"                                          */
/* ============================================================================ */

export function FinanceTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full max-w-lg mx-auto bg-[#0c1929] text-white" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Conservative prestigious header */}
      <div className="px-5 sm:px-6 pt-6 sm:pt-8 pb-4 border-b-2" style={{ borderColor: primaryColor + '40' }}>
        <div className="flex items-center gap-3 sm:gap-4">
          {p.photo && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden shrink-0" style={{ border: `2px solid ${primaryColor}50` }}>
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-wide">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm font-medium mt-0.5 tracking-wider uppercase" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] sm:text-xs text-gray-400">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {(p.city || p.country) && <span>{[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </div>

      {p.summary && (
        <div className="px-5 sm:px-6 pt-4">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
            <BarChart3 size={14} className="inline me-1" />{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3 pt-3">
        {sections.map((type) => (
          <div key={type} className="rounded-lg p-3 sm:p-4 border" style={{ borderColor: primaryColor + '20', backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
              {type === 'experience' ? <Briefcase size={12} /> : type === 'education' ? <GraduationCap size={12} /> : type === 'skills' ? <Target size={12} /> : type === 'certifications' ? <Award size={12} /> : type === 'languages' ? <Globe2 size={12} /> : <FolderKanban size={12} />}
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? <SkillBars data={data} color={primaryColor} lang={language} /> :
             type === 'languages' ? <LanguageDots data={data} color={primaryColor} lang={language} /> :
             renderSection(type, data, primaryColor, language)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   21. AAFIATAK PRO TEMPLATE - "عافيتك برو"                                  */
/* ============================================================================ */

export function AafiatakProTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const yearsExp = computeYears(data.experience);
  const completedJobs = data.experience.length;
  const skillCount = data.skills.length;

  const SKILL_PERCENT: Record<SkillLevel, number> = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };

  function skillBarColor(level: SkillLevel, color: string) {
    if (level === 'expert') return color;
    if (level === 'advanced') return color + 'cc';
    if (level === 'intermediate') return color + '99';
    return '#94a3b8';
  }

  function skillBadgeStyle(level: SkillLevel, color: string) {
    if (level === 'expert') return { bg: color + '15', text: color };
    if (level === 'advanced') return { bg: color + '10', text: color + 'cc' };
    if (level === 'intermediate') return { bg: '#e0f2fe', text: '#0284c7' };
    return { bg: '#f1f5f9', text: '#64748b' };
  }

  function langDotColor(level: LanguageLevel, color: string): { filled: string; empty: string } {
    if (level === 'native' || level === 'fluent') return { filled: color, empty: color + '20' };
    if (level === 'advanced') return { filled: color + 'cc', empty: color + '15' };
    if (level === 'intermediate') return { filled: '#38bdf8', empty: '#38bdf820' };
    return { filled: '#94a3b8', empty: '#94a3b820' };
  }

  function langBadgeStyle(level: LanguageLevel, color: string): { bg: string; text: string } {
    if (level === 'native') return { bg: color + '15', text: color };
    if (level === 'fluent') return { bg: '#d1fae5', text: '#059669' };
    if (level === 'advanced') return { bg: color + '10', text: color + 'cc' };
    if (level === 'intermediate') return { bg: '#fef3c7', text: '#d97706' };
    return { bg: '#f1f5f9', text: '#64748b' };
  }

  const skillLabels = language === 'ar' ? { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم', expert: 'خبير' } : { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', expert: 'Expert' };
  const langLabels = language === 'ar' ? { native: 'لغة أم', fluent: 'فصيح', advanced: 'متقدم', intermediate: 'متوسط', basic: 'أساسي' } : { native: 'Native', fluent: 'Fluent', advanced: 'Advanced', intermediate: 'Intermediate', basic: 'Basic' };
  const degreeLabels = language === 'ar' ? { high_school: 'ثانوية', diploma: 'دبلوم', bachelor: 'بكالوريوس', master: 'ماجستير', phd: 'دكتوراه', other: 'أخرى' } : { high_school: 'High School', diploma: 'Diploma', bachelor: 'Bachelor', master: 'Master', phd: 'PhD', other: 'Other' };

  const cardClass = "rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm";

  return (
    <div className="w-full max-w-lg mx-auto space-y-3 sm:space-y-4 pb-6" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Profile Header */}
      <div className={cardClass}>
        <div className="relative h-20 sm:h-28" style={{ background: `linear-gradient(135deg, ${primaryColor}30, ${primaryColor}15, transparent)` }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top left, ${primaryColor}20, transparent 70%)` }} />
        </div>
        <div className="relative px-4 sm:px-5 pb-4 sm:pb-5 -mt-12 sm:-mt-14">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-2 sm:mb-3">
              <div className="rounded-full p-[3px]" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}80, ${primaryColor}40)` }}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 sm:border-4 border-white dark:border-gray-900 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800">
                  {p.photo ? (
                    <img src={p.photo} alt={p.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold" style={{ color: primaryColor }}>
                      {p.fullName ? p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : '?'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Name + Title */}
          <div className="text-center mb-2 sm:mb-3">
            <h1 className="text-lg sm:text-xl font-bold flex items-center justify-center gap-1.5">
              {p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}
            </h1>
            {p.jobTitle && <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: primaryColor }}>{p.jobTitle}</p>}
          </div>

          {/* Location + Experience */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
            {(p.city || p.country) && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: primaryColor + '80' }} />{[p.city, p.country].filter(Boolean).join(', ')}</span>
            )}
            {yearsExp > 0 && (
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: primaryColor + '80' }} />{yearsExp} {language === 'ar' ? 'سنة خبرة' : 'years exp'}</span>
            )}
          </div>

          {/* Quick badges */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
            {completedJobs > 0 && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{completedJobs} {language === 'ar' ? 'خبرة' : 'exp'}
              </span>
            )}
            {skillCount > 0 && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{skillCount} {language === 'ar' ? 'مهارة' : 'skills'}
              </span>
            )}
            {data.languages.length > 0 && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Globe2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{data.languages.length} {language === 'ar' ? 'لغة' : 'lang'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {[
          { icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />, value: completedJobs, label: language === 'ar' ? 'خبرة عملية' : 'Work Exp', bg: 'bg-emerald-500/10' },
          { icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />, value: skillCount, label: language === 'ar' ? 'مهارة' : 'Skills', bg: 'bg-amber-500/10' },
          { icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: primaryColor }} />, value: yearsExp, label: language === 'ar' ? 'سنة خبرة' : 'Years Exp', bg: '', customBg: primaryColor + '10' },
          { icon: <Award className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 dark:text-violet-400" />, value: data.certifications.length, label: language === 'ar' ? 'شهادة' : 'Certs', bg: 'bg-violet-500/10' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`${stat.bg} w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0`} style={stat.customBg ? { backgroundColor: stat.customBg } : undefined}>
                {stat.icon}
              </div>
              <div>
                <p className="text-base sm:text-xl font-bold">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {p.summary && (
        <div className={cardClass}>
          <SectionHeader icon={<User size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'نبذة مهنية' : 'Professional Summary'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className={cardClass}>
          <SectionHeader icon={<Sparkles size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'المهارات' : 'Skills'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3 space-y-2.5 sm:space-y-3">
            {data.skills.map((sk) => {
              const badgeStyle = skillBadgeStyle(sk.level, primaryColor);
              return (
                <div key={sk.id} className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium">{sk.name}</span>
                    <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}>{skillLabels[sk.level]}</span>
                  </div>
                  <div className="h-1.5 sm:h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: skillBarColor(sk.level, primaryColor), width: `${SKILL_PERCENT[sk.level]}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className={cardClass}>
          <SectionHeader icon={<Briefcase size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'الخبرات العملية' : 'Work Experience'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3">
            <div className="relative">
              <div className="absolute top-2 bottom-2 w-[2px]" style={{ backgroundColor: primaryColor + '20', ...(isR ? { right: '7px' } : { left: '7px' }) }} />
              <div className="space-y-4 sm:space-y-5">
                {data.experience.map((exp, index) => (
                  <div key={exp.id} className="relative" style={{ ...(isR ? { paddingRight: 24 } : { paddingLeft: 24 }) }}>
                    <div className="absolute top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-[3px] border-white dark:border-gray-900" style={{ backgroundColor: index === 0 ? primaryColor : primaryColor + '40', ...(isR ? { right: 0 } : { left: 0 }), zIndex: 1 }} />
                    <div className="space-y-1 sm:space-y-1.5">
                      {exp.jobTitle && <h4 className="text-xs sm:text-sm font-semibold">{exp.jobTitle}</h4>}
                      {exp.company && (
                        <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                          <Building2 className="w-3 h-3" style={{ color: primaryColor + '70' }} /><span>{exp.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-gray-400">
                        <Calendar className="w-3 h-3" /><span>{formatDateRange(exp.startDate, exp.endDate, exp.current, language)}</span>
                      </div>
                      {exp.description && <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1 sm:mt-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 whitespace-pre-line">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className={cardClass}>
          <SectionHeader icon={<GraduationCap size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'المؤهلات التعليمية' : 'Education'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3 space-y-2.5 sm:space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="pb-2.5 sm:pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold">{edu.major}</h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{edu.institution}</p>
                    {edu.degree && (
                      <span className="inline-block text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1" style={{ backgroundColor: primaryColor + '10', color: primaryColor }}>
                        {degreeLabels[edu.degree as keyof typeof degreeLabels] || edu.degree}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 shrink-0">{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</span>
                </div>
                {edu.description && <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className={cardClass}>
          <SectionHeader icon={<Award size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'الشهادات والدورات' : 'Certifications'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-3 sm:p-3.5 space-y-1.5 sm:space-y-2">
                  <h4 className="text-xs sm:text-sm font-semibold leading-tight">{cert.name}</h4>
                  {cert.issuer && <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cert.issuer}</p>}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold bg-amber-500/10 text-amber-600">{language === 'ar' ? 'شهادة' : 'Cert'}</span>
                    {cert.date && <span className="text-[9px] sm:text-[10px] text-gray-400">{cert.date}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className={cardClass}>
          <SectionHeader icon={<Globe2 size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'اللغات' : 'Languages'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3 space-y-2.5 sm:space-y-3">
            {data.languages.map((lang) => {
              const dots = getLanguageDots(lang.level);
              const dotColors = langDotColor(lang.level, primaryColor);
              const badge = langBadgeStyle(lang.level, primaryColor);
              return (
                <div key={lang.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-medium">{lang.name}</span>
                    <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: badge.bg, color: badge.text }}>{langLabels[lang.level]}</span>
                  </div>
                  <div className="flex gap-0.5 sm:gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: i < dots ? dotColors.filled : dotColors.empty }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className={cardClass}>
          <SectionHeader icon={<FolderKanban size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'المشاريع' : 'Projects'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3 space-y-2 sm:space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-3 sm:p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold">{proj.name}</h4>
                  {proj.url && <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />}
                </div>
                {proj.description && <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5 leading-relaxed">{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
                    {proj.technologies.map((tech) => (
                      <span key={tech} className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: primaryColor + '10', color: primaryColor + 'cc' }}>{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      {(p.email || p.phone || p.website || p.linkedin || p.github) && (
        <div className={cardClass}>
          <SectionHeader icon={<Phone size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'معلومات التواصل' : 'Contact'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {p.email && <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400"><Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: primaryColor + '70' }} /><span className="truncate">{p.email}</span></div>}
              {p.phone && <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400"><Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: primaryColor + '70' }} /><span>{p.phone}</span></div>}
              {p.website && <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400"><Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: primaryColor + '70' }} /><span className="truncate">{p.website}</span></div>}
              {p.linkedin && <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400"><ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: primaryColor + '70' }} /><span className="truncate">{p.linkedin}</span></div>}
              {p.github && <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400"><Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: primaryColor + '70' }} /><span className="truncate">{p.github}</span></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================ */
/*   Template Registry                                                          */
/* ============================================================================ */

export function getTemplateComponent(slug: string): React.ComponentType<TemplateProps> {
  const map: Record<string, React.ComponentType<TemplateProps>> = {
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
    aafiatakpro: AafiatakProTemplate,
    manager: CorporateTemplate,
  };
  return map[slug] || AafiatakProTemplate;
}
