# Decisions Log

## Decision: Branded Product Placeholder Design

**Date:** 2025-01-20  
**Author:** Jan (Product Design)  
**Status:** Implemented

### Context

47 products in the seed data have no `image_url`. Previously, the fallback was a colored square showing brand initials (e.g. "SM" for SheaMoisture). This looked unintentional and gave users no category context.

### Decision

Created `ProductPlaceholder.tsx` — a category-aware placeholder that renders:
1. **Category emoji icon** (e.g. 🧴 for shampoo, ☁️ for curl cream, ✨ for gel)
2. **Brand name** in semibold gray-700
3. **Product name** in lighter gray-500

Each category gets a unique soft gradient background (e.g. blue for shampoo, pink for conditioner, violet for curl cream) that maps to intuitive color associations.

### Alternatives Considered

- **Keep brand-initial squares**: Too minimal, no category signal, looks broken.
- **SVG icons per category**: More polished but adds maintenance burden and icon library dependency. Emoji is zero-dependency and universally readable on mobile.
- **Generic "no image" placeholder**: Common pattern but loses the opportunity to communicate product type at a glance.

### Integration

The placeholder is consumed via `ProductImage` — the existing single point of truth for product image rendering. When no image is found (seed URL missing + Open Beauty Facts API miss + image load error), it falls back to `ProductPlaceholder`. The `category` prop was added to `ProductImage` and threaded through all call sites.

### Impact

- All 47 products without images now show an intentional, informative placeholder.
- No new dependencies added.
- Mobile-first: tested at w-10, w-14, w-16, w-20, w-28 sizes used across the app.

---

## Decision: Homepage Redesign — Discovery-First

**Author:** Frenchy  
**Date:** 2025-01-27  
**Status:** Implemented

### Context
The original homepage was a marketing-style hero page with an ingredient checker as the primary CTA. Per team decisions, the homepage should lead with browsable products and serve all 4 personas on day one without any gate.

### Decision
1. **Category cards as primary navigation** — 14 product categories displayed as a clickable grid with icons and product counts
2. **Sticky filter bar** — CG status, category, and brand dropdowns always visible below header (not behind a menu)
3. **Product grid with 40-item cap** — cards show image, name, brand, CG badge. Links to "View all" for overflow
4. **"New to curly hair?" section** — bottom of page, links to ingredient checker. Not a gate, just discoverable
5. **Same homepage for logged-in and logged-out** — removed conditional routing to Dashboard. Dashboard still available at `/dashboard`
6. **Search stays in header** — accessible but secondary per team decision

### Trade-offs
- Showing 40 products max on homepage keeps initial load fast; users can go to `/products` for full browse
- No personalization on homepage yet — that's a future P1 task once user profiles exist
- Category icons are emoji-based — lightweight, no asset pipeline needed, easy to swap later
