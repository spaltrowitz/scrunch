# Jan — Product Design History

## Learnings

- The app uses a shared `ProductImage` component (in `src/hooks/useProductImage.tsx`) as the single rendering point for all product images across the app. Any placeholder/fallback logic lives there.
- Product categories are defined as a union type in `database.types.ts` — 14 total categories covering the full curly hair routine.
- The color palette centers on violet/purple (`--color-primary: #7c3aed`). Tailwind classes used directly, no design tokens beyond CSS vars in index.css.
- Pre-existing build/lint errors exist in the codebase (Supabase `never` type inference, React refresh warnings) — don't chase those.
- Category-based visual differentiation (icon + gradient) is more informative than brand-initial-only placeholders, especially for users scanning a list of products.
