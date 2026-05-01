import { useState, useEffect } from 'react'

const CACHE_KEY = 'scrunch_product_images'
const API_BASE = 'https://world.openbeautyfacts.org/cgi/search.pl'

function getCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  } catch {
    return {}
  }
}

function setCache(cache: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // localStorage full, ignore
  }
}

export function useProductImage(brand: string, productName: string, enabled = true): string | null {
  const cacheKey = `${brand}::${productName}`
  const [imageUrl, setImageUrl] = useState<string | null>(() => {
    const cache = getCache()
    const cached = cache[cacheKey]
    if (cached === 'none') return null
    return cached || null
  })

  useEffect(() => {
    if (!enabled) return

    const cache = getCache()
    if (cache[cacheKey]) return

    let cancelled = false
    const searchTerm = `${brand} ${productName}`.slice(0, 80)

    fetch(`${API_BASE}?search_terms=${encodeURIComponent(searchTerm)}&search_simple=1&json=1&page_size=1`)
      .then(res => res.json())
      .then(data => {
        if (cancelled) return
        const products = data?.products || []
        const url = products[0]?.image_front_url || products[0]?.image_front_small_url || null
        const cache = getCache()
        cache[cacheKey] = url || 'none'
        setCache(cache)
        setImageUrl(url)
      })
      .catch(() => {
        if (!cancelled) {
          const cache = getCache()
          cache[cacheKey] = 'none'
          setCache(cache)
        }
      })

    return () => { cancelled = true }
  }, [brand, productName, cacheKey, enabled])

  return imageUrl
}
