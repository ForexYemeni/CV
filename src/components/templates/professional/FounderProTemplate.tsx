'use client';

import React from 'react';
import {
  Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink,
  Briefcase, GraduationCap, Award, FolderKanban,
  Wrench, Rocket, TrendingUp, Users, Target, Zap,
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
/*  Founder Pro Template – Bold Executive Startup Design                      */
/* -------------------------------------------------------------------------- */

export function FounderProTemplate({ data, primaryColor, fontFamily, fontSize, language }: TemplateProps) {
  const ff = resolveFont(fontFamily);
  const sz = fontSizeBase(fontSize);
  const d = language === 'ar' ? 'rtl' as const : 'ltr' as const;
  const isR = language === 'ar';
  const p = data.personalInfo;
  const color = primaryColor;

  const colorLight = color + '12';
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
    display: 'flex',
  };

  const sideSections = ['skills', 'languages', 'certifications'];
  const mainSections = ['experience', 'education', 'projects'];
  const visibleSections = data.sections
    .filter((s) => s.visible && s.type !== 'personalInfo')
    .sort((a, b) => a.order - b.order)
    .map((s) => s.type);

  const sideItems = sideSections.filter((s) => visibleSections.includes(s));
  const mainItems = mainSections.filter((s) => visibleSections.includes(s));

  return (
    <div style={A4}>
      {/* ===== Left Sidebar ===== */}
      <div style={{
        width: '38%',
        backgroundColor: '#0F172A',
        color: '#E2E8F0',
        padding: '28px 22px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Sidebar gradient accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${color}, ${colorDark})`,
        }} />

        {/* Photo */}
        {p.photo && (
          <div style={{ textAlign: 'center', marginBottom: 16, marginTop: 6 }}>
            <div style={{
              display: 'inline-block',
              padding: 3,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${color}, ${colorDark})`,
            }}>
              <img
                src={p.photo}
                alt=""
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #0F172A',
                }}
              />
            </div>
          </div>
        )}

        {/* Name & Title */}
        <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: sz + 8, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
            {p.fullName || (isR ? 'الاسم الكامل' : 'Full Name')}
          </div>
          <div style={{
            fontSize: sz + 1,
            fontWeight: 500,
            color: color,
            display: 'inline-block',
            padding: '2px 12px',
            borderRadius: 12,
            backgroundColor: colorLight,
          }}>
            {p.jobTitle || (isR ? 'المسمى الوظيفي' : 'Job Title')}
          </div>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: 22 }}>
          <div style={{
            fontSize: sz,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 2,
            color: color,
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{ width: 16, height: 2, backgroundColor: color }} />
            {isR ? 'التواصل' : 'Contact'}
          </div>
          {p.email && <div style={{ fontSize: sz - 1, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7, wordBreak: 'break-all' }}><Mail size={11} style={{ color, flexShrink: 0 }} /> {p.email}</div>}
          {p.phone && <div style={{ fontSize: sz - 1, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7 }}><Phone size={11} style={{ color, flexShrink: 0 }} /> {p.phone}</div>}
          {(p.city || p.country) && <div style={{ fontSize: sz - 1, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7 }}><MapPin size={11} style={{ color, flexShrink: 0 }} /> {[p.city, p.country].filter(Boolean).join(', ')}</div>}
          {p.website && <div style={{ fontSize: sz - 1, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7, wordBreak: 'break-all' }}><Globe size={11} style={{ color, flexShrink: 0 }} /> {p.website}</div>}
          {p.linkedin && <div style={{ fontSize: sz - 1, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7, wordBreak: 'break-all' }}><Linkedin size={11} style={{ color, flexShrink: 0 }} /> {p.linkedin}</div>}
          {p.github && <div style={{ fontSize: sz - 1, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7, wordBreak: 'break-all' }}><Github size={11} style={{ color, flexShrink: 0 }} /> {p.github}</div>}
        </div>

        {/* Sidebar sections */}
        {sideItems.map((type) => (
          <div key={type} style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: sz,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 2,
              color: color,
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <div style={{ width: 16, height: 2, backgroundColor: color }} />
              {type === 'skills' ? (isR ? 'المهارات' : 'Skills') :
               type === 'languages' ? (isR ? 'اللغات' : 'Languages') :
               (isR ? 'الشهادات' : 'Certifications')}
            </div>

            {type === 'skills' && data.skills.map((sk) => (
              <div key={sk.id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: sz - 1, marginBottom: 3 }}>
                  <span style={{ fontWeight: 500 }}>{sk.name}</span>
                  <span style={{ opacity: 0.6, fontSize: sz - 2 }}>{SKILL_LEVEL_LABELS[language][sk.level]}</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    borderRadius: 2,
                    width: getSkillWidth(sk.level),
                    background: `linear-gradient(90deg, ${color}, ${colorMid})`,
                  }} />
                </div>
              </div>
            ))}

            {type === 'languages' && data.languages.map((l) => {
              const filled = getLanguageDots(l.level);
              return (
                <div key={l.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: sz - 1, fontWeight: 500, minWidth: 70 }}>{l.name}</span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div key={dot} style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: dot <= filled ? color : 'rgba(255,255,255,0.15)',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: sz - 2, opacity: 0.5 }}>{LANGUAGE_LEVEL_LABELS[language][l.level]}</span>
                </div>
              );
            })}

            {type === 'certifications' && data.certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: 8, padding: '6px 10px', borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderLeft: `2px solid ${color}`, borderRight: isR ? `2px solid ${color}` : undefined }}>
                <div style={{ fontWeight: 600, fontSize: sz - 1, color: '#fff' }}>{c.name}</div>
                <div style={{ fontSize: sz - 2, opacity: 0.6 }}>{c.issuer}{c.date ? ` - ${c.date}` : ''}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ===== Main Content ===== */}
      <div style={{ flex: 1, padding: '28px 26px' }}>
        {/* Summary */}
        {p.summary && (
          <div style={{ marginBottom: 22 }}>
            <div style={{
              fontWeight: 700,
              fontSize: sz + 4,
              color: '#0F172A',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingBottom: 6,
              borderBottom: `2px solid ${color}`,
            }}>
              <Rocket size={16} style={{ color }} />
              {isR ? 'النبذة الاحترافية' : 'Professional Summary'}
            </div>
            <div style={{ fontSize: sz, color: '#555', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
              {p.summary}
            </div>
          </div>
        )}

        {/* Main sections */}
        {mainItems.map((type) => (
          <div key={type} style={{ marginBottom: 22 }}>
            <div style={{
              fontWeight: 700,
              fontSize: sz + 4,
              color: '#0F172A',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingBottom: 6,
              borderBottom: `2px solid ${color}`,
            }}>
              {type === 'experience' ? <Briefcase size={16} style={{ color }} /> :
               type === 'education' ? <GraduationCap size={16} style={{ color }} /> :
               <FolderKanban size={16} style={{ color }} />}
              {type === 'experience' ? (isR ? 'الخبرات العملية' : 'Work Experience') :
               type === 'education' ? (isR ? 'المؤهلات التعليمية' : 'Education') :
               (isR ? 'المشاريع' : 'Projects')}
            </div>

            {/* Experience */}
            {type === 'experience' && data.experience.map((exp, i) => (
              <div key={exp.id} style={{
                marginBottom: i < data.experience.length - 1 ? 14 : 0,
                padding: '12px 14px',
                borderRadius: 8,
                backgroundColor: i % 2 === 0 ? colorLight : '#fafafa',
                borderLeft: `3px solid ${color}`,
                borderRight: isR ? `3px solid ${color}` : undefined,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a' }}>{exp.jobTitle}</div>
                    <div style={{ fontSize: sz, color: color, fontWeight: 600 }}>{exp.company}</div>
                  </div>
                  <div style={{ fontSize: sz - 2, color: '#999', whiteSpace: 'nowrap' }}>
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

            {/* Education */}
            {type === 'education' && data.education.map((edu) => (
              <div key={edu.id} style={{
                marginBottom: 10,
                padding: '10px 14px',
                borderRadius: 8,
                backgroundColor: colorLight,
              }}>
                <div style={{ fontWeight: 700, fontSize: sz + 1, color: '#1a1a1a' }}>{edu.major}</div>
                <div style={{ fontSize: sz, color: color, fontWeight: 500 }}>{edu.institution}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: sz - 2, color: '#888', marginTop: 2 }}>
                  {edu.degree && <span>{DEGREE_LABELS[language][edu.degree as DegreeType] || edu.degree}</span>}
                  <span>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</span>
                </div>
                {edu.description && <div style={{ fontSize: sz - 1, color: '#666', marginTop: 2 }}>{edu.description}</div>}
              </div>
            ))}

            {/* Projects */}
            {type === 'projects' && data.projects.map((proj) => (
              <div key={proj.id} style={{
                marginBottom: 10,
                padding: '12px 14px',
                borderRadius: 8,
                border: `1px solid #e5e7eb`,
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Target size={12} style={{ color }} />
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
        ))}
      </div>
    </div>
  );
}
