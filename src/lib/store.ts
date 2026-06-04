import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ViewMode,
  Language,
  Resume,
  ResumeData,
  getDefaultResumeData,
  generateId,
  TEMPLATES,
} from './types';

interface AppState {
  // Navigation
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Auth
  isLoggedIn: boolean;
  userName: string;
  setIsLoggedIn: (val: boolean) => void;
  setUserName: (name: string) => void;

  // Resumes
  resumes: Resume[];
  setResumes: (resumes: Resume[]) => void;
  addResume: (resume: Resume) => void;
  updateResume: (id: string, data: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => void;

  // Current editing
  currentResumeId: string | null;
  setCurrentResumeId: (id: string | null) => void;
  getCurrentResume: () => Resume | null;
  updateCurrentResumeData: (data: Partial<ResumeData>) => void;
  updateCurrentResumeSettings: (settings: Partial<Pick<Resume, 'template' | 'primaryColor' | 'fontFamily' | 'fontSize' | 'language'>>) => void;

  // Editor state
  activeSection: string;
  setActiveSection: (section: string) => void;
  showPreview: boolean;
  setShowPreview: (val: boolean) => void;
  previewZoom: number;
  setPreviewZoom: (zoom: number) => void;
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;

  // AI
  aiLoading: boolean;
  setAiLoading: (val: boolean) => void;

  // Init
  createNewResume: (title?: string, template?: string) => string;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentView: 'landing',
      setCurrentView: (view) => set({ currentView: view }),

      // Language
      language: 'ar',
      setLanguage: (lang) => set({ language: lang }),

      // Auth
      isLoggedIn: false,
      userName: '',
      setIsLoggedIn: (val) => set({ isLoggedIn: val }),
      setUserName: (name) => set({ userName: name }),

      // Resumes
      resumes: [],
      setResumes: (resumes) => set({ resumes }),
      addResume: (resume) => set((s) => ({ resumes: [...s.resumes, resume] })),
      updateResume: (id, data) =>
        set((s) => ({
          resumes: s.resumes.map((r) => (r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r)),
        })),
      deleteResume: (id) =>
        set((s) => ({
          resumes: s.resumes.filter((r) => r.id !== id),
          currentResumeId: s.currentResumeId === id ? null : s.currentResumeId,
        })),
      duplicateResume: (id) => {
        const resume = get().resumes.find((r) => r.id === id);
        if (!resume) return;
        const newResume: Resume = {
          ...resume,
          id: generateId(),
          title: resume.title + ' (نسخة)',
          slug: generateId(),
          data: JSON.parse(JSON.stringify(resume.data)),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ resumes: [...s.resumes, newResume] }));
      },

      // Current editing
      currentResumeId: null,
      setCurrentResumeId: (id) => set({ currentResumeId: id }),
      getCurrentResume: () => {
        const state = get();
        return state.resumes.find((r) => r.id === state.currentResumeId) || null;
      },
      updateCurrentResumeData: (data) => {
        const state = get();
        if (!state.currentResumeId) return;
        const resume = state.resumes.find((r) => r.id === state.currentResumeId);
        if (!resume) return;
        set({
          resumes: state.resumes.map((r) =>
            r.id === state.currentResumeId
              ? { ...r, data: { ...r.data, ...data }, updatedAt: new Date().toISOString() }
              : r
          ),
        });
      },
      updateCurrentResumeSettings: (settings) => {
        const state = get();
        if (!state.currentResumeId) return;
        set({
          resumes: state.resumes.map((r) =>
            r.id === state.currentResumeId
              ? { ...r, ...settings, updatedAt: new Date().toISOString() }
              : r
          ),
        });
      },

      // Editor state
      activeSection: 'personalInfo',
      setActiveSection: (section) => set({ activeSection: section }),
      showPreview: true,
      setShowPreview: (val) => set({ showPreview: val }),
      previewZoom: 0.75,
      setPreviewZoom: (zoom) => set({ previewZoom: zoom }),
      isFullscreen: false,
      setIsFullscreen: (val) => set({ isFullscreen: val }),

      // AI
      aiLoading: false,
      setAiLoading: (val) => set({ aiLoading: val }),

      // Init
      createNewResume: (title, template) => {
        const id = generateId();
        const lang = get().language;
        const tmplInfo = TEMPLATES.find((t) => t.id === template);
        const newResume: Resume = {
          id,
          userId: 'local',
          title: title || (lang === 'ar' ? 'سيرة ذاتية جديدة' : 'New Resume'),
          slug: generateId(),
          template: template || 'modern',
          primaryColor: tmplInfo?.colors?.[0] || '#2563EB',
          fontFamily: 'inter',
          fontSize: 'medium',
          language: lang,
          data: getDefaultResumeData(),
          isPublic: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({
          resumes: [...s.resumes, newResume],
          currentResumeId: id,
          currentView: 'editor',
          activeSection: 'personalInfo',
        }));
        return id;
      },
    }),
    {
      name: 'resume-builder-store',
      partialize: (state) => ({
        resumes: state.resumes,
        currentResumeId: state.currentResumeId,
        language: state.language,
        isLoggedIn: state.isLoggedIn,
        userName: state.userName,
      }),
    }
  )
);
