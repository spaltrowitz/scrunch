# History

## Project Context
- **Project:** Scrunch — curly hair care app
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Supabase, React Query, React Router, Vitest
- **Deployment:** GitHub Pages
- **User:** Shari Paltrowitz

## Learnings

### 2026-05-03: Full Test Pass — Post-Feature Verification
- **Build & types clean:** `tsc --noEmit` zero errors, `npm run build` succeeds with no warnings.
- **useProductRatings.ts is dead code:** All three hooks (`useProductRating`, `useRatingMutation`, `useDeleteRating`) are defined but never imported anywhere. ProductDetail.tsx has its own inline rating logic. These hooks should either replace the inline code or be removed.
- **`as never` cast in useProductRatings.ts line 84:** Used to bypass Supabase's strict generated types on upsert. Works but hides type mismatches — if schema changes, this won't catch it.
- **useMigrateLocalRatings.ts has solid guards:** `attempted.current` ref + `MIGRATION_KEY` localStorage flag = double protection against re-runs. `ignoreDuplicates: true` = server wins on conflict. Empty localStorage handled gracefully.
- **Community.tsx debounce is correct:** Cleanup on unmount via useEffect return. Auto-search only fires at ≥10 chars after 1.2s inactivity. Regex special chars in highlight terms are escaped (line 202).
- **usePageTitle.ts has no cleanup:** Sets `document.title` but never resets on unmount. Acceptable in SPA since every route sets its own title via the `PageTitleUpdater` component.
- **Sitemap categories match constants 1:1:** All 17 categories present with correct slug ↔ underscore mapping.


## Cross-Project Tester Knowledge (injected 2026-05-02)

The following learnings come from Tester agents across Shari's other personal projects.

### From EatDiscounted (McManus — Tester)
- **Zero tests = zero confidence:** Project launched with no test framework. First audit: 🔴 not ship-ready. Vitest installed, 65 tests written in one session. Lesson: set up test framework and core algorithm tests early.
- **Unicode normalization bugs:** `norm()` stripped accented chars ("Café" → "caf"), destroyed CJK/Cyrillic (→ ""). `"".includes("")` is true in JS → false positives. Always test with non-ASCII input (relevant for product names in Scrunch).
- **Empty catch blocks hide failures:** `catch {}` silently swallowed errors. Users couldn't distinguish failures from "not found." Error states must be visually distinct.
- **Cache collision avoidance in tests:** Use unique input generators per test to prevent cache from returning stale results across runs.
- **External API mock patterns:** Mock `fetch` globally with `vi.fn()`, set API keys in `beforeEach`, test both success and failure paths (403/429/500, timeouts, malformed JSON). Verify cache prevents redundant calls.
- **Dead code detection:** Testing revealed `slugVariants()` was defined+tested but never called. Tests can surface dead code.

### From MyDailyWin (Purah — Tester)
- **localStorage/state sync bugs:** Admin and user surfaces used different storage key suffixing patterns, causing silent data splits. When multiple surfaces share state, map all read/write paths and verify consistency.
- **Undefined function bugs in vanilla JS:** `saveState` called but never defined. Without TypeScript or a bundler, these only surface at runtime. TypeScript projects (like Scrunch) catch these at build time — leverage that.
- **Profile-aware testing:** Functions using unsuffixed keys worked for default config, broke for all others. Always test with non-default configurations.
- **Parallel agent commits need integrity pass:** 4 agents committing to shared files simultaneously caused missing HTML tags, CSP gaps, FOUC. After parallel work on shared files, do a structural integrity sweep.
- **Bug bash methodology:** Systematic sweep across all user flows (onboarding → auth → admin → settings → payout). Found 6 bugs including 1 critical Firebase config mismatch.

### From MyDailyWin (Helen — Alumni Tester)
- **Independent verification validates findings:** Three testers independently found the same core bugs. Systematic code review catches real issues regardless of who does it.

### From MyDailyWin (Robin — Alumni Tester)
- **Architectural issues persist across rotations:** Same storage key mismatches and undefined functions found by every tester. These are design-level problems, not one-off bugs.

### From MyDailyWin (Riju — Security)
- **CSP hardening:** Eliminated `unsafe-inline` by converting 57+ inline handlers to `data-action` + event delegation. CSP meta tag must be in `<head>` before external resources.
- **Open redirect vulnerability:** `?redirect=` param allowed arbitrary redirects. Validate redirect targets against allowlist.
- **innerHTML XSS:** User-controlled data rendered via innerHTML without escaping. Always sanitize dynamic content.
- **Auth ≠ authorization:** Firestore rules with auth-only checks (no ownership scoping) let any authenticated user access other users' data. Supabase RLS (which Scrunch uses) mitigates this — but verify RLS policies are comprehensive.
- **Service worker cache versioning:** Adding new assets requires cache version bump or old caches 404.

### From Slotted-AI (Sokka — Tester)
- **Payload key mismatches are a top failure cause:** Backend used camelCase for some endpoints, snake_case for others. No consistency — caused ~10 of 16 test failures. Always inspect each endpoint's expected payload shape.
- **Polling helper for async assertions:** `waitFor<T>(fn, predicate, maxAttempts, delayMs)` — 5 attempts × 1s. Essential for testing anything involving async backend operations (relevant for Supabase real-time).
- **Response mapping mismatches:** Backend returned `{ friendshipId }` but client expected `{ id }` → requests to `/resource/undefined` → 500. Verify response shapes match client expectations.
- **E2E test debugging pattern:** Fixed 22 failures by categorizing root causes: payload mismatches (~10), response mapping (~4), timing (~3), stale state (1). Systematic categorization > random fixing.
- **Account deletion cascade testing:** Deletion left orphaned records across related tables (FK violations). Test delete flows for completeness across all foreign keys.
- **Notification dedup pitfalls:** Type enum reuse caused silent notification drops. Unique index too narrow → legitimate notifications blocked.
- **Security audit findings:** Tokens leaked to client (not in SENSITIVE_FIELDS filter), hardcoded secret fallbacks, list endpoints exposing emails. Check what `select(*)` returns vs. what should be exposed.
- **Calendar sync destructive pattern:** DELETE all → INSERT new creates brief zero-data window. Any sync that replaces data should be tested for race conditions.

### From Slotted-AI (Josh — Alumni Tester)
- **Webhook testing:** Always return HTTP 200, even for errors (third-party deactivates on 4xx). Webhooks are signals, not payloads — must fetch actual data separately.
- **Edge cases in external integrations:** Multi-calendar moves = delete + create with new ID (looks like deletion). Stale sync tokens require full re-sync. OAuth must handle expired vs. revoked tokens differently.
- **Soft social dynamics in UX:** Never use "declined/rejected/cancelled" — use "can't make it," "stepped out." Test assertions should match UX language.

### From Slotted-AI (Nate — Alumni Tester)
- **Sync token architecture:** Incremental sync via tokens. Stale token (410 Gone) → full re-sync. Full re-sync must filter to only app-created records.
- **Deterministic ID patterns:** Apple CalDAV UIDs: `slotted-{meetupId}-{userId}@domain`. Predictable IDs simplify testing but consider security implications.

### From HealthStitch (Zoe — Tester)
- No testing learnings recorded yet (project in early stage). Stack: Node.js/Express backend, React/Vite frontend, Swift/SwiftUI iOS, SQLite.
