import { useState, useRef, useCallback } from 'react'
import type { ProductCategory } from '../lib/database.types'
import { ProductPlaceholder } from '../components/products/ProductPlaceholder'
import { useProductImage } from './useProductImage.utils'

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
    <div ref={containerRef} className={`${className} shrink-0 overflow-hidden`}>
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
