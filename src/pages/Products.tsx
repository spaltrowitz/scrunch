import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { PRODUCT_CATEGORY_LABELS, CG_STATUS_CONFIG } from '../lib/constants'
import type { Product, ProductCategory, CgStatus } from '../lib/database.types'

export function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | ''>('')
  const [statusFilter, setStatusFilter] = useState<CgStatus | ''>('')

  useEffect(() => {
    loadProducts()
  }, [categoryFilter, statusFilter])

  const loadProducts = async () => {
    setLoading(true)
    let query = supabase.from('products').select('*').order('review_count', { ascending: false }).limit(50)

    if (categoryFilter) query = query.eq('category', categoryFilter)
    if (statusFilter) query = query.eq('cg_status', statusFilter)

    const { data } = await query
    setProducts(data ?? [])
    setLoading(false)
  }

  const filteredProducts = products.filter(p =>
    !search || `${p.brand} ${p.name}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
      <p className="text-gray-600 mb-8">Browse CG-approved products rated by the community.</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | '')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="">All Categories</option>
          {Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CgStatus | '')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="">Any Status</option>
          <option value="approved">🟢 Approved</option>
          <option value="caution">🟡 Caution</option>
          <option value="not_approved">🔴 Not Approved</option>
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No products found.</p>
          <p className="text-sm text-gray-400">
            Products will appear here once the database is seeded.
            Try the <Link to="/ingredient-checker" className="text-violet-600 hover:underline">Ingredient Checker</Link> in the meantime!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-violet-300 transition no-underline"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${CG_STATUS_CONFIG[product.cg_status].bg} ${CG_STATUS_CONFIG[product.cg_status].color}`}>
                  {CG_STATUS_CONFIG[product.cg_status].icon} {CG_STATUS_CONFIG[product.cg_status].label}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {PRODUCT_CATEGORY_LABELS[product.category]}
                {product.avg_rating != null && ` · ★ ${product.avg_rating} (${product.review_count})`}
              </p>
              {product.status_conflict && (
                <p className="text-xs text-amber-600 mt-1">⚠️ CurlScan and IsItCG disagree on this product</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
