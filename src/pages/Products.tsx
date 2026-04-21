import { useState } from 'react'
import { PRODUCT_CATEGORY_LABELS, CG_STATUS_CONFIG } from '../lib/constants'
import type { ProductCategory, CgStatus } from '../lib/database.types'
import { SEED_PRODUCTS } from '../data/seedProducts'
import { ProductImage } from '../hooks/useProductImage'
import { RequestProductForm } from '../components/products/RequestProductForm'

type ProductAction = 'tried' | 'liked' | 'bookmarked'
type ProductActions = Record<string, Set<ProductAction>>

function getStoredActions(): ProductActions {
  try {
    const raw = JSON.parse(localStorage.getItem('scrunch_actions') || '{}')
    const result: ProductActions = {}
    for (const [key, vals] of Object.entries(raw)) {
      result[key] = new Set(vals as ProductAction[])
    }
    return result
  } catch { return {} }
}

function storeActions(actions: ProductActions) {
  const serializable: Record<string, string[]> = {}
  for (const [key, set] of Object.entries(actions)) {
    serializable[key] = [...set]
  }
  localStorage.setItem('scrunch_actions', JSON.stringify(serializable))
}

export function Products() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | ''>('')
  const [statusFilter, setStatusFilter] = useState<CgStatus | ''>('')
  const [actions, setActions] = useState<ProductActions>(getStoredActions)
  const [showRequestForm, setShowRequestForm] = useState(false)

  const toggleAction = (productKey: string, action: ProductAction) => {
    setActions(prev => {
      const next = { ...prev }
      if (!next[productKey]) next[productKey] = new Set()
      else next[productKey] = new Set(next[productKey])
      if (next[productKey].has(action)) next[productKey].delete(action)
      else next[productKey].add(action)
      storeActions(next)
      return next
    })
  }

  const hasAction = (productKey: string, action: ProductAction) =>
    actions[productKey]?.has(action) ?? false

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

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">{filteredProducts.length} products shown</p>
        <button
          onClick={() => setShowRequestForm(true)}
          className="text-xs px-3 py-1.5 text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 cursor-pointer"
        >
          Can't find a product? Request it →
        </button>
      </div>

      {showRequestForm && (
        <div className="mb-6">
          <RequestProductForm onClose={() => setShowRequestForm(false)} />
        </div>
      )}

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
          {filteredProducts.map((product, i) => {
            const key = `${product.brand}::${product.name}`
            return (
              <div
                key={`${key}-${i}`}
                className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-violet-300 transition"
              >
                {/* Product Image */}
                <ProductImage
                  brand={product.brand}
                  name={product.name}
                  className="w-16 h-16 shrink-0"
                />

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">{product.brand}</p>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">{product.name}</h3>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${CG_STATUS_CONFIG[product.cg_status].bg} ${CG_STATUS_CONFIG[product.cg_status].color}`}>
                      {CG_STATUS_CONFIG[product.cg_status].icon}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{PRODUCT_CATEGORY_LABELS[product.category]}</p>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAction(key, 'tried')}
                      className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition ${
                        hasAction(key, 'tried')
                          ? 'bg-violet-100 border-violet-300 text-violet-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {hasAction(key, 'tried') ? '✓ Tried' : 'Tried it?'}
                    </button>
                    <button
                      onClick={() => toggleAction(key, 'liked')}
                      className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition ${
                        hasAction(key, 'liked')
                          ? 'bg-green-100 border-green-300 text-green-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {hasAction(key, 'liked') ? '💚 Liked' : '👍 Like?'}
                    </button>
                    <button
                      onClick={() => toggleAction(key, 'bookmarked')}
                      className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition ${
                        hasAction(key, 'bookmarked')
                          ? 'bg-amber-100 border-amber-300 text-amber-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {hasAction(key, 'bookmarked') ? '★ Saved' : '☆ Save'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
