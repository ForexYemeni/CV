---
Task ID: 1
Agent: Main Agent
Task: Fix critical bugs - templates not displaying and cannot add real resume data

Work Log:
- Investigated the project structure and identified all key components
- Found the root cause: Zustand persist middleware causing hydration mismatch between server and client
- Created HydrationGuard component to prevent rendering until store is hydrated from localStorage
- Added `skipHydration: true` to Zustand persist config and manual rehydration in useEffect
- Removed `output: "standalone"` from next.config.ts which was breaking `next start`
- Added `allowedDevOrigins` to next.config.ts for proper dev server access
- Added `getSampleResumeData()` function in types.ts with full Arabic/English sample resume data
- Added `fillWithSampleData()` action to Zustand store
- Added "Auto Fill" button in EditorView toolbar that fills resume with sample data
- Added "Templates" button in EditorView toolbar that opens template selector dialog
- Created `TemplateSelectorDialog` component within EditorView for choosing templates from the editor
- Added `Lock` icon import for premium template badges
- Verified build succeeds with `npx next build`

Stage Summary:
- Fixed hydration mismatch by adding HydrationGuard with `skipHydration: true`
- Fixed server config by removing standalone output
- Added sample resume data with Arabic/English support
- Added template selector dialog accessible from editor toolbar
- Added "Auto Fill" button to quickly populate resume with sample data
- Build compiles successfully
