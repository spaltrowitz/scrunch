# Supabase vs Self-Hosted Postgres Analysis for Scrunch

**Analysis Date:** 2026-01-15  
**Requested by:** Shari Paltrowitz  
**Problem:** Supabase free tier cold starts (1-3s on first request after inactivity) impacting user experience.

---

## CURRENT STATE: How Scrunch Uses Supabase

### Architecture Summary
- **Auth:** Supabase Auth with email+password and Google OAuth
- **Database:** 6 tables (profiles, products, product_reviews, product_requests, questions, answers, votes)
- **Edge Functions:** 3 functions (find-product-image, create-product-issue, notify-product-added)
- **RLS:** Full row-level security policies for all tables (public reads, authenticated writes)
- **Real-time:** Not currently used
- **Storage:** Not currently used
- **Client:** Supabase-js v2.104 (hardcoded anon key as fallback)

### Data Flow
1. **Auth Loading Gate:** `AuthProvider` calls `supabase.auth.getSession()` on mount → blocks all routes until resolved (blank screen 1-3s)
2. **Product Queries:** `useProducts()` hooks query products table with specific column selection (no `select('*')`)
3. **Fallback:** All queries have `placeholderData` from `seedProducts.ts` (280 products)
4. **User Data:** Profiles fetched only for authenticated users; localStorage fallback for guests
5. **Mutations:** All mutations (reviews, requests, answers) include error handling and toast feedback

### What Supabase Actually Gives Us
✅ **Built-in Auth:** Email/password + OAuth (Google)  
✅ **RLS Enforcement:** Data-level security without custom backend logic  
✅ **Automatic Profile Creation:** Trigger on user signup  
✅ **Public-read/Auth-write Pattern:** Reviews, requests, questions all follow this  
✅ **Email Notifications:** Edge functions (create-product-issue, notify-product-added)  
✅ **TypeScript Support:** Database type generation  

❓ **Not Used:**
- Real-time subscriptions (no live chat, no live updates)
- Storage (all images external URLs)
- Vector search
- Functions beyond email (no complex business logic)

---

## EVALUATION OF 5 OPTIONS

### OPTION A: Stay on Supabase (Current)

**Migration Effort:** None  
**Monthly Cost:** Free ($0) now → $25/mo Pro tier if scaling past 50K MAU  
**Cold Start Behavior:** 1-3 seconds blank screen on first load after inactivity  
**What Breaks:** Nothing  

**Honest Assessment:**
- **Free tier is genuinely good** for an MVP (50K reads/mo, 20K writes/mo, auth, RLS, edge functions)
- Cold start problem is **real but scoped**: only happens on first request after inactivity; subsequent loads instant
- **Placeholders work partially**: seed data renders immediately, but blank screen during `getSession()` still blocks everything
- **Pro tier ($25/mo)** solves cold starts but costs money for a side project
- **Vendor lock-in:** Supabase-specific RLS syntax, edge functions, auth library

**Recommendation:** ⚠️ **STAY for now** — If cold starts frustrate you enough to migrate, that effort (2-3 days) is probably worth it. But Supabase free tier is doing a lot of work for $0.

---

### OPTION B: Self-Hosted Postgres on Home Server

**Migration Effort:** HIGH  
**Monthly Cost:** $0 (existing hardware) + electricity (~$5-10/mo)  
**Cold Start Behavior:** Zero cold starts (persistent connection)  
**What Breaks:** Everything

**Migration Roadmap:**
1. Run `pg_dump` on Supabase → restore to home server
2. Replace Supabase client with raw `pg` driver + connection pooling (e.g., pgBouncer)
3. Write custom auth backend (JWT generation, password hashing, session management) — **not trivial**
4. Migrate RLS logic to backend middleware/validation
5. Set up SSL/TLS (self-signed cert or Let's Encrypt on home server)
6. Port forwarding + dynamic DNS for home IP stability
7. Replace edge functions with cron jobs or Next.js API routes

**Code Changes Required:**
- Remove `@supabase/supabase-js` (100KB) → `pg` or `node-postgres` (~40KB)
- Rewrite auth flow (currently Supabase.auth → custom JWT)
- Replace RLS with backend request validation
- Replace edge functions with Node.js backend
- Add connection pooling, query logging, error handling

**Risks:**
- **Home internet reliability:** ISP downtime = app down
- **Network latency:** Home server → phone on cellular could be slower than cloud CDN
- **Backup strategy:** No automatic backups (have to manage yourself)
- **Scaling:** If you get more users, home server CPU/RAM become bottleneck
- **SSL/Domain:** Self-signed certs or Let's Encrypt automation required
- **Monitoring:** No built-in dashboards like Supabase

**Honest Assessment:** This is a **2-3 day job to get right**, plus ongoing ops overhead. For a side project MVP, this is probably overkill unless you have ops experience.

**Recommendation:** ❌ **NO for MVP** — Too much work. Only if you have a home server already running and want to practice DevOps.

---

### OPTION C: Supabase Self-Hosted (on Home Server)

**Migration Effort:** HIGH  
**Monthly Cost:** $0 (existing hardware) + electricity  
**Cold Start Behavior:** Zero cold starts  
**What Breaks:** Nothing (same API)  

**What This Is:**
Supabase open-source stack (PostgreSQL + PostgREST + GoTrue auth + Realtime + Vector) running on your home server in Docker.

**Setup:**
```bash
docker-compose up -d
# Supabase available at http://localhost:3000
# Same API as cloud Supabase
```

**Trade-offs:**
- ✅ **Zero code changes** — exact same Supabase client, RLS, functions work
- ✅ **No cold starts** — persistent connection
- ✅ **Full control** — your hardware, your rules
- ❌ **Docker + infrastructure overhead** — 4-6 containers, 2-4GB RAM needed
- ❌ **Home server reliability** — ISP downtime = app down
- ❌ **No managed backups** — you manage PostgreSQL snapshots
- ❌ **SSL/domain** — still need home IP stability and certificates
- ❌ **Monitoring/alerting** — no Supabase dashboard
- ❌ **Complex to update** — Docker image updates, version mismatches with PostgREST

**Migration Path:**
1. Spin up Supabase Docker stack on home server
2. Migrate data from cloud Supabase (pg_dump → restore)
3. Update client `VITE_SUPABASE_URL` to home server
4. Keep everything else the same

**Honest Assessment:** This **solves the cold start problem** without rewriting auth, but introduces **ops complexity**. For an MVP where you're not sure if the app will even be used, this is **premature infrastructure investment**.

**Recommendation:** 🤔 **MAYBE later** — If you learn cold starts are actually killing user retention AND you want to keep Supabase's feature set AND you have home server capacity, this is solid. But today? Too much overhead.

---

### OPTION D: Other Managed Alternatives

#### D1: Neon (Serverless Postgres)
**Cold Start:** Yes, same problem as Supabase (1-2s cold starts on free tier)  
**Cost:** Free tier included, $5-20/mo for always-on  
**Code Changes:** Minimal — just swap connection string  
**Verdict:** ❌ Solves nothing. Same cold start problem + fewer features than Supabase.

#### D2: Railway/Render (Managed Postgres)
**Cold Start:** No (always-on)  
**Cost:** $12-15/mo for smallest instance  
**Code Changes:** Moderate — replace Supabase with Node.js backend + pg driver  
**Verdict:** ⚠️ Solves cold starts but adds backend complexity + costs money  
**Verdict:** Good option if you're already writing a Node backend, but adds complexity for MVP

#### D3: Turso/libSQL (Edge-optimized)
**Cold Start:** No (replicated edge caches)  
**Cost:** Free tier, $10+/mo paid  
**Code Changes:** High — libSQL API is different from Postgres  
**Verdict:** ❌ MySQL-adjacent, not Postgres, would require data migration + client rewrite

#### D4: Just Use Seed Data (Offline-first MVP)
**Cold Start:** Zero (all data in browser)  
**Cost:** $0  
**Code Changes:** Remove all Supabase calls for product browsing; keep auth for localStorage user state  
**Verdict:** ⚠️ Interesting for pure MVP, but ratings/reviews are key feature requiring backend

---

### OPTION E: Static-First with Optional Backend

**Migration Effort:** LOW  
**Monthly Cost:** $0 (GitHub Pages already free)  
**Cold Start Behavior:** Instant (no backend calls until user rates/reviews)  
**What Breaks:** Auth + user-specific features

**Concept:**
Scrunch already has 280 seed products. For MVP:
- Homepage, browse, search, filters → **all client-side**, no backend
- Ratings/reviews → **optional backend**, only if user wants to save
- Auth → **optional**, only needed for persistence

**Tradeoffs:**
- ✅ **No server dependency** — app works offline (like PWA)
- ✅ **Instant load** — everything is seed data + client caching
- ✅ **Zero cold starts** — no server calls on home page
- ✅ **Scalable to 1M users** — GitHub Pages CDN handles it
- ❌ **Ratings are ephemeral** — localStorage only, lost on new device/browser
- ❌ **No user profiles** — no "saved products" across devices
- ❌ **No community** — no reviews visible to other users

**Real Question:** Is ratings/reviews MVP-critical? If yes, need backend. If "nice to have," this works.

**Recommendation:** 🎯 **YES, as stepping stone** — Build MVP as offline-first, add Supabase backend when you confirm users actually want to save ratings. This is the fastest path to validation.

---

## SUMMARY TABLE

| Option | Migration | Cost/mo | Cold Start | Code | Recommendation |
|--------|-----------|---------|------------|------|-----------------|
| **A: Stay Supabase** | None | $0 free, $25+ paid | 1-3s blank | None | ✅ Stay for now |
| **B: Self-hosted Postgres** | HIGH | $5-10 | None | Rewrite auth/backend | ❌ Overkill for MVP |
| **C: Supabase self-hosted** | HIGH | $0 | None | None | 🤔 Later, not now |
| **D1: Neon** | LOW | $0-20 | 1-2s | None | ❌ Same problem |
| **D2: Railway/Render** | MEDIUM | $12-15 | None | Add backend | ⚠️ Works but costs $ |
| **D3: Turso** | HIGH | $0-10 | None | Rewrite DB calls | ❌ Schema mismatch |
| **D4: Seed data only** | LOW | $0 | Instant | Remove Supabase | ⚠️ Incomplete MVP |
| **E: Static MVP → Supabase** | LOW | $0 now, $25 later | Instant → 1-3s | Phased | 🎯 **Recommended** |

---

## HONEST RECOMMENDATION

### The Best Path Forward:

**Phase 1 (Next 2 weeks): Validate with static MVP**
- Serve 280 seed products as default state
- Zero Supabase calls for browsing/filters (client-side only)
- Keep auth off for now
- Measure: Do users come back? Do they expect ratings?

**Phase 2 (If validation is positive): Add ratings backend**
- If users want to rate/review → add Supabase for persistence
- Move off free tier → $25/mo Pro (Supabase or Railway)
- Keep GitHub Pages hosting (already solid)

**Why this works:**
- **Lowest risk:** MVP costs $0, no server ops needed
- **Validates demand:** You'll know if users even want ratings before paying for backend
- **No sunk cost:** If the app flops, you didn't build infrastructure
- **Cold-start problem is actually a non-issue** if the first page (Home) doesn't need backend calls

### If You Insist on Removing Supabase Today:

**Best option: Railway Postgres + Node.js backend**
- Cost: $12-15/mo (manageable for side project)
- Cold starts: Zero
- Effort: 2-3 days (auth, RLS → middleware, database calls)
- Complexity: Medium (but good learning)

**Second best: Supabase self-hosted in Docker**
- Cost: $0 (your hardware)
- Cold starts: Zero
- Effort: 1-2 days to migrate + Docker knowledge required
- Complexity: High (Docker, networking, SSL, backups)

**I would NOT recommend:** Raw self-hosted Postgres without a web framework. That's just too much ops burden for a side project.

---

## Closing Thoughts

**The cold-start problem is real, but it's not as bad as it feels.**

The blank screen during `getSession()` is annoying on first load, but:
1. Only affects first visit after inactivity
2. Seed data renders immediately *under* the blank screen (not showing)
3. Subsequent visits instant (connection warm)
4. If homepage didn't need auth gating, this wouldn't even be visible

**The real question:** Is Scrunch's MVP better as an offline-first experience (static MVP + optional backend), or does the app *require* user persistence from day one?

My honest take: **Try static MVP first**. It's faster, cheaper, and lets you validate the product without infrastructure. If users demand ratings/reviews, add Supabase then. You'll have data to justify the $25/mo cost.

