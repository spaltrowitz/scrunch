// Supabase Edge Function: create-product-issue
// Proxy that creates a GitHub issue on behalf of the user so they don't need a GitHub account.
// Requires secrets: GITHUB_PAT, RESEND_API_KEY
// Call via: POST /functions/v1/create-product-issue { brand, name, category?, link?, email? }

import { corsHeaders } from '../_shared/cors.ts'

const REPO_OWNER = 'spaltrowitz'
const REPO_NAME = 'scrunch'

async function sendReceiptEmail(email: string, brand: string, name: string) {
  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (!resendKey) return

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Scrunch <notifications@scrunch.app>',
        to: email,
        subject: `We received your request for ${brand} ${name}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">🧴 Product Request Received!</h2>
            <p>Thanks for requesting <strong>${brand} ${name}</strong>.</p>
            <p>Our bot is already looking up ingredients, finding images, and running CG analysis. We'll email you again once it's been added to the database.</p>
            <p style="color: #6b7280; font-size: 14px;">— The Scrunch Team</p>
          </div>
        `,
      }),
    })
  } catch (err) {
    console.error('Failed to send receipt email:', err)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { brand, name, category, link, email } = await req.json()

    if (!brand?.trim() || !name?.trim()) {
      return new Response(
        JSON.stringify({ error: 'brand and name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const githubToken = Deno.env.get('GITHUB_PAT')
    if (!githubToken) {
      return new Response(
        JSON.stringify({ error: 'GitHub integration not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Embed email in a hidden comment so the merge workflow can extract it
    const emailComment = email?.trim() ? `\n\n<!-- notify_email: ${email.trim()} -->` : ''

    const issueBody = [
      `### Brand\n${brand.trim()}`,
      `### Product Name\n${name.trim()}`,
      `### Category\n${category || 'Not specified'}`,
      link ? `### Product Link\n${link}` : '',
      '---',
      `*Submitted via Scrunch app on ${new Date().toISOString()}*${emailComment}`,
    ].filter(Boolean).join('\n\n')

    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        method: 'POST',
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Scrunch-App',
        },
        body: JSON.stringify({
          title: `[Product Request] ${brand.trim()} — ${name.trim()}`,
          body: issueBody,
          labels: ['product-request', 'from-app'],
        }),
      },
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('GitHub API error:', res.status, err)
      return new Response(
        JSON.stringify({ error: 'Failed to create issue' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const issue = await res.json()

    // Send receipt email in the background (don't block the response)
    if (email?.trim()) {
      sendReceiptEmail(email.trim(), brand.trim(), name.trim())
    }

    return new Response(
      JSON.stringify({ issue_number: issue.number, issue_url: issue.html_url }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
