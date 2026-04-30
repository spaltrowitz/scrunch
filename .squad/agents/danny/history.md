# History

## Project Context
- **Project:** Scrunch — curly hair care app
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Supabase, React Query, React Router, Vitest
- **Deployment:** GitHub Pages
- **User:** Shari Paltrowitz

## Learnings

### 2025-07-24: Product Image Audit
- **Open Beauty Facts** covers ~23% of our curly hair products (25/108 missing). Best for mass-market brands that have been scanned (SheaMoisture, Cantu, Garnier, Aussie, Herbal Essences).
- **Shopify CDN** is the dominant pattern — most indie curly brands (DevaCurl, Kristin Ess, Seen, Innersense, Ouai, Pattern, Mielle, etc.) use Shopify. URL pattern: `{brand-domain}/cdn/shop/files/{filename}.jpg` or `cdn.shopify.com/s/files/1/{shop-id}/files/{filename}.jpg`.
- **L'Oréal brands** (Mizani, Redken, Pureology, Kérastase, Bumble and Bumble) use proprietary CDNs that block automated access — need manual image sourcing.
- **Mass-market brands** (Suave, VO5, LA Looks, Wetline Xtreme) typically only have product images on retailer sites (prohibited sources).
- **Giovanni** uses Shopify but blocks automated og:image extraction on most product pages.
- DevaCurl CDN filenames follow pattern: `{Product-Name-Size}.jpg` (e.g., `No-Poo-Original-12oz.jpg`).

