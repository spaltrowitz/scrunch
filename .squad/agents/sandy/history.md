# Sandy — Lead Engineer History

## Learnings

### 2025-07-17: TypeScript 6 + Supabase type resolution

- Supabase-js v2.104+ with TypeScript 6.0 has a query parser that returns `never` for `.select('*')` results unless the `Database` type includes `Views`, `Functions`, and `Relationships` fields.
- The `Database` interface needs: `Views: {}`, `Functions: {}`, and each table needs `Relationships: []` to satisfy `GenericSchema` / `GenericTable` constraints.
- Even with all fields present, TS6's inference can still fail. The pragmatic fix is to cast query results: `(data as unknown as Product[])` — this pattern is already used elsewhere in the codebase (Recommendations.tsx).
- `noUnusedLocals: true` catches dead code like `saveNote` and `ratingCount`. Prefix `_` does NOT suppress this in TypeScript — either remove the code or destructure to `[,]`.
- Vitest config embedded in `vite.config.ts` requires `/// <reference types="vitest/config" />` at the top for type-checking to pass.

### 2026-04-30: PR #13 Full Code Review

- Reviewed full diff (65 source files, 16,671 insertions) covering: image sourcing (52 URLs), React Query migration, query optimization, component decomposition, pagination, bundle optimization, and homepage redesign.
- **Build/types/tests all green:** `npm run build` (290ms), `npx tsc --noEmit` (0 errors), `npm test` (26/26 passed).
- **Verdict: APPROVE.** No blockers found.
- Key findings:
  - 13 `as unknown as` casts remain — known Supabase+TS6 issue, documented and acceptable.
  - 5 `as never` casts on upsert calls — should centralize into a typed helper eventually.
  - Mutation errors are console-only (no user-facing toast) — acceptable for beta, should add before launch.
  - All 6 performance standards from team audit are implemented: React Query, named columns, lazy routes, dynamic seed import, component decomposition, count queries.
  - Zero `select('*')` calls remain. Zero raw useEffect data fetching patterns remain.
