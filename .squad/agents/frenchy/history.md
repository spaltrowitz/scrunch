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
- **Added 3 new sections to Home.tsx:** "How It Works" (3-step education cards: Browse → Rate → Get Matches), "Why Scrunch?" (3 differentiation cards vs. competitors), and enhanced hero with sub-heading + soft anchor link ("See how it works").
- **Section order:** Hero -> How It Works -> Why Scrunch? -> Trending on #HairTok (HairTok repositioned per Sandy's plan).
- **Pattern:** New sections use consistent card styling (border border-gray-200, bg-white, rounded-lg, p-6) and grid pattern (grid-cols-1 md:grid-cols-3).
- **Anchor linking:** "See how it works" in hero links to `#how-it-works` section ID. Note: HashRouter may interfere with anchor scroll - test in browser.
- **Implementation:** No new components extracted - all JSX inline in Home.tsx for readability.
- **Validation:** TypeScript clean, build succeeds, no lint errors.
- **Implements:** Sandy's homepage enrichment plan (sections 1-4), addressing adoption gap and clarifying visitor flow.

## Session Archive Summary

Frenchy completed 13+ sessions: homepage redesign (discovery-first → Prose-inspired), performance decomposition (Products.tsx 661→280 lines), ProductPlaceholder tooltip, toast notification system (7 mutations wired), Jan's UX recommendations (10/13 implemented), homepage declutter, HairTok section, community page polish, beta UX fixes (empty state, mobile CTAs), lint fixes (setState-in-effect, fast refresh, exhaustive-deps), SEO improvements (CategoryPage, dynamic titles, deep links), copy/visual polish passes, and homepage enrichment (How It Works + Why Scrunch sections). All sessions maintained 26/26 tests green.

## Learnings

### SEO & Landing Pages (2026 session)
- **SPA SEO limitations:** HashRouter means Google won't deeply index hash-fragment routes. JSON-LD structured data in `index.html` helps surface the app in search results as a WebApplication + FAQPage.
- **Category landing pages:** Created `CategoryPage.tsx` with route `/category/:slug`. Slugs are auto-derived from `ProductCategory` keys (underscores → hyphens). Reuses `useCatalogProducts()` hook.
- **Dynamic page titles:** `usePageTitle` hook in `src/hooks/usePageTitle.ts` — route-based title map with override support. Wired globally via `PageTitleUpdater` component inside `AppRoutes`. ProductDetail and CategoryPage use override for dynamic titles.
- **Products page deep links:** Added `useSearchParams` to Products.tsx so `?category=curl_cream` pre-selects the filter. CategoryPage CTA links to this.
- **`ProductImage` component signature:** Takes `{ brand, name, seedImageUrl, category, className }` — not a product object. `seedImageUrl` maps to product's `image_url` field.
- **Vite base path:** `base: '/scrunch/'` in vite.config.ts — all absolute URLs in meta tags must include this prefix.

### Homepage Enrichment (2026 session)
- **Added 3 new sections to Home.tsx:** "How It Works" (3-step education cards), "Why Scrunch?" (3 differentiation cards), and enhanced hero with sub-heading + anchor link.
- **Section order:** Hero -> How It Works -> Why Scrunch? -> Trending on #HairTok (HairTok moved down per Sandy's plan).
- **Pattern:** New sections use same card styling (border border-gray-200, bg-white, rounded-lg, p-6) and grid pattern (grid-cols-1 md:grid-cols-3).
- **Anchor linking:** "See how it works" in hero links to `#how-it-works` section ID. Note: HashRouter may interfere with anchor scroll - test in browser.
- **No new components or dependencies added** - pure JSX additions to Home.tsx.
- **No em dashes used** - hard rule across the app.

### PWA Support (2026 session)
- **Created `public/manifest.json`** with app name, theme color (#7c3aed violet), standalone display mode, and icons (SVG + PNG 192/512 + maskable variants).
- **Updated `index.html`** with manifest link, apple-touch-icon, theme-color meta, apple-mobile-web-app-capable/title metas.
- **Generated PNG icons** from favicon.svg using sharp-cli (192px and 512px, plus maskable copies).
- **Added "Add to Home Screen" instructions** to About.tsx - a card section above the credits with iPhone/iPad and Android steps in a 2-column grid.
- **No service worker added** - that's a bigger task. Current setup enables basic PWA metadata and "Add to Home Screen" prompts on Android Chrome. iOS Safari will use the apple-mobile-web-app-* metas.
- **Base path:** All manifest/icon paths use `/scrunch/` prefix matching vite.config.ts `base`.

## 2026-05-06: PWA Implementation (Baseline)

- Added manifest.json with app metadata (name, theme color, icons)
- Generated PNG icons (192x192, 512x512) from SVG favicon
- Added "Add to Home Screen" install instructions to About page
- Deliberately deferred service worker (offline caching) to avoid complexity; documented trade-off
- Key decision: PWA basics now, offline layer later
