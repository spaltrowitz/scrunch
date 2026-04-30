# History
# Danny — Backend Dev History

## Project Context
- **Project:** Scrunch — curly hair care app
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Supabase, React Query, React Router, Vitest
- **Deployment:** GitHub Pages
- **User:** Shari Paltrowitz

## Learnings

### 2025-07-24: Product Image Audit
- **Open Beauty Facts** covers ~23% of our curly hair products (25/108 missing). Best for mass-market brands that have been scanned (SheaMoisture, Cantu, Garnier, Aussie, Herbal Essences).
- **Shopify CDN** is the dominant pattern — most indie curly brands (DevaCurl, Kristin Ess, Seen, Innersense, Ouai, Pattern, Mielle, etc.) use Shopify. URL pattern: `{brand-domain}/cdn/shop/files/{filename}.jpg` or `cdn.shopify.com/s/files/1/{shop-id}/files/{filename}.jpg`.
- **L'Oréal brands** (Mizani, Redken, Pureology, Kérastase, Bumble and Bumble) use proprietary CDNs that block automated access — need manual image sourcing.
- **Mass-market brands** (Suave, VO5, LA Looks, Wetline Xtreme) typically only have product images on retailer sites (prohibited sources).
- **Giovanni** uses Shopify but blocks automated og:image extraction on most product pages.
- DevaCurl CDN filenames follow pattern: `{Product-Name-Size}.jpg` (e.g., `No-Poo-Original-12oz.jpg`).

### 2025-07-24: Image URL Application (Phase 1)
- Applied 28 verified product image URLs to seedProducts.ts (out of 108 null entries).
- Sources: DevaCurl Shopify CDN (5), Open Beauty Facts API (8), Shopify /products.json endpoint (5), og:image scraping (10).
- **SheaMoisture** site uses JavaScript-rendered pages — OBF is the only viable source, but coverage is sparse.
- **Curls (curls.biz)** blocked /products.json and og:image extraction — neither Shopify API nor page scraping works.
- **Kristin Ess** returns connection timeouts — site may block automated requests entirely.
- **Pattern Beauty** has >160 products on Shopify but product naming doesn't match our DB entries well (e.g., "Indigo Rain Leave-In Conditioner" vs "Leave-In Conditioner").
- **Giovanni Cosmetics** redirects all product pages to the same og:image (banner) — only the L.A. Hold Gel had a unique product-specific CDN file.
- Many brands (Mizani, Redken, Pureology, Aveda, Bumble and Bumble) block all automated access — need manual sourcing or brand outreach.
- 80 products remain with null images. Next steps: manual sourcing for L'Oréal family, brand outreach for indie brands, deeper OBF barcode search.

### 2026-04-30: Image URL Recovery (Phase 2)
- Recovered 24 additional product image URLs from Shopify CDNs and Open Beauty Facts.
- Current coverage: **80% (224/280 products)** — up from 73% (204/280).
- Sources: Shopify /products.json (12 URLs: DevaCurl, Innersense, Ouai, Pattern, Mielle), OBF API (8 URLs: SheaMoisture, Cantu, Garnier, Aussie, Herbal Essences), og:image extraction (4 URLs).
- Remaining blockers for 56 null entries: L'Oréal family (proprietary CDNs), Curls/Kristin Ess (dynamic rendering), Giovanni (Shopify blocks extraction), retailer-only brands (no brand CDNs).
- Recommendation: Manual sourcing for L'Oréal family, brand outreach for indie blockers, retailer partnerships for mass-market bottlenecks.

### 2026-04-30: Backend/Data Performance Fixes
- **Dashboard count query**: Created `useUserReviewCount` hook using `select('id', { count: 'exact', head: true })` — transfers zero rows instead of all review rows. Dashboard only needs the count, not the data.
- **Product dedup**: Replaced O(n²) `filter+findIndex` approach in `dedupeProducts()` with O(n) Map-based dedup. Used in `useProducts` hook shared by Home and Products pages.
- **Reddit API parallelization**: Converted sequential `for` loop over subreddits to `Promise.all()` in Community.tsx `searchReddit()`. Both subreddit fetches now run concurrently.
- **Already fixed (no changes needed)**: Recommendations `rateMutation` and ProductDetail `submitRatingMutation` both already use `queryClient.invalidateQueries()` with proper query keys — no manual re-fetch happening.
- **Collaborative filtering**: Confirmed the 3 sequential queries (profiles → reviews → products) have true data dependencies — each query's parameters depend on the previous result. Cannot be parallelized without restructuring the algorithm.
- **Pattern established**: For count-only use cases, always use `select('id', { count: 'exact', head: true })` and read the `count` from the response instead of fetching rows and using `.length`.
