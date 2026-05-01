### 2026-05-02: Community search — keyword extraction + honest summaries
**By:** Danny (Backend Dev)
**What:** Three changes to Community.tsx search:
1. Extract 4-6 key terms from user queries before sending to Reddit API (stop word removal, dedup, truncation). Long natural language queries return irrelevant popular posts.
2. Preserve Reddit's relevance ordering — removed the `sort by score` that was overriding it with popularity.
3. Replaced fake "AI Summary" with honest "Community Results" label and plain-text summary. Added `stripMarkdown()` to clean Reddit selftext before display.
**Why:** Shari tested with a real query and got completely irrelevant results (viral posts about haircuts instead of bang-styling advice). The "AI summary" was misleading — it pretended to analyze content but just quoted the first (wrong) result with raw markdown formatting.
**Impact:** Community.tsx search function, summary display, result ordering. No API or schema changes.
