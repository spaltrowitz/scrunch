# Frenchy — History

## Key Patterns & Corrections

### Homepage Evolution
- **Discovery-first redesign:** Rewrote Home.tsx from hero-centric marketing to product browser with category grid, sticky filter bar, product cards.
- **Prose-inspired redesign:** Full rewrite to full-viewport hero, 3 narrative feature sections (alternating layout), 6-product teaser grid. Removed: sticky filter bar, category grid, persona pills, old feature cards, 12-product grid, all filter state. Page: ~2.5 scroll heights (was ~5-6).
- **Homepage declutter:** Top 6 categories (by popularity) with "Show all" toggle, 12 products (was 40), persona pills moved below categories with toned-down styling.
- **HairTok section:** "Trending on #HairTok" between products and closer. Filters by `notes` field, fallback to hardcoded names. Featured creators as text-only cards (legal: no embeds/images).
- **`useHomeProducts()`** is homepage-specific hook (7 columns, 20 rows, placeholderData) — never use `useProducts()` on homepage.

### Component Architecture
- **Performance decomposition:** Extracted `SearchBar`, `FilterPanel`, `ProductCard` from Products.tsx (661→~280 lines). `ProductCard` wrapped in `React.memo`.
- **"Show More" pagination:** `useState(PRODUCTS_PER_PAGE)` + `.slice(0, visibleCount)` — reset when filters change.
- **Module-level constants:** `EMPTY_SET` avoids per-render allocations for default props.
- **`useProducts()` returns `{ products, isFallback }`** — all consumers updated. Fallback banner when Supabase down.

### React Patterns
- **setState-in-effect fix:** Render-time sync (track previous value, compare during render). Idiomatic replacement for "sync external data" effects.
- **Fast refresh:** Provider in `.tsx`, hook in `.utils.ts` — separate files.
- **Dependency array instability:** `data?.y ?? []` creates new arrays every render — `useMemo`.
- **React Query `placeholderData`:** Function using `queryClient.getQueryData()` to search all caches for instant navigation.
- **Auth loading gate:** Never return null from route wrapper — `animate-pulse bg-gray-50` placeholder.

### Toast Notification System
- Created `useToast.tsx` (context + hook) and `ToastContainer.tsx`. Types: success/error/info, auto-dismiss 4s. Bottom-right desktop, bottom-center mobile.
- Wired to all 7 `useMutation` calls across ProductDetail, Products, Recommendations, OnboardingWizard.
- **Convention:** All future mutations must include success/error toast.

### UX Polish
- **Hero copy:** Removed CGM jargon ("CG status" → "Curl Safety"). CG badges: "CG ✓" → "Curl Safe ✓".
- **Categories sorted by popularity** (product count descending).
- **Persona quick-start pills:** Newbie → ingredient checker, Scanner → curl-safe products, Optimizer → browse all.
- **ProductPlaceholder:** "Image coming soon" → "No image" (don't promise timeline).
- **Community page:** Collapsible textarea after search, `fadeIn` animation for results, ↗ icon for external links.
- **Products empty state:** 🔍 icon, friendlier copy, violet "Clear all filters" button.
- **Mobile CTAs:** Full-width with 44px min-height on mobile, compact inline on desktop.

### Mobile & Responsive
- **44px touch targets** on all interactive elements (`min-h-[44px]`, `py-2.5` on inputs).
- **Rating buttons:** `grid grid-cols-2 sm:grid-cols-4 gap-2` for wrapping on narrow screens.
- **Footer links:** `flex-wrap` for 320px screens.
- **Stack pattern:** `flex-col sm:flex-row` for layouts that overflow on mobile.
- **ProductCard actions:** Removed `pl-20` indent on mobile (`pl-0 sm:pl-20`).

### Codebase Knowledge
- `SEED_PRODUCTS` as fallback when Supabase empty — both paths handled.
- `ProductImage` handles brand-color placeholders — reuse everywhere.
- `PRODUCT_CATEGORY_LABELS` in `lib/constants.ts` is canonical source.
- Sticky filter bar: `top-16` accounts for 64px header.
- `useProductImage` has `enabled` flag + IntersectionObserver — images fetch only when visible.
- localStorage persistence: `scrunch_profile`, `scrunch_ratings`, `scrunch_actions`, `scrunch_notes`.

## Cross-Project Frontend Knowledge (injected 2026-05-02)

### From EatDiscounted (Hockney)
- **SSE streaming:** AbortController on ReadableStream. Abort-on-new-search, 30s timeout, cleanup on unmount.
- **Accessibility:** `aria-label` on inputs, `aria-live="polite"`, `aria-current="page"`. `sr-only` built into Tailwind v4.
- **Error vs empty state:** Distinct states. 429 → rate-limit message.
- **Premium design:** 2px borders, hover shadows + scale(1.02-1.03), not-found at 60% opacity.
- **React 19 lint:** `Promise.resolve().then()` microtask for transitive setState.

### From MyDailyWin (Mipha, Urbosa)
- **XSS:** `escapeHtml()` for text, `data-*` + `addEventListener()` for onclick. innerHTML loop: array.push() + join('').
- **Modal accessibility:** `<button>` with `aria-label`, `role="dialog"` + `aria-modal="true"`.
- **ARIA tabs:** `role="tablist"` container, `role="tab"` buttons, `role="tabpanel"` panels.
- **Responsive:** 375px/768px/1024px. Scrollable tab strip, `overflow-x: auto` tables.

### From Slotted (Katara, Alumni)
- **Security:** Hardcoded email (PII), credential logs, Firebase SW → build-time substitution.
- **Empty state pattern:** `rounded-2xl border` cards with emoji + heading + CTA. Distinguish "no data" vs "no activity."
- **Soft social language:** "Ready to connect?" not "No friends yet."
- **Notification types:** Requires updating: union, typeConfig, tab filters, action buttons.

### From HealthStitch (Kaylee)
- **CSS design system:** Custom properties, skeleton loaders, sync freshness indicator.
- **VITE_API_URL:** Single client module for all API calls.

## Owner Preferences (learned)
- When Shari's directives conflict with PM analysis, Shari wins (Browse Products = Primary CTA, not Ingredient Checker)
- Reducing feature boxes from 4→2 requires grid adjustment + `max-w-4xl`
- Always cross-reference structural changes with copy specs to avoid dead edits
- Feedback form label changes touch 6 points: union, LABELS, PLACEHOLDERS, default, reset, conditional renders

## Session Archive Summary

Frenchy completed 12+ sessions: homepage redesign (discovery-first → Prose-inspired), performance decomposition (Products.tsx 661→280 lines), ProductPlaceholder tooltip, toast notification system (7 mutations wired), Jan's UX recommendations (10/13 implemented), homepage declutter, HairTok section, community page polish, beta UX fixes (empty state, mobile CTAs), lint fixes (setState-in-effect, fast refresh, exhaustive-deps), and copy/visual polish passes. All sessions maintained 26/26 tests green.
