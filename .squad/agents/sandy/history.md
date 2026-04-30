# Sandy — Lead Engineer History

## Learnings

### 2025-07-17: TypeScript 6 + Supabase type resolution

- Supabase-js v2.104+ with TypeScript 6.0 has a query parser that returns `never` for `.select('*')` results unless the `Database` type includes `Views`, `Functions`, and `Relationships` fields.
- The `Database` interface needs: `Views: {}`, `Functions: {}`, and each table needs `Relationships: []` to satisfy `GenericSchema` / `GenericTable` constraints.
- Even with all fields present, TS6's inference can still fail. The pragmatic fix is to cast query results: `(data as unknown as Product[])` — this pattern is already used elsewhere in the codebase (Recommendations.tsx).
- `noUnusedLocals: true` catches dead code like `saveNote` and `ratingCount`. Prefix `_` does NOT suppress this in TypeScript — either remove the code or destructure to `[,]`.
- Vitest config embedded in `vite.config.ts` requires `/// <reference types="vitest/config" />` at the top for type-checking to pass.
