# Orchestration: Cha-Cha — Quick Wins (Column Narrowing & Dynamic Import)

**Timestamp:** 2026-04-30T19:40:00Z  
**Agent:** Cha-Cha (⚡ Performance Optimizer)  
**Branch:** spaltrowitz/add-product-request-validation  
**Status:** ✅ Complete and Committed

---

## Directive

Execute Quick Wins #2 and #3 from the performance audit (2026-04-30):
- **Quick Win #2:** Narrow 9 `select('*')` calls across 6 files to only required columns
- **Quick Win #3:** Dynamic import `seedProducts.ts` (69KB) on failure path only

Both changes preserve functionality while reducing over-fetching and bundle bloat.

---

## Scope

**Files modified:**
- `src/pages/Home.tsx` — products query narrowed from `*` to 8 named columns; `seedProducts` dynamic import
- `src/pages/Products.tsx` — products query (9 cols) + reviews query (4 cols); dynamic import
- `src/pages/Profile.tsx` — profile query narrowed from ~22 to 17 columns
- `src/pages/MyProducts.tsx` — nested query: reviews (5 cols) + product join (4 cols)
- `src/pages/ProductDetail.tsx` — products (12 cols) + reviews with profile join (6 cols)
- `src/pages/Recommendations.tsx` — 5 separate queries narrowed (profile 9→22, reviews 7 cols, products 10 cols for scoring, collab 8 cols, refresh same as initial)

**Key insight:** Recommendations.tsx requires `ingredients` for scoring logic but collab rec products can use display-only columns since they skip ingredient matching.

---

## Results

✅ **9 `select('*')` calls narrowed to named columns**
- Home: 8 cols (dropped ~12 unused columns including `ingredients[]`)
- Products: 9 + 4 cols
- Profile: 17 cols
- MyProducts: nested select (reviews + products join)
- ProductDetail: 12 + 6 cols  
- Recommendations: 5 separate queries, context-aware column selection

✅ **`seedProducts.ts` (69KB) dynamically imported**
- Converted static imports to `await import()` in Home.tsx and Products.tsx
- Only loads on Supabase fetch failure (error path)
- Vite code-splits into separate chunk, removed from initial bundle

✅ **Build & tests passing**
- `npm run build` — no errors, bundle size reduced
- `npm run test` — all tests pass

✅ **Committed**
- Branch: spaltrowitz/add-product-request-validation

---

## Standards Applied

Per Decisions entry 2026-04-30T19:34:00-04:00:
- ✅ Standard #2: Never `select('*')` — always list columns
- ✅ Standard #4: No static imports for fallback/seed data

---

## Next Steps

- Ready for PR review and merge
- Cha-Cha moving to Quick Win #1: Full React Query migration (queued for parallel execution)
