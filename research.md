# Research — React Query migration

## Current React Query setup
- `src/App.tsx` creates `new QueryClient()` with no default options and wraps the app in `QueryClientProvider`.

## Supabase data fetching (useEffect + useState)
- `src/pages/Home.tsx` loads products via `supabase.from('products').select('*')` with SEED_PRODUCTS fallback; stores `products` + `loading` in state.
- `src/pages/Products.tsx` loads products via `supabase.from('products').select('*')` with SEED_PRODUCTS fallback; loads user reviews via `supabase.from('product_reviews').select('*').eq('user_id', user.id)`; uses Supabase mutations for delete/upsert rating + note.
- `src/pages/Recommendations.tsx` uses `loadData` to fetch profile, user reviews, and products; additional Supabase calls for collaborative filtering; Supabase mutations for rating/dismiss.
- `src/pages/ProductDetail.tsx` uses `loadProduct` to fetch product + reviews; Supabase mutation to upsert a rating.
- `src/pages/Profile.tsx` loads profile via `supabase.from('profiles').select('*').eq('id', user.id).single()`.
- `src/pages/MyProducts.tsx` loads reviews via `supabase.from('product_reviews').select('*, products(*)').eq('user_id', user.id)`.
- `src/pages/Dashboard.tsx` uses `Promise.all` in `useEffect` to fetch profile completion + review count.
- `src/components/onboarding/OnboardingWizard.tsx` loads profile via `supabase.from('profiles').select('*').eq('id', user.id).single()` when editing; upserts profile on save.

## Seed data
- `src/data/seedProducts.ts` defines `SeedProduct` (no `id`, `ingredients`, or other `Product` fields) and exports `SEED_PRODUCTS`.

## Mutation hotspots
- Products page: delete review, upsert review rating, upsert notes.
- Product detail: upsert review rating + notes.
- Recommendations: upsert review rating, upsert dismiss review.
- Onboarding wizard: upsert profile.
