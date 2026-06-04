'use client';

import { useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { generateId } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Camera, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PersonalInfoForm() {
  const language = useAppStore((s) => s.language);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);

  const resume = getCurrentResume();
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
    if (file.size > 2 * 1024 * 1024) return; // 2MB max
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

  return (
    <div className="space-y-6">
      {/* Photo */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden">
                {personalInfo.photo ? (
                  <img
                    src={personalInfo.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground/50" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
            <div className="flex-1 space-y-3 pt-1">
              <p className="text-xs text-muted-foreground">
                {language === 'ar'
                  ? 'انقر لتحميل صورة شخصية (حد أقصى 2 ميجا)'
                  : 'Click to upload photo (2MB max)'}
              </p>
              {personalInfo.photo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateField('photo', '')}
                >
                  <Trash2 className="h-3 w-3 me-1" />
                  {language === 'ar' ? 'إزالة الصورة' : 'Remove Photo'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">{t('personal.fullName', language)}</Label>
              <Input
                id="fullName"
                value={personalInfo.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder={language === 'ar' ? 'أحمد محمد' : 'John Doe'}
                dir={isRtl ? 'rtl' : 'ltr'}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="jobTitle">{t('personal.jobTitle', language)}</Label>
              <Input
                id="jobTitle"
                value={personalInfo.jobTitle}
                onChange={(e) => updateField('jobTitle', e.target.value)}
                placeholder={language === 'ar' ? 'مهندس برمجيات' : 'Software Engineer'}
                dir={isRtl ? 'rtl' : 'ltr'}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="summary">{t('personal.summary', language)}</Label>
              <Textarea
                id="summary"
                value={personalInfo.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'نبذة احترافية مختصرة عن خبراتك ومهاراتك...'
                    : 'A brief professional summary of your experience and skills...'
                }
                dir={isRtl ? 'rtl' : 'ltr'}
                className="mt-1.5 min-h-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">{t('personal.email', language)}</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="email@example.com"
                dir="ltr"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="phone">{t('personal.phone', language)}</Label>
              <Input
                id="phone"
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+966 5x xxx xxxx"
                dir="ltr"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="country">{t('personal.country', language)}</Label>
              <Input
                id="country"
                value={personalInfo.country}
                onChange={(e) => updateField('country', e.target.value)}
                placeholder={language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
                dir={isRtl ? 'rtl' : 'ltr'}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="city">{t('personal.city', language)}</Label>
              <Input
                id="city"
                value={personalInfo.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder={language === 'ar' ? 'الرياض' : 'Riyadh'}
                dir={isRtl ? 'rtl' : 'ltr'}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">{t('personal.address', language)}</Label>
              <Input
                id="address"
                value={personalInfo.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder={language === 'ar' ? 'شارع الملك فهد' : '123 Main Street'}
                dir={isRtl ? 'rtl' : 'ltr'}
                className="mt-1.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Online Presence */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            {language === 'ar' ? 'التواجد الإلكتروني' : 'Online Presence'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">{t('personal.website', language)}</Label>
              <Input
                id="website"
                value={personalInfo.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://example.com"
                dir="ltr"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">{t('personal.linkedin', language)}</Label>
              <Input
                id="linkedin"
                value={personalInfo.linkedin}
                onChange={(e) => updateField('linkedin', e.target.value)}
                placeholder="linkedin.com/in/username"
                dir="ltr"
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="github">{t('personal.github', language)}</Label>
              <Input
                id="github"
                value={personalInfo.github}
                onChange={(e) => updateField('github', e.target.value)}
                placeholder="github.com/username"
                dir="ltr"
                className="mt-1.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Links */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {t('personal.otherLinks', language)}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addLink}>
              <Plus className="h-3 w-3 me-1" />
              {t('personal.addLink', language)}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {personalInfo.otherLinks.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              {language === 'ar'
                ? 'لا توجد روابط إضافية'
                : 'No additional links'}
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
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">{t('personal.linkUrl', language)}</Label>
                <Input
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
                onClick={() => removeLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
