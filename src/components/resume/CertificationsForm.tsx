'use client';

import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Certification, generateId } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function CertificationsForm() {
  const language = useAppStore((s) => s.language);
  const getCurrentResume = useAppStore((s) => s.getCurrentResume);
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);

  const resume = getCurrentResume();
  const isRtl = language === 'ar';

  if (!resume) return null;

  const { certifications } = resume.data;

  const addCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      description: '',
    };
    updateCurrentResumeData({
      certifications: [...certifications, newCert],
    });
  };

  const removeCertification = (id: string) => {
    updateCurrentResumeData({
      certifications: certifications.filter((c) => c.id !== id),
    });
  };

  const updateCertification = (id: string, data: Partial<Certification>) => {
    updateCurrentResumeData({
      certifications: certifications.map((c) => (c.id === id ? { ...c, ...data } : c)),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t('section.certifications', language)}</h3>
        <Button variant="outline" size="sm" onClick={addCertification}>
          <Plus className="h-3 w-3 me-1" />
          {t('cert.add', language)}
        </Button>
      </div>

      {certifications.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Award className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t('common.noData', language)}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={addCertification}>
            <Plus className="h-3 w-3 me-1" />
            {t('cert.add', language)}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {certifications.map((cert) => (
          <CertificationItem
            key={cert.id}
            cert={cert}
            language={language}
            isRtl={isRtl}
            onUpdate={updateCertification}
            onRemove={removeCertification}
          />
        ))}
      </div>
    </div>
  );
}

function CertificationItem({
  cert,
  language,
  isRtl,
  onUpdate,
  onRemove,
}: {
  cert: Certification;
  language: 'ar' | 'en';
  isRtl: boolean;
  onUpdate: (id: string, data: Partial<Certification>) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(!cert.name);

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-2 p-3 cursor-pointer">
            <div className="flex-1 text-start">
              <p className="text-sm font-medium truncate">
                {cert.name || (language === 'ar' ? 'اسم الشهادة' : 'Certification Name')}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {cert.issuer || (language === 'ar' ? 'الجهة المانحة' : 'Issuing Organization')}
              </p>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                open && 'rotate-180'
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">{t('cert.name', language)}</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => onUpdate(cert.id, { name: e.target.value })}
                  placeholder={language === 'ar' ? 'AWS Solutions Architect' : 'AWS Solutions Architect'}
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">{t('cert.issuer', language)}</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => onUpdate(cert.id, { issuer: e.target.value })}
                  placeholder={language === 'ar' ? 'أمازون' : 'Amazon'}
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">{t('cert.date', language)}</Label>
                <Input
                  type="month"
                  value={cert.date}
                  onChange={(e) => onUpdate(cert.id, { date: e.target.value })}
                  className="mt-1 h-9 text-sm"
                  dir="ltr"
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">{t('cert.description', language)}</Label>
                <Textarea
                  value={cert.description}
                  onChange={(e) => onUpdate(cert.id, { description: e.target.value })}
                  placeholder={
                    language === 'ar'
                      ? 'وصف مختصر للشهادة...'
                      : 'Brief description of the certification...'
                  }
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="mt-1 min-h-16 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onRemove(cert.id)}
              >
                <Trash2 className="h-3 w-3 me-1" />
                {t('cert.remove', language)}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
