# Scrunch — Product Requirements Document

## Problem Statement

The curly hair community relies on fragmented, hard-to-navigate resources: massive Google Spreadsheets with thousands of rows, single-purpose ingredient checkers (CurlScan, IsItCG), scattered Reddit threads across r/curlygirl (61K weekly visitors) and r/curlyhair (339K weekly visitors, 4.3K online), and YouTube videos. There is no single place where a person can:

1. Build a **personal profile** around their hair characteristics
2. **Track which products** they've tried and whether those products worked
3. Get **personalized recommendations** from people with similar hair
4. **Ask questions** and get both AI-assisted and community-driven answers

Scrunch consolidates these fragmented resources into an authenticated, personalized experience.

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
- **Re-entering the quiz pre-loads existing selections** (edit mode, not start-from-scratch)

**Quiz sections (Prose-style grouping):**

| Section | Questions | Notes |
|---|---|---|
| **Hair & Scalp** | Curl pattern, porosity, strand width (feel test), hair density (scalp visibility), hair length, oily/dry spectrum, split ends, shedding, genetic hair loss | Core hair characteristics. Each has "Why we ask" + "Tap for pics" |
| **Scalp Health** | Wash frequency, days until oily after wash, between-wash scalp oily/dry, flakiness, scalp sensitivity | Drives cleanser recommendations |
| **Treatments & History** | Color treatment, gray percentage, chemical treatments, heat tool usage | Damage assessment + product compatibility |
| **Lifestyle** | Climate/location (zip code), workout frequency, water type | Environmental factors |
| **Preferences & Goals** | CGM experience level, hair goals (multi-select), sensitivities/allergies (multi-select), fragrance preference | Drives personalized recommendations |

**Full question set (from Prose reference + CGM-specific):**

*Hair & Scalp:*
1. **Curl pattern** — "What's your natural, untreated, air-dried hair texture?" with SVG illustrations. "More of a visual learner? Tap for pics"
2. **Strand width** — "What does a single strand of hair feel like? Roll a single hair between your fingers." (Fine / Medium / Coarse) — with "Why we ask" tooltip
3. **Hair density** — "How dense is your hair? Part your hair and check the mirror — the more scalp you see, the less dense your hair is." (I see very little to no scalp / I can see a little skin / I can see a lot of scalp)
4. **Hair length** — "How long is your hair? If you have curly hair, pull the curl all the way down to find your true length." — Descriptive labels: "Buzz-cut to early-Beatles" / "Doesn't touch shoulders" / "Sits on shoulders" / "Below shoulder blades" / "Mid-back and beyond"
5. **Porosity** — with float test explainer link
6. **Oily/dry spectrum** — "Where would you put your hair on the oily/dry spectrum?" — Roots oily + lengths balanced / Roots not oily + lengths not dry / Roots oily + lengths dry or frizzy / Roots not oily + lengths always dry
7. **Split ends** — "Do you get split ends? Check your ends right now." — with "Did you know there are 6 types of splits?" expandable
8. **Shedding** — "Do you feel like you're shedding more than usual lately?" — with "What's normal? Check the tip!" expandable
9. **Genetic hair loss** — "Is hair loss a genetic issue in your family?" — with "Why we ask" tooltip

*Scalp Health:*
10. **Wash frequency** — "How often do you wash your hair? This includes shampooing and co-washing." — with fun fact tooltip
11. **Days until oily** — "After a wash, how long until hair gets oily again? If stuck between answers, choose the greater number of days." — with "Why we ask"
12. **Between-wash scalp** — "In between washes, where is your scalp on the oily/dry spectrum?" — with "Did you know..."
13. **Flakiness** — "Are you prone to flakiness?" — with "Did you know..." expandable
14. **Scalp sensitivity** — "Do you have a sensitive scalp? If you experience tightness, dryness, burning, tingling, pain, itching, or redness, all that counts as sensitivity."

*Treatments & History:*
15. **Color treatment** — Virgin / Color-treated / Bleached / Highlighted
16. **Gray percentage** — "How much of your hair is gray? If color-treated, answer with your natural gray percentage." — None / A few grays / About half gray / All or nearly-all gray — with "Tap for pics"
17. **Chemical treatments** — Relaxer / Keratin / Perm / None
18. **Heat tool usage** — Never / Occasionally / Frequently

*Lifestyle:*
19. **Climate** — Humid / Dry / Variable / Tropical
20. **Location** — Zip code (for humidity, water hardness, UV)
21. **Workout frequency** — Rarely / A few times/week / Daily
22. **Water type** — Hard / Soft / Don't know

*Preferences & Goals:*
23. **CGM experience** — Just starting / Under 1 year / 1-3 years / 3+ years
24. **Hair goals** — Multi-select: moisture, definition, volume, frizz control, length retention, repair, shine, scalp health
25. **Sensitivities** — Multi-select: fragrance, coconut, protein, sulfate, silicone, aloe
26. **Fragrance preference** — Love it / No preference / Fragrance-free

**UX patterns per question:**
- **"Why we ask"** — collapsible tooltip explaining how this affects recommendations
- **"More of a visual learner? Tap for pics"** — expandable panel with reference photos
- **"Did you know..."** / **"Fun fact"** — educational content that builds trust and engagement
- **"Check the tip!"** — contextual guidance (e.g., what's normal shedding)

**Visual aids per question:**
- Curl pattern: SVG illustrations of each wave/curl/coil pattern (currently implemented)
- Strand width: "Roll a single hair between your fingers" with thread comparison visual
- Hair density: Mirror/scalp visibility comparison images
- Hair length: Body-reference silhouette showing each length
- Gray percentage: Hair swatch photos from "a few grays" to "nearly all gray"
- Porosity: Float test diagram or spray test animation
- Each with "Tap for pics" expandable photo reference panel

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

### F3.5: Request a Missing Product

Users should be able to request products that aren't in the database yet.

**Request flow:**
- "Can't find your product?" button visible on the products page and search results
- Simple form: Brand name, Product name, Product category (dropdown), optional link to product page or photo
- No auth required for submitting a request (lowers friction), but logged-in users get notified when their request is fulfilled
- Requests go into a moderation queue
- Community can upvote existing requests ("I want this too") to help prioritize

**Request lifecycle:**
1. User submits request → status: `pending`
2. Community upvotes → surfaces popular requests
3. AI auto-processing (see below) → status: `auto_reviewed`
4. Admin spot-checks AI work → status: `approved` or `rejected`
5. Requester notified (if logged in) → status: `fulfilled`

### F3.6: AI-Powered Product Ingestion Pipeline

When a product request comes in, an automated pipeline should handle most of the work without human intervention.

**AI auto-processing (triggered on new request or scheduled batch):**
1. **Product lookup** — AI searches for the product by brand + name across:
   - Brand's official website (ingredients, description, product image)
   - Retail sites (Target, Ulta, Amazon) for product image and pricing
   - Open Beauty Facts API for existing data
2. **Ingredient extraction** — AI pulls the full ingredient list from the product page or retail listing
3. **CG analysis** — Run the ingredient list through our analyzer engine, cross-reference with CurlScan/IsItCG rules
4. **Image selection** — Pull the best available product image (brand site > retail site > Open Beauty Facts)
5. **Auto-populate fields** — Brand, name, category, ingredients, CG status, flagged ingredients, image URL, price range, country availability, protein-free/fragrance-free flags
6. **Confidence score** — AI assigns a confidence level to its work:
   - `high`: found on brand site with full ingredients → auto-approve
   - `medium`: found on retail site, ingredients may be outdated → flag for review
   - `low`: couldn't find reliable ingredient list → hold for manual review

**Product record created with:**
```
status: 'auto_reviewed'
ai_confidence: 'high' | 'medium' | 'low'
source_urls: ['https://brand.com/...', 'https://target.com/...']
auto_reviewed_at: timestamp
```

**Admin dashboard actions:**
- View AI-processed products sorted by confidence (low first)
- One-click approve for high-confidence items
- Edit ingredients/status before approving for medium/low
- Reject with reason

### F3.7: Product Removal & Data Quality

Products should be removable or flagged under certain criteria.

**Automatic flagging (AI-monitored):**
- **Formula change detected** — If a user reports "this product's ingredients changed" or a re-scan of retail sites shows different ingredients, flag the product for review
- **Discontinued product** — If the product is no longer available on major retail sites, mark as `discontinued` (keep in DB but de-prioritize in search/recommendations)
- **Duplicate product** — AI detects near-duplicate entries (same brand, similar name) and flags for merge

**Manual removal criteria (admin action):**
- Product confirmed discontinued by brand
- Product recalled or safety concern
- Persistent incorrect data that can't be verified
- DMCA or legal request from brand (unlikely but documented)
- Spam/fake product submissions

**Removal behavior:**
- Products are **soft-deleted** (marked `status: 'removed'`), never hard-deleted
- Removed products don't appear in search or recommendations
- Users who reviewed the product see a "This product has been removed" notice
- Removal reason is logged for transparency

**Product staleness policy:**
- Products not reviewed or updated in 18+ months get flagged for ingredient re-verification
- AI periodically re-checks top products against retail sites for formula changes
- Community can report outdated products via a "Report an issue" button on product pages

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

## Product Image Sourcing Strategy

Getting product images for niche curly hair products is challenging — most aren't in standard product databases. We use a multi-layer approach, trying each source in order until we find an image.

### Image Waterfall (priority order)

| Priority | Source | Method | Coverage | Notes |
|---|---|---|---|---|
| 1 | **Seed data `image_url`** | Manual curation | ~37 products | Hand-verified URLs from Target, Amazon, brand sites |
| 2 | **Open Beauty Facts API** | Search by brand + name | ~20% | Free, open data. Best for mass-market brands |
| 3 | **UPCitemdb API** | Search by product name | ~30-40% | Free tier: 100 req/day. Good for drugstore brands |
| 4 | **Datakick API** | UPC/name lookup | Variable | Free, no rate limits, CC-BY-SA license |
| 5 | **Reddit image scraping** | Search r/curlyhair for product photos in posts | High for popular products | Real photos posted by community members. Search `{brand} {product}` in subreddit. Filter for image posts. Many "shelfie" and "holy grail" posts include product photos |
| 6 | **Curly hair blogs & editorial sites** | Scrape product images from review articles | High for popular products | Sites like Curl Maven, Naturally Curly, Curly Girl Says, The Everygirl, Real Simple, Allure, and Byrdie regularly publish product roundups with photos. Search `"{brand}" "{product}" curly girl review` |
| 7 | **Brand press/media pages** | Scrape brand websites | High for major brands | Most brands have press kits or product catalogs with downloadable images |
| 7 | **User-uploaded photos** | Community contribution | Grows over time | Users can upload product photos with reviews. Incentivize with badges |
| 8 | **Brand-colored placeholder** | Generated client-side | 100% fallback | Brand initials on brand-specific color background |

### Curly Hair Editorial Sites for Product Images

These sites regularly publish product roundups, reviews, and "best of" lists with high-quality product photos:

| Site | Content Type | Example Articles |
|---|---|---|
| [Naturally Curly](https://www.naturallycurly.com/) | Product reviews, best-of lists, CG-approved roundups | "Best Gels for Curly Hair," "CG-Approved Conditioners" |
| [Curl Maven](https://curlmaven.ie/) | In-depth product reviews with photos, European focus | Individual product reviews with multiple product shots |
| [Curly Girl Says](https://curlygirlysays.com/) | CG-approved product lists with images | "What Curly Girl Products Are Approved?" |
| [Byrdie](https://www.byrdie.com/) | Beauty editorial with professional product photography | "Best Products for Curly Hair" roundups |
| [Allure](https://www.allure.com/) | Best-of lists, award winners | "Best of Beauty" awards often feature CG products |
| [Real Simple](https://www.realsimple.com/) | Practical product reviews | CGM product reviews with stock photography |
| [The Everygirl](https://theeverygirl.com/) | Routine breakdowns with product photos | CGM routine articles |
| [Cosmopolitan](https://www.cosmopolitan.com/) | Product roundups | "Best Curly Hair Products" lists |

**Search strategy for editorial images:**
- `"{brand}" "{product name}" review` — finds dedicated product reviews
- `best curly girl products {category}` — finds roundup articles with multiple product photos
- `"{product name}" curly hair` — broader search for any article mentioning the product
- AI can extract the product image URL from the article page

### Reddit as an Image Source

Reddit is uniquely valuable because the curly hair community constantly posts product photos:
- **"Shelfie" posts** — users photograph their entire product collection (r/curlyhair, r/curlygirl)
- **"Holy grail" threads** — often include product photos alongside reviews
- **Routine posts** — before/after photos frequently show the products used
- **Search strategy**: `site:reddit.com/r/curlyhair "{brand}" "{product}"` → filter for image posts
- **Legal**: Reddit content is user-generated; we'd link to the original post and credit the user rather than re-hosting

### Implementation Plan

**Phase 1 (current):**
- Seed data URLs (hand-curated)
- Open Beauty Facts API lookup
- Brand-colored placeholder fallback

**Phase 2:**
- Add UPCitemdb + Datakick API as additional lookup layers
- Supabase Edge Function to orchestrate the waterfall server-side
- Cache found images in Supabase Storage (so we don't re-fetch)

**Phase 3:**
- Reddit image mining (batch job to search subreddits for product photos)
- Brand website scraper for press kit images
- User photo uploads with reviews
- AI-assisted image matching (verify the image actually shows the right product)

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
