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
  approved: { label: 'CG ✓', className: 'bg-green-100 text-green-700' },
  caution: { label: 'Caution', className: 'bg-amber-100 text-amber-700' },
  not_approved: { label: 'Not CG', className: 'bg-red-100 text-red-700' },
}

export function Home() {
  const { data: products = [], isLoading, error } = useProducts()
  const loading = isLoading && !error
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)
  const [cgFilter, setCgFilter] = useState<CgStatus | ''>('')
  const [brandFilter, setBrandFilter] = useState('')

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

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory && p.category !== selectedCategory) return false
      if (cgFilter && p.cg_status !== cgFilter) return false
      if (brandFilter && p.brand !== brandFilter) return false
      return true
    })
  }, [products, selectedCategory, cgFilter, brandFilter])

  const categories = Object.entries(PRODUCT_CATEGORY_LABELS) as [ProductCategory, string][]

  return (
    <div className="min-h-screen">
      {/* Compact hero */}
      <section className="py-8 md:py-12 px-4 text-center bg-gradient-to-b from-violet-50 to-white">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Discover products for <span className="text-violet-600">your curls</span>
        </h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Community-rated, ad-free. Browse by category, filter by CG status, find what works.
        </p>
      </section>

      {/* Filter bar — always visible */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
          <select
            value={cgFilter}
            onChange={e => setCgFilter(e.target.value as CgStatus | '')}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
            aria-label="Filter by CG status"
          >
            <option value="">All CG Status</option>
            <option value="approved">CG Approved</option>
            <option value="caution">Caution</option>
            <option value="not_approved">Not CG Approved</option>
          </select>

          <select
            value={selectedCategory || ''}
            onChange={e => setSelectedCategory((e.target.value || null) as ProductCategory | null)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={brandFilter}
            onChange={e => setBrandFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
            aria-label="Filter by brand"
          >
            <option value="">All Brands</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {(cgFilter || selectedCategory || brandFilter) && (
            <button
              onClick={() => { setCgFilter(''); setSelectedCategory(null); setBrandFilter('') }}
              className="text-sm text-violet-600 hover:text-violet-800 cursor-pointer"
            >
              Clear filters
            </button>
          )}

          <span className="text-xs text-gray-500 ml-auto">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category cards — shown when no category filter is active */}
        {!selectedCategory && !cgFilter && !brandFilter && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categories.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className="flex flex-col items-center gap-1 p-4 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors cursor-pointer text-center"
                >
                  <span className="text-2xl">{CATEGORY_ICONS[key] || '📦'}</span>
                  <span className="text-xs font-medium text-gray-800 leading-tight">{label}</span>
                  <span className="text-xs text-gray-500">{categoryCounts[key] || 0}</span>
                </button>
              ))}
            </div>
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
            <div className="text-center py-12 text-gray-500">No products match your filters.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.slice(0, 40).map((product, i) => (
                <Link
                  key={product.id || `${product.brand}-${product.name}-${i}`}
                  to={product.id ? `/products/${product.id}` : '/products'}
                  className="flex gap-3 p-3 rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition-all no-underline group"
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

          {filteredProducts.length > 40 && (
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
              className="text-sm px-4 py-2 rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 whitespace-nowrap"
            >
              Check Ingredients
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
