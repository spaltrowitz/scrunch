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
