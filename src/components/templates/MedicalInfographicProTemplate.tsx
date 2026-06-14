'use client';

import React from 'react';
import {
  Mail, Phone, MapPin, Globe, Linkedin, Github,
  Briefcase, GraduationCap, Award, Globe2, FolderKanban,
  Calendar, Building2, Star, Heart, Shield, Stethoscope,
  Activity, Syringe, Users, BookOpen, Eye, MessageSquare,
  Sparkles, ChevronLeft, ChevronRight, CheckCircle2,
  Clock, Zap, User, ExternalLink,
} from 'lucide-react';
import type { ResumeData, SkillLevel, LanguageLevel, DegreeType } from '@/lib/types';
import { SKILL_LEVEL_LABELS, LANGUAGE_LEVEL_LABELS, DEGREE_LABELS } from '@/lib/types';

/* ────────────────────────────────────────────── */
/*  Template Props                               */
/* ────────────────────────────────────────────── */

export interface TemplateProps {
  data: ResumeData;
  primaryColor: string;
  fontFamily: string;
  fontSize: string;
  language: 'ar' | 'en';
}

/* ────────────────────────────────────────────── */
/*  Constants & Helpers                          */
/* ────────────────────────────────────────────── */

const isRtl = (lang: 'ar' | 'en') => lang === 'ar';
const dir = (lang: 'ar' | 'en') => isRtl(lang) ? 'rtl' as const : 'ltr' as const;

const FONT_MAP: Record<string, string> = {
  inter: 'var(--font-inter)',
  roboto: 'Roboto, sans-serif',
  cairo: '"Cairo", var(--font-cairo), sans-serif',
  tajawal: '"Tajawal", var(--font-tajawal), sans-serif',
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
  if (!start) return '';
  const present = lang === 'ar' ? 'الحاضر' : 'Present';
  return `${start} - ${current ? present : end}`;
}

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

/* ────────────────────────────────────────────── */
/*  A4 Container Style                           */
/* ────────────────────────────────────────────── */

const A4: React.CSSProperties = {
  width: '210mm',
  minHeight: '297mm',
  backgroundColor: '#F8FBFF',
  color: '#1F2937',
  lineHeight: 1.5,
  boxSizing: 'border-box' as const,
  overflow: 'hidden',
};

/* ────────────────────────────────────────────── */
/*  Medical Infographic Pro CV Template          */
/* ────────────────────────────────────────────── */

export function MedicalInfographicProTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = dir(language);
  const isR = isRtl(language);
  const p = data.personalInfo;
  const yrs = computeYears(data.experience);

  // Colors derived from primary
  const primary = primaryColor || '#0F4C81';
  const secondary = '#1E88E5';
  const accent = '#42A5F5';
  const bgLight = '#F8FBFF';
  const cardBg = '#FFFFFF';
  const borderColor = '#D6E4F0';
  const textDark = '#1F2937';
  const textMedium = '#4B5563';
  const textLight = '#6B7280';

  // Separate skills by category
  const technicalSkills = data.skills.filter(s => s.category === 'technical' || !s.category);
  const softSkills = data.skills.filter(s => s.category === 'soft');

  return (
    <div style={{ ...A4, fontFamily: ff, fontSize: sz, direction: d, display: 'flex' }}>
      {/* ════════════════════════════════════════════
          LEFT SIDEBAR (35%)
          ════════════════════════════════════════════ */}
      <div style={{
        width: '35%',
        background: `linear-gradient(180deg, ${primary}, ${primary}dd, ${primary}bb)`,
        color: '#FFFFFF',
        padding: '0',
        boxSizing: 'border-box' as const,
        flexShrink: 0,
        position: 'relative' as const,
        overflow: 'hidden',
      }}>
        {/* Decorative circle pattern */}
        <div style={{
          position: 'absolute' as const,
          top: -30,
          [isR ? 'left' : 'right']: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute' as const,
          bottom: 60,
          [isR ? 'right' : 'left']: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />

        {/* ── Profile Photo ── */}
        <div style={{ padding: '28px 20px 16px', textAlign: 'center' as const }}>
          <div style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            margin: '0 auto',
            background: `linear-gradient(135deg, ${accent}, ${secondary})`,
            padding: 4,
            boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
          }}>
            {p.photo ? (
              <img
                src={p.photo}
                alt={p.fullName}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid rgba(255,255,255,0.3)',
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid rgba(255,255,255,0.3)',
              }}>
                <Stethoscope size={40} style={{ opacity: 0.8 }} />
              </div>
            )}
          </div>
        </div>

        {/* ── Name & Title ── */}
        <div style={{ textAlign: 'center' as const, padding: '0 20px 20px' }}>
          <h1 style={{
            fontSize: sz + 8,
            fontWeight: 800,
            marginBottom: 4,
            letterSpacing: 0.5,
            lineHeight: 1.3,
          }}>
            {p.fullName || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}
          </h1>
          <div style={{
            fontSize: sz + 2,
            fontWeight: 500,
            opacity: 0.9,
            marginBottom: 8,
          }}>
            {p.jobTitle || (language === 'ar' ? 'المسمى الوظيفي' : 'Job Title')}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8 }}>
            {yrs > 0 && (
              <div style={{
                textAlign: 'center' as const,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 8,
                padding: '6px 12px',
              }}>
                <div style={{ fontSize: sz + 6, fontWeight: 800 }}>{yrs}+</div>
                <div style={{ fontSize: sz - 4, opacity: 0.7 }}>
                  {language === 'ar' ? 'سنوات' : 'Years'}
                </div>
              </div>
            )}
            {data.experience.length > 0 && (
              <div style={{
                textAlign: 'center' as const,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 8,
                padding: '6px 12px',
              }}>
                <div style={{ fontSize: sz + 6, fontWeight: 800 }}>{data.experience.length}</div>
                <div style={{ fontSize: sz - 4, opacity: 0.7 }}>
                  {language === 'ar' ? 'خبرات' : 'Jobs'}
                </div>
              </div>
            )}
            {data.skills.length > 0 && (
              <div style={{
                textAlign: 'center' as const,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 8,
                padding: '6px 12px',
              }}>
                <div style={{ fontSize: sz + 6, fontWeight: 800 }}>{data.skills.length}</div>
                <div style={{ fontSize: sz - 4, opacity: 0.7 }}>
                  {language === 'ar' ? 'مهارات' : 'Skills'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: '0 20px', height: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />

        {/* ── Contact Info ── */}
        <div style={{ padding: '16px 20px' }}>
          <SectionTitleSidebar
            title={language === 'ar' ? 'معلومات التواصل' : 'Contact'}
            icon={<Phone size={11} />}
          />
          <div style={{ marginTop: 10 }}>
            {p.email && (
              <ContactItem icon={<Mail size={11} />} text={p.email} />
            )}
            {p.phone && (
              <ContactItem icon={<Phone size={11} />} text={p.phone} />
            )}
            {(p.city || p.country) && (
              <ContactItem icon={<MapPin size={11} />} text={[p.city, p.country].filter(Boolean).join(', ')} />
            )}
            {p.address && (
              <ContactItem icon={<MapPin size={11} />} text={p.address} />
            )}
            {p.website && (
              <ContactItem icon={<Globe size={11} />} text={p.website} />
            )}
            {p.linkedin && (
              <ContactItem icon={<Linkedin size={11} />} text={p.linkedin} />
            )}
            {p.github && (
              <ContactItem icon={<Github size={11} />} text={p.github} />
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: '0 20px', height: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />

        {/* ── Nursing/Professional Skills ── */}
        {technicalSkills.length > 0 && (
          <div style={{ padding: '16px 20px' }}>
            <SectionTitleSidebar
              title={language === 'ar' ? 'المهارات التمريضية' : 'Clinical Skills'}
              icon={<Activity size={11} />}
            />
            <div style={{ marginTop: 8 }}>
              {technicalSkills.map((sk) => (
                <div key={sk.id} style={{ marginBottom: 8 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: sz - 1,
                    marginBottom: 3,
                  }}>
                    <span style={{ fontWeight: 500 }}>{sk.name}</span>
                    <span style={{ opacity: 0.6, fontSize: sz - 2 }}>
                      {SKILL_LEVEL_LABELS[language][sk.level]}
                    </span>
                  </div>
                  <div style={{
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      borderRadius: 3,
                      width: getSkillWidth(sk.level),
                      background: `linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.9))`,
                      transition: 'width 0.3s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        {technicalSkills.length > 0 && (
          <div style={{ margin: '0 20px', height: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
        )}

        {/* ── Soft Skills / Personal Traits ── */}
        {softSkills.length > 0 && (
          <div style={{ padding: '16px 20px' }}>
            <SectionTitleSidebar
              title={language === 'ar' ? 'الصفات الشخصية' : 'Personal Traits'}
              icon={<Heart size={11} />}
            />
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
              {softSkills.map((sk) => (
                <div key={sk.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: sz - 1,
                }}>
                  <CheckCircle2 size={9} style={{ opacity: 0.7 }} />
                  <span>{sk.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        {softSkills.length > 0 && (
          <div style={{ margin: '0 20px', height: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
        )}

        {/* ── Languages ── */}
        {data.languages.length > 0 && (
          <div style={{ padding: '16px 20px' }}>
            <SectionTitleSidebar
              title={language === 'ar' ? 'اللغات' : 'Languages'}
              icon={<Globe2 size={11} />}
            />
            <div style={{ marginTop: 8 }}>
              {data.languages.map((l) => {
                const filled = getLanguageDots(l.level);
                return (
                  <div key={l.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: sz - 1, fontWeight: 500 }}>{l.name}</span>
                      <span style={{ fontSize: sz - 3, opacity: 0.6 }}>
                        {LANGUAGE_LEVEL_LABELS[language][l.level]}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div key={dot} style={{
                          width: 18,
                          height: 5,
                          borderRadius: 2,
                          backgroundColor: dot <= filled ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.15)',
                        }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Professional Vision ── */}
        {p.summary && (
          <>
            <div style={{ margin: '0 20px', height: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ padding: '16px 20px' }}>
              <SectionTitleSidebar
                title={language === 'ar' ? 'الرؤية المهنية' : 'Professional Vision'}
                icon={<Eye size={11} />}
              />
              <div style={{
                marginTop: 8,
                fontSize: sz - 1,
                opacity: 0.85,
                lineHeight: 1.6,
                whiteSpace: 'pre-line' as const,
              }}>
                {p.summary.length > 200 ? p.summary.substring(0, 200) + '...' : p.summary}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ════════════════════════════════════════════
          RIGHT MAIN CONTENT (65%)
          ════════════════════════════════════════════ */}
      <div style={{
        width: '65%',
        padding: '28px 28px 20px',
        backgroundColor: bgLight,
        boxSizing: 'border-box' as const,
      }}>

        {/* ── Professional Summary (Full) ── */}
        {p.summary && (
          <div style={{ marginBottom: 20 }}>
            <SectionTitleMain
              title={language === 'ar' ? 'نبذة شخصية' : 'Professional Summary'}
              icon={<User size={13} />}
              color={primary}
            />
            <div style={{
              fontSize: sz,
              color: textMedium,
              lineHeight: 1.7,
              whiteSpace: 'pre-line' as const,
              backgroundColor: cardBg,
              borderRadius: 10,
              padding: '12px 16px',
              border: `1px solid ${borderColor}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              {p.summary}
            </div>
          </div>
        )}

        {/* ── Professional Experience ── */}
        {data.experience.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionTitleMain
              title={language === 'ar' ? 'الخبرات المهنية' : 'Professional Experience'}
              icon={<Briefcase size={13} />}
              color={primary}
            />
            <div style={{ position: 'relative' as const }}>
              {/* Timeline line */}
              <div style={{
                position: 'absolute' as const,
                top: 6,
                bottom: 6,
                width: 2,
                backgroundColor: `${primary}25`,
                ...(isR ? { right: 5 } : { left: 5 }),
              }} />

              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
                {data.experience.map((exp, idx) => (
                  <div key={exp.id} style={{
                    position: 'relative' as const,
                    ...(isR ? { paddingRight: 22 } : { paddingLeft: 22 }),
                  }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute' as const,
                      top: 6,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      border: `2px solid ${cardBg}`,
                      backgroundColor: idx === 0 ? primary : `${primary}60`,
                      ...(isR ? { right: 0 } : { left: 0 }),
                      zIndex: 1,
                      boxShadow: `0 0 0 2px ${primary}30`,
                    }} />

                    {/* Card */}
                    <div style={{
                      backgroundColor: cardBg,
                      borderRadius: 10,
                      padding: '12px 16px',
                      border: `1px solid ${borderColor}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 8,
                      }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: sz + 1, color: textDark }}>
                            {exp.jobTitle}
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: sz,
                            color: primary,
                            marginTop: 2,
                            fontWeight: 500,
                          }}>
                            <Building2 size={11} />
                            <span>{exp.company}</span>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          fontSize: sz - 2,
                          color: textLight,
                          whiteSpace: 'nowrap' as const,
                          backgroundColor: `${primary}08`,
                          padding: '2px 8px',
                          borderRadius: 6,
                          flexShrink: 0,
                        }}>
                          <Calendar size={9} />
                          {formatDateRange(exp.startDate, exp.endDate, exp.current, language)}
                        </div>
                      </div>
                      {exp.description && (
                        <div style={{
                          fontSize: sz - 1,
                          color: textMedium,
                          marginTop: 6,
                          whiteSpace: 'pre-line' as const,
                          lineHeight: 1.6,
                          backgroundColor: `${primary}04`,
                          borderRadius: 6,
                          padding: '6px 10px',
                        }}>
                          {exp.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Education ── */}
        {data.education.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionTitleMain
              title={language === 'ar' ? 'المؤهلات العلمية' : 'Education'}
              icon={<GraduationCap size={13} />}
              color={primary}
            />
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
              {data.education.map((edu) => (
                <div key={edu.id} style={{
                  backgroundColor: cardBg,
                  borderRadius: 10,
                  padding: '12px 16px',
                  border: `1px solid ${borderColor}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 10,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: sz + 1, color: textDark }}>{edu.major}</div>
                    <div style={{ fontSize: sz, color: textMedium, marginTop: 1 }}>{edu.institution}</div>
                    {edu.degree && (
                      <div style={{
                        display: 'inline-block',
                        fontSize: sz - 2,
                        padding: '2px 8px',
                        borderRadius: 6,
                        backgroundColor: `${primary}10`,
                        color: primary,
                        fontWeight: 600,
                        marginTop: 4,
                      }}>
                        {DEGREE_LABELS[language][edu.degree as DegreeType] || edu.degree}
                      </div>
                    )}
                    {edu.description && (
                      <div style={{ fontSize: sz - 1, color: textLight, marginTop: 4 }}>{edu.description}</div>
                    )}
                  </div>
                  <div style={{
                    fontSize: sz - 2,
                    color: textLight,
                    whiteSpace: 'nowrap' as const,
                    flexShrink: 0,
                  }}>
                    {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Certifications ── */}
        {data.certifications.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionTitleMain
              title={language === 'ar' ? 'الشهادات والدورات' : 'Certifications'}
              icon={<Award size={13} />}
              color={primary}
            />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8,
            }}>
              {data.certifications.map((cert) => (
                <div key={cert.id} style={{
                  backgroundColor: cardBg,
                  borderRadius: 10,
                  padding: '10px 14px',
                  border: `1px solid ${borderColor}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: `${primary}10`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: primary,
                    }}>
                      <Award size={13} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: sz, color: textDark, lineHeight: 1.3 }}>{cert.name}</div>
                      <div style={{ fontSize: sz - 2, color: textLight, marginTop: 1 }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Technical Skills (infographic grid) ── */}
        {technicalSkills.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionTitleMain
              title={language === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}
              icon={<Zap size={13} />}
              color={primary}
            />
            <div style={{
              backgroundColor: cardBg,
              borderRadius: 10,
              padding: '12px 16px',
              border: `1px solid ${borderColor}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {technicalSkills.map((sk) => (
                  <div key={sk.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: `${primary}08`,
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: sz - 1,
                    border: `1px solid ${primary}15`,
                  }}>
                    <CheckCircle2 size={10} style={{ color: primary }} />
                    <span style={{ fontWeight: 500, color: textDark }}>{sk.name}</span>
                    <span style={{ fontSize: sz - 3, color: textLight }}>
                      · {SKILL_LEVEL_LABELS[language][sk.level]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Projects ── */}
        {data.projects.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionTitleMain
              title={language === 'ar' ? 'المشاريع' : 'Projects'}
              icon={<FolderKanban size={13} />}
              color={primary}
            />
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
              {data.projects.map((proj) => (
                <div key={proj.id} style={{
                  backgroundColor: cardBg,
                  borderRadius: 10,
                  padding: '10px 14px',
                  border: `1px solid ${borderColor}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: sz, color: textDark }}>{proj.name}</span>
                    {proj.url && <ExternalLink size={11} style={{ color: textLight }} />}
                  </div>
                  {proj.description && (
                    <div style={{ fontSize: sz - 1, color: textMedium, marginTop: 3, lineHeight: 1.5 }}>{proj.description}</div>
                  )}
                  {proj.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginTop: 6 }}>
                      {proj.technologies.map((t) => (
                        <span key={t} style={{
                          fontSize: sz - 3,
                          padding: '2px 6px',
                          borderRadius: 4,
                          backgroundColor: `${primary}08`,
                          color: primary,
                          fontWeight: 500,
                        }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Slogan / Final Word ── */}
        <div style={{
          marginTop: 12,
          textAlign: 'center' as const,
          padding: '12px 20px',
          background: `linear-gradient(135deg, ${primary}08, ${primary}04)`,
          borderRadius: 10,
          border: `1px solid ${borderColor}`,
        }}>
          <Sparkles size={14} style={{ color: primary, marginBottom: 4 }} />
          <div style={{
            fontSize: sz + 1,
            fontWeight: 600,
            color: primary,
            fontStyle: 'italic',
            lineHeight: 1.5,
          }}>
            {language === 'ar'
              ? 'رحمة في الرعاية... وتميز في الأداء'
              : 'Compassion in care... Excellence in performance'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/*  Reusable Sub-components                      */
/* ────────────────────────────────────────────── */

/** Sidebar section title */
function SectionTitleSidebar({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: 1.2,
      opacity: 0.85,
      paddingBottom: 2,
      borderBottom: '1px solid rgba(255,255,255,0.15)',
    }}>
      {icon}
      <span>{title}</span>
    </div>
  );
}

/** Sidebar contact item */
function ContactItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      fontSize: 11,
      marginBottom: 7,
      wordBreak: 'break-all' as const,
      lineHeight: 1.4,
    }}>
      <div style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ opacity: 0.9 }}>{text}</span>
    </div>
  );
}

/** Main content section title */
function SectionTitleMain({ title, icon, color }: { title: string; icon: React.ReactNode; color: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: `${color}12`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{
        fontWeight: 700,
        fontSize: 15,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.8,
        color: '#1F2937',
      }}>
        {title}
      </div>
      <div style={{
        flex: 1,
        height: 2,
        borderRadius: 1,
        background: `linear-gradient(90deg, ${color}30, transparent)`,
      }} />
    </div>
  );
}
