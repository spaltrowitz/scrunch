# Plan — React Query migration

## Goal
Move Supabase data fetching from `useEffect` + `useState` to React Query, add shared hooks, and convert write operations to `useMutation` without changing UI behavior.

## Approach
1. **QueryClient defaults**
   - Update `src/App.tsx` to initialize `QueryClient` with `{ defaultOptions: { queries: { staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000 } } }`.

2. **Shared hooks** (`src/hooks/useProducts.ts`)
   - Add `useProducts()`, `useProduct(id)`, `useUserReviews(userId)`, `useUserProfile(userId)` using `useQuery` and the required query keys.
   - Keep SEED_PRODUCTS fallback inside the products query function via dynamic import and map to a `Product`-shaped fallback object (empty `ingredients`, `flagged_ingredients`, etc.) so recommendation logic stays safe.

   ```ts
   export function useProducts() {
     return useQuery({
       queryKey: ['products'],
       queryFn: async () => {
         const { data, error } = await supabase.from('products').select('*')
         if (!error && data?.length) return dedupeProducts(data as Product[])
         const { SEED_PRODUCTS } = await import('../data/seedProducts')
         return SEED_PRODUCTS.map((p, i) => seedToProduct(p, i))
       },
     })
   }
   ```

3. **Page migrations**
   - **Home.tsx**: replace `useEffect`/`useState` with `useProducts()` and `const { data, isLoading, error }`.
   - **Products.tsx**: use `useProducts()` + `useUserReviews(user.id)`; replace Supabase writes with `useMutation` (delete review, upsert rating, upsert notes), invalidate `['reviews', user.id]` after success.
   - **Recommendations.tsx**: use `useProducts()`, `useUserReviews(user.id)`, `useUserProfile(user.id)`; compute tiers in memo/effect; move collaborative Supabase reads into `useQuery` (e.g., `['collab-recs', userId, ...]`) with `enabled`; convert rating/dismiss writes to `useMutation` and invalidate `['reviews', user.id]`.
   - **ProductDetail.tsx**: use `useProduct(id)` and a dedicated `useQuery` for product reviews; use `useMutation` for rating submission and invalidate `['product', id]` + product reviews query.
   - **Profile.tsx**: use `useUserProfile(user.id)` for profile data.
   - **MyProducts.tsx**: use `useUserReviews(user.id)` for reviews.
   - (Optional to satisfy “all Supabase fetches” directive) **Dashboard.tsx** + **OnboardingWizard.tsx**: replace profile/review `useEffect` fetches with shared hooks and useMutation for profile upsert.

4. **Docs + decisions**
   - Append learnings to `.squad/agents/cha-cha/history.md`.
   - Add `.squad/decisions/inbox/cha-cha-react-query-patterns.md` documenting query keys and shared hook usage.

5. **Validation**
   - Run `npm run build` and `npm test`.
   - Commit changes with descriptive message.

## Trade-offs
- Using a single `useUserReviews` query with `select('*, products(*)')` is heavier for `Products`/`Dashboard`, but keeps hooks simple and matches current MyProducts/Recommendations needs.
- Fallback seed mapping fills required `Product` fields with safe defaults (empty arrays) to avoid runtime errors in recommendation logic.

## Todo list
- [x] Update QueryClient defaults in `App.tsx`.
- [x] Add `src/hooks/useProducts.ts` (queries + seed fallback mapping).
- [x] Migrate Home, Products, Recommendations, ProductDetail, Profile, MyProducts to hooks + `useMutation`.
- [x] (If in scope) Migrate Dashboard and OnboardingWizard to hooks + `useMutation`.
- [x] Update history + decision inbox docs.
- [x] Run `npm run build` and `npm test`.
- [x] Commit changes.
