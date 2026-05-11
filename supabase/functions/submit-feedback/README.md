# submit-feedback Edge Function

Creates a GitHub issue from the in-app feedback form, so testers don't need a
GitHub account.

## One-time setup

1. **Create a fine-grained PAT** at <https://github.com/settings/personal-access-tokens/new>:
   - Resource owner: `spaltrowitz`
   - Repository access: **Only select repositories** → `spaltrowitz/scrunch`
   - Permissions → Repository → **Issues: Read and write**
   - Expiration: 1 year (set a calendar reminder to rotate)
   - Copy the token — you'll only see it once.

2. **Set the secret on Supabase** (from the project root):
   ```bash
   supabase secrets set GH_FEEDBACK_TOKEN=ghp_xxx
   # optional, defaults to spaltrowitz/scrunch:
   # supabase secrets set GH_FEEDBACK_REPO=spaltrowitz/scrunch
   ```

3. **Deploy:**
   ```bash
   supabase functions deploy submit-feedback --no-verify-jwt
   ```
   `--no-verify-jwt` lets logged-out users submit feedback. Honeypot + length
   caps in the function provide basic spam mitigation.

4. **Test:**
   ```bash
   curl -X POST "https://<project-ref>.supabase.co/functions/v1/submit-feedback" \
     -H "Content-Type: application/json" \
     -H "apikey: $SUPABASE_ANON_KEY" \
     -d '{"type":"love","title":"Test","body":"Hello"}'
   ```

## Rotation

Rotate the GitHub PAT yearly (or sooner if leaked):
```bash
supabase secrets set GH_FEEDBACK_TOKEN=ghp_new_token
```
No redeploy needed — secrets are read at runtime.
