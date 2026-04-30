# History

## Project Context
- **Project:** Scrunch — curly hair care app
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Supabase, React Query, React Router, Vitest
- **Deployment:** GitHub Pages
- **User:** Shari Paltrowitz

## Learnings

### 2026-04-30: Ship-readiness audit
- **App state:** 14 pages, 280 products, auth (email+Google), recommendations engine, ingredient checker, onboarding wizard, product request workflow. Deployed to GitHub Pages via CI/CD.
- **Build status:** Main deploys fine. PR #13 branch has 16 TS errors (database.types.ts mismatch, vite config missing vitest reference, unused vars). Tests pass (26/26). Lint has 17 errors including functional bugs (setState-in-effect).
- **Key gap:** Homepage is ingredient-checker-forward but team decision says discovery-first (browse/categories). 109/280 products missing images.
- **Architecture notes:** HashRouter for GH Pages SPA. Supabase anon key hardcoded as fallback (acceptable for public read-only). Product data lives in both `seedProducts.ts` (fallback) and Supabase `products` table. localStorage used for guest state, Supabase for authenticated users.
- **What's NOT built:** Routine Builder (F7), Education Hub (F8), AI ingestion pipeline (F3.6), admin tooling (F3.7), Apple Sign-In, environmental stressor dashboard, full 30-question quiz.
- **Path to ship:** Fix TS errors → merge PR #13 → top-50 product images → homepage redesign → soft launch. ~1-2 days.


