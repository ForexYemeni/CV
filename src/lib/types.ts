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

/** Returns sample resume data for demo/preview purposes */
export function getSampleResumeData(lang: Language = 'ar'): ResumeData {
  const isAr = lang === 'ar';
  return {
    personalInfo: {
      photo: '',
      fullName: isAr ? 'أحمد محمد الخالدي' : 'Alex Johnson',
      jobTitle: isAr ? 'مهندس برمجيات أول' : 'Senior Software Engineer',
      summary: isAr
        ? 'مهندس برمجيات بخبرة تزيد عن 8 سنوات في تطوير تطبيقات الويب والموبايل. متخصص في تقنيات React و Node.js مع سجل حافل في قيادة فرق تطوير وتسليم مشاريع عالية الجودة. شغوف بالابتكار والتقنيات الحديثة.'
        : 'Experienced software engineer with 8+ years in web and mobile application development. Specialized in React and Node.js with a proven track record of leading development teams and delivering high-quality projects. Passionate about innovation and cutting-edge technologies.',
      email: isAr ? 'ahmed@example.com' : 'alex@example.com',
      phone: '+966 55 123 4567',
      country: isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia',
      city: isAr ? 'الرياض' : 'Riyadh',
      address: isAr ? 'حي العليا، شارع الملك فهد' : 'Olaya District, King Fahd Road',
      website: 'https://ahmed-dev.com',
      linkedin: 'linkedin.com/in/ahmed-khalidi',
      github: 'github.com/ahmed-khalidi',
      otherLinks: [],
    },
    experience: [
      {
        id: generateId(),
        company: isAr ? 'شركة تقنية المستقبل' : 'FutureTech Solutions',
        jobTitle: isAr ? 'مهندس برمجيات أول' : 'Senior Software Engineer',
        startDate: '2021-01',
        endDate: '',
        current: true,
        description: isAr
          ? 'قيادة فريق تطوير مكون من 6 مطورين لبناء منصة SaaS\nتصميم وتنفيذ معمارية Microservices باستخدام Node.js و Docker\nتحسين أداء التطبيق بنسبة 40% من خلال تحسين قواعد البيانات\nتطوير واجهات برمجة تطبيقات RESTful و GraphQL'
          : 'Led a team of 6 developers to build a SaaS platform\nDesigned and implemented Microservices architecture using Node.js and Docker\nImproved application performance by 40% through database optimization\nDeveloped RESTful APIs and GraphQL endpoints',
        order: 0,
      },
      {
        id: generateId(),
        company: isAr ? 'شركة الابتكار الرقمي' : 'Digital Innovation Co.',
        jobTitle: isAr ? 'مطور واجهات أمامية' : 'Frontend Developer',
        startDate: '2018-06',
        endDate: '2020-12',
        current: false,
        description: isAr
          ? 'تطوير تطبيقات ويب تفاعلية باستخدام React و TypeScript\nبناء مكتبة مكونات UI قابلة لإعادة الاستخدام\nالتعاون مع فريق التصميم لتنفيذ تصاميم متجاوبة\nتطبيق أفضل ممارسات اختبار الكود'
          : 'Developed interactive web applications using React and TypeScript\nBuilt reusable UI component library\nCollaborated with design team to implement responsive designs\nImplemented code testing best practices',
        order: 1,
      },
    ],
    education: [
      {
        id: generateId(),
        institution: isAr ? 'جامعة الملك سعود' : 'King Saud University',
        major: isAr ? 'هندسة البرمجيات' : 'Software Engineering',
        degree: 'bachelor',
        startDate: '2014',
        endDate: '2018',
        description: isAr ? 'تخرج بمرتبة الشرف الأولى، معدل 4.8/5.0' : 'Graduated with First Class Honors, GPA 4.8/5.0',
        order: 0,
      },
    ],
    skills: [
      { id: generateId(), name: 'React / Next.js', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'TypeScript', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Node.js', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Python', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Docker / K8s', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'PostgreSQL', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'MongoDB', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'AWS', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: isAr ? 'قيادة الفرق' : 'Team Leadership', level: 'advanced', category: 'soft' },
      { id: generateId(), name: isAr ? 'التواصل الفعال' : 'Communication', level: 'expert', category: 'soft' },
    ],
    certifications: [
      { id: generateId(), name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', date: '2022', description: '' },
      { id: generateId(), name: 'Google Cloud Professional', issuer: 'Google', date: '2021', description: '' },
    ],
    languages: [
      { id: generateId(), name: isAr ? 'العربية' : 'Arabic', level: 'native' },
      { id: generateId(), name: isAr ? 'الإنجليزية' : 'English', level: 'fluent' },
    ],
    projects: [
      {
        id: generateId(),
        name: isAr ? 'منصة إدارة المشاريع' : 'Project Management Platform',
        description: isAr
          ? 'منصة SaaS لإدارة المشاريع مع لوحات Kanban وتتبع الوقت والتقارير'
          : 'SaaS platform for project management with Kanban boards, time tracking, and reports',
        url: 'https://github.com/example/project-mgmt',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      },
      {
        id: generateId(),
        name: isAr ? 'تطبيق التوظيف الذكي' : 'Smart Recruitment App',
        description: isAr
          ? 'تطبيق توظيف مدعوم بالذكاء الاصطناعي لمطابقة المرشحين مع الوظائف'
          : 'AI-powered recruitment app for matching candidates with job openings',
        url: 'https://github.com/example/smart-recruit',
        technologies: ['Next.js', 'Python', 'TensorFlow', 'MongoDB'],
      },
    ],
    sections: DEFAULT_SECTIONS.map(s => ({ ...s })),
  };
}
