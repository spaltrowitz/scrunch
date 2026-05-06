import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { ProductCategory } from '../lib/database.types'
import { PRODUCT_CATEGORY_LABELS, PRODUCT_CATEGORY_DESCRIPTIONS } from '../lib/constants'
import { useCatalogProducts } from '../hooks/useProducts'
import { usePageTitle } from '../hooks/usePageTitle'
import { ProductImage } from '../hooks/useProductImage'

const SLUG_TO_CATEGORY: Record<string, ProductCategory> = Object.fromEntries(
  (Object.keys(PRODUCT_CATEGORY_LABELS) as ProductCategory[]).map(cat => [
    cat.replace(/_/g, '-'),
    cat,
  ])
)

function categoryToSlug(cat: ProductCategory): string {
  return cat.replace(/_/g, '-')
}

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = slug ? SLUG_TO_CATEGORY[slug] : undefined
  const { data, isLoading, isError } = useCatalogProducts()
  const products = useMemo(() => data?.products ?? [], [data])

  const categoryProducts = useMemo(
    () => products.filter(p => p.category === category),
    [products, category]
  )

  const topProducts = useMemo(
    () => categoryProducts.slice(0, 8),
    [categoryProducts]
  )

  const label = category ? PRODUCT_CATEGORY_LABELS[category] : ''
  const description = category ? PRODUCT_CATEGORY_DESCRIPTIONS[category] : ''

  usePageTitle(label ? `${label} for Curly Hair | Scrunch` : undefined)

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
        <p className="text-gray-600 mb-6">We couldn't find that product category.</p>
        <Link to="/products" className="text-violet-600 hover:text-violet-700 font-medium">
          Browse all products →
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-6">We couldn't load products right now. Please try again later.</p>
        <Link to="/products" className="text-violet-600 hover:text-violet-700 font-medium">
          Browse all products →
        </Link>
      </div>
    )
  }

  if (categoryProducts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No {label} products yet</h1>
        <p className="text-gray-600 mb-6">We haven't added any products in this category yet. Check back soon!</p>
        <Link to="/products" className="text-violet-600 hover:text-violet-700 font-medium">
          Browse all products →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/products" className="text-sm text-violet-600 hover:text-violet-700 mb-2 inline-block">
          ← All Products
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{label}</h1>
        <p className="text-lg text-gray-600 max-w-2xl">{description}</p>
        <p className="mt-3 text-sm text-gray-500">
          {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} in this category
        </p>
      </div>

      {/* Top products grid */}
      {topProducts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Popular {label} Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topProducts.map(p => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
              >
                <div className="w-full aspect-square mb-3 rounded-lg overflow-hidden bg-gray-50">
                  <ProductImage
                    brand={p.brand}
                    name={p.name}
                    seedImageUrl={p.image_url}
                    category={p.category}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{p.brand}</p>
                <p className="text-sm font-medium text-gray-900 group-hover:text-violet-600 line-clamp-2">
                  {p.name}
                </p>
                {p.cg_status === 'approved' && (
                  <span className="inline-block mt-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Curl Safe ✓
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="rounded-xl bg-violet-50 border border-violet-100 p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          See all {categoryProducts.length} {label.toLowerCase()} products
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Filter by CG status, brand, and more.
        </p>
        <Link
          to={`/products?category=${category}`}
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
        >
          Browse {label} →
        </Link>
      </div>

      {/* All categories */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Categories</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(PRODUCT_CATEGORY_LABELS) as [ProductCategory, string][]).map(([cat, catLabel]) => (
            <Link
              key={cat}
              to={`/category/${categoryToSlug(cat)}`}
              className={`text-sm px-3 py-1.5 min-h-[44px] inline-flex items-center rounded-full border transition-colors ${
                cat === category
                  ? 'bg-violet-100 border-violet-200 text-violet-700 font-medium'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:text-violet-600'
              }`}
            >
              {catLabel}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
