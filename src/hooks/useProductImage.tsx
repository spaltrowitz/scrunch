import { useState, useEffect, useRef, useCallback } from 'react'
import type { ProductCategory } from '../lib/database.types'
import { ProductPlaceholder } from '../components/products/ProductPlaceholder'

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
  }, [brand, productName, cacheKey, enabled])

  return imageUrl
}

function useInView(): [React.RefCallback<Element>, boolean] {
  const [isInView, setIsInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((node: Element | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (!node) return
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observerRef.current.observe(node)
  }, [])

  return [ref, isInView]
}

export function ProductImage({ brand, name, seedImageUrl, category, className = 'w-16 h-16' }: {
  brand: string
  name: string
  seedImageUrl?: string | null
  category?: ProductCategory | null
  className?: string
}) {
  const [containerRef, isInView] = useInView()
  const needsApiFetch = !seedImageUrl && isInView
  const apiImageUrl = useProductImage(brand, name, needsApiFetch)
  const [imgError, setImgError] = useState(false)
  const imageUrl = seedImageUrl || apiImageUrl

  return (
    <div ref={containerRef} className={className}>
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={`${brand} ${name}`}
          className="w-full h-full object-cover rounded-lg bg-gray-50"
          onError={() => setImgError(true)}
        />
      ) : (
        <ProductPlaceholder brand={brand} name={name} category={category} className="w-full h-full" />
      )}
    </div>
  )
}
