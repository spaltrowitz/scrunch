# Frenchy — History

## Key Patterns & Corrections

### Homepage & Component Evolution (pattern summary)
- **Homepage progression:** Discovery-first → Prose-inspired → Progressive disclosure (declutter) → Education-first enrichment (How It Works, Why Scrunch)
- **Pattern:** Full page rewrites maintain Home.tsx ~150-200 lines by using inline JSX for sections, leveraging existing pattern library (cards, grids, gradients)
- **Latest enrichment (2026-05-06):** Enhanced hero sub-heading, 3-step "How It Works" explainer, 3-card "Why Scrunch?" differentiation section, HairTok repositioned after education (section order: Hero → How It Works → Why Scrunch? → HairTok)
- **Related:** `useHomeProducts()` homepage-specific hook (7 cols, 20 rows, placeholderData). Never use `useProducts()` on homepage.

### Component Architecture & Performance (pattern summary)
- **Performance decomposition:** Extract from monolithic files (Products.tsx 661→280 lines example), wrap extracted components in `React.memo` for isolated re-renders
- **Pagination:** `useState(PRODUCTS_PER_PAGE)` + `.slice(0, visibleCount)`, reset on filter change
- **Module-level constants:** `EMPTY_SET` avoids per-render allocations. `PRODUCT_CATEGORY_LABELS` in `lib/constants.ts` is canonical
- **Fallback handling:** `useProducts()` returns `{ products, isFallback }`. Fallback banner when Supabase down. `SEED_PRODUCTS` as fallback data

### React Patterns & UX Standards (pattern summary)
- **setState-in-effect fix:** Render-time sync (track previous value, compare during render)
- **Dependency array instability:** `data?.y ?? []` creates new arrays — use `useMemo`
- **React Query `placeholderData`:** Function using `queryClient.getQueryData()` for instant navigation
- **Auth loading gate:** Never return null — use `animate-pulse bg-gray-50` placeholder
- **Toast system:** Context + hook, success/error/info, auto-dismiss 4s, bottom-right desktop / bottom-center mobile
- **UX pattern:** 44px touch targets, `grid-cols-1 md:grid-cols-3` responsive grids, text wrapping (`break-words` / `truncate` / `line-clamp-N`), mobile-first padding (`px-4`)
- **Copy convention:** No CGM jargon ("Curl Safety" not "CG status"), no em dashes, friendly empty states with icons, soft CTA language

### Toast Convention & Mobile Polish (standards)
- All `useMutation` calls require success/error toast
- Mobile CTAs: full-width with 44px min-height. Desktop: compact inline
- Category cards sorted by popularity. Persona pills toned down
- ProductPlaceholder: "No image" (don't promise timeline)
- Community: collapsible textarea, fadeIn animation, ↗ external-link icons


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

### Homepage Enrichment (2026-05-06 session)
- **Added 3 new sections to Home.tsx:** "How It Works" (3-step education cards), "Why Scrunch?" (3 differentiation cards), enhanced hero with sub-heading + anchor link
- **Section order:** Hero → How It Works → Why Scrunch? → HairTok (reordered per Sandy)
- **Pattern:** Consistent card styling (border, rounded-lg, p-6) + grid-cols-1 md:grid-cols-3
- **Anchor linking:** "#how-it-works" ID for scroll navigation
- **No new components** - pure JSX additions to Home.tsx

## Learnings


### SEO & Landing Pages
- SPA limitations: HashRouter prevents deep indexing; JSON-LD in index.html helps
- CategoryPage.tsx with `/category/:slug` routes (slugs auto-derived from ProductCategory keys)
- usePageTitle hook with route-based title map + override support
- ?category=curl_cream deep linking to pre-select filters
- Vite base: '/scrunch/' applies to all meta URLs

### Homepage Enrichment + PWA + Mobile Audit (2026 sessions)
- Added "How It Works" + "Why Scrunch?" sections to Home.tsx, reordered HairTok below
- PWA: manifest.json (theme #7c3aed), PNG icons (192×512px + maskable), "Add to Home Screen" card
- Mobile audit: Fixed 20 issues—touch targets min-h-[44px], responsive grids (grid-cols-1 sm:grid-cols-2 md:grid-cols-3), padding (p-3 sm:p-5), rating popup overflow fix

## 2026-05-06: Mobile Polish Cleanup

- Fixed 10 nice-to-have mobile items: responsive image heights, padding consistency, textarea sizing
- Grid columns adaptive breakpoints, container heights, close button touch targets (min-h-[44px])
- Files: 10 modified (ProductCard, QuickRateCard, RecommendedCard, FilterPanel, Community, Dashboard, Products, About, Credits, Recommendations)
- TypeScript clean ✓

## Pattern: Mobile-First Responsive Classes

- Use `h-auto sm:h-[200px]` for responsive image heights instead of fixed heights
- Padding: `p-3 sm:p-4 md:p-5` for scalable spacing
- Touch targets: Always `min-h-[44px]` + `inline-flex items-center justify-center` for buttons
- Grids: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4` for adaptive layouts
