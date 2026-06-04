import { Language } from './types';

type TranslationKey = string;
type Translations = Record<TranslationKey, string>;

const ar: Translations = {
  // App
  'app.title': 'منشئ السيرة الذاتية',
  'app.subtitle': 'أنشئ سيرتك الذاتية الاحترافية خلال دقائق',
  'app.createFirst': 'أنشئ سيرتك الذاتية الأولى',

  // Navigation
  'nav.dashboard': 'لوحة التحكم',
  'nav.editor': 'المحرر',
  'nav.templates': 'القوالب',
  'nav.settings': 'الإعدادات',
  'nav.admin': 'الإدارة',

  // Dashboard
  'dashboard.title': 'سيرتي الذاتية',
  'dashboard.new': 'سيرة ذاتية جديدة',
  'dashboard.empty': 'لم تنشئ أي سيرة ذاتية بعد',
  'dashboard.emptyDesc': 'ابدأ بإنشاء سيرتك الذاتية الأولى الآن',
  'dashboard.edit': 'تعديل',
  'dashboard.duplicate': 'نسخ',
  'dashboard.delete': 'حذف',
  'dashboard.download': 'تحميل',
  'dashboard.lastUpdated': 'آخر تحديث',
  'dashboard.search': 'ابحث في السير الذاتية...',

  // Personal Info
  'section.personalInfo': 'المعلومات الشخصية',
  'personal.photo': 'الصورة الشخصية',
  'personal.fullName': 'الاسم الكامل',
  'personal.jobTitle': 'المسمى الوظيفي',
  'personal.summary': 'نبذة احترافية',
  'personal.email': 'البريد الإلكتروني',
  'personal.phone': 'رقم الهاتف',
  'personal.country': 'الدولة',
  'personal.city': 'المدينة',
  'personal.address': 'العنوان',
  'personal.website': 'الموقع الإلكتروني',
  'personal.linkedin': 'LinkedIn',
  'personal.github': 'GitHub',
  'personal.otherLinks': 'وسائل التواصل الأخرى',
  'personal.addLink': 'إضافة رابط',
  'personal.removeLink': 'حذف الرابط',
  'personal.linkLabel': 'التسمية',
  'personal.linkUrl': 'الرابط',

  // Experience
  'section.experience': 'الخبرات العملية',
  'experience.company': 'اسم الشركة',
  'experience.jobTitle': 'المسمى الوظيفي',
  'experience.startDate': 'تاريخ البداية',
  'experience.endDate': 'تاريخ النهاية',
  'experience.current': 'ما زلت أعمل هنا',
  'experience.description': 'وصف المهام والإنجازات',
  'experience.add': 'إضافة خبرة',
  'experience.remove': 'حذف الخبرة',
  'experience.present': 'حتى الآن',

  // Education
  'section.education': 'المؤهلات التعليمية',
  'education.institution': 'اسم المؤسسة التعليمية',
  'education.major': 'التخصص',
  'education.degree': 'الدرجة العلمية',
  'education.startDate': 'سنة البداية',
  'education.endDate': 'سنة النهاية',
  'education.description': 'الوصف',
  'education.add': 'إضافة مؤهل',
  'education.remove': 'حذف المؤهل',

  // Skills
  'section.skills': 'المهارات',
  'skills.name': 'اسم المهارة',
  'skills.level': 'المستوى',
  'skills.category': 'التصنيف',
  'skills.technical': 'مهارات تقنية',
  'skills.soft': 'مهارات شخصية',
  'skills.add': 'إضافة مهارة',
  'skills.remove': 'حذف المهارة',

  // Certifications
  'section.certifications': 'الشهادات والدورات',
  'cert.name': 'اسم الشهادة',
  'cert.issuer': 'الجهة المانحة',
  'cert.date': 'تاريخ الإصدار',
  'cert.description': 'الوصف',
  'cert.add': 'إضافة شهادة',
  'cert.remove': 'حذف الشهادة',

  // Languages
  'section.languages': 'اللغات',
  'lang.name': 'اللغة',
  'lang.level': 'المستوى',
  'lang.add': 'إضافة لغة',
  'lang.remove': 'حذف اللغة',

  // Projects
  'section.projects': 'المشاريع والإنجازات',
  'project.name': 'اسم المشروع',
  'project.description': 'الوصف',
  'project.url': 'رابط المشروع',
  'project.technologies': 'التقنيات المستخدمة',
  'project.add': 'إضافة مشروع',
  'project.remove': 'حذف المشروع',

  // Templates
  'templates.title': 'القوالب الاحترافية',
  'templates.select': 'اختيار القالب',
  'templates.preview': 'معاينة',
  'templates.category': 'التصنيف',
  'templates.color': 'اللون',
  'templates.font': 'الخط',
  'templates.fontSize': 'حجم الخط',
  'templates.premium': 'فاخر',
  'templates.customize': 'تخصيص',

  // Preview
  'preview.title': 'المعاينة المباشرة',
  'preview.zoomIn': 'تكبير',
  'preview.zoomOut': 'تصغير',
  'preview.fullscreen': 'ملء الشاشة',
  'preview.exitFullscreen': 'خروج من ملء الشاشة',
  'preview.toggle': 'تبديل المعاينة',

  // Download
  'download.pdf': 'تحميل PDF',
  'download.png': 'تحميل PNG',
  'download.jpg': 'تحميل JPG',
  'download.a4': 'A4',
  'download.letter': 'Letter',
  'download.generating': 'جارٍ التوليد...',

  // AI
  'ai.title': 'مساعد الذكاء الاصطناعي',
  'ai.suggestSummary': 'اقتراح ملخص احترافي',
  'ai.improveDescription': 'تحسين الوصف الوظيفي',
  'ai.suggestSkills': 'اقتراح المهارات المناسبة',
  'ai.improveExperience': 'تحسين صياغة الخبرات',
  'ai.atsKeywords': 'اقتراح كلمات مفتاحية ATS',
  'ai.review': 'فحص السيرة الذاتية',
  'ai.loading': 'جارٍ التحليل...',
  'ai.result': 'النتيجة',

  // Auth
  'auth.login': 'تسجيل الدخول',
  'auth.register': 'إنشاء حساب',
  'auth.forgotPassword': 'استعادة كلمة المرور',
  'auth.email': 'البريد الإلكتروني',
  'auth.password': 'كلمة المرور',
  'auth.confirmPassword': 'تأكيد كلمة المرور',
  'auth.name': 'الاسم',
  'auth.logout': 'تسجيل الخروج',

  // Settings
  'settings.title': 'الإعدادات',
  'settings.language': 'اللغة',
  'settings.theme': 'المظهر',
  'settings.dark': 'داكن',
  'settings.light': 'فاتح',
  'settings.system': 'تلقائي',
  'settings.account': 'الحساب',
  'settings.export': 'تصدير البيانات',
  'settings.import': 'استيراد البيانات',

  // Admin
  'admin.title': 'لوحة الإدارة',
  'admin.users': 'المستخدمون',
  'admin.templates': 'القوالب',
  'admin.fonts': 'الخطوط',
  'admin.ads': 'الإعلانات',
  'admin.stats': 'الإحصائيات',
  'admin.pdfDownloads': 'عمليات تحميل PDF',

  // Common
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.delete': 'حذف',
  'common.edit': 'تعديل',
  'common.add': 'إضافة',
  'common.close': 'إغلاق',
  'common.loading': 'جارٍ التحميل...',
  'common.noData': 'لا توجد بيانات',
  'common.search': 'بحث',
  'common.confirm': 'تأكيد',
  'common.back': 'رجوع',
  'common.next': 'التالي',
  'common.previous': 'السابق',
  'common.or': 'أو',
};

const en: Translations = {
  'app.title': 'Resume Builder',
  'app.subtitle': 'Create your professional resume in minutes',
  'app.createFirst': 'Create your first resume',

  'nav.dashboard': 'Dashboard',
  'nav.editor': 'Editor',
  'nav.templates': 'Templates',
  'nav.settings': 'Settings',
  'nav.admin': 'Admin',

  'dashboard.title': 'My Resumes',
  'dashboard.new': 'New Resume',
  'dashboard.empty': 'No resumes yet',
  'dashboard.emptyDesc': 'Start by creating your first resume',
  'dashboard.edit': 'Edit',
  'dashboard.duplicate': 'Duplicate',
  'dashboard.delete': 'Delete',
  'dashboard.download': 'Download',
  'dashboard.lastUpdated': 'Last updated',
  'dashboard.search': 'Search resumes...',

  'section.personalInfo': 'Personal Information',
  'personal.photo': 'Photo',
  'personal.fullName': 'Full Name',
  'personal.jobTitle': 'Job Title',
  'personal.summary': 'Professional Summary',
  'personal.email': 'Email',
  'personal.phone': 'Phone',
  'personal.country': 'Country',
  'personal.city': 'City',
  'personal.address': 'Address',
  'personal.website': 'Website',
  'personal.linkedin': 'LinkedIn',
  'personal.github': 'GitHub',
  'personal.otherLinks': 'Other Links',
  'personal.addLink': 'Add Link',
  'personal.removeLink': 'Remove Link',
  'personal.linkLabel': 'Label',
  'personal.linkUrl': 'URL',

  'section.experience': 'Work Experience',
  'experience.company': 'Company Name',
  'experience.jobTitle': 'Job Title',
  'experience.startDate': 'Start Date',
  'experience.endDate': 'End Date',
  'experience.current': 'Still working here',
  'experience.description': 'Tasks and Achievements',
  'experience.add': 'Add Experience',
  'experience.remove': 'Remove Experience',
  'experience.present': 'Present',

  'section.education': 'Education',
  'education.institution': 'Institution',
  'education.major': 'Major',
  'education.degree': 'Degree',
  'education.startDate': 'Start Year',
  'education.endDate': 'End Year',
  'education.description': 'Description',
  'education.add': 'Add Education',
  'education.remove': 'Remove Education',

  'section.skills': 'Skills',
  'skills.name': 'Skill Name',
  'skills.level': 'Level',
  'skills.category': 'Category',
  'skills.technical': 'Technical Skills',
  'skills.soft': 'Soft Skills',
  'skills.add': 'Add Skill',
  'skills.remove': 'Remove Skill',

  'section.certifications': 'Certifications & Courses',
  'cert.name': 'Certification Name',
  'cert.issuer': 'Issuing Organization',
  'cert.date': 'Issue Date',
  'cert.description': 'Description',
  'cert.add': 'Add Certification',
  'cert.remove': 'Remove Certification',

  'section.languages': 'Languages',
  'lang.name': 'Language',
  'lang.level': 'Level',
  'lang.add': 'Add Language',
  'lang.remove': 'Remove Language',

  'section.projects': 'Projects & Achievements',
  'project.name': 'Project Name',
  'project.description': 'Description',
  'project.url': 'Project URL',
  'project.technologies': 'Technologies Used',
  'project.add': 'Add Project',
  'project.remove': 'Remove Project',

  'templates.title': 'Professional Templates',
  'templates.select': 'Select Template',
  'templates.preview': 'Preview',
  'templates.category': 'Category',
  'templates.color': 'Color',
  'templates.font': 'Font',
  'templates.fontSize': 'Font Size',
  'templates.premium': 'Premium',
  'templates.customize': 'Customize',

  'preview.title': 'Live Preview',
  'preview.zoomIn': 'Zoom In',
  'preview.zoomOut': 'Zoom Out',
  'preview.fullscreen': 'Fullscreen',
  'preview.exitFullscreen': 'Exit Fullscreen',
  'preview.toggle': 'Toggle Preview',

  'download.pdf': 'Download PDF',
  'download.png': 'Download PNG',
  'download.jpg': 'Download JPG',
  'download.a4': 'A4',
  'download.letter': 'Letter',
  'download.generating': 'Generating...',

  'ai.title': 'AI Assistant',
  'ai.suggestSummary': 'Suggest Professional Summary',
  'ai.improveDescription': 'Improve Job Description',
  'ai.suggestSkills': 'Suggest Relevant Skills',
  'ai.improveExperience': 'Improve Experience Wording',
  'ai.atsKeywords': 'Suggest ATS Keywords',
  'ai.review': 'Resume Review',
  'ai.loading': 'Analyzing...',
  'ai.result': 'Result',

  'auth.login': 'Sign In',
  'auth.register': 'Sign Up',
  'auth.forgotPassword': 'Forgot Password',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.confirmPassword': 'Confirm Password',
  'auth.name': 'Name',
  'auth.logout': 'Sign Out',

  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.theme': 'Theme',
  'settings.dark': 'Dark',
  'settings.light': 'Light',
  'settings.system': 'System',
  'settings.account': 'Account',
  'settings.export': 'Export Data',
  'settings.import': 'Import Data',

  'admin.title': 'Admin Panel',
  'admin.users': 'Users',
  'admin.templates': 'Templates',
  'admin.fonts': 'Fonts',
  'admin.ads': 'Ads',
  'admin.stats': 'Statistics',
  'admin.pdfDownloads': 'PDF Downloads',

  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.add': 'Add',
  'common.close': 'Close',
  'common.loading': 'Loading...',
  'common.noData': 'No data',
  'common.search': 'Search',
  'common.confirm': 'Confirm',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.or': 'or',
};

const translations: Record<Language, Translations> = { ar, en };

export function t(key: string, lang: Language): string {
  return translations[lang]?.[key] || translations['en']?.[key] || key;
}

export function useTranslation() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { language } = require('./store').useAppStore.getState();
  return {
    t: (key: string) => t(key, language),
    language,
    dir: language === 'ar' ? 'rtl' : 'ltr',
  };
}
