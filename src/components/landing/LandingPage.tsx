'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { TEMPLATES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Layout,
  Sparkles,
  Download,
  Eye,
  Shield,
  Globe,
  Star,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  FileText,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MiniTemplatePreview } from '@/components/resume/MiniTemplatePreview';

// ─── Animated Counter ──────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Feature Card ──────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, index }: {
  icon: typeof Layout; title: string; description: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-6 shadow-premium hover:shadow-glow transition-all duration-300 group"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-white mb-4 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ─── FAQ Item ──────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="glass rounded-xl overflow-hidden shadow-premium"
      layout
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-start"
      >
        <span className="font-medium">{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Testimonial Card ──────────────────────────────────────
function TestimonialCard({ quote, name, role, index }: {
  quote: string; name: string; role: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="glass rounded-2xl p-6 shadow-premium"
    >
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-sm leading-relaxed mb-5">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-brand text-white font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Floating Dots Background ──────────────────────────────────────
function FloatingDots() {
  const [mounted, setMounted] = useState(false);
  const dots = useMemo(() =>
    Array.from({ length: 30 }, () => ({
      width: Math.random() * 6 + 2,
      height: Math.random() * 6 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
    })),
  []);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/10"
          style={{ width: dot.width, height: dot.height, left: dot.left, top: dot.top }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: dot.duration, repeat: Infinity, delay: dot.delay }}
        />
      ))}
    </div>
  );
}

// ─── Resume Mockup with real template ──────────────────────────────────────
function ResumeMockup({ language }: { language: 'ar' | 'en' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative hidden lg:block"
    >
      <div className="animate-float">
        <div className="rounded-xl shadow-2xl overflow-hidden border border-border/30">
          <MiniTemplatePreview
            templateId="modern"
            primaryColor="#2563EB"
            language={language}
            width={280}
            height={396}
          />
        </div>
      </div>
      {/* Glow effect behind mockup */}
      <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-primary/20 via-cyan-400/10 to-purple-500/20 rounded-2xl blur-2xl" />
    </motion.div>
  );
}

// ─── Main Landing Page ──────────────────────────────────────
export function LandingPage() {
  const language = useAppStore((s) => s.language);
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const createNewResume = useAppStore((s) => s.createNewResume);
  const isRtl = language === 'ar';

  const handleGetStarted = () => {
    createNewResume();
  };

  const features = [
    { icon: Layout, title: t('landing.feature1', language), description: t('landing.feature1Desc', language) },
    { icon: Sparkles, title: t('landing.feature2', language), description: t('landing.feature2Desc', language) },
    { icon: Download, title: t('landing.feature3', language), description: t('landing.feature3Desc', language) },
    { icon: Eye, title: t('landing.feature4', language), description: t('landing.feature4Desc', language) },
    { icon: Shield, title: t('landing.feature5', language), description: t('landing.feature5Desc', language) },
    { icon: Globe, title: t('landing.feature6', language), description: t('landing.feature6Desc', language) },
  ];

  const faqs = [
    { q: t('landing.faq1', language), a: t('landing.faq1Answer', language) },
    { q: t('landing.faq2', language), a: t('landing.faq2Answer', language) },
    { q: t('landing.faq3', language), a: t('landing.faq3Answer', language) },
    { q: t('landing.faq4', language), a: t('landing.faq4Answer', language) },
    { q: t('landing.faq5', language), a: t('landing.faq5Answer', language) },
  ];

  const testimonials = [
    { quote: t('landing.testimonial1', language), name: t('landing.testimonial1Name', language), role: t('landing.testimonial1Role', language) },
    { quote: t('landing.testimonial2', language), name: t('landing.testimonial2Name', language), role: t('landing.testimonial2Role', language) },
    { quote: t('landing.testimonial3', language), name: t('landing.testimonial3Name', language), role: t('landing.testimonial3Role', language) },
  ];

  return (
    <div className={cn('min-h-screen', isRtl && 'rtl')} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <FloatingDots />
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 via-cyan-400/5 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium gradient-brand text-white mb-6">
                  <Sparkles className="h-3 w-3" />
                  {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI Powered'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
              >
                <span className="text-gradient">{t('landing.heroTitle', language)}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
              >
                {t('landing.heroSubtitle', language)}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={cn(
                  'flex flex-col sm:flex-row gap-4 justify-center lg:justify-start',
                  isRtl && 'sm:flex-row-reverse'
                )}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGetStarted}
                  className="gradient-animated text-white rounded-xl px-8 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  {t('landing.ctaStart', language)}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentView('templates')}
                  className="glass rounded-xl px-8 py-4 font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                >
                  <Play className="h-5 w-5" />
                  {t('landing.ctaDemo', language)}
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={cn(
                  'flex flex-wrap gap-8 mt-12 justify-center lg:justify-start',
                  isRtl && 'flex-row-reverse'
                )}
              >
                {[
                  { value: 50000, suffix: '+', label: t('landing.statUsers', language) },
                  { value: 200000, suffix: '+', label: t('landing.statResumes', language) },
                  { value: 85000, suffix: '+', label: t('landing.statJobs', language) },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-3xl font-extrabold text-gradient">
                      +<AnimatedCounter target={stat.value} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <ResumeMockup language={language} />
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="text-gradient">{t('landing.features', language)}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('landing.featuresSubtitle', language)}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Templates Section ─── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="text-gradient">{t('landing.templatesTitle', language)}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('landing.templatesSubtitle', language)}
            </p>
          </motion.div>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory custom-scrollbar -mx-4 px-4">
            {TEMPLATES.slice(0, 8).map((tmpl, i) => (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="snap-start shrink-0 w-52 group cursor-pointer"
                onClick={() => {
                  createNewResume(undefined, tmpl.id);
                  // The store's createNewResume sets currentView to 'editor'
                }}
              >
                <div className="rounded-xl overflow-hidden shadow-premium hover:shadow-glow transition-shadow border border-border/30">
                  <div
                    className="aspect-[3/4] relative overflow-hidden bg-white"
                  >
                    <MiniTemplatePreview
                      templateId={tmpl.id}
                      primaryColor={tmpl.colors[0]}
                      language={language}
                      width={208}
                      height={278}
                    />
                    {tmpl.isPremium && (
                      <div className="absolute top-2 start-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-yellow-400/90 text-yellow-900">
                        PRO
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-xs font-medium text-primary">{t('templates.select', language)}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">
                      {language === 'ar' ? tmpl.nameAr : tmpl.name}
                    </p>
                    <div className="flex gap-1 mt-1.5">
                      {tmpl.colors.slice(0, 3).map((color) => (
                        <div key={color} className="w-3 h-3 rounded-full border border-border/30" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentView('templates')}
              className="gradient-brand text-white rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              {t('landing.viewAllTemplates', language)}
            </motion.button>
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ─── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="text-gradient">{t('landing.testimonials', language)}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={i}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="text-gradient">{t('landing.faq', language)}</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-premium opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              {language === 'ar'
                ? 'ابدأ في إنشاء سيرتك الذاتية الآن'
                : 'Start Creating Your Resume Now'}
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              {language === 'ar'
                ? 'انضم لآلاف المستخدمين الذين حصلوا على وظائفهم أحلامهم'
                : 'Join thousands of users who landed their dream jobs'}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGetStarted}
              className="bg-white text-primary rounded-xl px-10 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              {t('landing.ctaStart', language)}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/30 pt-12 pb-8">
        <div className="h-1 w-full gradient-brand mb-8" style={{ marginTop: '-49px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className={cn('flex items-center gap-2 mb-4', isRtl && 'flex-row-reverse')}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl">{t('app.title', language)}</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-sm">
                {t('landing.footerDesc', language)}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">{t('landing.footerProduct', language)}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => setCurrentView('templates')} className="hover:text-primary transition-colors">{t('nav.templates', language)}</button></li>
                <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-primary transition-colors">{t('nav.dashboard', language)}</button></li>
                <li><button onClick={() => setCurrentView('settings')} className="hover:text-primary transition-colors">{t('nav.settings', language)}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">{t('landing.footerSupport', language)}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="hover:text-primary transition-colors cursor-pointer">{t('landing.faq', language)}</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t('app.title', language)}. {t('landing.footerRights', language)}.
          </div>
        </div>
      </footer>
    </div>
  );
}
