# Scrunch — Data Flow Architecture

> Curly hair product discovery app with OCR-free product requests and community ratings.

## Platform Summary

| Layer | Service |
|-------|---------|
| **Hosting** | GitHub Pages (`spaltrowitz.github.io/scrunch/`) |
| **CI/CD** | GitHub Actions (typecheck → test → build → deploy) |
| **Database** | Supabase PostgreSQL (`rqmplfyuonkikdmqngrj.supabase.co`) |
| **Auth** | Supabase Auth (email/password + Google OAuth) |
| **Email** | Resend API |
| **Issue Tracking** | GitHub API (product requests, feedback, brand scans) |
| **Product Images** | Target Redsky, Walmart, Open Beauty Facts, Ulta (scraped via Edge Functions) |
| **Serverless** | Supabase Edge Functions (create-product-issue, find-product-image, notify-product-added) |
| **Client Storage** | localStorage (anonymous ratings cache, saved products) |

## Data Flow

```mermaid
flowchart TB
    subgraph Browser["🌐 Browser (GitHub Pages)"]
        App["React + Vite SPA"]
        LS["localStorage\n• scrunch_actions\n• scrunch_ratings\n• onboarding_state"]
    end

    subgraph Supabase["☁️ Supabase"]
        DB["PostgreSQL\n• profiles\n• products (410+)\n• product_reviews\n• product_requests"]
        Auth["Supabase Auth\n• Email/Password\n• Google OAuth"]
        Edge["Edge Functions\n• create-product-issue\n• find-product-image\n• notify-product-added"]
    end

    subgraph GitHub["🐙 GitHub"]
        Issues["GitHub Issues\n• Product requests\n• Feedback\n• Brand scans"]
        Actions["GitHub Actions\n• deploy.yml\n• product-request.yml\n• brand-scan.yml"]
        Pages["GitHub Pages\nStatic hosting"]
    end

    subgraph External["🔌 External APIs"]
        Google["Google OAuth\naccounts.google.com"]
        Resend["Resend\nTransactional email"]
        Target["Target Redsky API"]
        Walmart["Walmart Search"]
        OBF["Open Beauty Facts"]
        Ulta["Ulta API"]
    end

    App <-->|"ratings, profiles,\nproducts (RLS)"| DB
    App <-->|"JWT sessions"| Auth
    Auth <-->|"OAuth flow"| Google
    App -->|"anonymous ratings\ncache"| LS
    LS -->|"migrate on login"| DB

    App -->|"product request\nfeedback"| Issues
    Issues -->|"labeled issue\ntriggers"| Actions
    Actions -->|"calls"| Edge

    Edge -->|"create issue"| Issues
    Edge -->|"receipt + notify\nemails"| Resend
    Edge -->|"image search\nwaterfall"| Target
    Edge -->|"fallback"| Walmart
    Edge -->|"fallback"| OBF
    Edge -->|"fallback"| Ulta
    Edge -->|"store image URL"| DB

    Actions -->|"build + deploy"| Pages

    style Browser fill:#e8f4fd,stroke:#2196F3
    style Supabase fill:#e8f5e9,stroke:#4CAF50
    style GitHub fill:#f3e5f5,stroke:#9C27B0
    style External fill:#fff3e0,stroke:#FF9800
```

## Key Data Flows

1. **Product Discovery**: User browses → Supabase products table → filtered by curl pattern
2. **Rating (Logged In)**: User rates → Supabase product_reviews (RLS enforced)
3. **Rating (Anonymous)**: User rates → localStorage → migrated to Supabase on login
4. **Product Request**: User submits → Edge Function → GitHub Issue created → Resend receipt email
5. **Image Scraping**: GitHub Action triggers → Edge Function → Target → Walmart → OBF → Ulta (waterfall) → URL stored in Supabase
