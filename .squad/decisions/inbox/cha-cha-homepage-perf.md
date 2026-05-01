### 2025-07-26: Homepage uses separate lightweight query hook

**By:** Cha-Cha (Performance Optimizer)
**What:** Homepage now uses `useHomeProducts()` instead of `useProducts()`. This hook fetches only 7 columns (vs 22), limits to 20 rows, orders by review_count, and shows bundled seed data instantly via `placeholderData`.
**Why:** Full product query took 1.3s+ on Supabase free tier cold starts. Homepage only needs display fields for product cards. Seed data placeholder eliminates blank loading state.
**Impact:** Products page, ProductDetail, and Recommendations still use `useProducts()` / `useProduct()` with full column set — no change to those queries. The `['products', 'home']` query key is separate from `['products']` so caches are independent.
**Trade-off:** Seed data (70KB) now loads with the Home route chunk instead of only on error fallback. Accepted: instant perceived load > smaller bundle for the landing page.
