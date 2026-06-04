'use client';

import { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Resume, TEMPLATES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  FileText,
  Pencil,
  Copy,
  Trash2,
  Download,
  Upload,
  MoreVertical,
  LayoutTemplate,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardView() {
  const language = useAppStore((s) => s.language);
  const resumes = useAppStore((s) => s.resumes);
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const setCurrentResumeId = useAppStore((s) => s.setCurrentResumeId);
  const createNewResume = useAppStore((s) => s.createNewResume);
  const deleteResume = useAppStore((s) => s.deleteResume);
  const duplicateResume = useAppStore((s) => s.duplicateResume);
  const updateResume = useAppStore((s) => s.updateResume);
  const setResumes = useAppStore((s) => s.setResumes);

  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRtl = language === 'ar';

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    createNewResume(newTitle || undefined);
    setNewTitle('');
    setNewDialogOpen(false);
  };

  const handleEdit = (id: string) => {
    setCurrentResumeId(id);
    setCurrentView('editor');
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteResume(deleteId);
      setDeleteId(null);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateResume(id);
  };

  const handleRename = (id: string, title: string) => {
    updateResume(id, { title });
  };

  const handleExport = () => {
    const data = JSON.stringify(resumes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resumes-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (Array.isArray(data)) {
          setResumes(data);
        }
      } catch {
        // Invalid JSON
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getTemplateName = (template: string) => {
    const tmpl = TEMPLATES.find((t) => t.id === template);
    if (!tmpl) return template;
    return language === 'ar' ? tmpl.nameAr : tmpl.name;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {t('dashboard.title', language)}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('app.subtitle', language)}
            </p>
          </div>
          <div className={cn('flex items-center gap-2', isRtl && 'flex-row-reverse')}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={resumes.length === 0}
            >
              <Download className="h-4 w-4 me-2" />
              {t('settings.export', language)}
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 me-2" />
              {t('settings.import', language)}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
            <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 me-2" />
                  {t('dashboard.new', language)}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('dashboard.new', language)}</DialogTitle>
                  <DialogDescription>
                    {language === 'ar'
                      ? 'أدخل عنوان السيرة الذاتية الجديدة'
                      : 'Enter a title for your new resume'}
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'سيرة ذاتية جديدة'
                      : 'New Resume'
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewDialogOpen(false)}>
                    {t('common.cancel', language)}
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleCreate}>
                    {t('common.save', language)}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        {resumes.length > 0 && (
          <div className="relative mb-6 max-w-md">
            <Search className={cn(
              'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
              isRtl ? 'right-3' : 'left-3'
            )} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dashboard.search', language)}
              className={cn(isRtl ? 'pr-10' : 'pl-10')}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>
        )}

        {/* Empty State */}
        {resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 mb-6">
              <FileText className="h-12 w-12 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {t('dashboard.empty', language)}
            </h2>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
              {t('dashboard.emptyDesc', language)}
            </p>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setNewDialogOpen(true)}
            >
              <Plus className="h-4 w-4 me-2" />
              {t('app.createFirst', language)}
            </Button>
          </div>
        )}

        {/* Resume Grid */}
        {resumes.length > 0 && filteredResumes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredResumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              language={language}
              isRtl={isRtl}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={setDeleteId}
              onRename={handleRename}
              getTemplateName={getTemplateName}
              formatDate={formatDate}
            />
          ))}
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar'
                ? 'هل أنت متأكد من حذف هذه السيرة الذاتية؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this resume? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel', language)}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              {t('common.delete', language)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ResumeCard({
  resume,
  language,
  isRtl,
  onEdit,
  onDuplicate,
  onDelete,
  onRename,
  getTemplateName,
  formatDate,
}: {
  resume: Resume;
  language: 'ar' | 'en';
  isRtl: boolean;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  getTemplateName: (template: string) => string;
  formatDate: (date: string) => string;
}) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(resume.title);

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== resume.title) {
      onRename(resume.id, editTitle.trim());
    }
    setEditing(false);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg border-border/60">
      {/* Preview thumbnail area */}
      <div
        className="relative h-40 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 cursor-pointer flex items-center justify-center"
        onClick={() => onEdit(resume.id)}
      >
        <div
          className="text-4xl font-bold text-emerald-600/20 select-none"
          style={{ fontFamily: 'var(--font-cairo), var(--font-inter)' }}
        >
          {resume.data.personalInfo.fullName
            ? resume.data.personalInfo.fullName.charAt(0).toUpperCase()
            : <FileText className="h-12 w-12 text-emerald-600/30" />}
        </div>
        {/* Color indicator */}
        <div
          className="absolute top-2 end-2 w-3 h-3 rounded-full"
          style={{ backgroundColor: resume.primaryColor }}
        />
        {/* Template badge */}
        <Badge className="absolute bottom-2 start-2" variant="secondary">
          <LayoutTemplate className="h-3 w-3 me-1" />
          {getTemplateName(resume.template)}
        </Badge>
      </div>

      <CardHeader className="p-3 pb-1">
        {editing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="h-7 text-sm"
            dir={isRtl ? 'rtl' : 'ltr'}
            autoFocus
          />
        ) : (
          <CardTitle
            className="text-sm font-semibold truncate cursor-pointer hover:text-emerald-600 transition-colors"
            onClick={() => onEdit(resume.id)}
            onDoubleClick={() => {
              setEditTitle(resume.title);
              setEditing(true);
            }}
          >
            {resume.title}
          </CardTitle>
        )}
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <div className={cn('flex items-center gap-1 text-xs text-muted-foreground', isRtl && 'flex-row-reverse')}>
          <Clock className="h-3 w-3" />
          <span>{formatDate(resume.updatedAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-xs"
          onClick={() => onEdit(resume.id)}
        >
          <Pencil className="h-3 w-3 me-1" />
          {t('dashboard.edit', language)}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRtl ? 'start' : 'end'}>
            <DropdownMenuItem onClick={() => onDuplicate(resume.id)}>
              <Copy className="h-4 w-4 me-2" />
              {t('dashboard.duplicate', language)}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEditTitle(resume.title);
                setEditing(true);
              }}
            >
              <Pencil className="h-4 w-4 me-2" />
              {language === 'ar' ? 'إعادة تسمية' : 'Rename'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(resume.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 me-2" />
              {t('dashboard.delete', language)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

function Badge({
  className,
  variant,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'secondary' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
        variant === 'secondary'
          ? 'bg-white/80 dark:bg-black/30 text-foreground/80'
          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
