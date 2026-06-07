'use client';

import React from 'react';
import {
  Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink,
  Briefcase, GraduationCap, Award, Languages as LangIcon, FolderKanban,
  Wrench, Heart, Star, Link as LinkIcon,
} from 'lucide-react';
import type { ResumeData, SkillLevel, LanguageLevel, DegreeType } from '@/lib/types';
import { SKILL_LEVEL_LABELS, LANGUAGE_LEVEL_LABELS, DEGREE_LABELS } from '@/lib/types';
import type { TemplateProps } from '@/components/templates';

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

/* -------------------------------------------------------------------------- */
/*  Aafiatak Pro Template – Premium Professional Design                       */
/* -------------------------------------------------------------------------- */

export function AafiatakProTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = language === 'ar' ? 'rtl' as const : 'ltr' as const;
  const isR = language === 'ar';
  const p = data.personalInfo;
  const color = primaryColor;

  // Light color variants
  const colorLight = color + '15';
  const colorMid = color + '40';
  const colorDark = color + 'CC';

  const A4: React.CSSProperties = {
    width: '210mm',
    minHeight: '297mm',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    lineHeight: 1.5,
    boxSizing: 'border-box',
    fontFamily: ff,
    fontSize: sz,
    direction: d,
  };

  // Count stats
  const totalExp = data.experience.length;
  const totalSkills = data.skills.length;
  const totalCerts = data.certifications.length;
  const totalProjects = data.projects.length;

  return (
    <div style={A4}>
      {/* ===== Gradient Header Banner ===== */}
      <div style={{
        background: `linear-gradient(135deg, ${color}, ${colorDark}, ${color})`,
        color: '#ffffff',
        padding: '28px 32px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 60, width: 80, height: 80, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />

        <div style={{ display: 'flex', gap: 20, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {p.photo && (
            <div style={{
              flexShrink: 0,
              padding: 3,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2))',
            }}>
              <img
                src={p.photo}
                alt=""
                style={{
                  width: 85,
                  height: 85,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid rgba(255,255,255,0.4)',
                }}
              />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: sz + 16, fontWeight: 800, marginBottom: 3, letterSpacing: 0.5 }}>
              {p.fullName || (isR ? 'الاسم الكامل' : 'Full Name')}
            </div>
            <div style={{ fontSize: sz + 4, fontWeight: 400, opacity: 0.92, marginBottom: 12, letterSpacing: 1 }}>
              {p.jobTitle || (isR ? 'المسمى الوظيفي' : 'Job Title')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: sz - 1, opacity: 0.88 }}>
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Mail size={10} /> {p.email}</span>}
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Phone size={10} /> {p.phone}</span>}
              {(p.city || p.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><MapPin size={10} /> {[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Globe size={10} /> {p.website}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Linkedin size={10} /> {p.linkedin}</span>}
              {p.github && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Github size={10} /> {p.github}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Stats Cards Row ===== */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `2px solid ${colorLight}` }}>
        {[
          { icon: <Briefcase size={14} />, value: totalExp, label: isR ? 'خبرة' : 'Exp' },
          { icon: <Wrench size={14} />, value: totalSkills, label: isR ? 'مهارة' : 'Skills' },
          { icon: <Award size={14} />, value: totalCerts, label: isR ? 'شهادة' : 'Certs' },
          { icon: <FolderKanban size={14} />, value: totalProjects, label: isR ? 'مشروع' : 'Projects' },
        ].map((stat, i) => (
          <div key={i} style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 8px',
            backgroundColor: i % 2 === 0 ? colorLight : 'transparent',
            borderRight: i < 3 ? `1px solid ${colorLight}` : undefined,
            borderLeft: isR && i < 3 ? `1px solid ${colorLight}` : undefined,
          }}>
            <div style={{ color: color }}>{stat.icon}</div>
            <div style={{ fontWeight: 800, fontSize: sz + 4, color: color }}>{stat.value}</div>
            <div style={{ fontSize: sz - 2, color: '#888', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ===== Main Content ===== */}
      <div style={{ padding: '20px 32px 28px' }}>

        {/* Professional Summary */}
        {p.summary && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 4, height: 22, borderRadius: 2, backgroundColor: color }} />
              <div style={{ fontWeight: 700, fontSize: sz + 4, color: '#1a1a1a', letterSpacing: 0.5 }}>
                {isR ? 'النبذة الاحترافية' : 'Professional Summary'}
              </div>
            </div>
            <div style={{ fontSize: sz, color: '#555', whiteSpace: 'pre-line', lineHeight: 1.7, paddingInlineStart: 12 }}>
              {p.summary}
            </div>
          </div>
        )}

        {/* Experience Section - Timeline Style */}
        {data.experience.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 4, height: 22, borderRadius: 2, backgroundColor: color }} />
              <div style={{ fontWeight: 700, fontSize: sz + 4, color: '#1a1a1a', letterSpacing: 0.5 }}>
                {isR ? 'الخبرات العملية' : 'Work Experience'}
              </div>
            </div>
            <div style={{ paddingInlineStart: 12 }}>
              {data.experience.map((exp, i) => (
                <div key={exp.id} style={{
                  position: 'relative',
                  paddingInlineStart: 20,
                  marginBottom: i < data.experience.length - 1 ? 16 : 0,
                }}>
                  {/* Timeline line */}
                  <div style={{
                    position: 'absolute',
                    top: 6,
                    [isR ? 'right' : 'left']: 0,
                    width: 2,
                    height: 'calc(100% + 8px)',
                    backgroundColor: colorLight,
                  }} />
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    top: 6,
                    [isR ? 'right' : 'left']: -3,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: '2px solid #fff',
                    boxShadow: `0 0 0 2px ${colorMid}`,
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a' }}>{exp.jobTitle}</div>
                      <div style={{ fontSize: sz, color: color, fontWeight: 600 }}>{exp.company}</div>
                    </div>
                    <div style={{
                      fontSize: sz - 2,
                      color: '#fff',
                      backgroundColor: color,
                      padding: '2px 10px',
                      borderRadius: 12,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current, language)}
                    </div>
                  </div>
                  {exp.description && (
                    <div style={{ fontSize: sz - 1, color: '#666', marginTop: 4, whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {data.education.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 4, height: 22, borderRadius: 2, backgroundColor: color }} />
              <div style={{ fontWeight: 700, fontSize: sz + 4, color: '#1a1a1a', letterSpacing: 0.5 }}>
                {isR ? 'المؤهلات التعليمية' : 'Education'}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingInlineStart: 12 }}>
              {data.education.map((edu) => (
                <div key={edu.id} style={{
                  flex: '1 1 calc(50% - 5px)',
                  minWidth: 200,
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: colorLight,
                  borderLeft: `3px solid ${color}`,
                  borderRight: isR ? `3px solid ${color}` : undefined,
                }}>
                  <div style={{ fontWeight: 700, fontSize: sz, color: '#1a1a1a' }}>{edu.major}</div>
                  <div style={{ fontSize: sz - 1, color: color, fontWeight: 500 }}>{edu.institution}</div>
                  {edu.degree && (
                    <div style={{ fontSize: sz - 2, color: '#888', marginTop: 2 }}>
                      {DEGREE_LABELS[language][edu.degree as DegreeType] || edu.degree}
                    </div>
                  )}
                  <div style={{ fontSize: sz - 2, color: '#aaa', marginTop: 2 }}>
                    {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section - Progress Bars */}
        {data.skills.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 4, height: 22, borderRadius: 2, backgroundColor: color }} />
              <div style={{ fontWeight: 700, fontSize: sz + 4, color: '#1a1a1a', letterSpacing: 0.5 }}>
                {isR ? 'المهارات' : 'Skills'}
              </div>
            </div>
            <div style={{ paddingInlineStart: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' }}>
                {data.skills.map((sk) => (
                  <div key={sk.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: sz - 1, marginBottom: 3 }}>
                      <span style={{ fontWeight: 600, color: '#333' }}>{sk.name}</span>
                      <span style={{ color: '#999', fontSize: sz - 2 }}>{SKILL_LEVEL_LABELS[language][sk.level]}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        borderRadius: 3,
                        width: getSkillWidth(sk.level),
                        background: `linear-gradient(90deg, ${color}, ${colorMid})`,
                        transition: 'width 0.3s',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {data.certifications.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 4, height: 22, borderRadius: 2, backgroundColor: color }} />
              <div style={{ fontWeight: 700, fontSize: sz + 4, color: '#1a1a1a', letterSpacing: 0.5 }}>
                {isR ? 'الشهادات' : 'Certifications'}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingInlineStart: 12 }}>
              {data.certifications.map((c) => (
                <div key={c.id} style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  backgroundColor: colorLight,
                  border: `1px solid ${colorMid}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Award size={12} style={{ color: color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: sz - 1, color: '#1a1a1a' }}>{c.name}</div>
                    <div style={{ fontSize: sz - 2, color: '#888' }}>{c.issuer}{c.date ? ` - ${c.date}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section - Dots */}
        {data.languages.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 4, height: 22, borderRadius: 2, backgroundColor: color }} />
              <div style={{ fontWeight: 700, fontSize: sz + 4, color: '#1a1a1a', letterSpacing: 0.5 }}>
                {isR ? 'اللغات' : 'Languages'}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', paddingInlineStart: 12 }}>
              {data.languages.map((l) => {
                const filled = getLanguageDots(l.level);
                return (
                  <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: sz, fontWeight: 600, color: '#333' }}>{l.name}</span>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div key={dot} style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: dot <= filled ? color : '#e5e7eb',
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: sz - 2, color: '#999' }}>
                      {LANGUAGE_LEVEL_LABELS[language][l.level]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <div style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 4, height: 22, borderRadius: 2, backgroundColor: color }} />
              <div style={{ fontWeight: 700, fontSize: sz + 4, color: '#1a1a1a', letterSpacing: 0.5 }}>
                {isR ? 'المشاريع' : 'Projects'}
              </div>
            </div>
            <div style={{ paddingInlineStart: 12 }}>
              {data.projects.map((proj) => (
                <div key={proj.id} style={{
                  marginBottom: 10,
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: '#fafafa',
                  border: `1px solid #f0f0f0`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FolderKanban size={12} style={{ color: color }} />
                    <span style={{ fontWeight: 700, fontSize: sz, color: '#1a1a1a' }}>{proj.name}</span>
                    {proj.url && <ExternalLink size={10} style={{ color: '#aaa' }} />}
                  </div>
                  {proj.description && (
                    <div style={{ fontSize: sz - 1, color: '#666', marginTop: 3 }}>{proj.description}</div>
                  )}
                  {proj.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                      {proj.technologies.map((t) => (
                        <span key={t} style={{
                          fontSize: sz - 2,
                          padding: '2px 8px',
                          borderRadius: 4,
                          backgroundColor: colorLight,
                          color: color,
                          fontWeight: 500,
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
