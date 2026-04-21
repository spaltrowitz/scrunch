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

export function useProductImage(brand: string, productName: string): string | null {
  const cacheKey = `${brand}::${productName}`
  const [imageUrl, setImageUrl] = useState<string | null>(() => {
    const cache = getCache()
    return cache[cacheKey] || null
  })

  useEffect(() => {
    const cache = getCache()
    if (cache[cacheKey]) {
      setImageUrl(cache[cacheKey] === 'none' ? null : cache[cacheKey])
      return
    }

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
  }, [brand, productName, cacheKey])

  return imageUrl
}

// Color palette for category-based placeholder backgrounds
const CATEGORY_COLORS: Record<string, string> = {
  low_poo: 'bg-blue-100 text-blue-600',
  co_wash: 'bg-cyan-100 text-cyan-600',
  rinse_out_conditioner: 'bg-teal-100 text-teal-600',
  deep_conditioner: 'bg-emerald-100 text-emerald-600',
  leave_in_conditioner: 'bg-green-100 text-green-600',
  curl_cream: 'bg-pink-100 text-pink-600',
  gel: 'bg-violet-100 text-violet-600',
  mousse: 'bg-purple-100 text-purple-600',
  custard: 'bg-amber-100 text-amber-600',
  oil_serum: 'bg-yellow-100 text-yellow-600',
  spray_refresher: 'bg-sky-100 text-sky-600',
  protein_treatment: 'bg-orange-100 text-orange-600',
  scalp_treatment: 'bg-rose-100 text-rose-600',
  clarifying_shampoo: 'bg-indigo-100 text-indigo-600',
}

export function ProductImage({ brand, name, category, className = 'w-16 h-16' }: {
  brand: string
  name: string
  category: string
  className?: string
}) {
  const imageUrl = useProductImage(brand, name)
  const colors = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-500'

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${brand} ${name}`}
        className={`${className} object-cover rounded-lg`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    )
  }

  // Placeholder with brand initial
  return (
    <div className={`${className} ${colors} rounded-lg flex items-center justify-center font-bold text-lg shrink-0`}>
      {brand.charAt(0).toUpperCase()}
    </div>
  )
}
