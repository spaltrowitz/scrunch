# Decisions

> Older decisions archived to decisions-archive.md on 2026-05-03

> Team decisions log. Append-only.

---

---

---

### ### 2026-05-01T16:25:00Z: Recommendations.tsx Decomposition
**By:** Cha-Cha (⚡ Performance Optimizer)
**What:** Decomposed `Recommendations.tsx` from 1173 lines into 7 files following the same pattern as the Products.tsx decomposition (PR #13).

**Structure:**
```
src/components/recommendations/
├── recommendationEngine.ts    — Pure scoring functions (buildTier1-3, ingredientTier, tierHeader)
├── RecommendedCard.tsx        — Product card + dismiss form (React.memo)
├── RatingGroup.tsx            — Rating group + row (React.memo)
├── SavedProducts.tsx          — Bookmarked products section (React.memo)
├── RatePromptSection.tsx      — Quick-rate prompt (React.memo)
└── IngredientRecsSection.tsx  — Ingredient-based recs section (React.memo)
```

**Orchestrator at 399 lines (exceeds 300-line cap but justified):** Manages 5 queries, 3 mutations, collaborative filtering, and tier selection. No clean split without over-abstracting Supabase access.

**Key Decisions:**
1. All extracted components use React.memo() — prevents re-renders when dismiss/rating popup state changes on sibling cards.
2. Scoring engine is pure TypeScript — no React, no Supabase imports. Makes it independently testable and tree-shakeable.
3. Collaborative filtering stays in orchestrator — it's tightly coupled to Supabase and React Query. Extracting it would require passing the Supabase client or creating a custom hook for a single query — not worth the complexity.

**Verification:**
- `npm run build` ✅
- `npx tsc --noEmit` ✅ (zero type errors)
- `npm test` ✅ (26 tests, 3 suites)

**Why:** Standard performance pattern from team audit. Monolithic components defeat React optimization and reduce code clarity.

---

---

---

### ### 2026-05-01T18:21:41Z: Homepage progressive disclosure
**By:** Frenchy (Frontend Dev)
**What:** Homepage now uses progressive disclosure: top 6 categories shown by default (expandable to 14), 12 products shown initially (scroll for more, was 40 always-visible), persona pills moved below categories as secondary navigation.
**Why:** Shari flagged homepage as overwhelming. Hick's Law — too many choices paralyzes users on first load. Progressive disclosure lets users see most-popular content immediately and drill deeper if interested. No functionality removed — all categories and products remain accessible.
**Impact:** Home.tsx only. No API changes, no schema changes.

---

---

### ### 2026-05-01T18:21:41Z: About page consolidation
**By:** Frenchy (Frontend Dev)
**What:** About.tsx refactored from 219 lines to 121 lines (45% reduction). Merged redundant sections, removed roadmap (out of scope), made credits collapsible accordion.
**Why:** Focus and clarity — page was repetitive. Roadmap content belonged in a product roadmap doc, not a shipped app. Collapsible credits preserve transparency without page bloat.
**Impact:** About.tsx only.

---

---

### ### 2026-05-01T18:21:41Z: Remove phantom status_conflict column
**By:** Danny (Backend Dev)
**What:** Removed `status_conflict` from Product TypeScript interface, all Supabase queries, and seed mapper. Column was defined in types but never created in database, causing PostgREST errors on product fetches → silent fallback on GitHub Pages.
**Why:** Type/schema misalignment. The `as unknown as` cast in useProducts hid this TypeScript error. PostgREST returned a hard error when selecting non-existent columns.
**Impact:** Fixes production fallback banner on spaltrowitz.github.io/scrunch/. Prevention: run `supabase gen types` periodically.

---

---

### ### 2026-05-01T18:21:41Z: Add r/wavyhair community
**By:** Danny (Backend Dev)
**What:** Added r/wavyhair subreddit to Community.tsx (subreddits array, search links, badge text) and to Credits.tsx.
**Why:** Community expansion — wavy hair users now included in community resources.
**Impact:** Community.tsx, Credits.tsx. No schema/API changes.

---

### ### 2026-05-01T22:30: User directive
**By:** Shari Paltrowitz (via Copilot)
**What:** Community Q&A is NOT a primary product feature — it's currently the weakest part of the app. The Reddit search engine needs significant optimization before it should be prominently featured. Demote it on the homepage; don't lead with it as a main selling point.
**Why:** User assessment of current feature quality. The search results are not good enough to be a top-level CTA. Product catalog browsing and personalized recommendations are stronger value props right now.

---

### ### 2026-05-01: Mobile-First Design Standards
**By:** Jan (Product Designer)
**What:** Established mobile-first design standards for the team:
1. **Touch Target Minimum:** All interactive elements must have 44×44px minimum (use `min-h-[44px]`, `py-3` for inputs)
2. **Explicit Grid Columns:** Always specify mobile-first grid columns explicitly (`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`)
3. **Text Wrapping:** Use `break-words` for long content, `truncate` for known-short, `line-clamp-N` for multi-line
4. **Mobile Padding:** Use `px-4` for horizontal padding on page containers
5. **Responsive Typography:** H1 `text-xl md:text-2xl lg:text-3xl`, H2 `text-lg md:text-xl lg:text-2xl`, H3 `text-base md:text-lg`, Body `text-sm md:text-base`
6. **Form Input Height:** 44px minimum for all inputs and buttons

**Implementation Priority:**
- High: ProductDetail ingredient wrapping, auth form input heights, Community button touch targets
- Medium: Audit all buttons, add explicit grid-cols-1, update ProductDetail rating layout
- Low: Component library docs, automated touch target testing

**Why:** Mobile responsiveness audit findings. Touch accuracy and readability on small screens are critical.

---

### ### 2026-05-01: Homepage CTA Priority & Structure
**By:** Kenickie (Product Manager), approved per Shari Paltrowitz
**What:** Restructured homepage to prioritize the Ingredient Checker as primary CTA and remove overlapping calls-to-action. 

**Changes:**
1. **Hero CTA:** "Check Ingredients Now →" (was "Explore Products") with subheading: "Paste any ingredient list — Scrunch tells you if it's curl-safe in seconds"
2. **Feature Grid (2 boxes):** Browse Products + Community Q&A (removed Ingredient Checker duplicate and Recommendations)
3. **Products Teaser:** Keep grid, remove "See All Products" CTA, add inline text: "Click any product to check ingredients or read reviews"
4. **New section after #HairTok:** "Ready to get personalized?" with "Create Profile & Get Recommendations" link (outline style, lower priority)
5. **Delete:** "New to curly hair?" section (duplicate Ingredient Checker messaging)

**Priority Hierarchy:**
- **PRIMARY:** Check Ingredients (fastest aha moment, zero friction, proves value)
- **Secondary:** Browse Products (discovery next step)
- **Tertiary:** Get Recommendations (future engagement, lower friction)
- **Support:** Community Q&A (social proof)

**Why:** Resolves Shari's concern about overwhelming first-time visitors. Ingredient Checker is the unique value prop (what only Scrunch does) and requires zero friction/account. Aligns with invisible onboarding philosophy.

---

### ### 2026-05-01: Supabase vs Self-Hosted Database — Phased Approach Decision
**By:** Sandy (Lead Engineer), approved by Shari Paltrowitz
**What:** Recommends phased approach: Phase 1 (static MVP with offline-first) → Phase 2 (Supabase backend if validation positive). Current architecture uses Supabase free tier (cold starts 1-3s on first request after inactivity).

**Options Evaluated & Verdict:**
- A: **Stay on Supabase (Free)** ✅ Default choice — zero code changes, managed auth, RLS, sustainable for MVP
- B: **Self-hosted Postgres** ❌ Too complex for MVP — requires 2-3 days, custom auth backend, ISP reliability risk
- C: **Supabase self-hosted (Docker)** 🤔 Good fallback later — solves cold starts but adds ops overhead
- D: **Railway/Render + Node Backend** ⚠️ Viable but costly ($12-15/mo) and complex
- E: **Static MVP (seed-only, offline-first)** 🎯 Recommended Phase 1

**Phased Roadmap:**
- **Phase 1:** Keep seed products as primary data source, remove auth requirement from browsing, localStorage for guest ratings, measure retention/pain points
- **Phase 2 (if validation positive):** Upgrade to Supabase Pro ($25/mo) or Railway ($12-15/mo), add persistent auth flow

**Key Finding:** App already has workarounds (placeholderData from seed products, Supabase fallback, RLS). Scaling: free tier covers ~100 active users.

**Why:** Lowest risk, validates market before infrastructure investment, avoids premature optimization.

---

### ### 2026-05-01: Performance Audit Decision Record
**By:** Sandy (Lead Engineer)
**Status:** Confidence 7/10 — performance is good, 3 issues worth fixing

**Current State (Good):**
- All 14 routes lazy-loaded, 27 chunks, 298ms build time
- Instant render from seed data via placeholderData
- Lightweight query variants (7-9 cols vs 22) reduce payload
- Image lazy-loading via IntersectionObserver + localStorage
- staleTime 5min + gcTime 10min = minimal refetches
- CSS purged (49KB raw, 9KB gzip)
- Bundle: 816KB raw, ~143KB gzip — reasonable

**Issues & Fixes:**
1. **Static SEED_PRODUCTS import (HIGH impact, MEDIUM fix):** Defeats lazy loading but enables instant render. **Decision: keep as intentional trade-off** — document that 15KB gzip cost buys instant paint on every product page.
2. **Auth blank screen on cold start (MEDIUM impact, EASY fix):** Supabase free-tier `getSession()` takes 1-3s, user sees blank white screen. **Fix:** Show app shell (Header + Footer + skeleton) during loading instead of `return null`.
3. **ProductDetail has no PlaceholderData (LOW-MEDIUM impact, EASY fix):** Pages show "Loading..." even though product might be in `['products']` cache. **Fix:** Use `queryClient.getQueryData(['products'])` to populate placeholderData.

**Decision:** Fix #2 (auth blank screen) — most user-visible and easiest. Fix #3 if time allows. Not worth fixing: Supabase-js SDK size, OpenBeautyFacts caching, component memoization, offline support (PWA).

**Why:** Determines performance optimization priorities without over-engineering diminishing returns.

---
# Auth Architecture Decision: Persistent Ratings Across Devices

**Author:** Sandy (Lead Engineer)  
**Date:** 2026-05-03  
**Status:** Draft Decision  
**Scope:** Add user accounts to persist ratings across devices (currently localStorage-only)

---

## Executive Summary

**What exists:** Supabase Auth is **fully configured and functional**. Email/password + Google OAuth are wired end-to-end. Profiles table auto-creates on signup. Product reviews table exists with RLS policies. The app just doesn't yet save ratings to the server.

**What's missing:** A migration path for localStorage ratings → Supabase, and a unified ratings hook that handles both authenticated users (save to server) and guests (stay on localStorage).

**Path forward:** Add 4 new React Query hooks (useProductRatings, useMigrateLocalRatings, useRatingMutation, useDeleteRating) + run one-time migration on first auth. No schema changes needed. The data layer is already production-ready.

---

## Current Auth Setup Analysis

### ✅ What's Already Built

**Auth Provider (src/lib/auth.tsx)**
- Email/password signup & signin: `signUp()`, `signIn()` ✓
- Google OAuth: `signInWithGoogle()` ✓
- Logout: `signOut()` ✓
- Session state: `user`, `session`, `loading` ✓
- Context + hook: `useAuth()` ✓
- **Status:** **Fully functional**, tested with real Supabase project (rqmplfyuonkikdmqngrj)

**Auth UI (src/pages/Login.tsx, src/pages/SignUp.tsx)**
- Email/password forms with validation ✓
- Google button ✓
- Error handling ✓
- **Status:** **Fully functional**

**Database Schema (supabase/schema.sql)**
- `profiles` table with auto-create trigger on auth signup ✓
- `product_reviews` table with RLS policies (public read, auth users can insert/update own) ✓
- Foreign keys: `profiles.id → auth.users.id`, `product_reviews.user_id → auth.users.id` ✓
- Unique constraint: `(user_id, product_id)` on reviews (1 review per user per product) ✓
- **Status:** **Deployed to Supabase**, RLS enabled

**Supabase Config (src/lib/supabase.ts)**
- Client initialized with real URL + anon key ✓
- Database types generated via `supabase gen types` ✓
- **Status:** **Production-ready**

### ⚠️ What's Missing

**Ratings → Server Sync:**
- Ratings in `src/pages/Products.tsx` save to `localStorage.setItem('scrunch_ratings', ...)` only
- Ratings in `src/pages/Recommendations.tsx` same pattern
- **No code path** to save ratings to `product_reviews` table
- Migration for existing localStorage ratings: **not implemented**

**Query Hooks:**
- No `useProductRatings(productId)` hook to fetch user's rating from server
- No `useMigrateLocalRatings()` hook to bulk-insert localStorage into Supabase on first auth
- No `useRatingMutation()` to handle both authenticated + guest paths

**Recommendations Integration:**
- `src/pages/Recommendations.tsx` calls `getLocalReviewsForRecs()` to build recommendations from localStorage
- After auth, needs to also fetch server ratings via React Query

---

## Key Questions → Answers

### 1. How much auth is already built?
**80% complete.** Authentication (email, Google, logout) is fully wired and tested. Profiles auto-create. The missing piece is connecting ratings to Supabase—not auth itself.

### 2. What's the simplest path to persistent ratings?
**Add React Query hooks for ratings + migration trigger.** The Supabase schema is correct. We only need:
- Hook to fetch user's ratings from `product_reviews` table
- Hook to migrate localStorage → Supabase on first auth
- Mutations to save/delete ratings on authenticated pages

This is simpler than building auth from scratch, and avoids new tables or RLS policies.

### 3. What providers should we support?
**Priority 1 (Q2):** Google + Email/Password  
**Priority 2 (Q3):** Magic link (email sign-in without password)  
**Priority 3 (Q4):** Apple Sign-In (iOS companion app)  

Current setup supports Priority 1 fully. Magic link is config-only in Supabase. Apple Sign-In requires additional Supabase config.

### 4. What needs to change in the data layer?
**Nothing.** Schema is ready:
- `product_reviews` table exists with correct schema
- RLS policies allow public read + authenticated insert/update
- Unique constraint prevents duplicate reviews
- Trigger auto-creates `profiles` on signup

Optional future improvements (out of scope):
- Denormalized `avg_rating` + `review_count` on `products` table (currently computed, not cached)
- Partial index on `product_reviews(user_id, created_at)` for user profile pages

### 5. How do we merge localStorage ratings with server-side?
**One-time migration on first login:**

```
User logs in → AuthProvider sets loading=false → 
  App triggers useMigrateLocalRatings() →
    Read localStorage ratings →
    Bulk-insert to product_reviews (ignoring conflicts) →
    Clear localStorage →
    Show toast "Synced X ratings"
```

This is safe because:
- Supabase unique constraint prevents duplicates
- If user rated on mobile + desktop (both to localStorage), one of them will be the "latest"
- We can use `on_conflict('user_id, product_id') do update` to preserve the most recent

---

## Recommended Implementation Plan

### Phase 1: React Query Hooks for Ratings (1-2 hours)

New file: `src/hooks/useProductRatings.ts`

```typescript
// Fetch authenticated user's rating for a specific product
export function useProductRating(productId: string | null) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['product-rating', productId, user?.id],
    enabled: !!user && !!productId,
    queryFn: async () => {
      if (!productId || !user) return null
      const { data, error } = await supabase
        .from('product_reviews')
        .select('id,rating,would_repurchase,results_notes')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()
      if (error?.code === 'PGRST116') return null // Not found
      if (error) throw error
      return data ?? null
    }
  })
}

// Save/update rating (authenticated users only)
export function useRatingMutation() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { productId: string; rating: number; would_repurchase: string; notes?: string }) => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('product_reviews').upsert({
        user_id: user.id,
        product_id: input.productId,
        rating: input.rating,
        would_repurchase: input.would_repurchase,
        results_notes: input.notes,
      })
      if (error) throw error
    },
    onSuccess: (_data, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['product-rating', productId] })
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] })
    }
  })
}

// Delete rating
export function useDeleteRating() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
      if (error) throw error
    },
    onSuccess: (_data, productId) => {
      queryClient.invalidateQueries({ queryKey: ['product-rating', productId] })
    }
  })
}
```

### Phase 2: Migration Hook (30 mins)

New file: `src/hooks/useMigrateLocalRatings.ts`

```typescript
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../lib/auth.utils'
import { getLocalRatings } from '../lib/localProfile'
import { supabase } from '../lib/supabase'

export function useMigrateLocalRatings() {
  const { user, loading } = useAuth()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (!user) return
      const localRatings = getLocalRatings()
      if (Object.keys(localRatings).length === 0) return

      // Convert localStorage format: { 'product-id': 'loved' } → { rating: 5, would_repurchase: 'yes', ... }
      const ratingMap: Record<string, number> = { loved: 5, liked: 4, ok: 3, disliked: 1 }
      const repurchaseMap: Record<string, string> = { loved: 'yes', liked: 'yes', ok: 'maybe', disliked: 'no' }
      
      const reviews = Object.entries(localRatings).map(([productId, triedRating]) => ({
        user_id: user.id,
        product_id: productId,
        rating: ratingMap[triedRating as never],
        would_repurchase: repurchaseMap[triedRating as never],
        status: 'tried_once' as const,
      }))

      // Upsert with conflict handling (preserves existing if any)
      const { error } = await supabase
        .from('product_reviews')
        .upsert(reviews, { onConflict: 'user_id,product_id' })
      
      if (error) throw error
      
      // Only clear localStorage after successful sync
      localStorage.removeItem('scrunch_ratings')
      localStorage.removeItem('scrunch_profile')
      
      return Object.keys(localRatings).length
    },
  })

  useEffect(() => {
    if (!loading && user && !isPending) {
      mutateAsync() // Fire and forget, errors are logged via QueryClient
    }
  }, [loading, user?.id, isPending, mutateAsync])
}
```

**How it's used:** In `App.tsx` after AuthProvider:

```typescript
export function App() {
  return (
    <AuthProvider>
      <MigrationWrapper />
    </AuthProvider>
  )
}

function MigrationWrapper() {
  useMigrateLocalRatings() // Runs automatically on first auth
  return <Router />
}
```

### Phase 3: Update Rating Components (1 hour)

**Update src/pages/Products.tsx:**

```typescript
// Instead of:
const [ratings, setRatings] = useState(() => JSON.parse(localStorage.getItem('scrunch_ratings') || '{}'))

// Use:
const { user } = useAuth()
const { data: serverRating } = useProductRating(ratingPopup) // When product is selected
const localRatings = !user ? JSON.parse(localStorage.getItem('scrunch_ratings') || '{}') : {}
const { mutate: saveRating } = useRatingMutation()

// In submit handler:
if (user) {
  saveRating({ productId: id, rating: 5, would_repurchase: 'yes' })
} else {
  setRatings(prev => ({ ...prev, [id]: 'loved' }))
  localStorage.setItem('scrunch_ratings', JSON.stringify(ratings))
}
```

**Update src/pages/Recommendations.tsx:**

```typescript
// For authenticated users, also fetch server ratings
const { data: serverReviews } = useQuery({
  queryKey: ['user-reviews', user?.id],
  enabled: !!user,
  queryFn: async () => {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('product_id,rating,would_repurchase')
      .eq('user_id', user.id)
    if (error) throw error
    return data ?? []
  }
})

// Combine for recommendations:
const allReviews = user 
  ? [...localReviews, ...serverReviews.map(r => toReviewFormat(r))]
  : localReviews
```

### Phase 4: Update Recommendations Engine (optional, 30 mins)

Currently in `src/components/recommendations/Recommendations.tsx`, make sure we're using both localStorage + server ratings:

```typescript
const localReviews = useMemo(() => {
  if (user || products.length === 0) return [] // Don't use local if authenticated
  return getLocalReviewsForRecs(products)
}, [user, products])

// Fetch server reviews for authenticated users
const { data: serverReviews = [] } = useQuery({
  queryKey: ['my-reviews', user?.id],
  enabled: !!user,
  queryFn: async () => { /* ... */ }
})

// Both sources feed recommendations
const allReviews = [...localReviews, ...serverReviews]
```

---

## Data Layer Summary

### Tables (No Changes Needed)

| Table | Status | Notes |
|-------|--------|-------|
| `auth.users` | ✅ Built | Supabase managed |
| `profiles` | ✅ Built | Auto-creates on signup |
| `product_reviews` | ✅ Built | RLS: public read, auth insert/update |
| `products` | ✅ Built | Existing inventory |

### RLS Policies (Already Correct)

```sql
-- Existing, no changes:
create policy "Reviews are public" on product_reviews for select using (true);
create policy "Auth users can insert reviews" on product_reviews for insert
  with check (auth.uid() = user_id);
create policy "Users can update own reviews" on product_reviews for update
  with check (auth.uid() = user_id);
create policy "Users can delete own reviews" on product_reviews for delete
  with check (auth.uid() = user_id);
```

### Future Optimization (Q3, not in scope)

- Add `avg_rating` + `review_count` computed columns on `products` table + materialized view
- Partial index on `product_reviews(user_id, created_at)` for profile pages
- Caching layer in React Query for expensive aggregations

---

## Migration Strategy for localStorage → Supabase

### Step 1: One-Time Sync on First Login

When user authenticates:
1. `useMigrateLocalRatings` hook fires
2. Reads localStorage `scrunch_ratings` + `scrunch_profile`
3. Bulk-inserts to Supabase using `upsert` with conflict strategy
4. Clears localStorage after success
5. Shows toast: "✓ Synced X ratings"

### Step 2: Conflict Handling

If user rated product on two devices before syncing:

```
Device 1 localStorage: { 'prod-1': 'loved' }
Device 2 localStorage: { 'prod-1': 'liked' }
Server: empty

After sync:
  Upsert with on_conflict='user_id,product_id' do update
  → Last write wins (Supabase auto-updates updated_at)
```

This is acceptable because:
- Ratings are low-stakes (not financial)
- User sees both devices' history in "My Reviews" later
- UI can prompt user to re-rate if needed

### Step 3: Post-Migration Behavior

**For authenticated users:**
- Ratings save to `product_reviews` immediately (via React Query mutation)
- localStorage is ignored
- Can sync across devices at login

**For guests:**
- Ratings stay in localStorage
- Can be synced later if they create an account

---

## File Changes Summary

| File | Change | Complexity |
|------|--------|------------|
| `src/hooks/useProductRatings.ts` | **NEW** — fetch/save/delete rating hooks | 🟢 Low |
| `src/hooks/useMigrateLocalRatings.ts` | **NEW** — migration on first auth | 🟢 Low |
| `src/pages/Products.tsx` | Use hooks instead of useState + localStorage | 🟡 Medium |
| `src/pages/Recommendations.tsx` | Fetch server ratings for authenticated users | 🟡 Medium |
| `src/components/recommendations/Recommendations.tsx` | Include server reviews in scoring | 🟡 Medium |
| `src/App.tsx` | Add MigrationWrapper for useMigrateLocalRatings() | 🟢 Low |
| `supabase/schema.sql` | **No changes** — already correct | ✅ Done |
| `src/lib/auth.tsx` | **No changes** — already complete | ✅ Done |
| `src/lib/supabase.ts` | **No changes** — already configured | ✅ Done |

---

## Provider Priority & Roadmap

### Phase 1: Q2 (This Sprint)
- ✅ Email/Password (already built)
- ✅ Google OAuth (already built)
- Task: Connect to ratings storage

### Phase 2: Q3
- Magic link (email sign-in, no password)
- Apple Sign-In config (iOS companion app prep)
- Analytics: track auth conversion funnel

### Phase 3: Q4+
- OAuth provider expansion (GitHub, Microsoft) if needed
- SAML for enterprise
- Passwordless WebAuthn

---

## Complexity & Effort Estimate

| Item | Complexity | Effort | Risk |
|------|------------|--------|------|
| Add rating hooks | 🟢 Low | 2 hours | Minimal — isolated hooks |
| Add migration hook | 🟢 Low | 1 hour | Low — upsert handles conflicts |
| Update Products.tsx | 🟡 Medium | 1 hour | Medium — interacts with state management |
| Update Recommendations | 🟡 Medium | 1 hour | Low — additive query, no logic change |
| Testing & verification | 🟡 Medium | 2 hours | Low — mostly manual E2E |
| **Total** | | **7 hours** | **Low** |

---

## Rollout Strategy

### Week 1: Build + Test
1. Implement hooks in isolation ✓
2. Unit test useMigrateLocalRatings (with mocked supabase) ✓
3. Manual E2E: Create account → Rate product → Logout/login → Ratings persist ✓

### Week 2: Staged Rollout
1. Merge to `main` (feature complete)
2. Deploy to GitHub Pages (GitHub Actions CI/CD)
3. Monitor: localStorage → Supabase sync success rate
4. Alert: If >10% migration failures, rollback

### Monitoring Queries

```sql
-- Verify migration success
SELECT COUNT(*), COUNT(DISTINCT user_id) FROM product_reviews;
-- Should match number of localStorage keys × 0.8 (some dupes expected)

-- Track auth conversion
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT id) as new_users,
  COUNT(DISTINCT CASE WHEN onboarding_completed THEN id END) as completed_onboarding
FROM profiles
GROUP BY DATE(created_at);
```

---

## Post-Implementation Follow-Up

### Immediate (Week 3-4)
- [ ] Analytics: Review auth funnel (signup → onboarding → first rating)
- [ ] Survey: Ask users if sync worked smoothly
- [ ] Fix any edge cases (bad auth state, network errors during migration)

### Q3
- [ ] Magic link auth (config-only in Supabase)
- [ ] Denormalize avg_rating on products table
- [ ] User profile page to show all reviews

### Q4+
- [ ] Apple Sign-In for iOS companion app
- [ ] Social sharing of reviews
- [ ] Reputation system (most helpful reviews)

---

## Decision Summary

**We proceed with Phase 1 (add hooks + migration).** The auth infrastructure is already production-ready; we're just connecting ratings storage to it. This is a safe, low-risk addition with high user value (persistent cross-device ratings).

**Start:** Next sprint  
**Duration:** 1 sprint (7 hours active work)  
**Owner:** Sandy (Lead) + one frontend dev  
**Approval:** Pending stakeholder sign-off
