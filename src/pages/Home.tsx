import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_CATEGORY_LABELS } from '../lib/constants'
import type { ProductCategory, CgStatus } from '../lib/database.types'
import { ProductImage } from '../hooks/useProductImage'
import { useProducts } from '../hooks/useProducts'

const CATEGORY_ICONS: Partial<Record<ProductCategory, string>> = {
  low_poo: '🧴',
  co_wash: '🫧',
  rinse_out_conditioner: '💧',
  deep_conditioner: '🧖‍♀️',
  leave_in_conditioner: '✨',
  curl_cream: '🍦',
  gel: '💎',
  mousse: '☁️',
  oil_serum: '🫒',
  spray_refresher: '💦',
  clarifying_shampoo: '🫗',
  custard: '🍮',
  protein_treatment: '💪',
  scalp_treatment: '🌿',
}

const CG_BADGE: Record<CgStatus, { label: string; className: string }> = {
  approved: { label: 'Curl Safe ✓', className: 'bg-green-100 text-green-700' },
  caution: { label: 'Caution', className: 'bg-amber-100 text-amber-700' },
  not_approved: { label: 'Not Curl Safe', className: 'bg-red-100 text-red-700' },
}

export function Home() {
  const { data, isLoading, error } = useProducts()
  const products = data?.products ?? []
  const isFallback = data?.isFallback ?? false
  const loading = isLoading && !error
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)
  const [cgFilter, setCgFilter] = useState<CgStatus | ''>('')
  const [brandFilter, setBrandFilter] = useState('')
  const [showAllCategories, setShowAllCategories] = useState(false)

  const clearFilters = () => {
    setCgFilter('')
    setSelectedCategory(null)
    setBrandFilter('')
  }

  const brands = useMemo(() => {
    const set = new Set(products.map(p => p.brand))
    return [...set].sort()
  }, [products])

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ProductCategory, number>> = {}
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return counts
  }, [products])

  const sortedCategories = useMemo(() => {
    return (Object.entries(PRODUCT_CATEGORY_LABELS) as [ProductCategory, string][])
      .sort((a, b) => (categoryCounts[b[0]] || 0) - (categoryCounts[a[0]] || 0))
  }, [categoryCounts])

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory && p.category !== selectedCategory) return false
      if (cgFilter && p.cg_status !== cgFilter) return false
      if (brandFilter && p.brand !== brandFilter) return false
      return true
    })
  }, [products, selectedCategory, cgFilter, brandFilter])

  return (
    <div className="min-h-screen">
      {/* Hero — clear value prop for first-time visitors */}
      <section className="py-8 md:py-12 px-4 text-center bg-gradient-to-b from-violet-50 to-white">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Find <span className="text-violet-600">curly hair products</span> that actually work
        </h1>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-5">
          Scrunch is your personal curly hair assistant — search, check, and discover products the community loves.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-sm text-gray-700">
          <div className="flex items-start justify-center gap-2">
            <span className="text-lg">✅</span>
            <span>Check any product's ingredients instantly</span>
          </div>
          <div className="flex items-start justify-center gap-2">
            <span className="text-lg">💬</span>
            <span>Get answers from 400K+ Reddit community members</span>
          </div>
          <div className="flex items-start justify-center gap-2">
            <span className="text-lg">🎯</span>
            <span>Personalized recommendations for your hair type</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            to="/ingredient-checker"
            className="px-6 py-3 min-h-[44px] flex items-center rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium text-sm"
          >
            Check Your Products →
          </Link>
          <a
            href="#categories"
            className="px-6 py-3 min-h-[44px] flex items-center rounded-lg bg-gray-100 text-gray-900 no-underline hover:bg-gray-200 font-medium text-sm"
          >
            Browse Products ↓
          </a>
        </div>
      </section>

      {/* Fallback banner — visible when Supabase is down */}
      {isFallback && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-4 py-2 text-center">
          📡 Showing cached products — live database temporarily unavailable
        </div>
      )}

      {/* Filter bar — always visible */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
          <select
            value={cgFilter}
            onChange={e => setCgFilter(e.target.value as CgStatus | '')}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] bg-white"
            aria-label="Filter by curl safety"
          >
            <option value="">Curl Safety</option>
            <option value="approved">Safe for Curls</option>
            <option value="caution">Use with Caution</option>
            <option value="not_approved">Not Curl Safe</option>
          </select>

          <select
            value={selectedCategory || ''}
            onChange={e => setSelectedCategory((e.target.value || null) as ProductCategory | null)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] bg-white"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {sortedCategories.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={brandFilter}
            onChange={e => setBrandFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px] bg-white"
            aria-label="Filter by brand"
          >
            <option value="">All Brands</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {(cgFilter || selectedCategory || brandFilter) && (
            <button
              onClick={clearFilters}
              className="text-sm text-violet-600 hover:text-violet-800 cursor-pointer min-h-[44px]"
            >
              Clear filters
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-400" title="Price checking coming soon — compare prices on retailer sites for now">
              💡 Prices vary by retailer
            </span>
            <span className="text-xs text-gray-500">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Feature Spotlight Row */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/ingredient-checker"
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all no-underline hover:bg-violet-50"
          >
            <div className="text-5xl">🔬</div>
            <h3 className="font-semibold text-base text-gray-900">Ingredient Checker</h3>
            <p className="text-sm text-gray-600 text-center">Paste a product label, we'll tell you if it's curl-safe</p>
            <span className="text-sm text-violet-600">Explore →</span>
          </Link>

          <Link
            to="/community"
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all no-underline hover:bg-violet-50"
          >
            <div className="text-5xl">💬</div>
            <h3 className="font-semibold text-base text-gray-900">Community Q&A</h3>
            <p className="text-sm text-gray-600 text-center">Ask questions, see answers from 400K+ Redditors</p>
            <span className="text-sm text-violet-600">Explore →</span>
          </Link>

          <Link
            to="/recommendations"
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all no-underline hover:bg-violet-50"
          >
            <div className="text-5xl">🎯</div>
            <h3 className="font-semibold text-base text-gray-900">Smart Recommendations</h3>
            <p className="text-sm text-gray-600 text-center">Get personalized product picks based on your hair type</p>
            <span className="text-sm text-violet-600">Explore →</span>
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Category cards — shown when no filter is active, sorted by popularity */}
        {!selectedCategory && !cgFilter && !brandFilter && (
          <section id="categories" className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(showAllCategories ? sortedCategories : sortedCategories.slice(0, 8)).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className="flex flex-col items-center gap-1 p-4 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors cursor-pointer text-center min-h-[44px]"
                >
                  <span className="text-2xl">{CATEGORY_ICONS[key] || '📦'}</span>
                  <span className="text-xs font-medium text-gray-800 leading-tight">{label}</span>
                  <span className="text-xs text-gray-500">{categoryCounts[key] || 0}</span>
                </button>
              ))}
            </div>
            {!showAllCategories && sortedCategories.length > 6 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowAllCategories(true)}
                  className="text-sm text-violet-600 hover:text-violet-800 font-medium cursor-pointer"
                >
                  Show all categories →
                </button>
              </div>
            )}
          </section>
        )}

        {/* Product grid */}
        <section>
          {selectedCategory && (
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {PRODUCT_CATEGORY_LABELS[selectedCategory]}
              </h2>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading products…</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-gray-700 font-medium mb-1">No products match your filters</p>
              <p className="text-sm text-gray-500 mb-4">
                Try broadening your search or{' '}
                <button onClick={clearFilters} className="text-violet-600 hover:underline cursor-pointer">
                  clearing filters
                </button>
              </p>
              <Link to="/products" className="text-sm text-violet-600 hover:underline no-underline">
                Browse all products →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.slice(0, 12).map((product, i) => (
                <Link
                  key={product.id || `${product.brand}-${product.name}-${i}`}
                  to={product.id ? `/products/${product.id}` : '/products'}
                  className="flex gap-3 p-3 rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition-all no-underline group min-h-[44px]"
                >
                  <ProductImage
                    brand={product.brand}
                    name={product.name}
                    seedImageUrl={product.image_url}
                    className="w-14 h-14 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-violet-700">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{product.brand}</p>
                    <p className="text-[10px] text-violet-400 truncate">
                      {PRODUCT_CATEGORY_LABELS[product.category]}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${CG_BADGE[product.cg_status].className}`}>
                        {CG_BADGE[product.cg_status].label}
                      </span>
                      {product.cruelty_free === 'yes' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700">🐰 CF</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredProducts.length > 12 && (
            <div className="text-center mt-6">
              <Link
                to="/products"
                className="text-sm text-violet-600 hover:text-violet-800 font-medium no-underline"
              >
                View all {filteredProducts.length} products →
              </Link>
            </div>
          )}
        </section>

        {/* New to curly hair — discoverable, not a gate */}
        <section className="mt-12 p-6 rounded-2xl bg-violet-50 border border-violet-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-3xl">🌱</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">New to curly hair care?</h3>
              <p className="text-sm text-gray-600">
                Not sure where to start? Check our ingredient checker to see if your current products are curl-friendly.
              </p>
            </div>
            <Link
              to="/ingredient-checker"
              className="text-sm px-4 py-2.5 min-h-[44px] flex items-center rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 whitespace-nowrap"
            >
              Check Ingredients
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
