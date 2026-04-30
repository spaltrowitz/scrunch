### 2026-04-30T16:24:00Z: User directive — Hosting & scaling limits reference
**By:** Shari Paltrowitz (via Copilot)
**What:** GitHub Pages limits: 100GB bandwidth/month (~200K page loads), 1GB repo, 10 builds/hr — more than enough even for hundreds of users. The real bottleneck is Firebase free tier: 50K Firestore reads/day, 20K writes/day, 10K auth verifications/month. Free tier covers up to ~100 active users. Past that, move to Firebase Blaze plan ($0.06/100K reads). Recommendation: keep GitHub Pages for hosting indefinitely, watch Firebase usage past 100 active users.
**Why:** User request — captured for team memory. Important scaling reference for Alpha → Beta → Launch progression.
