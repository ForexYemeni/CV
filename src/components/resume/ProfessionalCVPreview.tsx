'use client';

import { motion } from 'framer-motion';
import {
  User, Sparkles, Briefcase, GraduationCap, Award, Globe2, FolderKanban,
  MapPin, Clock, Mail, Phone, Globe, Building2, Calendar,
  CheckCircle2, Zap, ExternalLink, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResumeData, Language as LangType, SkillLevel, LanguageLevel } from '@/lib/types';

// ---- Level Labels ----
const SKILL_LEVEL_AR: Record<SkillLevel, string> = { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم', expert: 'خبير' };
const SKILL_LEVEL_EN: Record<SkillLevel, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', expert: 'Expert' };
const LANG_LEVEL_AR: Record<LanguageLevel, string> = { native: 'لغة أم', fluent: 'ممتاز', advanced: 'متقدم', intermediate: 'متوسط', basic: 'أساسي' };
const LANG_LEVEL_EN: Record<LanguageLevel, string> = { native: 'Native', fluent: 'Fluent', advanced: 'Advanced', intermediate: 'Intermediate', basic: 'Basic' };

const SKILL_PERCENT: Record<SkillLevel, number> = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
const LANG_DOTS: Record<LanguageLevel, number> = { native: 5, fluent: 5, advanced: 4, intermediate: 3, basic: 2 };

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

const CERT_ICONS: Record<string, string> = { certificate: '\uD83D\uDCC4', course: '\uD83D\uDCDA', license: '\uD83D\uDCCB', training: '\uD83C\uDF93' };
const CERT_LABELS_AR: Record<string, string> = { certificate: 'شهادة', course: 'دورة', license: 'ترخيص', training: 'تدريب' };
const CERT_LABELS_EN: Record<string, string> = { certificate: 'Certificate', course: 'Course', license: 'License', training: 'Training' };
const CERT_COLORS: Record<string, { bg: string; text: string }> = {
  certificate: { bg: '#fef3c7', text: '#d97706' },
  course: { bg: '#dbeafe', text: '#2563eb' },
  license: { bg: '#d1fae5', text: '#059669' },
  training: { bg: '#ede9fe', text: '#7c3aed' },
};

const DEGREE_AR: Record<string, string> = { high_school: 'ثانوية', diploma: 'دبلوم', bachelor: 'بكالوريوس', master: 'ماجستير', phd: 'دكتوراه', other: 'أخرى' };
const DEGREE_EN: Record<string, string> = { high_school: 'High School', diploma: 'Diploma', bachelor: 'Bachelor', master: 'Master', phd: 'PhD', other: 'Other' };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

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

function formatDate(date: string, lang: LangType): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short' });
}

function formatDateRange(start: string, end: string, current: boolean, lang: LangType): string {
  if (!start) return '';
  const s = formatDate(start, lang);
  const e = current ? (lang === 'ar' ? 'الحاضر' : 'Present') : formatDate(end, lang);
  return `${s} - ${e}`;
}

interface ProfessionalCVPreviewProps {
  data: ResumeData;
  primaryColor: string;
  language: LangType;
  /** When true, skip Framer Motion animations and render plain divs (for PDF/image export) */
  disableAnimations?: boolean;
}

export function ProfessionalCVPreview({ data, primaryColor, language, disableAnimations }: ProfessionalCVPreviewProps) {
  const isR = language === 'ar';
  const isStatic = disableAnimations || false;
  const p = data.personalInfo;
  const yearsExp = computeYears(data.experience);
  const completedJobs = data.experience.length;
  const skillCount = data.skills.length;

  const skillLabels = language === 'ar' ? SKILL_LEVEL_AR : SKILL_LEVEL_EN;
  const langLabels = language === 'ar' ? LANG_LEVEL_AR : LANG_LEVEL_EN;
  const certLabels = language === 'ar' ? CERT_LABELS_AR : CERT_LABELS_EN;
  const degreeLabels = language === 'ar' ? DEGREE_AR : DEGREE_EN;

  // Card class - reusable for all sections
  const cardClass = "rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm";

  // Section header
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-2 px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
      <div className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0" style={{ backgroundColor: primaryColor + '12', color: primaryColor }}>
        {icon}
      </div>
      <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
    </div>
  );

  // Animated wrapper - conditionally uses motion.div or plain div
  const AContainer = isStatic ? 'div' : motion.div;
  const AItem = isStatic ? 'div' : motion.div;

  // Helper to spread animation props only when not static
  const containerAnimProps = isStatic ? {} : { variants: containerVariants, initial: "hidden" as const, animate: "visible" as const };
  const itemAnimProps = isStatic ? {} : { variants: itemVariants };

  return (
    <AContainer
      className="w-full max-w-lg mx-auto space-y-3 sm:space-y-4 pb-6"
      dir={isR ? 'rtl' : 'ltr'}
      id="professional-cv-content"
      data-professional-cv
      {...containerAnimProps}
    >
      {/* ============ PROFILE HEADER ============ */}
      <AItem className={cardClass} {...itemAnimProps}>
        {/* Gradient banner */}
        <div className="relative h-20 sm:h-28" style={{ background: `linear-gradient(135deg, ${primaryColor}30, ${primaryColor}15, transparent)` }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top left, ${primaryColor}20, transparent 70%)` }} />
        </div>

        <div className="relative px-4 sm:px-5 pb-4 sm:pb-5 -mt-12 sm:-mt-14">
          {/* Avatar */}
          <AItem className="flex flex-col items-center text-center" {...itemAnimProps}>
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
          </AItem>

          {/* Name + Title */}
          <AItem className="text-center mb-2 sm:mb-3" {...itemAnimProps}>
            <h1 className="text-lg sm:text-xl font-bold flex items-center justify-center gap-1.5">
              {p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}
            </h1>
            {p.jobTitle && (
              <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: primaryColor }}>{p.jobTitle}</p>
            )}
          </AItem>

          {/* Location + Experience */}
          <AItem className="flex items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-3" {...itemAnimProps}>
            {(p.city || p.country) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: primaryColor + '80' }} />
                {[p.city, p.country].filter(Boolean).join(', ')}
              </span>
            )}
            {yearsExp > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: primaryColor + '80' }} />
                {yearsExp} {language === 'ar' ? 'سنة خبرة' : 'years exp'}
              </span>
            )}
          </AItem>

          {/* Quick badges */}
          <AItem className="flex flex-wrap justify-center gap-1 sm:gap-1.5" {...itemAnimProps}>
            {completedJobs > 0 && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {completedJobs} {language === 'ar' ? 'خبرة' : 'exp'}
              </span>
            )}
            {skillCount > 0 && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {skillCount} {language === 'ar' ? 'مهارة' : 'skills'}
              </span>
            )}
            {data.languages.length > 0 && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Globe2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {data.languages.length} {language === 'ar' ? 'لغة' : 'lang'}
              </span>
            )}
          </AItem>
        </div>
      </AItem>

      {/* ============ STATISTICS ============ */}
      <AItem className="grid grid-cols-2 gap-2 sm:gap-3" {...itemAnimProps}>
        {[
          { icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />, value: completedJobs, label: language === 'ar' ? 'خبرة عملية' : 'Work Exp', bg: 'bg-emerald-500/10' },
          { icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />, value: skillCount, label: language === 'ar' ? 'مهارة' : 'Skills', bg: 'bg-amber-500/10' },
          { icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: primaryColor }} />, value: yearsExp, label: language === 'ar' ? 'سنة خبرة' : 'Years Exp', bg: '', customBg: primaryColor + '10' },
          { icon: <Award className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 dark:text-violet-400" />, value: data.certifications.length, label: language === 'ar' ? 'شهادة' : 'Certs', bg: 'bg-violet-500/10' },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 sm:p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={cn('w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0', stat.bg)}
                style={stat.customBg ? { backgroundColor: stat.customBg } : undefined}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-base sm:text-xl font-bold">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </AItem>

      {/* ============ BIO / SUMMARY ============ */}
      {p.summary && (
        <AItem className={cardClass} {...itemAnimProps}>
          <SectionHeader icon={<User size={12} />} title={language === 'ar' ? 'نبذة مهنية' : 'Professional Summary'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {p.summary}
            </p>
          </div>
        </AItem>
      )}

      {/* ============ SKILLS ============ */}
      {data.skills.length > 0 && (
        <AItem className={cardClass} {...itemAnimProps}>
          <SectionHeader icon={<Sparkles size={12} />} title={language === 'ar' ? 'المهارات' : 'Skills'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3 space-y-2.5 sm:space-y-3">
            {data.skills.map((sk, index) => {
              const badgeStyle = skillBadgeStyle(sk.level, primaryColor);
              return (
                <div key={sk.id} className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium">{sk.name}</span>
                    <span
                      className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
                    >
                      {skillLabels[sk.level]}
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ backgroundColor: skillBarColor(sk.level, primaryColor), width: `${SKILL_PERCENT[sk.level]}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AItem>
      )}

      {/* ============ EXPERIENCE ============ */}
      {data.experience.length > 0 && (
        <AItem className={cardClass} {...itemAnimProps}>
          <SectionHeader icon={<Briefcase size={12} />} title={language === 'ar' ? 'الخبرات العملية' : 'Work Experience'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3">
            <div className="relative">
              {/* Timeline line */}
              <div
                className="absolute top-2 bottom-2 w-[2px]"
                style={{
                  backgroundColor: primaryColor + '20',
                  ...(isR ? { right: '7px' } : { left: '7px' }),
                }}
              />

              <div className="space-y-4 sm:space-y-5">
                {data.experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="relative"
                    style={{ ...(isR ? { paddingRight: 24 } : { paddingLeft: 24 }) }}
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-[3px] border-white dark:border-gray-900"
                      style={{
                        backgroundColor: index === 0 ? primaryColor : primaryColor + '40',
                        ...(isR ? { right: 0 } : { left: 0 }),
                        zIndex: 1,
                      }}
                    />

                    <div className="space-y-1 sm:space-y-1.5">
                      {exp.jobTitle && (
                        <h4 className="text-xs sm:text-sm font-semibold">{exp.jobTitle}</h4>
                      )}
                      {exp.company && (
                        <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                          <Building2 className="w-3 h-3" style={{ color: primaryColor + '70' }} />
                          <span>{exp.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateRange(exp.startDate, exp.endDate, exp.current, language)}</span>
                      </div>
                      {exp.description && (
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1 sm:mt-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AItem>
      )}

      {/* ============ EDUCATION ============ */}
      {data.education.length > 0 && (
        <AItem className={cardClass} {...itemAnimProps}>
          <SectionHeader icon={<GraduationCap size={12} />} title={language === 'ar' ? 'المؤهلات التعليمية' : 'Education'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3 space-y-2.5 sm:space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="pb-2.5 sm:pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold">{edu.major}</h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{edu.institution}</p>
                    {edu.degree && (
                      <span
                        className="inline-block text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1"
                        style={{ backgroundColor: primaryColor + '10', color: primaryColor }}
                      >
                        {degreeLabels[edu.degree] || edu.degree}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 shrink-0">
                    {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </AItem>
      )}

      {/* ============ CERTIFICATIONS ============ */}
      {data.certifications.length > 0 && (
        <AItem className={cardClass} {...itemAnimProps}>
          <SectionHeader icon={<Award size={12} />} title={language === 'ar' ? 'الشهادات والدورات' : 'Certifications'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {data.certifications.map((cert) => {
                const certType = 'certificate';
                const certStyle = CERT_COLORS[certType] || CERT_COLORS.certificate;
                return (
                  <div
                    key={cert.id}
                    className="rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-3 sm:p-3.5 space-y-1.5 sm:space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg sm:text-xl shrink-0 mt-0.5">{CERT_ICONS[certType]}</span>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold leading-tight">{cert.name}</h4>
                        {cert.issuer && (
                          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cert.issuer}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold"
                        style={{ backgroundColor: certStyle.bg, color: certStyle.text }}
                      >
                        {certLabels[certType]}
                      </span>
                      {cert.date && (
                        <span className="text-[9px] sm:text-[10px] text-gray-400">{cert.date}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AItem>
      )}

      {/* ============ LANGUAGES ============ */}
      {data.languages.length > 0 && (
        <AItem className={cardClass} {...itemAnimProps}>
          <SectionHeader icon={<Globe2 size={12} />} title={language === 'ar' ? 'اللغات' : 'Languages'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3 space-y-2.5 sm:space-y-3">
            {data.languages.map((lang) => {
              const dots = LANG_DOTS[lang.level] || 3;
              const dotColors = langDotColor(lang.level, primaryColor);
              const badge = langBadgeStyle(lang.level, primaryColor);
              return (
                <div key={lang.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-medium">{lang.name}</span>
                    <span
                      className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: badge.bg, color: badge.text }}
                    >
                      {langLabels[lang.level]}
                    </span>
                  </div>
                  <div className="flex gap-0.5 sm:gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                        style={{ backgroundColor: i < dots ? dotColors.filled : dotColors.empty }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </AItem>
      )}

      {/* ============ PROJECTS ============ */}
      {data.projects.length > 0 && (
        <AItem className={cardClass} {...itemAnimProps}>
          <SectionHeader icon={<FolderKanban size={12} />} title={language === 'ar' ? 'المشاريع' : 'Projects'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3 space-y-2 sm:space-y-3">
            {data.projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-3 sm:p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold">{proj.name}</h4>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                    </a>
                  )}
                </div>
                {proj.description && (
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5 leading-relaxed">{proj.description}</p>
                )}
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: primaryColor + '10', color: primaryColor + 'cc' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AItem>
      )}

      {/* ============ CONTACT INFO ============ */}
      {(p.email || p.phone || p.website || p.linkedin || p.github || p.address) && (
        <AItem className={cardClass} {...itemAnimProps}>
          <SectionHeader icon={<Phone size={12} />} title={language === 'ar' ? 'معلومات التواصل' : 'Contact'} />
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {p.email && (
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span className="truncate">{p.email}</span>
                </div>
              )}
              {p.phone && (
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span>{p.phone}</span>
                </div>
              )}
              {p.address && (
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span>{p.address}</span>
                </div>
              )}
              {p.website && (
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                  <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span className="truncate">{p.website}</span>
                </div>
              )}
              {p.linkedin && (
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                  <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span className="truncate">{p.linkedin}</span>
                </div>
              )}
              {p.github && (
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span className="truncate">{p.github}</span>
                </div>
              )}
            </div>
          </div>
        </AItem>
      )}
    </AContainer>
  );
}
