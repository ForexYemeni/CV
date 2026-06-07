'use client';

import React from 'react';
import {
  Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink,
  Briefcase, GraduationCap, Award, FolderKanban,
  Wrench, Palette, Brush, Sparkles, PenTool, Layers,
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
/*  Creative Pro Template – Artistic Yet Professional Design                  */
/* -------------------------------------------------------------------------- */

export function CreativeProTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = language === 'ar' ? 'rtl' as const : 'ltr' as const;
  const isR = language === 'ar';
  const p = data.personalInfo;
  const color = primaryColor;

  const colorLight = color + '10';
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
    position: 'relative',
    overflow: 'hidden',
  };

  const visibleSections = data.sections
    .filter((s) => s.visible && s.type !== 'personalInfo')
    .sort((a, b) => a.order - b.order)
    .map((s) => s.type);

  return (
    <div style={A4}>
      {/* ===== Creative Side Accent Bar ===== */}
      <div style={{
        position: 'absolute',
        top: 0,
        [isR ? 'right' : 'left']: 0,
        width: 6,
        height: '100%',
        background: `linear-gradient(180deg, ${color}, ${colorDark}, ${colorMid}, ${color})`,
      }} />

      {/* ===== Top Creative Header ===== */}
      <div style={{
        padding: '28px 36px 22px',
        position: 'relative',
        marginInlineStart: 6,
      }}>
        {/* Decorative gradient circle in background */}
        <div style={{
          position: 'absolute',
          top: -40,
          [isR ? 'left' : 'right']: -20,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colorLight}, transparent)`,
          zIndex: 0,
        }} />

        <div style={{ display: 'flex', gap: 22, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {p.photo && (
            <div style={{
              flexShrink: 0,
              position: 'relative',
            }}>
              {/* Creative photo frame with offset borders */}
              <div style={{
                position: 'absolute',
                top: -4,
                [isR ? 'right' : 'left']: -4,
                width: 86,
                height: 86,
                borderRadius: 12,
                border: `2px solid ${colorMid}`,
                zIndex: 0,
              }} />
              <img
                src={p.photo}
                alt=""
                style={{
                  width: 82,
                  height: 82,
                  borderRadius: 12,
                  objectFit: 'cover',
                  border: `3px solid ${color}`,
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: sz + 16,
              fontWeight: 800,
              color: '#1a1a1a',
              marginBottom: 2,
              letterSpacing: -0.5,
            }}>
              {p.fullName || (isR ? 'الاسم الكامل' : 'Full Name')}
            </div>
            <div style={{
              fontSize: sz + 3,
              fontWeight: 500,
              color: color,
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <PenTool size={14} />
              {p.jobTitle || (isR ? 'المسمى الوظيفي' : 'Job Title')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: sz - 1, color: '#666' }}>
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={10} style={{ color }} /> {p.email}</span>}
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} style={{ color }} /> {p.phone}</span>}
              {(p.city || p.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} style={{ color }} /> {[p.city, p.country].filter(Boolean).join(', ')}</span>}
              {p.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Globe size={10} style={{ color }} /> {p.website}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={10} style={{ color }} /> {p.linkedin}</span>}
              {p.github && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Github size={10} style={{ color }} /> {p.github}</span>}
            </div>
          </div>
        </div>

        {/* Creative gradient divider */}
        <div style={{
          marginTop: 18,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${color}, ${colorMid}, transparent)`,
        }} />
      </div>

      {/* ===== Summary ===== */}
      {p.summary && (
        <div style={{ padding: '4px 36px 8px', marginInlineStart: 6 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8,
          }}>
            <Sparkles size={14} style={{ color }} />
            <div style={{
              fontWeight: 700,
              fontSize: sz + 3,
              color: '#1a1a1a',
              letterSpacing: 0.5,
            }}>
              {isR ? 'النبذة الاحترافية' : 'Professional Summary'}
            </div>
          </div>
          <div style={{ fontSize: sz, color: '#555', whiteSpace: 'pre-line', lineHeight: 1.7, paddingInlineStart: 24 }}>
            {p.summary}
          </div>
        </div>
      )}

      {/* ===== Content Sections ===== */}
      <div style={{ padding: '8px 36px 28px', marginInlineStart: 6 }}>
        {visibleSections.map((type) => (
          <div key={type} style={{ marginBottom: 18 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
              }}>
                {type === 'experience' ? <Briefcase size={13} /> :
                 type === 'education' ? <GraduationCap size={13} /> :
                 type === 'skills' ? <Wrench size={13} /> :
                 type === 'certifications' ? <Award size={13} /> :
                 type === 'languages' ? <Globe size={13} /> :
                 <FolderKanban size={13} />}
              </div>
              <div style={{
                fontWeight: 700,
                fontSize: sz + 3,
                color: '#1a1a1a',
                letterSpacing: 0.5,
              }}>
                {type === 'experience' ? (isR ? 'الخبرات العملية' : 'Work Experience') :
                 type === 'education' ? (isR ? 'المؤهلات التعليمية' : 'Education') :
                 type === 'skills' ? (isR ? 'المهارات' : 'Skills') :
                 type === 'certifications' ? (isR ? 'الشهادات' : 'Certifications') :
                 type === 'languages' ? (isR ? 'اللغات' : 'Languages') :
                 (isR ? 'المشاريع' : 'Projects')}
              </div>
              <div style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
            </div>

            {/* Experience - Creative Cards with accent borders */}
            {type === 'experience' && data.experience.map((exp, i) => (
              <div key={exp.id} style={{
                marginBottom: i < data.experience.length - 1 ? 12 : 0,
                padding: '12px 16px',
                borderRadius: 10,
                position: 'relative',
                backgroundColor: i % 2 === 0 ? colorLight : '#fafafa',
                borderLeft: `4px solid ${color}`,
                borderRight: isR ? `4px solid ${color}` : undefined,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a' }}>{exp.jobTitle}</div>
                    <div style={{ fontSize: sz, color: color, fontWeight: 600 }}>{exp.company}</div>
                  </div>
                  <div style={{
                    fontSize: sz - 2,
                    color: '#ffffff',
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

            {/* Education - Grid Cards */}
            {type === 'education' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {data.education.map((edu) => (
                  <div key={edu.id} style={{
                    flex: '1 1 calc(50% - 5px)',
                    minWidth: 180,
                    padding: '10px 14px',
                    borderRadius: 10,
                    backgroundColor: colorLight,
                    borderTop: `3px solid ${color}`,
                  }}>
                    <div style={{ fontWeight: 700, fontSize: sz, color: '#1a1a1a' }}>{edu.major}</div>
                    <div style={{ fontSize: sz - 1, color: color, fontWeight: 500 }}>{edu.institution}</div>
                    <div style={{ display: 'flex', gap: 8, fontSize: sz - 2, color: '#888', marginTop: 2 }}>
                      {edu.degree && <span>{DEGREE_LABELS[language][edu.degree as DegreeType] || edu.degree}</span>}
                      <span>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills - Creative Tags with levels */}
            {type === 'skills' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {data.skills.map((sk) => (
                  <div key={sk.id} style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    backgroundColor: colorLight,
                    border: `1px solid ${colorMid}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: color,
                    }} />
                    <span style={{ fontWeight: 600, fontSize: sz - 1, color: '#1a1a1a' }}>{sk.name}</span>
                    <span style={{ fontSize: sz - 2, color: '#999' }}>{SKILL_LEVEL_LABELS[language][sk.level]}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {type === 'certifications' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
                    <Award size={12} style={{ color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: sz - 1, color: '#1a1a1a' }}>{c.name}</div>
                      <div style={{ fontSize: sz - 2, color: '#888' }}>{c.issuer}{c.date ? ` - ${c.date}` : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Languages */}
            {type === 'languages' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
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
                      <span style={{ fontSize: sz - 2, color: '#999' }}>{LANGUAGE_LEVEL_LABELS[language][l.level]}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Projects - Creative Cards */}
            {type === 'projects' && data.projects.map((proj) => (
              <div key={proj.id} style={{
                marginBottom: 10,
                padding: '12px 16px',
                borderRadius: 10,
                border: `1px solid #e5e7eb`,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Subtle gradient accent in corner */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  [isR ? 'left' : 'right']: 0,
                  width: 60,
                  height: 60,
                  background: `radial-gradient(circle at top ${isR ? 'left' : 'right'}, ${colorLight}, transparent)`,
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
                  <Layers size={12} style={{ color }} />
                  <span style={{ fontWeight: 700, fontSize: sz, color: '#1a1a1a' }}>{proj.name}</span>
                  {proj.url && <ExternalLink size={10} style={{ color: '#aaa' }} />}
                </div>
                {proj.description && (
                  <div style={{ fontSize: sz - 1, color: '#666', marginTop: 3, position: 'relative' }}>{proj.description}</div>
                )}
                {proj.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6, position: 'relative' }}>
                    {proj.technologies.map((t) => (
                      <span key={t} style={{
                        fontSize: sz - 2,
                        padding: '2px 8px',
                        borderRadius: 6,
                        backgroundColor: color,
                        color: '#ffffff',
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
        ))}
      </div>
    </div>
  );
}
