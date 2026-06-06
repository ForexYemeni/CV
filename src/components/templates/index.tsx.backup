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

/* Extra helpers for premium templates */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) };
}

function lighten(hex: string, pct: number): string {
  const { r, g, b } = hexToRgb(hex);
  const f = pct / 100;
  return `rgb(${Math.round(r + (255 - r) * f)},${Math.round(g + (255 - g) * f)},${Math.round(b + (255 - b) * f)})`;
}

function darken(hex: string, pct: number): string {
  const { r, g, b } = hexToRgb(hex);
  const f = 1 - pct / 100;
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
}

function sectionIcon(type: string): React.ReactNode {
  switch (type) {
    case 'experience': return <Briefcase size={14} />;
    case 'education': return <GraduationCap size={14} />;
    case 'skills': return <Zap size={14} />;
    case 'certifications': return <Award size={14} />;
    case 'languages': return <Globe2 size={14} />;
    case 'projects': return <FolderKanban size={14} />;
    default: return <FileText size={14} />;
  }
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
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Double border header */}
      <div style={{ borderColor: primaryColor }} className="border-b-2">
        <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {p.photo && (
              <div className="shrink-0">
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden border-4 shadow-md" style={{ borderColor: primaryColor }}>
                  <img src={p.photo} alt={p.fullName} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            <div className="min-w-0 flex-1 pt-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
              <p className="text-sm sm:text-base font-medium mt-1" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
              <div className="mt-3"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
            </div>
          </div>
        </div>
      </div>
      {/* Decorative double line */}
      <div className="flex">
        <div className="flex-1 h-0.5" style={{ backgroundColor: primaryColor }} />
        <div className="flex-1 h-0.5" style={{ backgroundColor: primaryColor + '30' }} />
      </div>

      {p.summary && (
        <div className="px-5 sm:px-8 pt-5">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-widest pb-2 mb-3 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-widest pb-2 mb-3 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>{sectionLabel(type, language)}</h2>
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
    <div className="w-full flex flex-col sm:flex-row" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Sidebar */}
      <div className="w-full sm:w-[38%] text-white p-5 sm:p-6" style={{ background: `linear-gradient(180deg, ${primaryColor}, ${darken(primaryColor, 15)})` }}>
        <div className="flex flex-col items-center text-center">
          {p.photo ? (
            <div className="mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-white/30 shadow-lg">
                <img src={p.photo} alt={p.fullName} className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-white/80">{p.fullName ? p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : '?'}</span>
            </div>
          )}
          <h1 className="text-base sm:text-lg font-extrabold">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
          <p className="text-xs sm:text-sm opacity-90 mt-1">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
        </div>

        <div className="mt-5 pt-4 border-t border-white/20">
          <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 opacity-70">{language === 'ar' ? 'معلومات التواصل' : 'Contact'}</h3>
          <div className="space-y-2 text-[10px] sm:text-xs">
            {p.email && <div className="flex items-center gap-2"><Mail size={12} className="shrink-0" /><span className="break-all">{p.email}</span></div>}
            {p.phone && <div className="flex items-center gap-2"><Phone size={12} className="shrink-0" />{p.phone}</div>}
            {(p.city || p.country) && <div className="flex items-center gap-2"><MapPin size={12} className="shrink-0" />{[p.city, p.country].filter(Boolean).join(', ')}</div>}
            {p.website && <div className="flex items-center gap-2"><Globe size={12} className="shrink-0" /><span className="break-all">{p.website}</span></div>}
            {p.linkedin && <div className="flex items-center gap-2"><Linkedin size={12} className="shrink-0" /><span className="break-all">{p.linkedin}</span></div>}
            {p.github && <div className="flex items-center gap-2"><Github size={12} className="shrink-0" /><span className="break-all">{p.github}</span></div>}
          </div>
        </div>

        {sidebarItems.map((type) => (
          <div key={type} className="mt-5 pt-4 border-t border-white/20">
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 opacity-70">{sectionLabel(type, language)}</h3>
            {type === 'skills' && (
              <div className="space-y-2.5">
                {data.skills.map((sk) => (
                  <div key={sk.id}>
                    <div className="flex justify-between text-[10px] sm:text-xs mb-1"><span>{sk.name}</span><span className="opacity-60">{SKILL_LEVEL_LABELS[language][sk.level]}</span></div>
                    <div className="h-1.5 rounded-full bg-white/20 overflow-hidden"><div className="h-full rounded-full bg-white/80" style={{ width: getSkillWidth(sk.level) }} /></div>
                  </div>
                ))}
              </div>
            )}
            {type === 'certifications' && (
              <div className="space-y-2">
                {data.certifications.map((c) => (
                  <div key={c.id} className="text-[10px] sm:text-xs"><div className="font-semibold">{c.name}</div><div className="opacity-60 mt-0.5">{c.issuer}{c.date ? ` · ${c.date}` : ''}</div></div>
                ))}
              </div>
            )}
            {type === 'languages' && (
              <div className="space-y-2">
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
      <div className="flex-1 p-5 sm:p-6 space-y-5">
        {p.summary && (
          <div>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: primaryColor }} />
              {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
          </div>
        )}
        {mainItems.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: primaryColor }} />
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
  const yrs = computeYears(data.experience);

  return (
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Premium gradient banner */}
      <div className="relative px-6 sm:px-8 py-6 sm:py-8 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${darken(primaryColor, 20)})` }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative flex items-center gap-4 sm:gap-5">
          {p.photo && (
            <div className="shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 shadow-xl" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-sm sm:text-base font-light opacity-90 mt-1 tracking-wide">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm opacity-85">
              {p.email && <span className="flex items-center gap-1"><Mail size={12} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone size={12} />{p.phone}</span>}
              {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={12} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
            </div>
          </div>
        </div>
        {/* Stats strip */}
        <div className="flex gap-4 mt-5 pt-4 border-t border-white/20">
          {yrs > 0 && <div className="text-center"><div className="text-lg sm:text-xl font-extrabold">{yrs}+</div><div className="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-70">{language === 'ar' ? 'سنوات خبرة' : 'Years Exp'}</div></div>}
          {data.experience.length > 0 && <div className="text-center"><div className="text-lg sm:text-xl font-extrabold">{data.experience.length}</div><div className="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-70">{language === 'ar' ? 'وظائف' : 'Positions'}</div></div>}
          {data.certifications.length > 0 && <div className="text-center"><div className="text-lg sm:text-xl font-extrabold">{data.certifications.length}</div><div className="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-70">{language === 'ar' ? 'شهادات' : 'Certs'}</div></div>}
          {data.skills.length > 0 && <div className="text-center"><div className="text-lg sm:text-xl font-extrabold">{data.skills.length}</div><div className="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-70">{language === 'ar' ? 'مهارات' : 'Skills'}</div></div>}
        </div>
      </div>

      {p.summary && (
        <div className="px-6 sm:px-8 pt-5">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider pb-2 mb-3 border-b-2" style={{ color: primaryColor, borderColor: primaryColor + '30' }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider pb-2 mb-3 border-b-2" style={{ color: primaryColor, borderColor: primaryColor + '30' }}>{sectionLabel(type, language)}</h2>
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
/*   4. CREATIVE TEMPLATE - "الإبداعي"                                         */
/* ============================================================================ */

export function CreativeTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full relative overflow-hidden" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Geometric corner accent */}
      <div className="absolute top-0 w-28 h-28 sm:w-36 sm:h-36 opacity-10" style={{ backgroundColor: primaryColor, [isR ? 'left' : 'right']: 0, clipPath: isR ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)' }} />
      <div className="absolute top-0 w-18 h-18 sm:w-24 sm:h-24 opacity-20" style={{ backgroundColor: primaryColor, [isR ? 'left' : 'right']: 0, clipPath: isR ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)' }} />
      {/* Circle accent */}
      <div className="absolute top-16 w-8 h-8 sm:w-12 sm:h-12 rounded-full opacity-10" style={{ backgroundColor: primaryColor, [isR ? 'left' : 'right']: '40px' }} />

      {/* Header with gradient ring */}
      <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4 relative">
        <div className="flex items-center gap-4 sm:gap-5">
          {p.photo && (
            <div className="rounded-full p-1 shrink-0" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}60, ${primaryColor})` }}>
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-white dark:border-gray-900">
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-sm sm:text-base font-semibold mt-1" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="mt-3"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
          </div>
        </div>
      </div>

      {/* Gradient divider */}
      <div className="mx-5 sm:mx-8 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}60, ${primaryColor}10)` }} />

      {p.summary && (
        <div className="px-5 sm:px-8 pt-5">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3" style={{ color: primaryColor }}>
            <Sparkles size={14} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3" style={{ color: primaryColor }}>
              {sectionIcon(type)}
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((sk) => (
                  <span key={sk.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}>
                    {sk.name}
                  </span>
                ))}
              </div>
            ) : type === 'projects' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="rounded-xl border-2 p-3 sm:p-4" style={{ borderColor: primaryColor + '20', background: `linear-gradient(135deg, ${primaryColor}08, ${primaryColor}03)` }}>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold">{proj.name}</h4>
                      {proj.url && <ExternalLink size={12} style={{ color: primaryColor }} className="shrink-0" />}
                    </div>
                    {proj.description && <p className="text-[11px] sm:text-xs text-gray-500 mt-1.5 leading-relaxed">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((t) => (
                          <span key={t} className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: primaryColor + '90' }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
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
/*   5. MINIMAL TEMPLATE - "البسيط"                                            */
/* ============================================================================ */

export function MinimalTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      <div className="px-8 sm:px-12 pt-10 sm:pt-12 pb-5">
        <h1 className="text-2xl sm:text-3xl font-light tracking-[0.15em] text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
        <p className="text-sm sm:text-base font-normal mt-2 tracking-wider" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
        <div className="h-px mt-4 mb-3" style={{ backgroundColor: primaryColor + '30' }} />
        <ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} />
      </div>

      {p.summary && (
        <div className="px-8 sm:px-12 pt-3">
          <h2 className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: primaryColor }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-8 sm:px-12 pb-10 sm:pb-12 space-y-6 pt-5">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: primaryColor }}>{sectionLabel(type, language)}</h2>
            {type === 'skills' ? (
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {data.skills.map((sk) => <span key={sk.id} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{sk.name}<span className="mx-1" style={{ color: primaryColor + '60' }}>·</span></span>)}
              </div>
            ) : type === 'languages' ? <LanguageList data={data} color={primaryColor} lang={language} /> :
             renderSection(type, data, primaryColor, language)}
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
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Top accent bar */}
      <div className="h-2" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}80)` }} />

      {/* Header */}
      <div className="px-5 sm:px-8 pt-5 sm:pt-6 pb-4 flex items-center gap-4 sm:gap-5">
        {p.photo && (
          <div className="shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-md border-2" style={{ borderColor: primaryColor + '30' }}>
              <img src={p.photo} alt={p.fullName} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
          <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
          <div className="mt-2"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
        </div>
      </div>

      {p.summary && (
        <div className="px-5 sm:px-8 pt-2">
          <div className="rounded-lg p-3 sm:p-4 border-s-4" style={{ borderInlineStartColor: primaryColor, backgroundColor: primaryColor + '08' }}>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
          </div>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-4 pt-4">
        {sections.map((type) => (
          <div key={type} className="rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 overflow-hidden">
            <div className="px-3 sm:px-4 py-2 flex items-center gap-2" style={{ backgroundColor: primaryColor + '10', borderBottom: `2px solid ${primaryColor}20` }}>
              <div style={{ color: primaryColor }}>{sectionIcon(type)}</div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{sectionLabel(type, language)}</h2>
            </div>
            <div className="p-3 sm:p-4">
              {type === 'skills' ? <SkillBadges data={data} color={primaryColor} lang={language} /> :
               type === 'languages' ? <LanguageDots data={data} color={primaryColor} lang={language} /> :
               renderSection(type, data, primaryColor, language)}
            </div>
          </div>
        ))}
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
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      <div className="px-6 sm:px-10 pt-6 sm:pt-8 pb-4 text-center">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
        <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mt-1">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-gray-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>· {p.phone}</span>}
          {(p.city || p.country) && <span>· {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.website && <span>· {p.website}</span>}
          {p.linkedin && <span>· {p.linkedin}</span>}
          {p.github && <span>· {p.github}</span>}
        </div>
      </div>
      <div className="h-px bg-gray-900 dark:bg-gray-100 mx-6 sm:mx-10" />

      {p.summary && (
        <div className="px-6 sm:px-10 pt-4">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-6 sm:px-10 pb-6 sm:pb-8 space-y-4 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white pb-1 mb-2 border-b border-gray-900 dark:border-gray-100">{sectionLabel(type, language)}</h2>
            {type === 'skills' ? (
              <p className="text-xs sm:text-sm text-gray-700">{data.skills.map((sk, i) => <span key={sk.id}>{sk.name} ({SKILL_LEVEL_LABELS[language][sk.level]}){i < data.skills.length - 1 ? ' | ' : ''}</span>)}</p>
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
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Medical header with cross motif */}
      <div className="relative px-5 sm:px-8 py-5 sm:py-6 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${darken(primaryColor, 15)})` }}>
        <div className="absolute opacity-10" style={{ top: '-8px', [isR ? 'left' : 'right']: '12px' }}>
          <div className="relative w-20 h-20">
            <div className="absolute top-1/2 left-0 w-full h-5 bg-white rounded -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 h-full w-5 bg-white rounded -translate-x-1/2" />
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-5 relative">
          {p.photo && (
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-extrabold">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm opacity-90 mt-1">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[10px] sm:text-xs opacity-85">
              {p.email && <span className="flex items-center gap-1"><Mail size={11} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone size={11} />{p.phone}</span>}
              {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={11} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20" />
      </div>

      {p.summary && (
        <div className="px-5 sm:px-8 pt-5">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
            <Shield size={14} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider pb-2 mb-3 border-b" style={{ color: primaryColor, borderColor: primaryColor + '30' }}>{sectionLabel(type, language)}</h2>
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
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Blueprint dark header */}
      <div className="px-5 sm:px-8 py-5 sm:py-6 relative overflow-hidden" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="flex items-center gap-4 sm:gap-5 relative">
          {p.photo && (
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-lg overflow-hidden border-2 shrink-0" style={{ borderColor: primaryColor }}>
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1 text-white">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-wide">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm font-mono mt-1" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[10px] sm:text-xs text-gray-400">
              {p.email && <span className="flex items-center gap-1"><Mail size={11} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone size={11} />{p.phone}</span>}
              {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={11} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.github && <span className="flex items-center gap-1"><Github size={11} />{p.github}</span>}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-1" style={{ backgroundColor: primaryColor }} />
      </div>

      {p.summary && (
        <div className="px-5 sm:px-8 pt-5">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
            <span className="w-2 h-2 rotate-45 shrink-0" style={{ backgroundColor: primaryColor }} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line ps-4 border-s-2" style={{ borderInlineStartColor: primaryColor + '30' }}>{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
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
  const serifFont = '"Playfair Display", Georgia, serif';

  return (
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Centered header - publication style */}
      <div className="px-6 sm:px-10 pt-6 sm:pt-8 pb-4 text-center border-b-2" style={{ borderColor: primaryColor }}>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: serifFont }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
        {p.jobTitle && <p className="text-sm sm:text-base italic mt-1" style={{ color: primaryColor, fontFamily: serifFont }}>{p.jobTitle}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-gray-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>· {p.phone}</span>}
          {(p.city || p.country) && <span>· {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.website && <span>· {p.website}</span>}
          {p.linkedin && <span>· {p.linkedin}</span>}
        </div>
      </div>

      {p.summary && (
        <div className="px-6 sm:px-10 pt-5">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-center mb-3" style={{ color: primaryColor, fontFamily: serifFont }}>{language === 'ar' ? 'نبذة احترافية' : 'Research Interests & Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line text-justify">{p.summary}</p>
        </div>
      )}

      <div className="px-6 sm:px-10 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider pb-1.5 mb-3 border-b" style={{ color: primaryColor, borderColor: primaryColor + '40', fontFamily: serifFont }}>{sectionLabel(type, language)}</h2>
            {type === 'skills' ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {data.skills.map((sk) => <div key={sk.id} className="text-xs sm:text-sm text-gray-600 ps-3 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />{sk.name}</div>)}
              </div>
            ) : type === 'projects' ? (
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <h4 className="text-xs sm:text-sm font-bold italic" style={{ fontFamily: serifFont }}>{proj.name}</h4>
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
  const serifFont = '"Playfair Display", Georgia, serif';

  return (
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Gradient header with decorative circles */}
      <div className="relative px-6 sm:px-8 py-6 sm:py-8 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc, ${darken(primaryColor, 10)})` }}>
        <div className="absolute -top-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-white/10" style={{ [isR ? 'left' : 'right']: '-20px' }} />
        <div className="absolute -top-2 w-16 h-16 sm:w-22 sm:h-22 rounded-full border border-white/8" style={{ [isR ? 'left' : 'right']: '-5px' }} />
        <div className="flex items-center gap-4 sm:gap-5 relative">
          {p.photo && (
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 shadow-lg shrink-0" style={{ borderColor: 'rgba(255,255,255,0.5)' }}>
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: serifFont }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm font-light opacity-90 mt-1 tracking-wide">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[10px] sm:text-xs opacity-85">
              {p.email && <span className="flex items-center gap-1"><Mail size={10} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone size={10} />{p.phone}</span>}
              {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={10} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
            </div>
          </div>
        </div>
      </div>

      {p.summary && (
        <div className="px-6 sm:px-8 pt-5">
          <h2 className="flex items-center gap-3 text-sm sm:text-base font-bold mb-3" style={{ fontFamily: serifFont, color: primaryColor }}>
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
            <span className="flex-1 h-px" style={{ backgroundColor: primaryColor + '30' }} />
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-3 text-sm sm:text-base font-bold mb-3" style={{ fontFamily: serifFont, color: primaryColor }}>
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
  const bgMain = '#0f0f1a';
  const bgCard = '#1a1a2e';

  return (
    <div className="w-full text-white" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily), backgroundColor: bgMain }}>
      <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4">
        <div className="flex items-center gap-4 sm:gap-5">
          {p.photo && (
            <div className="shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2" style={{ borderColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}40` }}>
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-sm sm:text-base mt-1 font-medium" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-[10px] sm:text-xs text-gray-400">
          {p.email && <span className="flex items-center gap-1.5"><Mail size={12} style={{ color: primaryColor + '80' }} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1.5"><Phone size={12} style={{ color: primaryColor + '80' }} />{p.phone}</span>}
          {(p.city || p.country) && <span className="flex items-center gap-1.5"><MapPin size={12} style={{ color: primaryColor + '80' }} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.github && <span className="flex items-center gap-1.5"><Github size={12} style={{ color: primaryColor + '80' }} />{p.github}</span>}
          {p.linkedin && <span className="flex items-center gap-1.5"><Linkedin size={12} style={{ color: primaryColor + '80' }} />{p.linkedin}</span>}
        </div>
      </div>

      {/* Glow divider */}
      <div className="mx-5 sm:mx-8 h-px" style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}60, transparent)` }} />

      {p.summary && (
        <div className="px-5 sm:px-8 pt-5">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-4 pt-4">
        {sections.map((type) => (
          <div key={type} className="rounded-xl p-4 sm:p-5 border" style={{ borderColor: primaryColor + '15', backgroundColor: bgCard }}>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>{sectionLabel(type, language)}</h2>
            {type === 'skills' ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((sk) => (
                  <span key={sk.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border" style={{ borderColor: primaryColor + '30', color: primaryColor, backgroundColor: primaryColor + '15', boxShadow: `0 0 8px ${primaryColor}15` }}>
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
  const bgDark = '#0a0f1e';
  const serifFont = '"Playfair Display", Georgia, serif';

  return (
    <div className="w-full text-white" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily), backgroundColor: bgDark }}>
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 text-center">
        {p.photo && (
          <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 mx-auto mb-4" style={{ borderColor: gold, boxShadow: `0 0 24px ${gold}25` }}>
            <img src={p.photo} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: serifFont }}>{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
        <p className="text-xs sm:text-sm font-light mt-1.5 tracking-[0.2em] uppercase" style={{ color: gold }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
        {/* Ornamental divider */}
        <div className="flex items-center gap-3 mt-4 justify-center">
          <div className="w-12 h-px" style={{ backgroundColor: gold + '40' }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: gold }} />
          <div className="w-12 h-px" style={{ backgroundColor: gold + '40' }} />
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-[10px] sm:text-xs text-gray-400">
          {p.email && <span className="flex items-center gap-1"><Mail size={10} style={{ color: gold + '80' }} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone size={10} style={{ color: gold + '80' }} />{p.phone}</span>}
          {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={10} style={{ color: gold + '80' }} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
        </div>
      </div>

      {p.summary && (
        <div className="px-6 sm:px-8 pt-4">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider mb-3 text-center" style={{ fontFamily: serifFont, color: gold }}>{language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line text-center">{p.summary}</p>
        </div>
      )}

      <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 pt-5">
        {sections.map((type) => (
          <div key={type} className="rounded-xl p-4 sm:p-5 border" style={{ borderColor: gold + '20', backgroundColor: gold + '06' }}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-3" style={{ fontFamily: serifFont, color: gold }}>
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((sk) => (
                  <span key={sk.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border" style={{ borderColor: gold + '30', color: gold, backgroundColor: gold + '10' }}>
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
  const yrs = computeYears(data.experience);

  return (
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Vibrant gradient header */}
      <div className="relative px-5 sm:px-8 py-6 sm:py-8 overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)` }}>
        <div className="absolute top-0 w-40 h-40 sm:w-56 sm:h-56 rounded-full opacity-10 -translate-y-1/2" style={{ backgroundColor: primaryColor, [isR ? 'left' : 'right']: '-40px' }} />
        <div className="absolute bottom-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-8 translate-y-1/2" style={{ backgroundColor: primaryColor, [isR ? 'right' : 'left']: '20px' }} />
        <div className="flex items-center gap-4 sm:gap-5 relative">
          {p.photo && (
            <div className="shrink-0 rounded-2xl overflow-hidden border-2 shadow-lg" style={{ borderColor: primaryColor + '30' }}>
              <div className="w-18 h-18 sm:w-22 sm:h-22">
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-sm sm:text-base font-semibold mt-1" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="mt-3"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
          </div>
        </div>
        {/* Bold stats */}
        <div className="flex gap-4 sm:gap-6 mt-5 pt-4 border-t relative" style={{ borderColor: primaryColor + '20' }}>
          {yrs > 0 && <div className="flex items-center gap-2"><TrendingUp size={16} style={{ color: primaryColor }} /><div><div className="text-lg sm:text-xl font-extrabold" style={{ color: primaryColor }}>{yrs}+</div><div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">{language === 'ar' ? 'سنوات' : 'Years'}</div></div></div>}
          {data.experience.length > 0 && <div className="flex items-center gap-2"><Briefcase size={16} style={{ color: primaryColor }} /><div><div className="text-lg sm:text-xl font-extrabold" style={{ color: primaryColor }}>{data.experience.length}</div><div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">{language === 'ar' ? 'وظائف' : 'Roles'}</div></div></div>}
          {data.projects.length > 0 && <div className="flex items-center gap-2"><FolderKanban size={16} style={{ color: primaryColor }} /><div><div className="text-lg sm:text-xl font-extrabold" style={{ color: primaryColor }}>{data.projects.length}</div><div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">{language === 'ar' ? 'مشاريع' : 'Projects'}</div></div></div>}
        </div>
      </div>

      {p.summary && (
        <div className="px-5 sm:px-8 pt-5">
          <SectionCard>
            <SectionHeader icon={<User size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} />
            <div className="px-4 sm:px-5 pb-4 pt-2"><p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p></div>
          </SectionCard>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-3 pt-4">
        {sections.map((type) => (
          <SectionCard key={type}>
            <SectionHeader icon={<span style={{ color: primaryColor }}>{sectionIcon(type)}</span>} title={sectionLabel(type, language)} />
            <div className="px-4 sm:px-5 pb-4 pt-2">
              {type === 'skills' ? (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((sk) => (
                    <span key={sk.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: primaryColor + 'cc' }}>
                      {sk.name}
                    </span>
                  ))}
                </div>
              ) : type === 'languages' ? <LanguageDots data={data} color={primaryColor} lang={language} /> :
               renderSection(type, data, primaryColor, language)}
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
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Navy professional header */}
      <div className="flex">
        <div className="w-2 shrink-0" style={{ background: `linear-gradient(180deg, ${primaryColor}, ${darken(primaryColor, 20)})` }} />
        <div className="flex-1 min-w-0">
          <div className="px-5 sm:px-8 pt-5 sm:pt-6 pb-4">
            <div className="flex items-center gap-4 sm:gap-5">
              {p.photo && (
                <div className="shrink-0">
                  <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden border-3 shadow-md" style={{ borderColor: primaryColor + '40' }}>
                    <img src={p.photo} alt={p.fullName} className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
                <p className="text-sm sm:text-base font-medium mt-1" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
                <div className="mt-3"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px mx-5 sm:mx-8" style={{ backgroundColor: primaryColor + '20' }} />

      {p.summary && (
        <div className="px-5 sm:px-8 pt-5">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
            <span className="w-1.5 h-5 rounded" style={{ backgroundColor: primaryColor }} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              <span className="w-1.5 h-5 rounded" style={{ backgroundColor: primaryColor }} />
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
/*   16. SOFTWARE TEMPLATE - "المبرمج"                                         */
/* ============================================================================ */

export function SoftwareTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Terminal-style dark header */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-4" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28c840' }} />
          <span className="text-[10px] sm:text-xs text-gray-500 ms-2 font-mono">resume.tsx</span>
        </div>
        <div className="font-mono text-xs sm:text-sm text-gray-500">
          <span style={{ color: primaryColor }}>const</span> <span className="text-gray-300">developer</span> <span style={{ color: primaryColor }}>=</span> <span className="text-gray-400">{'{'}</span>
        </div>
        <div className="mt-3 flex items-center gap-4 sm:gap-5">
          {p.photo && (
            <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2" style={{ borderColor: primaryColor + '50' }}>
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-extrabold text-white font-mono">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-xs sm:text-sm font-mono mt-1" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] sm:text-xs text-gray-400 font-mono">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {(p.city || p.country) && <span>{[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.github && <span className="flex items-center gap-1"><Github size={10} />{p.github}</span>}
            </div>
          </div>
        </div>
      </div>

      {p.summary && (
        <div className="px-5 sm:px-8 pt-5">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold font-mono text-gray-900 dark:text-white mb-3">
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: primaryColor + '15', color: primaryColor }}>{'>'}</span>
            {language === 'ar' ? 'نبذة احترافية' : 'Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 font-mono">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold font-mono text-gray-900 dark:text-white mb-3">
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: primaryColor + '15', color: primaryColor }}>{'>'}</span>
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((sk) => (
                  <span key={sk.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border" style={{ borderColor: primaryColor + '30', color: primaryColor, backgroundColor: primaryColor + '08' }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sk.level === 'expert' ? '#22c55e' : sk.level === 'advanced' ? primaryColor : '#94a3b8' }} />
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
/*   17. NURSE TEMPLATE - "التمريض"                                            */
/* ============================================================================ */

export function NurseTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const yrs = computeYears(data.experience);

  return (
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Soft caring header */}
      <div className="relative px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}18, ${primaryColor}08)` }}>
        {/* Heart motif */}
        <div className="absolute top-3 opacity-8" style={{ [isR ? 'left' : 'right']: '16px' }}>
          <Heart size={48} style={{ color: primaryColor }} />
        </div>
        <div className="flex items-center gap-4 sm:gap-5 relative">
          {p.photo && (
            <div className="shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 shadow-md" style={{ borderColor: primaryColor + '40' }}>
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Heart size={14} style={{ color: primaryColor }} />
              <p className="text-sm sm:text-base font-semibold" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            </div>
            <div className="mt-3"><ContactRow info={p} color={primaryColor} lang={language} size={fontSizeBase(fontSize)} /></div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-3 sm:gap-4 mt-5 pt-4 border-t relative" style={{ borderColor: primaryColor + '20' }}>
          {yrs > 0 && <div className="flex-1 rounded-xl p-2.5 sm:p-3 text-center" style={{ backgroundColor: primaryColor + '10' }}><div className="text-base sm:text-lg font-extrabold" style={{ color: primaryColor }}>{yrs}+</div><div className="text-[9px] sm:text-[10px] text-gray-500 uppercase">{language === 'ar' ? 'سنوات خبرة' : 'Years Exp'}</div></div>}
          {data.certifications.length > 0 && <div className="flex-1 rounded-xl p-2.5 sm:p-3 text-center" style={{ backgroundColor: primaryColor + '10' }}><div className="text-base sm:text-lg font-extrabold" style={{ color: primaryColor }}>{data.certifications.length}</div><div className="text-[9px] sm:text-[10px] text-gray-500 uppercase">{language === 'ar' ? 'شهادات' : 'Certs'}</div></div>}
          {data.languages.length > 0 && <div className="flex-1 rounded-xl p-2.5 sm:p-3 text-center" style={{ backgroundColor: primaryColor + '10' }}><div className="text-base sm:text-lg font-extrabold" style={{ color: primaryColor }}>{data.languages.length}</div><div className="text-[9px] sm:text-[10px] text-gray-500 uppercase">{language === 'ar' ? 'لغات' : 'Langs'}</div></div>}
        </div>
      </div>

      {p.summary && (
        <div className="px-5 sm:px-8 pt-4">
          <SectionCard>
            <SectionHeader icon={<Heart size={12} style={{ color: primaryColor }} />} title={language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'} />
            <div className="px-4 sm:px-5 pb-4 pt-2"><p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p></div>
          </SectionCard>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-3 pt-4">
        {sections.map((type) => (
          <div key={type} className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: primaryColor + '20', backgroundColor: primaryColor + '04' }}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3" style={{ color: primaryColor }}>
              <Heart size={12} />
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
/*   18. HEALTHCARE TEMPLATE - "أخصائي صحي"                                    */
/* ============================================================================ */

export function HealthcareTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const sideSections = ['skills', 'certifications', 'languages'];
  const mainSections = ['experience', 'education', 'projects'];
  const sidebarItems = sideSections.filter((s) => sections.includes(s));
  const mainItems = mainSections.filter((s) => sections.includes(s));

  return (
    <div className="w-full flex flex-col sm:flex-row" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Teal sidebar */}
      <div className="w-full sm:w-[38%] p-5 sm:p-6" style={{ background: `linear-gradient(180deg, ${primaryColor}, ${darken(primaryColor, 15)})` }}>
        <div className="flex flex-col items-center text-center text-white">
          {/* Medical cross icon */}
          <div className="mb-3 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Shield size={20} />
          </div>
          {p.photo ? (
            <div className="mb-3">
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
                <img src={p.photo} alt={p.fullName} className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <span className="text-xl font-bold text-white/80">{p.fullName ? p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : '?'}</span>
            </div>
          )}
          <h1 className="text-base sm:text-lg font-extrabold">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
          <p className="text-xs sm:text-sm opacity-90 mt-1">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
        </div>

        <div className="mt-5 pt-4 border-t border-white/20">
          <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 opacity-70">{language === 'ar' ? 'معلومات التواصل' : 'Contact'}</h3>
          <div className="space-y-2 text-[10px] sm:text-xs">
            {p.email && <div className="flex items-center gap-2"><Mail size={11} className="shrink-0" /><span className="break-all">{p.email}</span></div>}
            {p.phone && <div className="flex items-center gap-2"><Phone size={11} className="shrink-0" />{p.phone}</div>}
            {(p.city || p.country) && <div className="flex items-center gap-2"><MapPin size={11} className="shrink-0" />{[p.city, p.country].filter(Boolean).join(', ')}</div>}
          </div>
        </div>

        {sidebarItems.map((type) => (
          <div key={type} className="mt-5 pt-4 border-t border-white/20">
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 opacity-70">{sectionLabel(type, language)}</h3>
            {type === 'skills' && (
              <div className="space-y-2.5">
                {data.skills.map((sk) => (
                  <div key={sk.id}>
                    <div className="flex justify-between text-[10px] sm:text-xs mb-1"><span>{sk.name}</span><span className="opacity-60">{SKILL_LEVEL_LABELS[language][sk.level]}</span></div>
                    <div className="h-1.5 rounded-full bg-white/20 overflow-hidden"><div className="h-full rounded-full bg-white/80" style={{ width: getSkillWidth(sk.level) }} /></div>
                  </div>
                ))}
              </div>
            )}
            {type === 'certifications' && (
              <div className="space-y-2">
                {data.certifications.map((c) => (
                  <div key={c.id} className="rounded-lg p-2" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="text-[10px] sm:text-xs font-semibold">{c.name}</div>
                    <div className="text-[9px] sm:text-[10px] opacity-70 mt-0.5">{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
                  </div>
                ))}
              </div>
            )}
            {type === 'languages' && (
              <div className="space-y-2">
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
      <div className="flex-1 p-5 sm:p-6 space-y-5">
        {p.summary && (
          <div>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-3">
              <Shield size={14} style={{ color: primaryColor }} />
              {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
          </div>
        )}
        {mainItems.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-3">
              <span style={{ color: primaryColor }}>{sectionIcon(type)}</span>
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
/*   19. MARKETING TEMPLATE - "التسويق"                                        */
/* ============================================================================ */

export function MarketingTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;

  return (
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Vibrant bold header */}
      <div className="relative px-5 sm:px-8 py-6 sm:py-8 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc, ${darken(primaryColor, 10)})` }}>
        {/* Dynamic shapes */}
        <div className="absolute -bottom-6 w-32 h-32 sm:w-44 sm:h-44 rounded-full opacity-10" style={{ backgroundColor: 'white', [isR ? 'left' : 'right']: '-20px' }} />
        <div className="absolute -top-4 w-20 h-20 sm:w-28 sm:h-28 rounded-full opacity-5" style={{ backgroundColor: 'white', [isR ? 'right' : 'left']: '40px' }} />
        <div className="relative">
          <div className="flex items-center gap-4 sm:gap-5">
            {p.photo && (
              <div className="shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shadow-lg rotate-3" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
                  <img src={p.photo} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
              <p className="text-sm sm:text-base font-medium mt-1 opacity-90">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 text-[10px] sm:text-xs opacity-85">
            {p.email && <span className="flex items-center gap-1"><Mail size={11} />{p.email}</span>}
            {p.phone && <span className="flex items-center gap-1"><Phone size={11} />{p.phone}</span>}
            {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={11} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
            {p.website && <span className="flex items-center gap-1"><Globe size={11} />{p.website}</span>}
            {p.linkedin && <span className="flex items-center gap-1"><Linkedin size={11} />{p.linkedin}</span>}
          </div>
        </div>
      </div>

      {p.summary && (
        <div className="px-5 sm:px-8 pt-5">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3" style={{ color: primaryColor }}>
            <Target size={14} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3" style={{ color: primaryColor }}>
              <span>{sectionIcon(type)}</span>
              {sectionLabel(type, language)}
            </h2>
            {type === 'skills' ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((sk) => (
                  <span key={sk.id} className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}bb)` }}>
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
/*   20. FINANCE TEMPLATE - "المالي"                                           */
/* ============================================================================ */

export function FinanceTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const yrs = computeYears(data.experience);

  return (
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Dark conservative header */}
      <div className="px-5 sm:px-8 py-5 sm:py-6 text-white" style={{ background: `linear-gradient(135deg, #1a1a2e, #16213e)` }}>
        <div className="flex items-center gap-4 sm:gap-5">
          {p.photo && (
            <div className="shrink-0">
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2" style={{ borderColor: primaryColor + '60' }}>
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-sm sm:text-base font-medium mt-1" style={{ color: primaryColor }}>{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[10px] sm:text-xs text-gray-400">
              {p.email && <span className="flex items-center gap-1"><Mail size={11} style={{ color: primaryColor + '80' }} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone size={11} style={{ color: primaryColor + '80' }} />{p.phone}</span>}
              {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={11} style={{ color: primaryColor + '80' }} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.linkedin && <span className="flex items-center gap-1"><Linkedin size={11} style={{ color: primaryColor + '80' }} />{p.linkedin}</span>}
            </div>
          </div>
        </div>
        {/* Key metrics */}
        <div className="flex gap-4 sm:gap-6 mt-5 pt-4 border-t border-white/10">
          {yrs > 0 && <div><div className="text-base sm:text-lg font-extrabold" style={{ color: primaryColor }}>{yrs}+</div><div className="text-[9px] sm:text-[10px] text-gray-500 uppercase">{language === 'ar' ? 'سنوات خبرة' : 'Years Exp'}</div></div>}
          {data.experience.length > 0 && <div><div className="text-base sm:text-lg font-extrabold" style={{ color: primaryColor }}>{data.experience.length}</div><div className="text-[9px] sm:text-[10px] text-gray-500 uppercase">{language === 'ar' ? 'وظائف' : 'Positions'}</div></div>}
          {data.certifications.length > 0 && <div><div className="text-base sm:text-lg font-extrabold" style={{ color: primaryColor }}>{data.certifications.length}</div><div className="text-[9px] sm:text-[10px] text-gray-500 uppercase">{language === 'ar' ? 'شهادات' : 'Certifications'}</div></div>}
        </div>
      </div>
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}60, transparent)` }} />

      {p.summary && (
        <div className="px-5 sm:px-8 pt-5">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
            <BarChart3 size={14} style={{ color: primaryColor }} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => (
          <div key={type}>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3 pb-2 border-b" style={{ borderColor: primaryColor + '20' }}>
              <span style={{ color: primaryColor }}>{sectionIcon(type)}</span>
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
/*   21. AAFIATAK PRO TEMPLATE - "عافية تك برو"                                */
/* ============================================================================ */

export function AafiatakProTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const isR = isRtl(language);
  const sections = getVisibleSections(data.sections);
  const p = data.personalInfo;
  const yrs = computeYears(data.experience);

  return (
    <div className="w-full" dir={isR ? 'rtl' : 'ltr'} style={{ fontFamily: resolveFont(fontFamily) }}>
      {/* Premium gradient banner */}
      <div className="relative px-5 sm:px-8 py-5 sm:py-7 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${darken(primaryColor, 15)})` }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="flex items-center gap-4 sm:gap-5 relative">
          {p.photo && (
            <div className="shrink-0">
              <div className="rounded-full p-[3px]" style={{ background: `linear-gradient(135deg, white, ${primaryColor}60)` }}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                  <img src={p.photo} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">{p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</h1>
            <p className="text-sm sm:text-base font-medium opacity-90 mt-1">{p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[10px] sm:text-xs opacity-85">
              {p.email && <span className="flex items-center gap-1"><Mail size={11} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone size={11} />{p.phone}</span>}
              {(p.city || p.country) && <span className="flex items-center gap-1"><MapPin size={11} />{[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.website && <span className="flex items-center gap-1"><Globe size={11} />{p.website}</span>}
              {p.linkedin && <span className="flex items-center gap-1"><Linkedin size={11} />{p.linkedin}</span>}
              {p.github && <span className="flex items-center gap-1"><Github size={11} />{p.github}</span>}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-5 pt-4 border-t border-white/20 relative">
          {yrs > 0 && <div className="text-center rounded-lg py-2" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}><div className="text-base sm:text-lg font-extrabold">{yrs}+</div><div className="text-[8px] sm:text-[10px] uppercase tracking-wider opacity-70">{language === 'ar' ? 'سنوات' : 'Years'}</div></div>}
          <div className="text-center rounded-lg py-2" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}><div className="text-base sm:text-lg font-extrabold">{data.experience.length}</div><div className="text-[8px] sm:text-[10px] uppercase tracking-wider opacity-70">{language === 'ar' ? 'وظائف' : 'Jobs'}</div></div>
          <div className="text-center rounded-lg py-2" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}><div className="text-base sm:text-lg font-extrabold">{data.skills.length}</div><div className="text-[8px] sm:text-[10px] uppercase tracking-wider opacity-70">{language === 'ar' ? 'مهارات' : 'Skills'}</div></div>
          <div className="text-center rounded-lg py-2" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}><div className="text-base sm:text-lg font-extrabold">{data.certifications.length}</div><div className="text-[8px] sm:text-[10px] uppercase tracking-wider opacity-70">{language === 'ar' ? 'شهادات' : 'Certs'}</div></div>
        </div>
      </div>

      {p.summary && (
        <div className="px-5 sm:px-8 pt-5">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
            <User size={14} style={{ color: primaryColor }} />
            {language === 'ar' ? 'نبذة احترافية' : 'Professional Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{p.summary}</p>
        </div>
      )}

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 pt-4">
        {sections.map((type) => {
          /* Timeline style for experience */
          if (type === 'experience' && data.experience.length > 0) {
            return (
              <div key={type}>
                <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-4" style={{ color: primaryColor }}>
                  <Briefcase size={14} style={{ color: primaryColor }} />
                  {sectionLabel(type, language)}
                </h2>
                <div className="relative ps-5 border-s-2" style={{ borderInlineStartColor: primaryColor + '30' }}>
                  {data.experience.map((exp, idx) => (
                    <div key={exp.id} className={`relative ${idx < data.experience.length - 1 ? 'pb-4 mb-4 border-b border-gray-100 dark:border-gray-800' : ''}`}>
                      {/* Timeline dot */}
                      <div className="absolute w-3 h-3 rounded-full border-2 -translate-y-0.5" style={{ ...(isR ? { right: '-21px' } : { left: '-21px' }), backgroundColor: 'white', borderColor: primaryColor }} />
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-2">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold">{exp.jobTitle}</h4>
                          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500">
                            <Building2 size={12} style={{ color: primaryColor + '80' }} />
                            <span>{exp.company}</span>
                          </div>
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-400 shrink-0 flex items-center gap-1">
                          <Calendar size={10} />{formatDateRange(exp.startDate, exp.endDate, exp.current, language)}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 whitespace-pre-line leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={type}>
              <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
                <span style={{ color: primaryColor }}>{sectionIcon(type)}</span>
                {sectionLabel(type, language)}
              </h2>
              {type === 'skills' ? <SkillBars data={data} color={primaryColor} lang={language} /> :
               type === 'languages' ? <LanguageDots data={data} color={primaryColor} lang={language} /> :
               type === 'projects' ? (
                 <div className="space-y-2 sm:space-y-3">
                   {data.projects.map((proj) => (
                     <div key={proj.id} className="rounded-xl border p-3 sm:p-4" style={{ borderColor: primaryColor + '20', backgroundColor: primaryColor + '06' }}>
                       <div className="flex items-start justify-between gap-2">
                         <h4 className="text-xs sm:text-sm font-bold">{proj.name}</h4>
                         {proj.url && <ExternalLink size={12} style={{ color: primaryColor }} className="shrink-0" />}
                       </div>
                       {proj.description && <p className="text-[11px] sm:text-xs text-gray-500 mt-1.5 leading-relaxed">{proj.description}</p>}
                       {proj.technologies.length > 0 && (
                         <div className="flex flex-wrap gap-1 mt-2">
                           {proj.technologies.map((t) => (
                             <span key={t} className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: primaryColor + '90' }}>{t}</span>
                           ))}
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               ) : renderSection(type, data, primaryColor, language)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================ */
/*   Template Selector                                                          */
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
