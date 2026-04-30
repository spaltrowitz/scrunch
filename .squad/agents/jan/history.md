# Jan — Product Design History

## Learnings

- The app uses a shared `ProductImage` component (in `src/hooks/useProductImage.tsx`) as the single rendering point for all product images across the app. Any placeholder/fallback logic lives there.
- Product categories are defined as a union type in `database.types.ts` — 14 total categories covering the full curly hair routine.
- The color palette centers on violet/purple (`--color-primary: #7c3aed`). Tailwind classes used directly, no design tokens beyond CSS vars in index.css.
- Pre-existing build/lint errors exist in the codebase (Supabase `never` type inference, React refresh warnings) — don't chase those.
- Category-based visual differentiation (icon + gradient) is more informative than brand-initial-only placeholders, especially for users scanning a list of products.

---

## 2026-04-30: Homepage UX Review

**Context:** Discovery-first homepage redesign — products lead, no gates before value.

**What I reviewed:**
- `src/pages/Home.tsx` — main homepage implementation
- `src/components/products/ProductPlaceholder.tsx` — imageless product handling
- `src/components/products/ProductCard.tsx` — product display component
- `src/App.tsx` — routing structure
- `src/lib/constants.ts` — category labels and configuration

**Key findings:**
1. Homepage successfully implements discovery-first philosophy — categories visible immediately, no login gate
2. Category grid is intuitive with user-friendly labels (not database snake_case)
3. "CG status" jargon in hero copy is barrier for Newbie persona
4. No price information hurts Budget Builder persona — need to set expectations
5. Fallback to seed data on Supabase error is invisible — users don't know they're seeing cached data
6. Placeholder UX is well-designed with category icons and tooltip, but "Image coming soon" may overpromise

**4 Must-Haves for Alpha:**
1. Rewrite hero copy to remove jargon and improve 3-second recognition
2. Add "Why no price?" tooltip for Budget Builders
3. Surface fallback-to-seed state visibly
4. Add parallel entry points for each persona (not gates — paths)

**Deliverable:** Full recommendations in `.squad/decisions/inbox/jan-homepage-ux.md`
