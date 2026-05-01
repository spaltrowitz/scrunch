# Decision: Supabase vs Self-Hosted Database

**Date:** 2026-01-15  
**Author:** Sandy (Lead Engineer)  
**Stakeholder:** Shari Paltrowitz  
**Status:** RECOMMENDED — Phased approach (MVP offline-first → Supabase later)

---

## Problem Statement

Scrunch is experiencing Supabase free-tier cold starts (1-3 seconds blank screen on first request after inactivity). Shari is exploring whether migrating to a home-hosted Postgres server would provide better performance and reduce vendor lock-in.

---

## Context

### Current Architecture
- **Hosting:** GitHub Pages (static)
- **Backend:** Supabase cloud (free tier)
- **Auth:** Supabase Auth (email + Google OAuth)
- **Database:** 6 tables with RLS policies
- **Edge Functions:** 3 (image search, issue tracking, notifications)
- **App State:** 280 seed products + user reviews (localStorage for guests, Supabase for auth users)

### Cold-Start Root Cause
The `AuthProvider` component calls `supabase.auth.getSession()` on mount, which blocks rendering of all routes until the Supabase session resolves. This is a free-tier limitation (managed function startup latency), not an app bug. The blank screen lasts 1-3 seconds after inactivity.

### Key Finding
The app already has workarounds in place:
- `placeholderData` from seed products renders instantly
- Seed data is used as fallback if Supabase fails
- RLS prevents unauthorized data exposure
- Auth is only required for user-specific data (ratings, profiles)

---

## Options Evaluated

| # | Option | Migration | Cost | Cold Start | Recommendation |
|---|--------|-----------|------|------------|-----------------|
| A | Stay on Supabase | None | $0 free, $25/mo paid | 1-3s | ✅ Default choice |
| B | Self-hosted Postgres | 2-3 days + ops overhead | $5-10/mo | None | ❌ Too complex |
| C | Supabase self-hosted | 1-2 days + Docker setup | $0 | None | 🤔 Later option |
| D | Railway/Render + backend | 2-3 days + backend rewrite | $12-15/mo | None | ⚠️ Works but costly |
| E | Static MVP (seed-only) | Low | $0 | Instant | 🎯 Phase 1 |

### Option A: Stay on Supabase (Free Tier)
**Verdict:** ✅ Recommended for now

- **Pros:** Zero code changes, managed auth, RLS built-in, free tier sustainable for MVP, edge functions for automation
- **Cons:** Cold starts on free tier, vendor lock-in to Supabase API
- **Scaling:** Free tier covers 50K reads/day, 20K writes/day — enough for ~100 active users. Pro tier ($25/mo) removes cold-start issue.
- **Reality:** Free tier is doing a lot of work. Upgrade cost is justified only if you have significant user base justifying the cost.

### Option B: Self-Hosted Postgres
**Verdict:** ❌ Not recommended for MVP

- **Effort:** 2-3 days minimum (custom auth backend, RLS → middleware, ops setup)
- **What breaks:** Everything — auth, data validation, edge functions all need rewriting
- **Ongoing costs:** Home internet reliability, backup strategy, SSL/DNS, monitoring
- **Risk:** ISP downtime = app downtime; network latency could be worse than cloud CDN
- **Learning curve:** Requires solid DevOps knowledge
- **Reality:** Only worth it if you already run infrastructure or want to practice ops. For a side project? Overkill.

### Option C: Supabase Self-Hosted (Docker)
**Verdict:** 🤔 Good fallback, not MVP choice

- **Effort:** 1-2 days to spin up Docker stack + migrate data
- **Pros:** Same Supabase API (zero code changes), no cold starts, full control
- **Cons:** Adds Docker/networking complexity, home ISP reliability issues, manual backups, no managed dashboards
- **Maintenance:** Docker updates, version mismatches, PostgreSQL upgrades all manual
- **Reality:** Solves cold-start problem but introduces new ops overhead. Better to try this after validating demand for real backend.

### Option D: Railway/Render Postgres + Node Backend
**Verdict:** ⚠️ Viable alternative, not cost-effective for MVP

- **Cost:** $12-15/mo (manageable but not free)
- **Cold starts:** Zero
- **Effort:** 2-3 days to write Node.js backend (auth, RLS → middleware, database integration)
- **Pros:** Industry-standard stack, scalable, good for learning
- **Cons:** Adds complexity, requires backend DevOps (deployments, error handling), more surface area
- **Reality:** Good choice if you're already writing a backend, but just for Postgres access? Railway overkill.

### Option E: Static MVP (Offline-First, Seed-Data Only)
**Verdict:** 🎯 Recommended as Phase 1

- **Architecture:** Client-side filtering + localStorage ratings, no server calls for browsing
- **Cold starts:** Zero (no backend calls on homepage)
- **Cost:** $0 (GitHub Pages already free)
- **Effort:** Low (remove auth gating from homepage, keep seed data)
- **Validation:** Answers the question: "Do users actually want to rate/review products?"
- **Scaling:** GitHub Pages CDN serves unlimited users (within bandwidth limits)
- **Reality:** If users don't want persistence, you wasted zero infrastructure. If they do, you have data to justify backend cost.

---

## Recommended Decision

### Phased Approach (E → A)

**Phase 1 (Weeks 1-2): Validate with Static MVP**
```
- Keep seed products as primary data source
- Remove auth requirement from homepage/browsing
- Implement localStorage for guest ratings (ephemeral)
- Measure: User retention, feature requests, pain points
```

**Phase 2 (If validation positive): Add Supabase Backend**
```
- If users demand persistent ratings/profiles → migrate to Supabase (or Railway)
- Upgrade from free tier to Pro ($25/mo Supabase or $12-15/mo Railway)
- Add auth flow back in
- Sync localStorage state to server
```

### Why This Works
1. **Lowest risk:** MVP costs $0, validates market before infrastructure investment
2. **Solves real problem:** If users want persistence, you have data justifying backend cost
3. **Avoids premature optimization:** Building ops infrastructure before confirming demand is waste
4. **Keeps learning curve manageable:** One concern at a time (product fit first, scaling second)

---

## If You Insist on Removing Supabase Today

**Best option:** Railway Postgres + Node.js backend
- Costs $12-15/mo (acceptable for side project with users)
- No cold starts (persistent connection)
- Industry-standard stack (good learning opportunity)
- Effort: 2-3 days for competent backend engineer

**Second best:** Supabase self-hosted in Docker
- Costs $0 (your hardware)
- No cold starts
- Zero code changes (same API)
- Effort: 1-2 days to set up + ongoing Docker/networking knowledge

**NOT recommended:** Raw self-hosted Postgres without framework
- Too much ops burden for side project (backups, monitoring, SSL, domain, port forwarding)
- Better to pay for managed solution if you want that control

---

## Closing Statement

**The cold-start problem is real but not as catastrophic as it feels.**

The blank screen during `getSession()` is annoying, but it only affects first load after inactivity. Subsequent loads are instant (warm connection). If the app's homepage didn't require auth, this wouldn't even be visible.

**The honest recommendation:** Start with offline-first MVP (Phase 1). Validate that users actually want to save ratings. If yes, add Supabase backend (Phase 2). If no, you've built an MVP with zero infrastructure overhead and learned something valuable.

Supabase free tier is genuinely good value for what it provides. The upgrade cost ($25/mo Pro) is justified only if you have users validating the demand for backend features.

---

## Decision Log

- **Status:** APPROVED (Phased approach recommended)
- **Next:** Shari reviews and approves Phase 1 static MVP roadmap
- **Implementation:** Sandy to draft Phase 1 tasks once approved
