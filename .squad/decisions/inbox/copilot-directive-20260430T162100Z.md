### 2026-04-30T16:21:00Z: User directive — Hosting + Auth clarification (supersedes earlier directive)
**By:** Shari Paltrowitz (via Copilot)
**What:** Scrunch CAN stay on GitHub Pages even with auth. Client-side auth (Firebase Auth) runs entirely in the browser — GitHub Pages just serves the static files. No migration needed. Pattern: GitHub Pages serves HTML/JS/CSS, Firebase Auth handles login, Firestore stores user data if needed. The hosting and auth are separate services.
**Why:** Corrects earlier directive that said auth requires leaving GitHub Pages. That was too simplistic — client-side auth works fine with static hosting.
