# Product Request Workflow

How a user-submitted product request becomes a product in the Scrunch database.

```mermaid
flowchart TD
    A[User fills out form in webapp] -->|Checkbox: I confirm this is a hair care product| B[Opens GitHub Issue via URL]
    B --> C[GitHub Actions workflow triggers]
    C --> D{Spam check step}
    D -->|❌ Fails| E[Flagged with needs-review label]
    D -->|✅ Passes| F[Copilot assigned to issue]
    F --> G{Copilot Step 0: Is this a real hair care product?}
    G -->|❌ No| H[Issue closed with invalid label]
    G -->|✅ Yes| I[Copilot researches ingredients, finds image]
    I --> J[Copilot creates PR to edit seedProducts.ts]
    J --> K[Maintainer reviews and merges PR]
    K --> L[Product appears in database]
```

## Validation layers

| Layer | Where | What it checks |
|-------|-------|----------------|
| **Frontend form** | `RequestProductForm.tsx` | Confirmation checkbox, input length, suspicious patterns |
| **GitHub Issue template** | `.github/ISSUE_TEMPLATE/product-request.yml` | Category dropdown limited to hair care, required fields |
| **Actions spam check** | `.github/workflows/product-request.yml` | Brand/product name quality, repeated chars, test words |
| **Copilot Step 0** | `.github/copilot-instructions.md` | Verifies product is real hair care, not a duplicate, not spam |
| **PR review** | Human maintainer | Final approval before merge |

## Database write access

Products are **never written by end users**. The `products` table has no client-side insert/update RLS policies — only the Supabase service role (used by admin/CI) can write to it. All products enter through seed data PRs.

The `product_requests` table requires authentication for inserts, in case a native in-app request queue is built in the future.
