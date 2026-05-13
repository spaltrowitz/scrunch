// Supabase Edge Function: submit-feedback
// Receives feedback from the Scrunch in-app form and creates a GitHub issue
// using a server-side token. No GitHub account needed from the user.
//
// Required secrets (set via `supabase secrets set ...`):
//   GH_FEEDBACK_TOKEN  Fine-grained PAT with `Issues: write` on spaltrowitz/scrunch
//   GH_FEEDBACK_REPO   e.g. "spaltrowitz/scrunch" (optional, defaults below)

// deno-lint-ignore-file no-explicit-any
/// <reference lib="deno.ns" />

const DEFAULT_REPO = 'spaltrowitz/scrunch'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALLOWED_TYPES = new Set(['bug', 'idea', 'love', 'product-request'])
const TYPE_LABELS: Record<string, string[]> = {
  bug: ['bug', 'from-app'],
  idea: ['enhancement', 'from-app'],
  love: ['feedback', 'from-app'],
  'product-request': ['product-request', 'from-app'],
}

const MAX_TITLE = 200
const MAX_BODY = 5000
const MAX_FIELD = 200

function json(status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

// Strip Markdown / HTML injection vectors. We don't strip Markdown wholesale
// (users may want lists), but we hard-cap length and forbid HTML comments and
// raw script tags so a submitter can't break out of the issue template.
function sanitize(s: string, max: number): string {
  return String(s)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?script[^>]*>/gi, '')
    .slice(0, max)
    .trim()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS })
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' })

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return json(400, { error: 'Invalid JSON' })
  }

  const type = String(payload?.type ?? '')
  const honeypot = String(payload?.website ?? '')

  // Honeypot: bots fill hidden field. Real users leave it empty.
  if (honeypot) return json(200, { ok: true, skipped: 'honeypot' })

  if (!ALLOWED_TYPES.has(type)) return json(400, { error: 'Invalid type' })

  const token = Deno.env.get('GH_FEEDBACK_TOKEN')
  if (!token) {
    console.error('GH_FEEDBACK_TOKEN not configured')
    return json(500, { error: 'Server not configured' })
  }
  const repo = Deno.env.get('GH_FEEDBACK_REPO') || DEFAULT_REPO

  let issueTitle: string
  let issueBody: string

  if (type === 'product-request') {
    const brand = sanitize(payload?.brand ?? '', MAX_FIELD)
    const name = sanitize(payload?.name ?? '', MAX_FIELD)
    const category = sanitize(payload?.category ?? '', MAX_FIELD)
    const link = sanitize(payload?.link ?? '', MAX_FIELD)
    if (!brand || !name) return json(400, { error: 'brand and name required' })

    issueTitle = `[Product Request] ${brand} - ${name}`
    issueBody = [
      `### Brand\n${brand}`,
      `### Product Name\n${name}`,
      `### Category\n${category || 'Not specified'}`,
      link ? `### Product Link\n${link}` : '',
      '',
      '---',
      `*Submitted via Scrunch in-app product request at ${new Date().toISOString()}*`,
    ].filter(Boolean).join('\n\n')
  } else {
    const title = sanitize(payload?.title ?? '', MAX_TITLE)
    const body = sanitize(payload?.body ?? '', MAX_BODY)
    if (!title) return json(400, { error: 'Title required' })

    issueTitle = `[${type}] ${title}`
    issueBody = [
      `**Type:** ${type}`,
      `**Submitted from:** Scrunch app (in-app feedback)`,
      '',
      body || '_No additional details provided._',
      '',
      '---',
      `*Submitted at ${new Date().toISOString()}*`,
    ].join('\n')
  }

  const ghRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'scrunch-feedback-function',
    },
    body: JSON.stringify({
      title: issueTitle,
      body: issueBody,
      labels: TYPE_LABELS[type],
    }),
  })

  if (!ghRes.ok) {
    const text = await ghRes.text()
    console.error('GitHub API error', ghRes.status, text)
    return json(502, { error: 'Could not create issue', status: ghRes.status })
  }

  const issue = await ghRes.json() as { html_url?: string; number?: number }
  return json(200, { ok: true, url: issue.html_url, number: issue.number })
})
