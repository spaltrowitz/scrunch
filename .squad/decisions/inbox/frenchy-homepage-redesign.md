# Decision: Homepage Redesign — Discovery-First

**Author:** Frenchy  
**Date:** 2025-01-27  
**Status:** Implemented

## Context
The original homepage was a marketing-style hero page with an ingredient checker as the primary CTA. Per team decisions, the homepage should lead with browsable products and serve all 4 personas on day one without any gate.

## Decision
1. **Category cards as primary navigation** — 14 product categories displayed as a clickable grid with icons and product counts
2. **Sticky filter bar** — CG status, category, and brand dropdowns always visible below header (not behind a menu)
3. **Product grid with 40-item cap** — cards show image, name, brand, CG badge. Links to "View all" for overflow
4. **"New to curly hair?" section** — bottom of page, links to ingredient checker. Not a gate, just discoverable
5. **Same homepage for logged-in and logged-out** — removed conditional routing to Dashboard. Dashboard still available at `/dashboard`
6. **Search stays in header** — accessible but secondary per team decision

## Trade-offs
- Showing 40 products max on homepage keeps initial load fast; users can go to `/products` for full browse
- No personalization on homepage yet — that's a future P1 task once user profiles exist
- Category icons are emoji-based — lightweight, no asset pipeline needed, easy to swap later
