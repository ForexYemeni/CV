'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Resume, TEMPLATES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Sparkles,
  TrendingUp,
  FolderOpen,
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
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const userName = useAppStore((s) => s.userName);

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

  const lastUpdated = resumes.length > 0
    ? formatDate(resumes.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b)).updatedAt)
    : '-';

  const favTemplate = resumes.length > 0
    ? getTemplateName(
        Object.entries(resumes.reduce((acc, r) => { acc[r.template] = (acc[r.template] || 0) + 1; return acc; }, {} as Record<string, number>))
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'modern'
      )
    : '-';

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-premium rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 end-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 start-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {language === 'ar'
                ? `مرحباً ${isLoggedIn ? userName : ''} 👋`
                : `Welcome${isLoggedIn ? `, ${userName}` : ''} 👋`}
            </h1>
            <p className="text-white/80 text-sm md:text-base">
              {t('app.subtitle', language)}
            </p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { icon: FileText, label: language === 'ar' ? 'عدد السير الذاتية' : 'Total Resumes', value: resumes.length, color: 'from-blue-500 to-cyan-500' },
            { icon: Clock, label: language === 'ar' ? 'آخر تحديث' : 'Last Updated', value: lastUpdated, color: 'from-purple-500 to-pink-500' },
            { icon: LayoutTemplate, label: language === 'ar' ? 'القالب المفضل' : 'Favorite Template', value: favTemplate, color: 'from-amber-500 to-orange-500' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-5 shadow-premium">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white', stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-bold text-sm truncate max-w-[140px]">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold">{t('dashboard.title', language)}</h2>
          </div>
          <div className={cn('flex items-center gap-2', isRtl && 'flex-row-reverse')}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={resumes.length === 0}
              className="rounded-xl"
            >
              <Download className="h-4 w-4 me-2" />
              {t('settings.export', language)}
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-xl">
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
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="gradient-brand text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t('dashboard.new', language)}
                </motion.button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" dir={isRtl ? 'rtl' : 'ltr'}>
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
                  className="rounded-xl"
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewDialogOpen(false)} className="rounded-xl">
                    {t('common.cancel', language)}
                  </Button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    className="gradient-brand text-white rounded-xl px-5 py-2 text-sm font-semibold"
                  >
                    {t('common.save', language)}
                  </motion.button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative mb-6 max-w-md"
          >
            <Search className={cn(
              'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
              isRtl ? 'right-3' : 'left-3'
            )} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dashboard.search', language)}
              className={cn('rounded-xl bg-white/50 dark:bg-white/5 border-border/50', isRtl ? 'pr-10' : 'pl-10')}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </motion.div>
        )}

        {/* Empty State */}
        {resumes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl gradient-brand/10 mb-6 animate-float">
              <FolderOpen className="h-14 w-14 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {t('dashboard.empty', language)}
            </h2>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
              {t('dashboard.emptyDesc', language)}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setNewDialogOpen(true)}
              className="gradient-brand text-white rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('app.createFirst', language)}
            </motion.button>
          </motion.div>
        )}

        {/* Resume Grid */}
        {resumes.length > 0 && filteredResumes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredResumes.map((resume, i) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              language={language}
              isRtl={isRtl}
              index={i}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={setDeleteId}
              onRename={handleRename}
              getTemplateName={getTemplateName}
              formatDate={formatDate}
            />
          ))}
        </div>

        {/* FAB */}
        {resumes.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setNewDialogOpen(true)}
            className="fixed bottom-6 end-6 h-14 w-14 rounded-2xl gradient-brand text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-40 md:hidden"
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        )}

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
    </div>
  );
}

function ResumeCard({
  resume,
  language,
  isRtl,
  index,
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
  index: number;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl overflow-hidden shadow-premium hover:shadow-glow transition-all duration-300 group"
    >
      {/* Preview thumbnail area */}
      <div
        className="relative h-40 cursor-pointer flex items-center justify-center overflow-hidden"
        onClick={() => onEdit(resume.id)}
      >
        <div className="absolute inset-0 opacity-30" style={{
          background: `linear-gradient(135deg, ${resume.primaryColor}15, ${resume.primaryColor}30)`,
        }} />
        <div
          className="text-5xl font-bold select-none relative"
          style={{ color: resume.primaryColor + '25', fontFamily: 'var(--font-cairo), var(--font-inter)' }}
        >
          {resume.data.personalInfo.fullName
            ? resume.data.personalInfo.fullName.charAt(0).toUpperCase()
            : <FileText className="h-12 w-12" style={{ color: resume.primaryColor + '30' }} />}
        </div>
        {/* Gradient line at top */}
        <div className="absolute top-0 inset-x-0 h-1" style={{ background: `linear-gradient(90deg, ${resume.primaryColor}, ${resume.primaryColor}80)` }} />
        {/* Template badge */}
        <div className="absolute bottom-2 start-2 flex items-center gap-1 px-2 py-0.5 rounded-lg glass text-[10px] font-medium">
          <LayoutTemplate className="h-3 w-3" />
          {getTemplateName(resume.template)}
        </div>
      </div>

      <div className="p-4">
        {editing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="h-7 text-sm rounded-xl mb-2"
            dir={isRtl ? 'rtl' : 'ltr'}
            autoFocus
          />
        ) : (
          <h3
            className="text-sm font-semibold truncate cursor-pointer hover:text-primary transition-colors mb-1"
            onClick={() => onEdit(resume.id)}
            onDoubleClick={() => {
              setEditTitle(resume.title);
              setEditing(true);
            }}
          >
            {resume.title}
          </h3>
        )}
        <div className={cn('flex items-center gap-1 text-xs text-muted-foreground mb-3', isRtl && 'flex-row-reverse')}>
          <Clock className="h-3 w-3" />
          <span>{formatDate(resume.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(resume.id)}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-medium gradient-brand text-white hover:shadow-md transition-shadow"
          >
            <Pencil className="h-3 w-3" />
            {t('dashboard.edit', language)}
          </motion.button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
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
        </div>
      </div>
    </motion.div>
  );
}
