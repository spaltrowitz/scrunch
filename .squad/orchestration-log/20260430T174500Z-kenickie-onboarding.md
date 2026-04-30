# Orchestration Log: Kenickie Onboarding Goal Capture Spec

**Date:** 2026-04-30T17:45:00Z  
**Agent:** Kenickie (PM)  
**Task:** Onboarding goal capture product spec  
**Status:** Delivered

## Outcome

Proposed one-question interstitial ("What brings you to Scrunch?") with 3 options:
- 🌱 I'm new to curly hair care
- 🔍 I want to find new products
- 🤷 Just browsing — surprise me

**Key properties:**
- Skippable (defaults to explore behavior)
- localStorage-persisted for anonymous users + Supabase for auth
- Re-engagement nudge after 3+ sessions on explore goal
- Reversible (settings → "Your Scrunch experience")

**Priority:** P1

## Constraints Applied

- Non-blocking: products visible behind interstitial, renders after 500ms
- Invisible onboarding principle: don't gate value, show products first
- No demographic collection (no hair type, age, etc.)
- Lightweight: one tap, no wizards

## Open Questions Flagged

1. Copy tone: playful ("Surprise me!") vs. neutral ("Just browsing")?
2. Visual treatment: full-screen interstitial or inline?
3. Analytics: track goal changes as cohort metric?
4. Skip behavior: default skippers to explore or blended?

## Next Steps

- Jan (Design) to create UX flow and visual specs
- Incorporate invisible onboarding constraint
- Resolve design/copy decisions before dev sprint planning
