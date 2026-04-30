// Supabase Edge Function: find-product-image
// Searches retail sites for a product image URL
// Call via: POST /functions/v1/find-product-image { brand, name }

import { corsHeaders } from '../_shared/cors.ts'

interface ImageResult {
  image_url: string | null
  source: string | null
}

// 1. Search Target's Redsky API
async function searchTarget(brand: string, name: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${brand} ${name}`)
    const url = `https://redsky.target.com/redsky_aggregations/v1/web/plp_search_v2?key=9f36aeafbe60771e321a7cc95a78140772ab3e96&channel=WEB&count=1&keyword=${query}&page=/s/${query}`
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    })
    if (!res.ok) return null
    const data = await res.json()
    const products = data?.data?.search?.products || []
    if (products.length > 0) {
      const imgUrl = products[0]?.item?.enrichment?.images?.primary_image_url
      if (imgUrl) return imgUrl
    }
  } catch { /* continue */ }
  return null
}

// 2. Search Walmart
async function searchWalmart(brand: string, name: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${brand} ${name} hair`)
    const url = `https://www.walmart.com/search?q=${query}`
    const res = await fetch(url, {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; ScrunchBot/1.0)'
      }
    })
    if (!res.ok) return null
    const html = await res.text()
    // Look for product image in search results
    const match = html.match(/https:\/\/i5\.walmartimages\.com\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/i)
    if (match) return match[0]
  } catch { /* continue */ }
  return null
}

// 3. Search Open Beauty Facts
async function searchOpenBeautyFacts(brand: string, name: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${brand} ${name}`)
    const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&json=1&page_size=1`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const products = data?.products || []
    if (products.length > 0) {
      return products[0]?.image_front_url || products[0]?.image_front_small_url || null
    }
  } catch { /* continue */ }
  return null
}

// 4. Try Ulta search
async function searchUlta(brand: string, name: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${brand} ${name}`)
    const url = `https://www.ulta.com/api/search?q=${query}&pageSize=1`
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    })
    if (!res.ok) return null
    const data = await res.json()
    const products = data?.products || data?.items || []
    if (products.length > 0) {
      const imgUrl = products[0]?.imageUrl || products[0]?.image || null
      if (imgUrl) return imgUrl.startsWith('//') ? `https:${imgUrl}` : imgUrl
    }
  } catch { /* continue */ }
  return null
}

// Waterfall: try each source in order
async function findImage(brand: string, name: string): Promise<ImageResult> {
  // Target
  const targetImg = await searchTarget(brand, name)
  if (targetImg) return { image_url: targetImg, source: 'target' }

  // Open Beauty Facts
  const obfImg = await searchOpenBeautyFacts(brand, name)
  if (obfImg) return { image_url: obfImg, source: 'open_beauty_facts' }

  // Ulta
  const ultaImg = await searchUlta(brand, name)
  if (ultaImg) return { image_url: ultaImg, source: 'ulta' }

  // Walmart
  const walmartImg = await searchWalmart(brand, name)
  if (walmartImg) return { image_url: walmartImg, source: 'walmart' }

  return { image_url: null, source: null }
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { brand, name } = await req.json()

    if (!brand || !name) {
      return new Response(
        JSON.stringify({ error: 'brand and name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await findImage(brand, name)

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal error', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
