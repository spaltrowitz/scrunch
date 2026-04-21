# Curly Girl — Product Requirements Document

## Problem Statement

The curly hair community relies on fragmented, hard-to-navigate resources: massive Google Spreadsheets with thousands of rows, single-purpose ingredient checkers (CurlScan, IsItCG), scattered Reddit threads across r/curlygirl (61K weekly visitors) and r/curlyhair (339K weekly visitors, 4.3K online), and YouTube videos. There is no single place where a person can:

1. Build a **personal profile** around their hair characteristics
2. **Track which products** they've tried and whether those products worked
3. Get **personalized recommendations** from people with similar hair
4. **Ask questions** and get both AI-assisted and community-driven answers

Curly Girl consolidates these fragmented resources into an authenticated, personalized experience.

---

## Vision

A web app where curly-haired people can create a hair profile, log products they've used (with notes on results), discover new products recommended by people with similar hair, and participate in a community Q&A board with an AI assistant trained on the wealth of existing curly hair knowledge.

### Design Inspirations

- **[Yuka](https://yuka.io/)** — The gold standard for product scanning UX. Scan a barcode, get an instant color-coded health rating (green/orange/red) with clear ingredient breakdowns and healthier alternatives. We want this same "scan and understand instantly" experience for hair products. Yuka is ad-free and focused entirely on user trust — we should follow the same principle. *Future integration point: Yuka-style health scoring layered on top of CG approval (Phase 2+).*
- **[Prose](https://prose.com/)** — Best-in-class onboarding quiz for hair profiles. Their flow asks about hair type, texture, density, porosity, scalp condition, styling habits, environment (zip code for humidity/water hardness), diet, stress, workout frequency, fragrance preference, and sensitivities — all in a guided 5–10 minute experience. Our onboarding should mirror this depth and flow. Key Prose questions to adapt:
  - Hair type & texture (straight → coily)
  - Strand thickness (fine, medium, coarse)
  - Scalp condition (oily, dry, sensitive, dandruff)
  - Styling habits (heat tools, chemical treatments)
  - Location/zip code (for humidity, water hardness, UV)
  - Workout frequency (affects wash frequency)
  - Washing frequency
  - Fragrance preference
  - Allergies/sensitivities

### Guiding Principles

- **No paid advertising.** We will not run ads. Revenue model TBD but the product must stay unbiased and community-trust-first. This extends to content curation — YouTube and Reddit content must be filtered for genuine reviews, not sponsored/paid promotions.
- **Community-driven, not brand-driven.** Product recommendations come from real people with real results, not paid influencers or brand deals.
- **Unbiased data.** Cross-reference multiple sources (CurlScan, IsItCG, community spreadsheets) rather than relying on any single authority.

---

## User Personas

### 1. The Beginner ("Just discovered I have curls")
- Doesn't know their curl type, porosity, or what products to avoid
- Overwhelmed by ingredient lists and CGM rules
- Needs guided onboarding and simple recommendations

### 2. The Experimenter ("Always trying new products")
- Knows their hair type but is constantly testing products
- Wants to log what works and what doesn't
- Values reviews from people with *similar* hair, not generic reviews

### 3. The Expert ("I've been doing CGM for years")
- Deep knowledge of ingredients, techniques, and routines
- Wants to help others — answers questions, writes reviews
- Would contribute product data and corrections

### 4. The Browser ("Just checking ingredients")
- May not want to create an account
- Wants to quickly check if a product is CG-approved
- Needs a fast, frictionless ingredient checker

---

## Core Features

### F1: User Profiles & Hair Characteristics

Users create a profile with their hair attributes. This is the foundation for personalized recommendations.

**Hair attributes to capture:**
- **Curl pattern**: 2A, 2B, 2C, 3A, 3B, 3C, 4A, 4B, 4C (with visual reference images)
- **Porosity**: Low, Medium/Normal, High (with guidance on how to test — e.g., the float test, spray test)
- **Hair density**: Thin, Medium, Thick
- **Hair width/texture**: Fine, Medium, Coarse
- **Scalp type**: Dry, Normal, Oily
- **Hair length**: Short, Medium, Long, Extra long
- **Color treatment**: Virgin, Color-treated, Bleached, Highlighted
- **Climate/environment**: Humid, Dry, Variable (affects product performance significantly)
- **Country**: For product availability filtering

**Lifestyle & environment factors (inspired by Prose onboarding):**
- Workout/sweat frequency (affects wash frequency needs)
- Washing frequency (current and desired)
- Heat tool usage (never, occasionally, frequently)
- Chemical treatments (relaxer, keratin, perm)
- Stress level (can affect hair health)
- Water type (hard, soft, unknown — can prompt by zip/location)

**Profile should also capture:**
- How long they've been following CGM (or if they're just starting)
- Primary hair goals (moisture, definition, volume, frizz control, length retention)
- Known sensitivities/allergies (fragrance, coconut, protein sensitivity)
- Fragrance preference (love it, no preference, prefer fragrance-free)

**Onboarding UX (Prose-inspired):**
- Guided quiz format, one question per screen with visual aids
- Progress bar showing how far along they are
- Skip option for questions they're unsure about (can fill in later)
- "Help me figure this out" links with explainers (e.g., how to test porosity)
- Results summary at the end: "Here's your hair profile" with personalized first recommendations
- Should take ~3–5 minutes (shorter than Prose since we're not formulating custom products)

### F2: Product Database

A comprehensive, community-maintained database of hair products with CG-approval status.

**Product attributes:**
- Brand name
- Product name
- Product category (see taxonomy below)
- Full ingredient list
- CG-approved status (Approved / Not Approved / Caution)
- Flagged ingredients (which specific ingredients caused a non-approved rating and why)
- Country availability
- Price range
- Size options
- Protein-free flag
- Fragrance-free flag
- Key beneficial ingredients highlighted

**Product categories (taxonomy):**
| Category | Description |
|---|---|
| Clarifying shampoo | Used for "final wash" or reset — may contain sulfates intentionally |
| Low-poo (sulfate-free shampoo) | Gentle cleansing without sulfates |
| Co-wash | Conditioner-based cleansing |
| Rinse-out conditioner | Standard conditioner for detangling and moisture |
| Deep conditioner / Hair mask | Intensive treatment for moisture or protein |
| Leave-in conditioner | Applied after washing, not rinsed out |
| Curl cream / Styling cream | Moisture and soft hold |
| Gel | Definition and hold |
| Mousse / Foam | Lightweight hold and volume |
| Custard / Pudding | Thick styling product for definition |
| Oil / Serum | Sealing moisture, shine |
| Spray / Refresher | Refresh curls between washes |
| Protein treatment | Targeted protein repair |
| Scalp treatment | Scalp-specific products |

**Data seeding strategy:**
- Import from the existing [CG-approved spreadsheet](https://docs.google.com/spreadsheets/d/1gn6VnPsRU1H3ziElbWqNVFY5mev6GB1pwKKt_MNpoAY/) as initial dataset
- **Cross-reference CurlScan AND IsItCG** for CG-approval status — don't rely on a single source. Where they disagree, flag for manual review
- Build our own ingredient analysis engine using the rules/logic from both CurlScan and IsItCG as reference
- Allow community submissions with moderation
- Ingredient analysis engine that can auto-classify CG approval based on ingredient lists

### F3: Product Logging & Reviews

Authenticated users can log products they've used and record their experience.

**Per-product log entry:**
- Product reference (from the database)
- Rating (1–5 stars, or thumbs up/down for simplicity)
- Status: Currently using / Used to use / Tried once
- Would repurchase: Yes / No / Maybe
- Application method notes (e.g., "applied to soaking wet hair," "scrunched in," "praying hands")
- Results notes (freeform text)
- Photos (optional — before/after)
- Date started using
- Part of routine: Wash day / Refresh day / Deep treatment

**Product page aggregation:**
- Overall community rating
- **Filtered ratings by hair type** — "People with 3B, low porosity hair rated this 4.2/5" — this is the killer feature
- Most common pros/cons extracted from reviews
- "People like you also liked..." recommendations

### F4: Personalized Recommendations Engine

Recommend products based on collaborative filtering — find users with similar hair profiles and surface what works for them.

**Similarity matching factors (weighted):**
1. Curl pattern (highest weight)
2. Porosity (high weight)
3. Hair density + width
4. Climate/environment
5. Country (for availability)
6. Hair goals overlap

**Recommendation types:**
- "Top rated by people like you" — products highly rated by similar-profile users
- "Trending with your hair type" — recently popular products in your segment
- "You might want to try" — products from categories you haven't explored
- "Switch suggestion" — if you rated a product poorly, suggest alternatives that similar users preferred

### F5: Community Q&A Board

A place where users can ask questions and get answers.

**Flow:**
1. User writes a question
2. **AI assistant responds first** — using knowledge from Reddit (r/curlygirl, r/curlyhair), YouTube transcripts, CGM resources, and the app's own product data
3. User can:
   - Accept the AI answer (question resolved)
   - Post to the community if unsatisfied with the AI answer (question becomes a community thread)
4. Community members can answer, upvote, and comment
5. AI can also suggest relevant existing threads before the user posts

**AI Knowledge Sources:**
- Scraped/indexed content from r/curlygirl wiki and top posts (search "curly girl method reddit" for best threads — holy grail product threads, routine megathreads, weekly wash day results)
- Scraped/indexed content from r/curlyhair wiki and top posts (339K weekly visitors — massive knowledge base)
- Key Reddit thread types to prioritize: "holy grail products," "routine help," "product recommendations by hair type," weekly results threads with before/after photos
- YouTube creator content — **only genuine comparison/review content, NOT sponsored or paid promotions**. Prioritize creators doing multi-product comparisons with honest results over single-product "reviews" that are likely paid
- The app's own product database and user reviews
- General CGM principles and ingredient science
- Cross-referenced data from CurlScan and IsItCG

**Q&A Features:**
- Tag questions by topic (products, techniques, troubleshooting, beginner, etc.)
- Filter by hair type relevance
- Mark answers as "worked for me" (validated solutions)
- AI answers clearly labeled as AI-generated
- Community experts can earn reputation/badges

### F6: Ingredient Checker (Available Without Auth)

A lightweight, publicly accessible tool — no login required.

- Paste an ingredient list → get instant CG-approval analysis
- Flag each problematic ingredient with an explanation of *why* it's not CG-approved
- Barcode scan (mobile) to look up products directly
- Link to full product page if the product exists in the database
- Prompt to create an account for personalized features

### F7: Routine Builder

Help users construct a complete hair care routine.

- Guided flow: select products for each step (cleanse → condition → style → dry)
- Save multiple routines (wash day routine, refresh routine, deep treatment routine)
- Share routines publicly or keep private
- Browse popular routines filtered by hair type
- Track which routine you used on which days (routine diary)

### F8: Featured Content & Education Hub

Curated educational content from trusted sources across the web — surfaced contextually throughout the app (not a separate "blog" section).

**Content types:**
- **Method guides** — "What is the Curly Girl Method?" explainers for beginners
- **Technique tutorials** — Plopping, scrunching, squish to condish, diffusing, etc.
- **Ingredient education** — What are silicones? Why avoid sulfates? Protein vs moisture balance
- **Product comparisons** — Honest multi-product reviews and roundups

**Trusted featured sources (curated, editorial-quality):**
| Source | Strength | URL |
|---|---|---|
| Curl Maven | Deep CGM guides, technique tutorials, European product focus | [curlmaven.ie](https://curlmaven.ie/what-is-the-curly-girl-method/) |
| Real Simple | Mainstream editorial reviews with expert input | [realsimple.com](https://www.realsimple.com/beauty-fashion/hair/hair-care/curly-girl-method-review) |
| Curly World (Lorraine Massey) | Original CGM creator's site — authoritative method explanation | [curlyworld.com](https://www.curlyworld.com/cgmethod) |
| CurlsBot | Ingredient analyzer tool — useful for cross-referencing our analysis rules | [curlsbot.com](https://www.curlsbot.com/) |
| The Everygirl | Accessible beginner guides with real results and routine breakdowns | [theeverygirl.com](https://theeverygirl.com/curly-girl-method/) |
| r/curlygirl + r/curlyhair | Community wisdom — holy grail threads, routine megathreads | Reddit |
| YouTube (genuine only) | Technique demos, multi-product comparisons (no sponsored content) | Various |

**How featured content appears in the app:**
- On product pages: relevant articles about that product category (e.g., "Best gels for 3B curls" article linked on gel product pages)
- In onboarding: "Learn more" links to educational content at each quiz step (e.g., porosity test article linked from the porosity step)
- On the dashboard: "Featured reads" section with rotating curated content
- In the Q&A AI assistant: AI can cite featured content sources in its answers
- **All featured content links out to the original source** — we don't copy/republish. We curate and contextualize.

**Content curation principles:**
- No sponsored or paid content — same principle as products
- Prefer sources with hands-on experience and real results
- Cross-reference ingredient analysis rules with CurlsBot, CurlScan, and IsItCG for consistency
- Prioritize diverse hair types in featured content (2A–4C representation)

---

## Non-Functional Requirements

### Authentication & Authorization
- Email/password registration with email verification
- Social login (Google, Apple)
- Guest access for ingredient checker and product browsing
- User data privacy — hair profiles are private by default, users opt-in to make data available for recommendations
- GDPR/privacy compliant — users can export and delete their data

### Performance
- Product search and ingredient check must respond in < 500ms
- Recommendation engine can be async (computed periodically, not real-time)
- Support for high traffic given the large Reddit communities (339K+ weekly visitors potential)

### Mobile Experience
- Mobile-first responsive design (most product checks happen in-store on a phone)
- Barcode scanning via mobile camera
- PWA support for "add to home screen" experience

### Data Quality
- Moderation system for community-submitted products
- Ingredient parsing engine to automatically detect CG compliance
- Flagging system for outdated product formulations (manufacturers change ingredients)
- Version history on product ingredient lists

### Internationalization
- Support multiple countries for product availability
- Currency display by region
- Potential for multilingual UI (English first, Spanish as second priority given large LatAm curly community)

---

## Technical Considerations

> These are initial suggestions for discussion — not final decisions.

### Frontend
- **Next.js** (App Router) — SSR for SEO on product pages, fast client navigation
- **Tailwind CSS** — rapid UI development, mobile-first
- **React Query / TanStack Query** — data fetching and caching

### Backend / API
- **Next.js API routes** or **separate Node.js/Express API** — depends on scale expectations
- **PostgreSQL** — relational data (users, products, reviews, routines) with strong querying
- **Full-text search** — PostgreSQL `tsvector` or Elasticsearch/Typesense for product/ingredient search

### AI / Recommendations
- **Embeddings-based similarity** for product recommendations (collaborative filtering)
- **RAG (Retrieval-Augmented Generation)** for the Q&A AI assistant — embed Reddit content, YouTube transcripts, CGM guides, and product data into a vector store
- **LLM** (Claude or GPT) for generating Q&A answers from retrieved context

### Auth
- **NextAuth.js** or **Clerk** — handles social login, email/password, session management

### Storage
- **Cloud storage** (S3 or similar) for user-uploaded photos
- **CDN** for product images

### Hosting
- **Vercel** for frontend + API (natural fit for Next.js)
- **Managed PostgreSQL** (Supabase, Neon, or Railway)

---

## Data Sources & Content Strategy

### Initial Data Seeding
| Source | Content | Integration Method |
|---|---|---|
| CG Approved Spreadsheet | ~5,000+ products with ingredients | CSV import, one-time + periodic sync |
| CurlScan | Product database with CG status | API integration or scrape (check ToS) |
| IsItCG | Ingredient analysis rules & product checks | **Cross-reference with CurlScan** — use both to validate CG status, flag disagreements |
| CurlsBot | Ingredient analysis engine & CG checker | Cross-reference analysis rules with our engine for consistency |
| r/curlygirl wiki | Beginner guides, technique explanations | Manual curation + RAG indexing |
| r/curlyhair wiki + top threads | Holy grail product lists, routine megathreads, technique guides | Manual curation + RAG indexing. Search "curly girl method reddit" for top threads |
| YouTube (genuine reviewers only) | Multi-product comparisons, technique tutorials | Transcript indexing for RAG. **Filter out sponsored/paid content** — only index genuine comparison reviews |

### Featured Content Sources (Editorial / Educational)
| Source | Content Type | Integration |
|---|---|---|
| [Curl Maven](https://curlmaven.ie/) | Deep CGM guides, technique tutorials, European products | Link-out with contextual placement. RAG indexing for AI assistant |
| [Real Simple](https://www.realsimple.com/) | Expert-backed editorial reviews | Link-out. Curated for product pages and beginner onboarding |
| [Curly World](https://www.curlyworld.com/) | Lorraine Massey's original CGM method guides | Authoritative method reference. Link-out from onboarding/education |
| [The Everygirl](https://theeverygirl.com/) | Accessible beginner guides with real routine breakdowns | Link-out. Great for onboarding "learn more" links |
| [CurlsBot](https://www.curlsbot.com/) | Ingredient analysis tool | Cross-reference our ingredient rules. Link-out as secondary checker |

### Ongoing Content
- Community-submitted product additions (moderated)
- User reviews and ratings (organic growth)
- Community Q&A threads
- AI-generated summaries of trending discussions from Reddit
- **No paid/sponsored content** — all data sources must be filtered for authenticity

---

## Success Metrics

| Metric | Target | Why It Matters |
|---|---|---|
| Registered users | 10K in first 6 months | Community critical mass |
| Products in database | 10K+ at launch | Must be comprehensive to be useful |
| Product reviews logged | 50K in first year | Powers the recommendation engine |
| Ingredient checks/day | 1K+ | Proves utility for the "browser" persona |
| Q&A questions answered by AI | 70%+ satisfaction (no need to post to community) | Validates AI assistant value |
| DAU/MAU ratio | 30%+ | Shows sticky engagement |

---

## MVP Scope (Phase 1)

For initial launch, focus on the core loop:

1. **Auth** — sign up, log in, social login
2. **Hair profile** — onboarding quiz to set up profile
3. **Product database** — seeded from spreadsheet, searchable, browsable by category
4. **Ingredient checker** — paste ingredients, get CG analysis (no auth required)
5. **Product logging** — rate products, add notes
6. **Basic recommendations** — "top products for your hair type" (doesn't need full collaborative filtering yet — can start with simple filtering by hair type)

### Deferred to Phase 2
- Community Q&A board + AI assistant
- Routine builder
- Barcode scanning
- Photo uploads
- Advanced recommendation engine (collaborative filtering)
- Mobile PWA optimizations

### Deferred to Phase 3
- Internationalization
- Expert badges / reputation system
- Trending discussions from Reddit integration
- YouTube content integration (genuine reviews only, no sponsored)
- **Yuka-style product health scoring** — layer a Yuka-inspired health/ingredient score on top of CG approval. Color-coded rating (green/orange/red) with clear explanations. Potential future Yuka API integration for cross-referencing general product health data alongside CG-specific analysis

---

## Open Questions

1. **Monetization**: ~~Ad-supported?~~ **No ads.** Freemium with premium features? Affiliate links (if transparent and non-biasing)? Subscription model?
2. **Product data licensing**: What are the ToS for CurlScan and the Google Spreadsheet data? Can we legally import/reference it? Same question for IsItCG.
3. **AI assistant model**: Claude vs GPT vs open-source for the Q&A assistant? Cost implications at scale?
4. **Moderation**: How do we handle product data disputes? (e.g., "this product changed its formula")
5. **Community guidelines**: What moderation is needed for the Q&A board?
6. **Brand partnerships**: Should brands be able to claim their product pages or respond to reviews? (Must not compromise unbiased positioning)
7. **Sponsored content detection**: How do we reliably filter out paid YouTube reviews and Reddit astroturfing from our knowledge base?

---

## References

- [CG Approved Product Spreadsheet](https://docs.google.com/spreadsheets/d/1gn6VnPsRU1H3ziElbWqNVFY5mev6GB1pwKKt_MNpoAY/)
- [CurlScan](https://curlscan.com/approved)
- [IsItCG](http://www.isitcg.com/)
- [r/curlygirl wiki](https://www.reddit.com/r/curlygirl/wiki/basics/)
- [r/curlyhair](https://www.reddit.com/r/curlyhair/)
- [Curl Maven](https://curlmaven.ie/what-is-the-curly-girl-method/) — deep CGM guides, European product focus
- [Real Simple — CGM Review](https://www.realsimple.com/beauty-fashion/hair/hair-care/curly-girl-method-review) — editorial review with expert input
- [Curly World](https://www.curlyworld.com/cgmethod) — Lorraine Massey's original CGM method site
- [CurlsBot](https://www.curlsbot.com/) — ingredient analyzer, cross-reference for our rules engine
- [The Everygirl — CGM Guide](https://theeverygirl.com/curly-girl-method/) — accessible beginner guide
- [Prose](https://prose.com/) — onboarding quiz inspiration for hair profile creation
- [Yuka](https://yuka.io/) — product scanning UX and health scoring inspiration (future integration)
- [Boris Tane — How I Use Claude Code](https://boristane.com/blog/how-i-use-claude-code/) (development workflow reference)
