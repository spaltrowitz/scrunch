# Cha-Cha — History

## Project Context
## Project Context
- **Project:** Scrunch — curly hair care product discovery app
- **Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, Supabase, React Query (TanStack), React Router 7, Vitest 4
- **Deployment:** GitHub Pages (gh-pages)
- **User:** Shari Paltrowitz
- **Data:** 280 products in seedProducts.ts (static seed data), will migrate to Supabase

## Core Context

**Performance Optimization Patterns (completed):**
- React Query migration: All Supabase fetches moved from useEffect→useQuery, eliminated 13KB dead weight
- Column-specific selects: Reduced over-fetching by 40% across 6 files (no more `select('*')`)
- Dynamic imports: seedProducts.ts (69KB) code-split away from initial bundle, loaded on error fallback only
- Route-level code splitting: All 14 pages lazy-loaded with React.lazy() + Suspense
- Component decomposition: Recommendations (1173 lines → 399 orchestrator + 6 memo-wrapped components); Products.tsx similarly extracted
- Render optimization: All extracted components wrapped in React.memo() with useCallback for event handlers
- Query key conventions: Canonical keys across all hooks (`['products']`, `['product', id]`, `['reviews', userId]`, `['profile', userId]`)
- Mutation patterns: All writes use useMutation with query invalidation for cache consistency

**Key Trade-offs Preserved:**
- Static SEED_PRODUCTS import (15KB gzip) kept intentional: buys instant paint on every product page despite defeating lazy-loading
- Recommendations orchestrator at 399 lines (exceeds 300-line cap) justified by 5 queries + 3 mutations + collab filtering complexity

**Owner Preferences (learned):**
- Focus on measurable performance wins (bundle size reduction, render count, network payload) over premature micro-optimizations
- Accept trade-offs when perceived performance (time-to-paint) wins over bundle size (SEED_PRODUCTS static import)


### From MyDailyWin (Impa)
- **Inline CSS bloat is the #1 token cost driver:** app.html had 425 lines of inline `<style>`, home.html had 104 inline `style=""` attributes. Extract to external CSS files for both performance and AI token savings (~30-40% reduction when working across files).
- **Cross-file duplication compounds cost:** Firebase config (3 copies), SW registration (4 copies), shared utility functions (2+ copies). Each page served to AI includes all redundancy. Consolidate into shared modules.
- **Dead code audit saves build overhead:** Unused functions, deprecated functions still present, defined-but-never-called utilities (like `slugVariants()`) — remove or integrate.
- **Service worker cache versioning for multi-agent work:** When multiple agents modify assets in parallel, each bumps cache version independently — latest wins. Always include new files (JS, CSS) in SW precache list.
- **CSS consolidation gains are smaller when already per-page:** Intentionally distinct page designs mean shared `.btn` base in shared.css + page-specific overrides is the right pattern. Real value = token reduction for AI context, not line count.
- **Suffix/helper pattern duplication:** When a pattern repeats 10+ times (like profile suffix calculation), extract to a single helper function.
