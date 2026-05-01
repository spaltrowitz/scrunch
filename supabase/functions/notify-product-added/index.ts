// Supabase Edge Function: notify-product-added
// Sends a "your product is live!" email via Resend when a product-request PR is merged.
// Called by GitHub Actions with: POST /functions/v1/notify-product-added { email, brand, name }
// Requires RESEND_API_KEY secret.

import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, brand, name } = await req.json()

    if (!email || !brand || !name) {
      return new Response(
        JSON.stringify({ error: 'email, brand, and name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (!resendKey) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Scrunch <notifications@scrunch.app>',
        to: email,
        subject: `${brand} ${name} is now on Scrunch! 🎉`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">🧴 Your Product is Live!</h2>
            <p><strong>${brand} ${name}</strong> has been added to the Scrunch database.</p>
            <p>We've analyzed the ingredients, determined CG status, and it's ready for you to review and rate.</p>
            <p>
              <a href="https://scrunch.app/products" style="display: inline-block; background: #7c3aed; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500;">
                View &amp; Rate It
              </a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">— The Scrunch Team</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', res.status, err)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
