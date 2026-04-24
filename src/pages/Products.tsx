import { useState, useRef, useEffect } from 'react'
import { PRODUCT_CATEGORY_LABELS, CG_STATUS_CONFIG } from '../lib/constants'
import type { ProductCategory } from '../lib/database.types'
import { SEED_PRODUCTS } from '../data/seedProducts'
import { ProductImage } from '../hooks/useProductImage'
import { RequestProductForm } from '../components/products/RequestProductForm'

type ProductAction = 'tried' | 'liked' | 'bookmarked'
type ProductActions = Record<string, Set<ProductAction>>
type ProductNotes = Record<string, string>

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

function getStoredNotes(): ProductNotes {
  try {
    return JSON.parse(localStorage.getItem('scrunch_notes') || '{}')
  } catch { return {} }
}

function storeNotes(notes: ProductNotes) {
  localStorage.setItem('scrunch_notes', JSON.stringify(notes))
}

const ALL_SUGGESTIONS = Array.from(new Set([
  ...SEED_PRODUCTS.map(p => p.brand),
  ...SEED_PRODUCTS.map(p => `${p.brand} ${p.name}`),
])).sort()

export function Products() {
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Set<ProductCategory>>(new Set())
  const [showApprovedOnly, setShowApprovedOnly] = useState(false)
  const [actions, setActions] = useState<ProductActions>(getStoredActions)
  const [notes, setNotes] = useState<ProductNotes>(getStoredNotes)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const suggestions = search.length >= 2
    ? ALL_SUGGESTIONS.filter(s => s.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : []

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

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

  const updateNote = (productKey: string, note: string) => {
    setNotes(prev => {
      const next = { ...prev }
      if (note.trim()) next[productKey] = note.trim()
      else delete next[productKey]
      storeNotes(next)
      return next
    })
  }

  const filteredProducts = SEED_PRODUCTS.filter(p => {
    if (selectedCategories.size > 0 && !selectedCategories.has(p.category)) return false
    if (showApprovedOnly && p.cg_status !== 'approved') return false
    if (search && !`${p.brand} ${p.name}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const approvedCount = SEED_PRODUCTS.filter(p => p.cg_status === 'approved').length
  const hasFilters = selectedCategories.size > 0 || showApprovedOnly || search

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
      <p className="text-gray-600 mb-6">
        {SEED_PRODUCTS.length} products from the r/curlyhair holy grail list · {approvedCount} CG-approved
      </p>

      {/* Search with autocomplete */}
      <div ref={searchRef} className="relative mb-4">
        <input
          type="text"
          placeholder="Search by brand or product name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { setSearch(s); setShowSuggestions(false) }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-violet-50 cursor-pointer border-b border-gray-50 last:border-0"
              >
                <span className="text-gray-400">🔍 </span>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category chips — multi-select */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => {
            const cat = value as ProductCategory
            const isSelected = selectedCategories.has(cat)
            const count = SEED_PRODUCTS.filter(p => p.category === cat).length
            return (
              <button
                key={value}
                onClick={() => toggleCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition ${
                  isSelected
                    ? 'bg-violet-100 border-violet-300 text-violet-700 font-medium'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {label} <span className="text-gray-400 ml-0.5">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Approved toggle + count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={showApprovedOnly}
              onChange={(e) => setShowApprovedOnly(e.target.checked)}
              className="accent-violet-600 w-4 h-4"
            />
            <span className="text-gray-600">Show CG-approved only</span>
          </label>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setSelectedCategories(new Set()); setShowApprovedOnly(false) }}
              className="text-xs text-violet-600 hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400">{filteredProducts.length} products</p>
          <button
            onClick={() => setShowRequestForm(true)}
            className="text-xs px-3 py-1.5 text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 cursor-pointer"
          >
            Can't find a product? Request it →
          </button>
        </div>
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
          <button onClick={() => { setSearch(''); setSelectedCategories(new Set()); setShowApprovedOnly(false) }} className="text-sm text-violet-600 hover:underline cursor-pointer">
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
                <ProductImage
                  brand={product.brand}
                  name={product.name}
                  seedImageUrl={product.image_url}
                  className="w-16 h-16 shrink-0"
                />
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

                  {/* Personal note */}
                  {notes[key] && editingNote !== key && (
                    <div
                      onClick={() => setEditingNote(key)}
                      className="mt-2 text-xs text-gray-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 cursor-pointer hover:border-amber-200"
                    >
                      📝 {notes[key]}
                    </div>
                  )}
                  {editingNote === key ? (
                    <div className="mt-2">
                      <textarea
                        autoFocus
                        defaultValue={notes[key] || ''}
                        placeholder="Add a personal note... e.g., 'Roots remain oily after use'"
                        onBlur={(e) => {
                          updateNote(key, e.target.value)
                          setEditingNote(null)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            updateNote(key, (e.target as HTMLTextAreaElement).value)
                            setEditingNote(null)
                          }
                        }}
                        className="w-full text-xs px-3 py-2 border border-violet-300 rounded-lg resize-none h-16 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  ) : !notes[key] && (
                    <button
                      onClick={() => setEditingNote(key)}
                      className="mt-2 text-xs text-gray-400 hover:text-violet-500 cursor-pointer"
                    >
                      + Add note
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
