# React Query patterns — products/profile/reviews

## Query key conventions
- Products list: `['products']`
- Product detail: `['product', id]`
- User reviews: `['reviews', userId]`
- User profile: `['profile', userId]`
- Product reviews (detail page): `['product-reviews', id]`
- Collaborative recs: `['collab-recs', userId, curlPattern, porosity, ratedIds, dislikedCategories]`

## Shared hook usage
- Use `useProducts()` for product lists across Home/Products/Recommendations.
- Use `useProduct(id)` for product detail views.
- Use `useUserReviews(userId)` for user review data (joined to products).
- Use `useUserProfile(userId)` for profile reads.
- `useProducts()` owns the seed fallback via dynamic import and maps seeds to safe `Product` defaults.

## Mutation patterns
- Use `useMutation` for all Supabase writes (ratings, notes, dismissals, profile save).
- Invalidate `['reviews', userId]` after review mutations; invalidate `['product', id]` + `['product-reviews', id]` after product-detail writes.
