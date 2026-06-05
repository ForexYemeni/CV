export type Language = 'ar' | 'en';
export type ViewMode = 'landing' | 'dashboard' | 'editor' | 'templates' | 'settings' | 'admin' | 'auth';
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
  { id: 'modern', name: 'Modern Professional', nameAr: 'احترافي حديث', slug: 'modern', category: 'professional', categoryAr: 'احترافي', description: 'Sleek modern professional design', descriptionAr: 'تصميم احترافي حديث وأنيق', isPremium: false, colors: ['#2563EB', '#1E40AF', '#1D4ED8'], preview: '' },
  { id: 'executive', name: 'Executive Elite', nameAr: 'تنفيذي نخبة', slug: 'executive', category: 'professional', categoryAr: 'احترافي', description: 'Bold executive elite style', descriptionAr: 'أسلوب تنفيذي نخبوي', isPremium: false, colors: ['#0F172A', '#334155', '#475569'], preview: '' },
  { id: 'ats', name: 'ATS Pro', nameAr: 'ATS برو', slug: 'ats', category: 'professional', categoryAr: 'احترافي', description: 'Optimized for ATS systems', descriptionAr: 'مُحسّن لأنظمة التتبع', isPremium: false, colors: ['#1F2937', '#374151', '#4B5563'], preview: '' },
  { id: 'medical', name: 'Medical Expert', nameAr: 'خبير طبي', slug: 'medical', category: 'industry', categoryAr: 'صناعي', description: 'For medical professionals', descriptionAr: 'للمهنيين في المجال الطبي', isPremium: false, colors: ['#0D9488', '#0F766E', '#115E59'], preview: '' },
  { id: 'engineering', name: 'Engineering Pro', nameAr: 'هندسة برو', slug: 'engineering', category: 'industry', categoryAr: 'صناعي', description: 'Engineering professional template', descriptionAr: 'قالب احترافي للمهندسين', isPremium: false, colors: ['#B45309', '#92400E', '#78350F'], preview: '' },
  { id: 'creative', name: 'Creative Designer', nameAr: 'مصمم إبداعي', slug: 'creative', category: 'creative', categoryAr: 'إبداعي', description: 'Creative design for designers', descriptionAr: 'تصميم إبداعي للمصممين', isPremium: false, colors: ['#8B5CF6', '#7C3AED', '#6D28D9'], preview: '' },
  { id: 'corporate', name: 'Corporate Blue', nameAr: 'مؤسسي أزرق', slug: 'corporate', category: 'professional', categoryAr: 'احترافي', description: 'Corporate blue professional layout', descriptionAr: 'تصميم مؤسسي أزرق احترافي', isPremium: false, colors: ['#0369A1', '#075985', '#0C4A6E'], preview: '' },
  { id: 'elegant', name: 'Elegant Black', nameAr: 'أنيق أسود', slug: 'elegant', category: 'creative', categoryAr: 'إبداعي', description: 'Elegant black refined design', descriptionAr: 'تصميم أنيق أسود راقي', isPremium: false, colors: ['#18181B', '#3F3F46', '#52525B'], preview: '' },
  { id: 'luxury', name: 'Luxury Gold', nameAr: 'ذهبي فاخر', slug: 'luxury', category: 'premium', categoryAr: 'فاخر', description: 'Luxury gold premium design', descriptionAr: 'تصميم ذهبي فاخر', isPremium: true, colors: ['#D97706', '#B45309', '#92400E'], preview: '' },
  { id: 'minimal', name: 'Minimal White', nameAr: 'أبيض بسيط', slug: 'minimal', category: 'minimal', categoryAr: 'بسيط', description: 'Minimal clean white design', descriptionAr: 'تصميم أبيض بسيط ونظيف', isPremium: false, colors: ['#374151', '#4B5563', '#6B7280'], preview: '' },
  { id: 'academic', name: 'Academic Pro', nameAr: 'أكاديمي برو', slug: 'academic', category: 'academic', categoryAr: 'أكاديمي', description: 'Academic CV template', descriptionAr: 'قالب أكاديمي للباحثين', isPremium: false, colors: ['#7C2D12', '#9A3412', '#C2410C'], preview: '' },
  { id: 'premiumdark', name: 'Premium Dark', nameAr: 'داكن فاخر', slug: 'premiumdark', category: 'premium', categoryAr: 'فاخر', description: 'Premium dark mode design', descriptionAr: 'تصميم داكن فاخر', isPremium: true, colors: ['#F59E0B', '#D97706', '#B45309'], preview: '' },
  { id: 'startup', name: 'Startup Founder', nameAr: 'مؤسس شركة', slug: 'startup', category: 'industry', categoryAr: 'صناعي', description: 'For startup founders', descriptionAr: 'لمؤسسي الشركات الناشئة', isPremium: false, colors: ['#059669', '#047857', '#065F46'], preview: '' },
  { id: 'consultant', name: 'Business Consultant', nameAr: 'مستشار أعمال', slug: 'consultant', category: 'professional', categoryAr: 'احترافي', description: 'For business consultants', descriptionAr: 'للمستشارين في الأعمال', isPremium: false, colors: ['#1E3A5F', '#2C5282', '#2B6CB0'], preview: '' },
  { id: 'software', name: 'Software Engineer', nameAr: 'مهندس برمجيات', slug: 'software', category: 'industry', categoryAr: 'صناعي', description: 'For software engineers', descriptionAr: 'لمهندسي البرمجيات', isPremium: false, colors: ['#2563EB', '#3B82F6', '#60A5FA'], preview: '' },
  { id: 'nurse', name: 'Nurse Professional', nameAr: 'تمريض احترافي', slug: 'nurse', category: 'industry', categoryAr: 'صناعي', description: 'For nursing professionals', descriptionAr: 'للمهنيين في التمريض', isPremium: false, colors: ['#DB2777', '#BE185D', '#9D174D'], preview: '' },
  { id: 'healthcare', name: 'Healthcare Specialist', nameAr: 'أخصائي صحي', slug: 'healthcare', category: 'industry', categoryAr: 'صناعي', description: 'For healthcare specialists', descriptionAr: 'للأخصائيين الصحيين', isPremium: false, colors: ['#0D9488', '#14B8A6', '#2DD4BF'], preview: '' },
  { id: 'marketing', name: 'Marketing Expert', nameAr: 'خبير تسويق', slug: 'marketing', category: 'industry', categoryAr: 'صناعي', description: 'For marketing experts', descriptionAr: 'لخبراء التسويق', isPremium: false, colors: ['#EA580C', '#C2410C', '#9A3412'], preview: '' },
  { id: 'finance', name: 'Finance Expert', nameAr: 'خبير مالي', slug: 'finance', category: 'professional', categoryAr: 'احترافي', description: 'For finance professionals', descriptionAr: 'للمهنيين الماليين', isPremium: false, colors: ['#1E293B', '#334155', '#475569'], preview: '' },
  { id: 'manager', name: 'Executive Manager', nameAr: 'مدير تنفيذي', slug: 'manager', category: 'professional', categoryAr: 'احترافي', description: 'For executive managers', descriptionAr: 'للمديرين التنفيذيين', isPremium: false, colors: ['#1E3A5F', '#2563EB', '#3B82F6'], preview: '' },
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
