'use client';

import { motion } from 'framer-motion';
import {
  User, Sparkles, Briefcase, GraduationCap, Award, Globe2, FolderKanban,
  MapPin, Clock, Mail, Phone, Globe, Building2, Calendar, Tag,
  CheckCircle2, Star, Zap, ExternalLink, Shield,
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

// ---- Skill Level Colors ----
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

// ---- Lang Level Colors ----
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

// ---- Certificate Type ----
const CERT_ICONS: Record<string, string> = { certificate: '\uD83D\uDCC4', course: '\uD83D\uDCDA', license: '\uD83D\uDCCB', training: '\uD83C\uDF93' };
const CERT_LABELS_AR: Record<string, string> = { certificate: 'شهادة', course: 'دورة', license: 'ترخيص', training: 'تدريب' };
const CERT_LABELS_EN: Record<string, string> = { certificate: 'Certificate', course: 'Course', license: 'License', training: 'Training' };
const CERT_COLORS: Record<string, { bg: string; text: string }> = {
  certificate: { bg: '#fef3c7', text: '#d97706' },
  course: { bg: '#dbeafe', text: '#2563eb' },
  license: { bg: '#d1fae5', text: '#059669' },
  training: { bg: '#ede9fe', text: '#7c3aed' },
};

// ---- Degree Labels ----
const DEGREE_AR: Record<string, string> = { high_school: 'ثانوية', diploma: 'دبلوم', bachelor: 'بكالوريوس', master: 'ماجستير', phd: 'دكتوراه', other: 'أخرى' };
const DEGREE_EN: Record<string, string> = { high_school: 'High School', diploma: 'Diploma', bachelor: 'Bachelor', master: 'Master', phd: 'PhD', other: 'Other' };

// ---- Animation Variants ----
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// ---- Compute Years of Experience ----
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

// ---- Format Date ----
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

// ---- Props ----
interface ProfessionalCVPreviewProps {
  data: ResumeData;
  primaryColor: string;
  language: LangType;
}

export function ProfessionalCVPreview({ data, primaryColor, language }: ProfessionalCVPreviewProps) {
  const isR = language === 'ar';
  const p = data.personalInfo;
  const yearsExp = computeYears(data.experience);
  const completedJobs = data.experience.length;
  const skillCount = data.skills.length;

  // Skill level labels
  const skillLabels = language === 'ar' ? SKILL_LEVEL_AR : SKILL_LEVEL_EN;
  const langLabels = language === 'ar' ? LANG_LEVEL_AR : LANG_LEVEL_EN;
  const certLabels = language === 'ar' ? CERT_LABELS_AR : CERT_LABELS_EN;
  const degreeLabels = language === 'ar' ? DEGREE_AR : DEGREE_EN;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg mx-auto space-y-4 pb-8"
      dir={isR ? 'rtl' : 'ltr'}
    >
      {/* ============ PROFILE HEADER ============ */}
      <motion.div variants={itemVariants} className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        {/* Gradient banner */}
        <div className="relative h-28" style={{ background: `linear-gradient(135deg, ${primaryColor}30, ${primaryColor}15, transparent)` }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top left, ${primaryColor}20, transparent 70%)` }} />
        </div>

        <div className="relative px-5 pb-5 -mt-14">
          {/* Avatar */}
          <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="rounded-full p-[3px]" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}80, ${primaryColor}40)` }}>
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800">
                  {p.photo ? (
                    <img src={p.photo} alt={p.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                      {p.fullName ? p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : '?'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Name + Title */}
          <motion.div variants={itemVariants} className="text-center mb-3">
            <h1 className="text-xl font-bold flex items-center justify-center gap-1.5">
              {p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}
            </h1>
            {p.jobTitle && (
              <p className="text-sm font-medium mt-0.5" style={{ color: primaryColor }}>{p.jobTitle}</p>
            )}
          </motion.div>

          {/* Location + Experience */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            {(p.city || p.country) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor + '80' }} />
                {[p.city, p.country].filter(Boolean).join(', ')}
              </span>
            )}
            {yearsExp > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" style={{ color: primaryColor + '80' }} />
                {yearsExp} {language === 'ar' ? 'سنة خبرة' : 'years exp'}
              </span>
            )}
          </motion.div>

          {/* Quick badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-1.5">
            {completedJobs > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                {completedJobs} {language === 'ar' ? 'خبرة' : 'positions'}
              </span>
            )}
            {skillCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Sparkles className="w-3 h-3" />
                {skillCount} {language === 'ar' ? 'مهارة' : 'skills'}
              </span>
            )}
            {data.languages.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Globe2 className="w-3 h-3" />
                {data.languages.length} {language === 'ar' ? 'لغة' : 'languages'}
              </span>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ============ STATISTICS ============ */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        {[
          { icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />, value: completedJobs, label: language === 'ar' ? 'خبرة عملية' : 'Work Exp', bg: 'bg-emerald-500/10' },
          { icon: <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />, value: skillCount, label: language === 'ar' ? 'مهارة' : 'Skills', bg: 'bg-amber-500/10' },
          { icon: <Clock className="w-5 h-5" style={{ color: primaryColor }} />, value: yearsExp, label: language === 'ar' ? 'سنة خبرة' : 'Years Exp', bg: '', customBg: primaryColor + '10' },
          { icon: <Award className="w-5 h-5 text-violet-600 dark:text-violet-400" />, value: data.certifications.length, label: language === 'ar' ? 'شهادة' : 'Certificates', bg: 'bg-violet-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
            className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', stat.bg)}
                style={stat.customBg ? { backgroundColor: stat.customBg } : undefined}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ============ BIO / SUMMARY ============ */}
      {p.summary && (
        <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 pt-5 pb-0">
            <User className="w-4 h-4" style={{ color: primaryColor }} />
            <h3 className="text-base font-semibold">{language === 'ar' ? 'نبذة مهنية' : 'Professional Summary'}</h3>
          </div>
          <div className="px-5 pb-5 pt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {p.summary}
            </p>
          </div>
        </motion.div>
      )}

      {/* ============ SKILLS ============ */}
      {data.skills.length > 0 && (
        <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 pt-5 pb-0">
            <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
            <h3 className="text-base font-semibold">{language === 'ar' ? 'المهارات' : 'Skills'}</h3>
          </div>
          <div className="px-5 pb-5 pt-3 space-y-3">
            {data.skills.map((sk, index) => {
              const badgeStyle = skillBadgeStyle(sk.level, primaryColor);
              return (
                <motion.div
                  key={sk.id}
                  initial={{ opacity: 0, x: isR ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{sk.name}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
                    >
                      {skillLabels[sk.level]}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: skillBarColor(sk.level, primaryColor) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${SKILL_PERCENT[sk.level]}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + index * 0.04 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ============ EXPERIENCE ============ */}
      {data.experience.length > 0 && (
        <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 pt-5 pb-0">
            <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
            <h3 className="text-base font-semibold">{language === 'ar' ? 'الخبرات العملية' : 'Work Experience'}</h3>
          </div>
          <div className="px-5 pb-5 pt-3">
            <div className="relative">
              {/* Timeline line */}
              <div
                className="absolute top-2 bottom-2 w-[2px]"
                style={{
                  backgroundColor: primaryColor + '20',
                  ...(isR ? { right: '7px' } : { left: '7px' }),
                }}
              />

              <div className="space-y-5">
                {data.experience.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: isR ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.07 }}
                    className="relative"
                    style={{ ...(isR ? { paddingRight: 28 } : { paddingLeft: 28 }) }}
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute top-1.5 w-4 h-4 rounded-full border-[3px] border-white dark:border-gray-900"
                      style={{
                        backgroundColor: index === 0 ? primaryColor : primaryColor + '40',
                        ...(isR ? { right: 0 } : { left: 0 }),
                        zIndex: 1,
                      }}
                    />

                    <div className="space-y-1.5">
                      {exp.jobTitle && (
                        <h4 className="text-sm font-semibold">{exp.jobTitle}</h4>
                      )}
                      {exp.company && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Building2 className="w-3 h-3" style={{ color: primaryColor + '70' }} />
                          <span>{exp.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateRange(exp.startDate, exp.endDate, exp.current, language)}</span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ============ EDUCATION ============ */}
      {data.education.length > 0 && (
        <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 pt-5 pb-0">
            <GraduationCap className="w-4 h-4" style={{ color: primaryColor }} />
            <h3 className="text-base font-semibold">{language === 'ar' ? 'المؤهلات التعليمية' : 'Education'}</h3>
          </div>
          <div className="px-5 pb-5 pt-3 space-y-3">
            {data.education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: isR ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold">{edu.major}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{edu.institution}</p>
                    {edu.degree && (
                      <span
                        className="inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1"
                        style={{ backgroundColor: primaryColor + '10', color: primaryColor }}
                      >
                        {degreeLabels[edu.degree] || edu.degree}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{edu.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ============ CERTIFICATIONS ============ */}
      {data.certifications.length > 0 && (
        <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 pt-5 pb-0">
            <Award className="w-4 h-4" style={{ color: primaryColor }} />
            <h3 className="text-base font-semibold">{language === 'ar' ? 'الشهادات والدورات' : 'Certifications'}</h3>
          </div>
          <div className="px-5 pb-5 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.certifications.map((cert, index) => {
                const certType = 'certificate'; // default type
                const certStyle = CERT_COLORS[certType] || CERT_COLORS.certificate;
                return (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-3.5 space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl shrink-0 mt-0.5">{CERT_ICONS[certType]}</span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold leading-tight">{cert.name}</h4>
                        {cert.issuer && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cert.issuer}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: certStyle.bg, color: certStyle.text }}
                      >
                        {certLabels[certType]}
                      </span>
                      {cert.date && (
                        <span className="text-[10px] text-gray-400">{cert.date}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ============ LANGUAGES ============ */}
      {data.languages.length > 0 && (
        <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 pt-5 pb-0">
            <Globe2 className="w-4 h-4" style={{ color: primaryColor }} />
            <h3 className="text-base font-semibold">{language === 'ar' ? 'اللغات' : 'Languages'}</h3>
          </div>
          <div className="px-5 pb-5 pt-3 space-y-3">
            {data.languages.map((lang, index) => {
              const dots = LANG_DOTS[lang.level] || 3;
              const dotColors = langDotColor(lang.level, primaryColor);
              const badge = langBadgeStyle(lang.level, primaryColor);
              return (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, x: isR ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{lang.name}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: badge.bg, color: badge.text }}
                    >
                      {langLabels[lang.level]}
                    </span>
                  </div>
                  {/* Dot indicators */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: i < dots ? dotColors.filled : dotColors.empty }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ============ PROJECTS ============ */}
      {data.projects.length > 0 && (
        <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 pt-5 pb-0">
            <FolderKanban className="w-4 h-4" style={{ color: primaryColor }} />
            <h3 className="text-base font-semibold">{language === 'ar' ? 'المشاريع' : 'Projects'}</h3>
          </div>
          <div className="px-5 pb-5 pt-3 space-y-3">
            {data.projects.map((proj, index) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold">{proj.name}</h4>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-primary transition-colors" />
                    </a>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{proj.description}</p>
                )}
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: primaryColor + '10', color: primaryColor + 'cc' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ============ CONTACT INFO ============ */}
      {(p.email || p.phone || p.website || p.linkedin || p.github || p.address) && (
        <motion.div variants={itemVariants} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 pt-5 pb-0">
            <Phone className="w-4 h-4" style={{ color: primaryColor }} />
            <h3 className="text-base font-semibold">{language === 'ar' ? 'معلومات التواصل' : 'Contact'}</h3>
          </div>
          <div className="px-5 pb-5 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.email && (
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span className="truncate">{p.email}</span>
                </div>
              )}
              {p.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span>{p.phone}</span>
                </div>
              )}
              {p.address && (
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span>{p.address}</span>
                </div>
              )}
              {p.website && (
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span className="truncate">{p.website}</span>
                </div>
              )}
              {p.linkedin && (
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span className="truncate">{p.linkedin}</span>
                </div>
              )}
              {p.github && (
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor + '70' }} />
                  <span className="truncate">{p.github}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
