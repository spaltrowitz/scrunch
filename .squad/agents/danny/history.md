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

### 2026-05-01: Supabase Fallback Banner Fix
- **Root cause:** The `PRODUCT_SELECT` string in `useProducts.ts` included a `status_conflict` column that doesn't exist in the Supabase `products` table. PostgREST returned error code 42703 ("column does not exist"), which the query handler treated as a failure and fell back to seed data.
- **Why curl worked:** Direct curl without the bad column select returned data fine. The issue was specifically in the column list the app was requesting.
- **Fix:** Removed `status_conflict` from the select string, the Product type interface, the seedToProduct mapper, and the Database type definitions.
- **Lesson:** When TypeScript types drift from the actual DB schema, the app can silently degrade. The `as unknown as Product[]` cast masked the real error. Consider using `supabase gen types` to keep types in sync with the actual schema.
- **CORS verified:** Supabase correctly returns `access-control-allow-origin: https://spaltrowitz.github.io` — no CORS issues.
- **RLS verified:** Anonymous reads work fine with the anon key — RLS policies allow public read on products.

### 2026-05-02: Community Search Relevance Fix
- **Root cause (relevance):** Two compounding issues — (1) long natural language queries confuse Reddit's search engine, returning popular posts instead of relevant ones; (2) results were re-sorted by upvote score (`sort by b.score - a.score`), destroying Reddit's relevance ordering and surfacing viral posts over topical matches.
- **Fix (relevance):** Added `extractSearchTerms()` that strips stop words and limits to 6 key terms (e.g., "bangs wavy dry styling taylor swift" from a full paragraph). Removed the score-based re-sort — results now stay in Reddit's relevance order.
- **Fix (summary honesty):** Replaced fake "AI Summary" (`generateAiAnswer`) with honest `generateSummary` — plain text like "Found 8 related discussions across r/curlyhair, r/wavyhair." No markdown, no pretend analysis. Badge changed from "🤖 AI Summary" to "📋 Community Results".
- **Fix (markdown leaking):** Added `stripMarkdown()` utility that removes `**bold**`, `_italic_`, `> blockquotes`, `# headings`, `[links](url)`, and `` `code` `` from Reddit selftext snippets before display. Applied during result mapping.
- **Lesson:** Reddit search works best with 4-6 keyword terms. Natural language queries return noise. Always extract terms before hitting their API.

### 2026-05-02: Community Search Relevance Redesign (v2)
- **Root cause:** `extractSearchTerms()` was naive — stripped stop words and took first 6 remaining words. For long natural-language queries like "how can i make my bangs dry well when they dry naturally... taylor swift folklore era", it produced garbage terms like "bangs dry naturally place wavy taylor" that Reddit couldn't match.
- **Fix — Domain-aware keyword extraction:** Added `HAIR_TERMS` set (~80 hair-domain words) and `COMPOUND_TERMS` list (~30 multi-word phrases like "air dry", "deep condition", "low porosity", "curly girl"). Extraction now: (1) finds compound terms first, (2) prioritizes hair domain terms, (3) drops celebrity/pop culture noise via `NOISE_WORDS`, (4) pads with remaining terms up to 5 total.
- **Fix — Multi-query strategy:** Each subreddit now gets searched with TWO queries — a primary (up to 5 domain terms) and a fallback (just the top 2 terms). Results are deduped by URL. This doubles the chance of finding relevant posts since Reddit's simple keyword matching often misses on longer queries.
- **Fix — Relevance filtering:** Posts with 0 comments are deprioritized (nobody engaged = not useful). Results are ranked by: title keyword matches (×100 boost per match) + comment count (capped at 50, ×2). Posts whose titles contain search terms float to top.
- **Test results after fix:**
  - "bangs dry naturally... taylor swift folklore" → Primary: "bangs dry wavy", Fallback: "bangs dry" (was: "bangs dry naturally place wavy taylor")
  - "best gel for 3B low porosity hair" → Primary: "low porosity gel 3b", Fallback: "low porosity gel"
  - "how often should I deep condition" → Primary: "deep condition", Fallback: "deep condition"
  - "curly girl method for beginners" → Primary: "curly girl method beginners", Fallback: "curly girl method"
- **Lesson:** For domain-specific search over a dumb search engine (Reddit), you need a domain vocabulary to separate signal from noise. Generic NLP (stop word removal) isn't enough — you need to know what the domain cares about.
