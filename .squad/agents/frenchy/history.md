# History

## Project Context
- **Project:** Scrunch — curly hair care app
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Supabase, React Query, React Router, Vitest
- **Deployment:** GitHub Pages
- **User:** Shari Paltrowitz

## Learnings

# Frenchy — History

## Work Done

### Homepage Redesign (Discovery-First)
- Rewrote `src/pages/Home.tsx` from hero-centric marketing page to discovery-first product browser
- Added category card grid, sticky filter bar (CG status, category, brand), product cards with images/badges
- Subtle "New to curly hair?" section at bottom — discoverable, not a gate
- Updated `src/App.tsx` to show homepage for all users (removed logged-in → Dashboard redirect)

### ProductPlaceholder Tooltip Enhancement (2026-04-30)
- Added desktop hover tooltip displaying "Image coming soon" (Tailwind `group-hover` styling)
- Added mobile tap-activated info icon (ℹ️) for image context
- Fallback text "Image coming soon" now displays below placeholder
- Works seamlessly with ProductImage component and brand-color placeholders
- Build passes; component tested with null image entries

### Performance Decomposition (2026-04-30)
- Extracted `SearchBar`, `FilterPanel`, `ProductCard` from Products.tsx (661→~280 lines)
- `ProductCard` wrapped in `React.memo` to prevent cascade re-renders
- Added "Show More" pagination (20 products per page) to Products page
- Wrapped `filteredProducts` in `useMemo`, memoized category counts and `approvedCount`
- Added module-level `EMPTY_SET` constant in Recommendations.tsx
- Build passes (26/26 tests green)

## Learnings

- The app uses `SEED_PRODUCTS` as fallback when Supabase returns empty — both paths must be handled
- `ProductImage` component handles brand-color placeholders when no image is available — reuse it everywhere
- Pre-existing TS errors in Products.tsx, Profile.tsx, Recommendations.tsx, and vite.config.ts — not caused by homepage work
- Sticky filter bar must account for the 64px header (`top-16`) to avoid overlap
- The `PRODUCT_CATEGORY_LABELS` constant in `lib/constants.ts` is the canonical source of category display names
- ProductPlaceholder tooltip UX pattern: transparent messaging ("Image coming soon") reduces user confusion when product data is incomplete
- Component must handle both hover (desktop) and tap (mobile) interactions to reach all user personas
- Products.tsx decomposition: SearchBar, FilterPanel, ProductCard are now separate components under `src/components/products/` — keep them there for any future product-list UI work
- ProductCard is wrapped in `React.memo` — pass stable props (avoid inline arrow functions where possible) to get the benefit
- "Show More" pagination pattern: `useState(PRODUCTS_PER_PAGE)` + `filteredProducts.slice(0, visibleCount)` — reset `visibleCount` when filters change
- Module-level constants (like `EMPTY_SET`) avoid per-render allocations — use this pattern for any Set/Map/array passed as default props
- `useProductImage` has an `enabled` flag + IntersectionObserver in `ProductImage` — images only fetch when scrolled into viewport
- Prose-inspired redesign lesson: removing filter state (useState, useMemo) from the homepage component drastically simplifies the code — filters belong on /products, not the landing page
- `useHomeProducts()` in `src/hooks/useHomeProducts.ts` is the homepage-specific hook (7 columns, 20 rows, placeholderData) — never use `useProducts()` on the homepage
- Full-viewport hero (`min-h-screen` + flex centering) creates immediate visual impact — worth the scroll trade-off for a mission-driven landing page

### Homepage UX Polish — Jan's Recommendations (2026-05-01)
- Implemented 10 of 13 UX recommendations from Jan's review (4 🔴 must-haves + 6 🟡 nice-to-haves)
- `useProducts()` now returns `{ products, isFallback }` — all consumers (Home, Products, Recommendations) updated
- Hero copy rewritten: removed all CGM jargon ("CG status" → "Curl Safety"), added emotional value prop
- CG_BADGE labels changed: "CG ✓" → "Curl Safe ✓", "Not CG" → "Not Curl Safe"
- Categories sorted by popularity (product count descending) via `sortedCategories` useMemo
- Added persona quick-start pills (Newbie → ingredient checker, Scanner → curl-safe products, Optimizer → browse all)
- Added fallback banner when Supabase is down (amber notification)
- All filter selects and buttons now have `min-h-[44px]` for mobile touch targets
- ProductPlaceholder text changed from "Image coming soon" to "No image" (no timeline = don't promise)
- Build passes, 26/26 tests green

### Toast Notification System (2026-05-01)
- Created `src/hooks/useToast.tsx` — React context with `ToastProvider` and `useToast()` hook
- Created `src/components/ui/ToastContainer.tsx` — renders stacked toasts with slide-up animation
- Toast types: success (green), error (red), info (blue) with auto-dismiss at 4s and manual close
- Position: bottom-right on desktop, bottom-center on mobile (responsive via `max-sm:` Tailwind)
- Added `ToastProvider` wrapper in `App.tsx` around the entire app
- Wired toast feedback to all 7 `useMutation` calls across 4 files:
  - `ProductDetail.tsx`: review submit (1 mutation)
  - `Products.tsx`: delete review, upsert rating, upsert note (3 mutations)
  - `Recommendations.tsx`: rate product, dismiss product (2 mutations)
  - `OnboardingWizard.tsx`: save profile (1 mutation)
- Every mutation now shows success confirmation or error message to the user
- Addresses Sandy's code review note #2 from PR #13 approval
- Build passes, 26/26 tests green

### Cross-team context (2026-05-01)
- Sandy merged 3 PRs this batch; PR #9 and #15 required rebasing to React Query patterns per architecture-first conflict resolution policy
- Cha-Cha decomposed Recommendations.tsx (1173→399 lines) with memo-wrapped sub-components
- Toast system establishes pattern for all future mutation feedback

### Homepage Declutter (2026-07-25)
- Reduced initial category grid from all 14 to top 6 (by popularity), with "Show all categories →" toggle
- Reduced initial product grid from 40 to 12 items; "View all products →" link triggers at 12+
- Moved persona pills below category grid to reduce hero-area visual competition
- Toned down persona pill styling (lighter borders/text) so they read as secondary navigation
- Capped category grid at 4 columns max (was 5 on lg), 3 on mobile (was 2)
- Added more vertical spacing between sections (py-8 → py-10, mb-6 → mb-10)
- Build passes, 26/26 tests green

### Prose-Inspired Homepage Redesign (2026-07-25)
- Full rewrite of `src/pages/Home.tsx` following Jan's spec at `.squad/designs/homepage-redesign-prose-inspired.md`
- **Hero**: Full-viewport centered layout with bold headline, single CTA, subtle social proof line. Killed 3 value bullets and dual CTAs.
- **3 Feature narrative sections**: Full-width alternating left/right rows with generous padding. Links to /ingredient-checker, /community, /recommendations.
- **Product teaser**: 6 products in clean grid using `useHomeProducts()` hook. No filter bar, no category grid.
- **Removed**: sticky filter bar, category grid, "Show all categories" toggle, persona pills, old feature spotlight cards, 12-product grid, all filter state.
- **Kept**: "New to curly hair?" CTA closer, Supabase fallback banner.
- Page now ~2.5 scroll heights (was ~5-6). Build passes, 26/26 tests green.

### Community Page UX Polish
- Added `showSearchBox` state to collapse textarea after submission
- After asking a question: textarea + suggested questions hide, replaced by compact "Ask another question" button
- Added `fadeIn` CSS keyframe animation for result cards (opacity + slight slide-up)
- Removed "📋 Community Results" badge — summary text now shows directly
- Added ↗ icon after each Reddit post title to signal external links
- Suggested questions only show before first search (hide along with textarea after submission)
- **Avoided touching:** `extractSearchTerms()`, `searchReddit()`, `generateSummary()`, `stripMarkdown()` (Danny's domain)
- Files changed: `src/pages/Community.tsx`, `src/index.css`

### Beta UX Audit Fixes — Items 4 & 5
- **Products empty state (Item 4):** Enhanced the empty state when filters return 0 results — added 🔍 icon, friendlier copy, and a prominent violet "Clear all filters" button (was just a text link)
- **Homepage mobile CTAs (Item 5):** Made feature card CTAs full-width with 44px min-height tap targets on mobile (`w-full md:w-auto`, `text-sm md:text-xs`, `py-3 md:py-2`, `min-h-[44px] md:min-h-0`), keeping compact inline style on desktop
- Pattern: use `md:` breakpoint for mobile-first responsive CTAs — full-width + larger text on small screens, inline + smaller on desktop
- Note: `npm run build` fails due to pre-existing TS errors in Community.tsx (Danny's domain) — my changes type-check clean

### Beta Technical Review — Lint Fixes (Sandy's 3 must-fixes)
- **setState-in-effect:** Replaced useEffect→setState patterns with render-time sync (React's "you might not need an effect" pattern) in OnboardingWizard, ProductDetail, Products, and useProductImage
- **Fast refresh violations:** Extracted `useAuth`, `useToast`, `useProductImage` hooks into `.utils.ts` files so provider files only export React components
- **exhaustive-deps:** Wrapped `products` and `sensitivities` derivations in `useMemo` to stabilize dependency arrays in Products.tsx and Recommendations.tsx
- Pattern: render-time state sync (track previous value via useState, compare during render, update if changed) is the idiomatic replacement for "sync external data into local state" useEffect patterns
- Pattern: for fast refresh, keep provider components and their hooks in separate files — provider in `.tsx`, hook in `.utils.ts`
- Pattern: `const x = data?.y ?? []` creates new arrays every render — wrap in `useMemo` when used as dependency of other hooks

## 2026-05-01T20:58:00Z — Beta Must-Fix Sprint Complete

### Outcomes
- **Lint Issues (3/3):** useState-in-effect, fast refresh violations, exhaustive-deps — all resolved
- **Empty States:** Products page now shows clear empty state with "Clear all filters" button when filters return 0 results
- **Mobile CTAs:** Feature card CTAs now 44px tap targets on mobile (full-width) with responsive scaling down to desktop
- **Build Status:** Passing, 26 tests green
- **Deployment:** GitHub Pages active

### Orchestration
This sprint completed all 6 beta must-fix items across team (Frenchy + Danny + team supports). Scribe documented via orchestration logs and merged team decisions into shared decision log.

### Trending on #HairTok Section (2026-07-25)
- Added "Trending on #HairTok" section to Home.tsx between Explore Products and the closer
- Product grid filters by `notes` field containing 'HairTok'; falls back to hardcoded names (K18, Olaplex, Rosemary Oil) until Danny tags products
- Featured Creators cards (Manes by Mell, Ali Noskowiak, BiancaReneeToday) with TikTok links, no images per legal rules
- Mobile-first: creator cards stack vertically on mobile, 3-col on desktop
- Section uses gray-50 bg, same product card pattern as Explore Products
- Build passes

## Learnings
- Legal constraints for TikTok integration: no embeds, no creator images, no verbatim captions — text-only cards with links are the safe path
- `useMemo` with dual filter strategy (notes field → hardcoded fallback) lets us ship UI before data migration is complete
- Reusing the exact same product card markup keeps visual consistency without extracting a shared component (would be worth extracting if a 3rd grid appears)
