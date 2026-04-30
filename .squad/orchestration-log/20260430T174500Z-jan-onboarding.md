# Orchestration Log: Jan Onboarding UX Flow Design

**Date:** 2026-04-30T17:45:00Z  
**Agent:** Jan (Product Design)  
**Task:** Onboarding UX flow design  
**Status:** Delivered

## Outcome

Bottom sheet interaction pattern with 5 emoji-forward options:
1. 🌱 Just starting my curly journey
2. 🔍 Looking for new products to try
3. 💰 Finding products that won't break the bank
4. 🧪 Fine-tuning what works for my hair
5. 🤷 Not sure yet — just browsing!

**Key properties:**
- Bottom sheet (60% of screen, product grid visible behind)
- Swipe-to-dismiss (no "X" button)
- 500ms delay on first launch (allows homepage to load)
- "Not sure" as first-class option
- Re-engagement inline card after 3rd session
- Settings page to change answer anytime

## Constraints Applied

- Invisible onboarding: products visible before interaction
- Non-gating: swipe dismissal creates no friction
- Accessibility: proper focus traps, high contrast, min 48px tap targets
- Offline-first: works with localStorage, no network required

## Persona Mapping

| User sees | Internal persona | Homepage effect |
|-----------|-----------------|-----------------|
| 🌱 Just starting | Newbie | "Beginner-friendly" badge, simple routines |
| 🔍 Looking for new | Store Scanner | Top-rated, quick verdict badges |
| 💰 Budget-friendly | Budget Builder | Price-sorted, "under $X" sections |
| 🧪 Fine-tuning | Optimizer | Ingredient filters, "what's new" |
| 🤷 Not sure yet | None (default) | Generic discovery, no personalization |

## Edge Cases Handled

- App data cleared → sheet reappears
- Deep link into product → sheet after first homepage visit
- Offline → sheet appears with localStorage storage
- Reduced motion → instant appearance (no slide animation)

## Next Steps

- Kenickie to finalize spec incorporating these designs
- Dev sprint: implement bottom sheet, localStorage, Supabase schema
- Analytics: track option popularity and goal changes over time
