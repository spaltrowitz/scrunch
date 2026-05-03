# Work Routing

How to decide who handles what.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|----------|
| Architecture, scope, tech decisions | Sandy | System design, API contracts, stack choices, code review |
| React, UI components, styling, PWA | Frenchy | Components, pages, Tailwind CSS 4, accessibility, animations |
| Supabase, database, APIs, auth | Danny | Edge functions, migrations, RLS policies, external APIs |
| Tests, quality, edge cases, coverage | Rizzo | Vitest, React Testing Library, regression, product-principle tests |
| UX/UI design, visual hierarchy, copy | Jan | Flows, layouts, design tokens, UX writing, accessibility audit |
| Feature scoping, prioritization, MVP | Sandy | User stories, roadmap, competitive analysis, scope challenges |
| Performance, dead code, bundle size | Cha-Cha | Query optimization, render perf, duplication, code bloat |
| Domain knowledge, data validation | Marty | CGM rules, ingredient analysis, hair typing, data model correctness |
| Session logging, decisions | Scribe | Automatic — never needs routing |

## Keyword Routing

| Keywords | Route To |
|----------|----------|
| "architecture", "design decision", "scope", "API contract" | Sandy |
| "component", "page", "styling", "tailwind", "responsive", "mobile", "accessibility", "PWA" | Frenchy |
| "API", "endpoint", "database", "migration", "auth", "supabase", "edge function", "RLS" | Danny |
| "test", "bug", "edge case", "coverage", "regression", "quality", "vitest" | Rizzo |
| "design", "UX", "UI", "flow", "layout", "animation", "copy", "label" | Jan |
| "priority", "roadmap", "MVP", "scope", "user story", "feature request" | Sandy |
| "performance", "slow", "optimize", "bundle", "dead code", "bloat", "redundant" | Cha-Cha |
| "CGM", "ingredient", "curly", "hair type", "porosity", "routine", "silicone", "sulfate" | Marty |

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze issue, assign `squad:{member}` label | Sandy |
| `squad:{name}` | Pick up issue and complete the work | Named member |
| `squad:copilot` | Well-defined issue routed to @copilot | @copilot |

### How Issue Assignment Works

1. When a GitHub issue gets the `squad` label, **Sandy** triages it — analyzing content, assigning the right `squad:{member}` label, and commenting with triage notes.
2. When a `squad:{member}` label is applied, that member picks up the issue in their next session.
3. Members can reassign by removing their label and adding another member's label.
4. The `squad` label is the "inbox" — untriaged issues waiting for Sandy's review.

## Multi-Domain Routing

| Signal | Action |
|--------|--------|
| "Team, ..." or broad feature request | Fan-out: Sandy + relevant domain agents in parallel |
| New feature implementation | Sandy (arch) + Frenchy/Danny (impl) + Rizzo (tests) |
| UI/UX feature | Jan (design) + Frenchy (impl) |
| Hair care domain question | Marty (domain) + relevant tech agent |
| Product decision | Sandy (scope + tech feasibility) |
| Performance issue | Cha-Cha (analysis) + relevant tech agent (fix) |

## Review Gates

| Change Type | Required Reviewer |
|-------------|-------------------|
| Architecture decisions | Sandy must approve before implementation |
| API contracts | Sandy must approve before frontend integration |
| New components/pages | Rizzo must review for test coverage |
| Database migrations | Sandy + Danny must both approve |
| Optimization PRs | Sandy reviews + Rizzo verifies no regressions |
| Security-related changes | Sandy reviews with security focus |
| Domain logic (CGM scoring, ingredients) | Marty must validate domain correctness |

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for "what port does the server run on?"
4. **When two agents could handle it**, pick the one whose domain is the primary concern.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** If a feature is being built, spawn Rizzo to write test cases from requirements simultaneously.
7. **Issue-labeled work** — when a `squad:{member}` label is applied to an issue, route to that member.
8. **@copilot routing** — well-defined issues with clear specs may be routed to @copilot. Sandy triages and assigns the `squad:copilot` label. See team.md Coding Agent capabilities for routing guidance (🟢/🟡/🔴).

## Optional Agents

| Agent | Role | When to Route |
|-------|------|---------------|
| Cha-Cha | Optimizer | Performance, dead code, bundle size, query optimization |
| Marty | Domain Expert | CGM rules, ingredient analysis, hair typing, data model correctness |

> Optimizer and Domain Expert are optional roles. If unavailable, route to Sandy for triage.
