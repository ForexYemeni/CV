export type Language = 'ar' | 'en';
export type ViewMode = 'dashboard' | 'editor' | 'templates' | 'settings' | 'admin' | 'auth';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type LanguageLevel = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
export type DegreeType = 'high_school' | 'diploma' | 'bachelor' | 'master' | 'phd' | 'other';
export type PaperSize = 'a4' | 'letter';
export type ExportFormat = 'pdf' | 'png' | 'jpg';

export interface PersonalInfo {
  photo: string;
  fullName: string;
  jobTitle: string;
  summary: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  website: string;
  linkedin: string;
  github: string;
  otherLinks: { label: string; url: string }[];
}

export interface Experience {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  major: string;
  degree: DegreeType;
  startDate: string;
  endDate: string;
  description: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
}

export interface LanguageEntry {
  id: string;
  name: string;
  level: LanguageLevel;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
}

export interface ResumeSection {
  id: string;
  type: 'personalInfo' | 'experience' | 'education' | 'skills' | 'certifications' | 'languages' | 'projects';
  visible: boolean;
  order: number;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages: LanguageEntry[];
  projects: Project[];
  sections: ResumeSection[];
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  slug: string;
  template: string;
  primaryColor: string;
  fontFamily: string;
  fontSize: string;
  language: Language;
  data: ResumeData;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateInfo {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
  isPremium: boolean;
  colors: string[];
  preview: string;
}

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  photo: '',
  fullName: '',
  jobTitle: '',
  summary: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  address: '',
  website: '',
  linkedin: '',
  github: '',
  otherLinks: [],
};

export const DEFAULT_SECTIONS: ResumeSection[] = [
  { id: 'personalInfo', type: 'personalInfo', visible: true, order: 0 },
  { id: 'experience', type: 'experience', visible: true, order: 1 },
  { id: 'education', type: 'education', visible: true, order: 2 },
  { id: 'skills', type: 'skills', visible: true, order: 3 },
  { id: 'certifications', type: 'certifications', visible: true, order: 4 },
  { id: 'languages', type: 'languages', visible: true, order: 5 },
  { id: 'projects', type: 'projects', visible: true, order: 6 },
];

export function getDefaultResumeData(): ResumeData {
  return {
    personalInfo: { ...DEFAULT_PERSONAL_INFO },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
    sections: DEFAULT_SECTIONS.map(s => ({ ...s })),
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export const TEMPLATES: TemplateInfo[] = [
  { id: 'classic', name: 'Classic Professional', nameAr: 'كلاسيكي احترافي', slug: 'classic', category: 'professional', categoryAr: 'احترافي', description: 'A timeless professional layout', descriptionAr: 'تصميم احترافي كلاسيكي', isPremium: false, colors: ['#2563eb', '#1e40af', '#1d4ed8'], preview: '' },
  { id: 'modern', name: 'Modern Business', nameAr: 'أعمال حديث', slug: 'modern', category: 'professional', categoryAr: 'احترافي', description: 'Clean modern business design', descriptionAr: 'تصميم أعمال حديث وأنيق', isPremium: false, colors: ['#0f172a', '#334155', '#475569'], preview: '' },
  { id: 'executive', name: 'Executive', nameAr: 'تنفيذي', slug: 'executive', category: 'professional', categoryAr: 'احترافي', description: 'Bold executive style', descriptionAr: 'أسلوب تنفيذي جريء', isPremium: false, colors: ['#18181b', '#3f3f46', '#52525b'], preview: '' },
  { id: 'creative', name: 'Creative Designer', nameAr: 'مصمم إبداعي', slug: 'creative', category: 'creative', categoryAr: 'إبداعي', description: 'Creative design for designers', descriptionAr: 'تصميم إبداعي للمصممين', isPremium: false, colors: ['#8b5cf6', '#7c3aed', '#6d28d9'], preview: '' },
  { id: 'minimal', name: 'Minimal', nameAr: 'بسيط', slug: 'minimal', category: 'minimal', categoryAr: 'بسيط', description: 'Minimal clean design', descriptionAr: 'تصميم بسيط ونظيف', isPremium: false, colors: ['#374151', '#4b5563', '#6b7280'], preview: '' },
  { id: 'corporate', name: 'Corporate', nameAr: 'مؤسسي', slug: 'corporate', category: 'professional', categoryAr: 'احترافي', description: 'Corporate professional layout', descriptionAr: 'تصميم مؤسسي احترافي', isPremium: false, colors: ['#0369a1', '#075985', '#0c4a6e'], preview: '' },
  { id: 'ats', name: 'ATS Friendly', nameAr: 'متوافق مع ATS', slug: 'ats', category: 'professional', categoryAr: 'احترافي', description: 'Optimized for ATS systems', descriptionAr: 'مُحسّن لأنظمة التتبع', isPremium: false, colors: ['#1f2937', '#374151', '#4b5563'], preview: '' },
  { id: 'medical', name: 'Medical Professional', nameAr: 'طبي احترافي', slug: 'medical', category: 'industry', categoryAr: 'صناعي', description: 'Designed for medical professionals', descriptionAr: 'مصمم للمهنيين في المجال الطبي', isPremium: false, colors: ['#0d9488', '#0f766e', '#115e59'], preview: '' },
  { id: 'engineering', name: 'Engineering', nameAr: 'هندسي', slug: 'engineering', category: 'industry', categoryAr: 'صناعي', description: 'Engineering professional template', descriptionAr: 'قالب احترافي للمهندسين', isPremium: false, colors: ['#b45309', '#92400e', '#78350f'], preview: '' },
  { id: 'academic', name: 'Academic', nameAr: 'أكاديمي', slug: 'academic', category: 'academic', categoryAr: 'أكاديمي', description: 'Academic CV template', descriptionAr: 'قالب أكاديمي للباحثين', isPremium: false, colors: ['#7c2d12', '#9a3412', '#c2410c'], preview: '' },
  { id: 'elegant', name: 'Elegant', nameAr: 'أنيق', slug: 'elegant', category: 'creative', categoryAr: 'إبداعي', description: 'Elegant refined design', descriptionAr: 'تصميم أنيق وراقي', isPremium: true, colors: ['#be185d', '#9d174d', '#831843'], preview: '' },
  { id: 'premiumdark', name: 'Premium Dark', nameAr: 'داكن فاخر', slug: 'premiumdark', category: 'creative', categoryAr: 'إبداعي', description: 'Premium dark mode design', descriptionAr: 'تصميم داكن فاخر', isPremium: true, colors: ['#f59e0b', '#d97706', '#b45309'], preview: '' },
];

export const SKILL_LEVEL_LABELS: Record<Language, Record<SkillLevel, string>> = {
  ar: { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم', expert: 'خبير' },
  en: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', expert: 'Expert' },
};

export const LANGUAGE_LEVEL_LABELS: Record<Language, Record<LanguageLevel, string>> = {
  ar: { native: 'لغة أم', fluent: 'فصيح', advanced: 'متقدم', intermediate: 'متوسط', basic: 'أساسي' },
  en: { native: 'Native', fluent: 'Fluent', advanced: 'Advanced', intermediate: 'Intermediate', basic: 'Basic' },
};

export const DEGREE_LABELS: Record<Language, Record<DegreeType, string>> = {
  ar: { high_school: 'ثانوية', diploma: 'دبلوم', bachelor: 'بكالوريوس', master: 'ماجستير', phd: 'دكتوراه', other: 'أخرى' },
  en: { high_school: 'High School', diploma: 'Diploma', bachelor: 'Bachelor', master: 'Master', phd: 'PhD', other: 'Other' },
};

export const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter', labelAr: 'إنتر' },
  { value: 'roboto', label: 'Roboto', labelAr: 'روبوتو' },
  { value: 'cairo', label: 'Cairo', labelAr: 'القاهرة' },
  { value: 'tajawal', label: 'Tajawal', labelAr: 'تجوال' },
  { value: 'noto-kufi', label: 'Noto Kufi', labelAr: 'نوتو كوفي' },
  { value: 'georgia', label: 'Georgia', labelAr: 'جورجيا' },
  { value: 'playfair', label: 'Playfair Display', labelAr: 'بلايفير' },
];

export const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Small', labelAr: 'صغير' },
  { value: 'medium', label: 'Medium', labelAr: 'متوسط' },
  { value: 'large', label: 'Large', labelAr: 'كبير' },
];
