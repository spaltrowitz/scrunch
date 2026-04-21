import { useState } from 'react'
import { PRODUCT_CATEGORY_LABELS, CG_STATUS_CONFIG } from '../lib/constants'
import type { ProductCategory, CgStatus } from '../lib/database.types'
import { SEED_PRODUCTS } from '../data/seedProducts'

export function Products() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | ''>('')
  const [statusFilter, setStatusFilter] = useState<CgStatus | ''>('')

  const filteredProducts = SEED_PRODUCTS.filter(p => {
    if (categoryFilter && p.category !== categoryFilter) return false
    if (statusFilter && p.cg_status !== statusFilter) return false
    if (search && !`${p.brand} ${p.name}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const approvedCount = SEED_PRODUCTS.filter(p => p.cg_status === 'approved').length

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
      <p className="text-gray-600 mb-8">
        {SEED_PRODUCTS.length} products from the r/curlyhair holy grail list · {approvedCount} CG-approved
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by brand or product name..."
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

      <p className="text-xs text-gray-400 mb-4">{filteredProducts.length} products shown</p>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No products match your filters.</p>
          <button onClick={() => { setSearch(''); setCategoryFilter(''); setStatusFilter('') }} className="text-sm text-violet-600 hover:underline cursor-pointer">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredProducts.map((product, i) => (
            <div
              key={`${product.brand}-${product.name}-${i}`}
              className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-violet-300 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ml-2 ${CG_STATUS_CONFIG[product.cg_status].bg} ${CG_STATUS_CONFIG[product.cg_status].color}`}>
                  {CG_STATUS_CONFIG[product.cg_status].icon} {CG_STATUS_CONFIG[product.cg_status].label}
                </span>
              </div>
              <p className="text-xs text-gray-500">{PRODUCT_CATEGORY_LABELS[product.category]}</p>
              {product.notes && (
                <p className="text-xs text-gray-400 mt-1">{product.notes}</p>
              )}
              {product.cruelty_free === 'yes' && (
                <span className="inline-block text-xs mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">🐰 Cruelty-free</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
