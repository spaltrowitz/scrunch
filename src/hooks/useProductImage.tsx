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
    const cached = cache[cacheKey]
    if (cached === 'none') return null
    return cached || null
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

// Brand colors for recognizable placeholders
const BRAND_COLORS: Record<string, { bg: string; text: string }> = {
  'SheaMoisture': { bg: 'bg-amber-700', text: 'text-amber-100' },
  'Shea Moisture': { bg: 'bg-amber-700', text: 'text-amber-100' },
  'Cantu': { bg: 'bg-red-600', text: 'text-red-100' },
  'Giovanni': { bg: 'bg-green-700', text: 'text-green-100' },
  'Jessicurl': { bg: 'bg-purple-600', text: 'text-purple-100' },
  'Ouidad': { bg: 'bg-teal-600', text: 'text-teal-100' },
  'Innersense': { bg: 'bg-lime-700', text: 'text-lime-100' },
  'Curlsmith': { bg: 'bg-pink-600', text: 'text-pink-100' },
  'Briogeo': { bg: 'bg-emerald-600', text: 'text-emerald-100' },
  'Mielle': { bg: 'bg-orange-600', text: 'text-orange-100' },
  'Olaplex': { bg: 'bg-neutral-800', text: 'text-neutral-100' },
  'As I Am': { bg: 'bg-yellow-600', text: 'text-yellow-100' },
  'Bounce Curl': { bg: 'bg-cyan-600', text: 'text-cyan-100' },
  'Kinky Curly': { bg: 'bg-violet-700', text: 'text-violet-100' },
  'Eco Styler': { bg: 'bg-green-600', text: 'text-green-100' },
  'TRESemmé': { bg: 'bg-gray-800', text: 'text-gray-100' },
  'Herbal Essences': { bg: 'bg-fuchsia-600', text: 'text-fuchsia-100' },
  'Aussie': { bg: 'bg-indigo-500', text: 'text-indigo-100' },
}

export function ProductImage({ brand, name, seedImageUrl, className = 'w-16 h-16' }: {
  brand: string
  name: string
  seedImageUrl?: string | null
  className?: string
}) {
  const apiImageUrl = useProductImage(brand, name)
  const [imgError, setImgError] = useState(false)
  const imageUrl = seedImageUrl || apiImageUrl

  const brandColor = BRAND_COLORS[brand] || { bg: 'bg-violet-100', text: 'text-violet-600' }

  if (imageUrl && !imgError) {
    return (
      <img
        src={imageUrl}
        alt={`${brand} ${name}`}
        className={`${className} object-cover rounded-lg bg-gray-50`}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div className={`${className} ${brandColor.bg} ${brandColor.text} rounded-lg flex items-center justify-center font-bold text-xs text-center px-1 shrink-0 leading-tight`}>
      {brand.split(' ').map(w => w[0]).join('').slice(0, 3)}
    </div>
  )
}
