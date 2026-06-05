'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, useCurrentResume } from '@/lib/store';
import { t } from '@/lib/i18n';
import { generateId } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Plus, Trash2, Link as LinkIcon, User, Mail, Phone, MapPin, Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PersonalInfoForm() {
  const language = useAppStore((s) => s.language);
  const resume = useCurrentResume();
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRtl = language === 'ar';

  if (!resume) return null;

  const { personalInfo } = resume.data;

  const updateField = (field: string, value: string) => {
    updateCurrentResumeData({
      personalInfo: { ...personalInfo, [field]: value },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateField('photo', ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addLink = () => {
    updateCurrentResumeData({
      personalInfo: {
        ...personalInfo,
        otherLinks: [...personalInfo.otherLinks, { label: '', url: '' }],
      },
    });
  };

  const removeLink = (index: number) => {
    const links = [...personalInfo.otherLinks];
    links.splice(index, 1);
    updateCurrentResumeData({
      personalInfo: { ...personalInfo, otherLinks: links },
    });
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const links = [...personalInfo.otherLinks];
    links[index] = { ...links[index], [field]: value };
    updateCurrentResumeData({
      personalInfo: { ...personalInfo, otherLinks: links },
    });
  };

  const inputClass = "w-full rounded-xl border border-border/60 bg-white/50 dark:bg-white/5 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="space-y-5">
      {/* Photo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5 shadow-premium"
      >
        <div className="flex items-start gap-4">
          <div
            className="relative group cursor-pointer shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-24 h-24 rounded-2xl bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-colors">
              {personalInfo.photo ? (
                <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground/50" />
              )}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <div className="flex-1 space-y-2 pt-1">
            <p className="text-xs text-muted-foreground">
              {language === 'ar'
                ? 'انقر لتحميل صورة شخصية (حد أقصى 2 ميجا)'
                : 'Click to upload photo (2MB max)'}
            </p>
            {personalInfo.photo && (
              <Button variant="outline" size="sm" onClick={() => updateField('photo', '')} className="rounded-xl text-destructive hover:text-destructive">
                <Trash2 className="h-3 w-3 me-1" />
                {language === 'ar' ? 'إزالة الصورة' : 'Remove Photo'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-5 shadow-premium"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <User className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-sm">
            {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label className="text-xs font-medium mb-1.5 block">{t('personal.fullName', language)}</Label>
            <Input
              value={personalInfo.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              placeholder={language === 'ar' ? 'أحمد محمد' : 'John Doe'}
              dir={isRtl ? 'rtl' : 'ltr'}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs font-medium mb-1.5 block">{t('personal.jobTitle', language)}</Label>
            <Input
              value={personalInfo.jobTitle}
              onChange={(e) => updateField('jobTitle', e.target.value)}
              placeholder={language === 'ar' ? 'مهندس برمجيات' : 'Software Engineer'}
              dir={isRtl ? 'rtl' : 'ltr'}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs font-medium mb-1.5 block">{t('personal.summary', language)}</Label>
            <Textarea
              value={personalInfo.summary}
              onChange={(e) => updateField('summary', e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'نبذة احترافية مختصرة عن خبراتك ومهاراتك...'
                  : 'A brief professional summary of your experience and skills...'
              }
              dir={isRtl ? 'rtl' : 'ltr'}
              className="rounded-xl border border-border/60 bg-white/50 dark:bg-white/5 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-24"
            />
          </div>
        </div>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 shadow-premium"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <Phone className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-sm">
            {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium mb-1.5 block">{t('personal.email', language)}</Label>
            <Input
              type="email"
              value={personalInfo.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="email@example.com"
              dir="ltr"
              className={inputClass}
            />
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">{t('personal.phone', language)}</Label>
            <Input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+966 5x xxx xxxx"
              dir="ltr"
              className={inputClass}
            />
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">{t('personal.country', language)}</Label>
            <Input
              value={personalInfo.country}
              onChange={(e) => updateField('country', e.target.value)}
              placeholder={language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
              dir={isRtl ? 'rtl' : 'ltr'}
              className={inputClass}
            />
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">{t('personal.city', language)}</Label>
            <Input
              value={personalInfo.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder={language === 'ar' ? 'الرياض' : 'Riyadh'}
              dir={isRtl ? 'rtl' : 'ltr'}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs font-medium mb-1.5 block">{t('personal.address', language)}</Label>
            <Input
              value={personalInfo.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder={language === 'ar' ? 'شارع الملك فهد' : '123 Main Street'}
              dir={isRtl ? 'rtl' : 'ltr'}
              className={inputClass}
            />
          </div>
        </div>
      </motion.div>

      {/* Online Presence */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-5 shadow-premium"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white">
            <Globe2 className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-sm">
            {language === 'ar' ? 'التواجد الإلكتروني' : 'Online Presence'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium mb-1.5 block">{t('personal.website', language)}</Label>
            <Input
              value={personalInfo.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="https://example.com"
              dir="ltr"
              className={inputClass}
            />
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">{t('personal.linkedin', language)}</Label>
            <Input
              value={personalInfo.linkedin}
              onChange={(e) => updateField('linkedin', e.target.value)}
              placeholder="linkedin.com/in/username"
              dir="ltr"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs font-medium mb-1.5 block">{t('personal.github', language)}</Label>
            <Input
              value={personalInfo.github}
              onChange={(e) => updateField('github', e.target.value)}
              placeholder="github.com/username"
              dir="ltr"
              className={inputClass}
            />
          </div>
        </div>
      </motion.div>

      {/* Other Links */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5 shadow-premium"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <LinkIcon className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">{t('personal.otherLinks', language)}</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addLink}
            className="flex items-center gap-1 gradient-brand text-white rounded-xl px-3 py-1.5 text-xs font-medium"
          >
            <Plus className="h-3 w-3" />
            {t('personal.addLink', language)}
          </motion.button>
        </div>
        <div className="space-y-3">
          {personalInfo.otherLinks.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              {language === 'ar' ? 'لا توجد روابط إضافية' : 'No additional links'}
            </p>
          )}
          {personalInfo.otherLinks.map((link, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1">
                <Label className="text-xs">{t('personal.linkLabel', language)}</Label>
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(index, 'label', e.target.value)}
                  placeholder={language === 'ar' ? 'التسمية' : 'Label'}
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="mt-1 h-9 text-sm rounded-xl"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">{t('personal.linkUrl', language)}</Label>
                <Input
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                  className="mt-1 h-9 text-sm rounded-xl"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-destructive hover:text-destructive rounded-xl"
                onClick={() => removeLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
