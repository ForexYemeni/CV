'use client';

import { useAppStore, useCurrentResume } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Certification, generateId } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';

const inputClass = "rounded-xl border border-border/60 bg-white/50 dark:bg-white/5 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

export function CertificationsForm() {
  const language = useAppStore((s) => s.language);
  const resume = useCurrentResume();
  const updateCurrentResumeData = useAppStore((s) => s.updateCurrentResumeData);
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addCertification}
          className="flex items-center gap-1 gradient-brand text-white rounded-xl px-3 py-1.5 text-xs font-medium"
        >
          <Plus className="h-3 w-3" />
          {t('cert.add', language)}
        </motion.button>
      </div>

      {certifications.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Award className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t('common.noData', language)}</p>
          <Button variant="outline" size="sm" className="mt-3 rounded-xl" onClick={addCertification}>
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass rounded-2xl overflow-hidden shadow-premium',
        open && 'border-s-4 border-s-red-500'
      )}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-2 p-4 cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-500 text-white">
              <Award className="h-3.5 w-3.5" />
            </div>
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
          <div className="pt-0 pb-4 px-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">{t('cert.name', language)}</Label>
                <Input value={cert.name} onChange={(e) => onUpdate(cert.id, { name: e.target.value })} placeholder="AWS Solutions Architect" dir={isRtl ? 'rtl' : 'ltr'} className={cn('mt-1', inputClass)} />
              </div>
              <div>
                <Label className="text-xs">{t('cert.issuer', language)}</Label>
                <Input value={cert.issuer} onChange={(e) => onUpdate(cert.id, { issuer: e.target.value })} placeholder={language === 'ar' ? 'أمازون' : 'Amazon'} dir={isRtl ? 'rtl' : 'ltr'} className={cn('mt-1', inputClass)} />
              </div>
              <div>
                <Label className="text-xs">{t('cert.date', language)}</Label>
                <Input type="month" value={cert.date} onChange={(e) => onUpdate(cert.id, { date: e.target.value })} className={cn('mt-1', inputClass)} dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">{t('cert.description', language)}</Label>
                <Textarea value={cert.description} onChange={(e) => onUpdate(cert.id, { description: e.target.value })} placeholder={language === 'ar' ? 'وصف مختصر للشهادة...' : 'Brief description of the certification...'} dir={isRtl ? 'rtl' : 'ltr'} className="mt-1 rounded-xl border border-border/60 bg-white/50 dark:bg-white/5 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-16" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive rounded-xl" onClick={() => onRemove(cert.id)}>
                <Trash2 className="h-3 w-3 me-1" />
                {t('cert.remove', language)}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}
