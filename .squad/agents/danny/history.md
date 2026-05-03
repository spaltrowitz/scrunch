# Danny — History

## Key Patterns & Corrections

### Product Image Sourcing
- **INCIDecoder GCS** is the #1 source (highest hit rate, clean product-on-white photos).
- **Priority waterfall:** INCIDecoder → Ulta media CDN (`?w=400`, check placeholder hash) → Sephora CDN (SKU from product page) → Sally Beauty Scene7 → Garnier USA CDN → Shopify brand stores.
- **Sources that DON'T work:** Amazon (403), Walmart (404), Target (403), SheaMoisture Demandware (403), Open Beauty Facts (near-zero curly hair coverage).
- **Ulta caveat:** Without `?w=400` returns tiny thumbnail. Verify against placeholder hash `43eed7447d66573a67e2bc6e10858ab5`.
- **Current coverage:** ~98% (only 5 null: Monday Curl Define, TJ Conditioner, Ouai Hydrating Cream, Cantu Flaxseed Oil, SM Coconut Oil).

### Performance Fixes
- **Dashboard count query:** `select('id', { count: 'exact', head: true })` — zero row transfer for count-only use cases.
- **Product dedup:** O(n²) `filter+findIndex` → O(n) Map-based dedup in `useProducts`.
- **Reddit API parallelization:** Sequential `for` loop → `Promise.all()` for concurrent subreddit fetches.
- **Supabase fallback fix:** `PRODUCT_SELECT` included nonexistent `status_conflict` column → PostgREST 42703 error → silent seed data fallback. Removed the column from select/types/mapper.
- **Instant render:** Added `placeholderData` to hooks (seed products, empty array, 0), `staleTime: 5min` to ALL hooks. Removed loading gates — render with defaults, upgrade reactively.
- **Recommendations instant load:** Changed loading gate to only block if zero products available. Inline loading indicators replace full-page spinners.

### Community Search
- **Domain-aware keyword extraction:** `HAIR_TERMS` set (~80 words) + `COMPOUND_TERMS` (~30 phrases). Drops celebrity/noise words. Limits to 5 terms.
- **Multi-query strategy:** Primary (5 domain terms) + fallback (top 2 terms) per subreddit. Dedup by URL.
- **Relevance ranking:** Title keyword matches (×100 boost) + comment count (capped 50, ×2). Zero-comment posts deprioritized.
- **Honest labeling:** Replaced fake "AI Summary" with plain-text "Community Results" summary. `stripMarkdown()` utility for Reddit selftext.
- **Fallback UI:** `SearchStatus = 'ok' | 'no_results' | 'error'`. Amber banner (no results) vs red banner (error) with retry. Never disguise navigation as content.

### Catalog & Categories
- **New categories:** `scalp_care` and `bond_repair`. 3 new products added, 6 existing tagged as HairTok trending.
- **Category audit:** 7 products recategorized (3 protein_treatment→bond_repair, 4 oil_serum→scalp_care). 1 duplicate removed.
- **Lesson:** Bond-repair ≠ protein treatment (disulfide bonds vs keratin). Category = primary use case, not product format.
- **Before adding products:** Always grep existing seed data — catalog is 400+ lines.
- **Type validation:** Task descriptions use informal category names — always validate against TypeScript union type.

## Cross-Project Backend Knowledge (injected 2026-05-02)

### From EatDiscounted (Fenster)
- **Rate limiting:** Per-IP sliding window. Return 429 + `Retry-After`. Verify rate limits are wired in, not dead code.
- **In-memory caching:** TTL-based (1hr API, 5min sitemaps). Key: `entity::source`. Lost on deploy — needs Redis for serverless.
- **Search API migration:** Google CSE (100/day) → Brave Search (2,000/month). Always have fallback + know quota ceiling.
- **Direct API integrations:** Check for public REST APIs before search-scraping.
- **Security:** `.env.local` in `.gitignore`. Check git history for exposure. Rotate keys.

### From MyDailyWin (Daruk, alumni)
- **Firebase Auth + Firestore:** Document ownership via `ownerEmail` + admins subcollection. Never trust localStorage for authorization.
- **CSP headers:** Enforced in `firebase.json`. Update `connect-src` when switching APIs.
- **Firestore rules:** `request.auth != null` alone is too permissive — need ownership scoping + field validation.

### From Slotted (Zuko, alumni)
- **Security:** Fail-closed admin auth. Strip sensitive fields from all responses. Always add new token fields to sensitive list.
- **OAuth token storage:** Supabase Vault encryption. Old columns renamed `_deprecated` for rollback.
- **Google webhooks:** Always return 200 or Google deactivates endpoint. Stale sync (410) → clear and retry.
- **Race conditions:** AFTER UPDATE trigger + FOR UPDATE lock. Use `ON CONFLICT` upserts.
- **Account deletion:** CASCADE + cancel meetups + notify + clear OAuth + delete blocked_users.

### From HealthStitch (Wash)
- **Sync:** WHOOP = backend-pull, Apple Watch = iOS-push. Different strategies per source.
- **Metric normalization:** WHOOP RMSSD ≠ Apple SDNN for HRV. Separate baselines per source.
- **PostgreSQL migration:** `datetime('now')` → `NOW()`, `INSERT OR IGNORE` → `ON CONFLICT DO NOTHING`.

## Session Archive Summary

Danny completed 10+ sessions: product image sourcing across 3 phases (28→52→64 URLs applied, reaching ~98% coverage), backend performance fixes (count queries, O(n) dedup, Reddit parallelization), Supabase fallback diagnosis (status_conflict column), community search relevance redesign (domain-aware extraction, multi-query strategy, honest labeling, fallback UI), instant render optimization (placeholderData + staleTime across all hooks, removed loading gates), HairTok product catalog expansion (2 batches, 10 new products, 2 new categories), and product categorization audit (7 recategorized, 1 duplicate removed).
