import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../lib/database.types'
import { ProductImage } from '../../hooks/useProductImage'

interface SavedProductsProps {
  products: Product[]
}

export const SavedProducts = memo(function SavedProducts({ products }: SavedProductsProps) {
  let bookmarkedKeys: string[]
  try {
    const stored = JSON.parse(localStorage.getItem('scrunch_actions') || '{}')
    bookmarkedKeys = Object.entries(stored)
      .filter(([, actions]) => (actions as string[]).includes('bookmarked'))
      .map(([key]) => key)
  } catch {
    return null
  }

  if (bookmarkedKeys.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        ☆ Saved ({bookmarkedKeys.length})
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        Products you've saved to try later
      </p>
      <div className="space-y-2">
        {bookmarkedKeys.map(key => {
          const product = products.find(p => p.id === key)
          const brand = product?.brand || (key.includes('::') ? key.split('::')[0] : null)
          const name = product?.name || (key.includes('::') ? key.split('::')[1] : null)
          if (!brand || !name) return null
          return (
            <Link
              key={key}
              to={product ? `/products/${product.id}` : '/products'}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition no-underline"
            >
              <ProductImage brand={brand} name={name} seedImageUrl={product?.image_url} category={product?.category} className="w-10 h-10" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{brand}</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
})
