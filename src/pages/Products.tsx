import { useState, useRef, useEffect, useMemo } from 'react'
import { PRODUCT_CATEGORY_LABELS, SCRUNCH_SCORE_CONFIG } from '../lib/constants'
import type { ProductCategory } from '../lib/database.types'
import { SEED_PRODUCTS, computeScrunchScore } from '../data/seedProducts'
import type { SeedProduct } from '../data/seedProducts'
import { ProductImage } from '../hooks/useProductImage'
import { RequestProductForm } from '../components/products/RequestProductForm'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

type TriedRating = 'loved' | 'ok' | 'disliked'
type ProductAction = 'tried' | 'bookmarked'
type ProductActions = Record<string, Set<ProductAction>>
type ProductRatings = Record<string, TriedRating>
type ProductNotes = Record<string, string>

type DisplayProduct = SeedProduct & { id?: string }

function productKey(p: DisplayProduct): string {
  return p.id || `${p.brand}::${p.name}`
}

function isUuid(key: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(key)
}

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

export function Products() {
  const { user } = useAuth()
  const [products, setProducts] = useState<DisplayProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Set<ProductCategory>>(new Set())
  const [showApprovedOnly, setShowApprovedOnly] = useState(false)
  const [showGoodPlus, setShowGoodPlus] = useState(false)
  const [actions, setActions] = useState<ProductActions>(getStoredActions)
  const [ratings, setRatings] = useState<ProductRatings>(() => {
    try { return JSON.parse(localStorage.getItem('scrunch_ratings') || '{}') } catch { return {} }
  })
  const [ratingPopup, setRatingPopup] = useState<string | null>(null)
  const [notes, setNotes] = useState<ProductNotes>(getStoredNotes)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load products from Supabase, fall back to SEED_PRODUCTS
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data, error } = await supabase.from('products').select('*')
        if (!cancelled) {
          if (!error && data && data.length > 0) {
            setProducts(data.map(p => ({
              id: p.id,
              brand: p.brand,
              name: p.name,
              category: p.category,
              cg_status: p.cg_status,
              cruelty_free: p.cruelty_free,
              notes: p.notes,
              image_url: p.image_url,
            })).filter((p, i, arr) =>
              // Dedup by brand+name (case-insensitive)
              arr.findIndex(x => x.brand.toLowerCase() === p.brand.toLowerCase() && x.name.toLowerCase() === p.name.toLowerCase()) === i
            ))
          } else {
            setProducts(SEED_PRODUCTS)
          }
        }
      } catch {
        if (!cancelled) setProducts(SEED_PRODUCTS)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Load user reviews or revert to localStorage
  useEffect(() => {
    if (!user) {
      setActions(getStoredActions())
      setNotes(getStoredNotes())
      return
    }
    let cancelled = false
    async function loadReviews() {
      const { data } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('user_id', user!.id)
      if (cancelled || !data) return
      const reviewActions: ProductActions = {}
      const reviewNotes: ProductNotes = {}
      for (const review of data) {
        const key = review.product_id
        reviewActions[key] = new Set()
        if (review.status) reviewActions[key].add('tried')
        if (review.rating != null && review.rating >= 4) reviewActions[key].add('liked')
        if (review.results_notes) reviewNotes[key] = review.results_notes
      }
      // Preserve localStorage bookmarks
      const stored = getStoredActions()
      for (const [key, set] of Object.entries(stored)) {
        if (set.has('bookmarked')) {
          if (!reviewActions[key]) reviewActions[key] = new Set()
          reviewActions[key].add('bookmarked')
        }
      }
      setActions(reviewActions)
      setNotes(prev => ({ ...prev, ...reviewNotes }))
    }
    loadReviews()
    return () => { cancelled = true }
  }, [user])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const allSuggestions = useMemo(() =>
    Array.from(new Set([
      ...products.map(p => p.brand),
      ...products.map(p => `${p.brand} ${p.name}`),
    ])).sort()
  , [products])

  const suggestions = search.length >= 2
    ? allSuggestions.filter(s => s.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : []

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const toggleAction = (key: string, action: ProductAction) => {
    if (action === 'tried') {
      // Show rating popup instead of toggling directly
      if (actions[key]?.has('tried')) {
        // Un-try: remove tried + rating
        setActions(prev => {
          const next = { ...prev }
          next[key] = new Set(next[key])
          next[key].delete('tried')
          storeActions(next)
          return next
        })
        setRatings(prev => {
          const next = { ...prev }
          delete next[key]
          localStorage.setItem('scrunch_ratings', JSON.stringify(next))
          return next
        })
        if (user && isUuid(key)) {
          supabase.from('product_reviews').delete().eq('user_id', user.id).eq('product_id', key)
            .then(({ error }) => { if (error) console.error('Delete review failed:', error) })
        }
      } else {
        setRatingPopup(key)
      }
      return
    }

    // Bookmark toggle (localStorage only)
    setActions(prev => {
      const next = { ...prev }
      if (!next[key]) next[key] = new Set()
      else next[key] = new Set(next[key])
      if (next[key].has(action)) next[key].delete(action)
      else next[key].add(action)
      storeActions(next)
      return next
    })
  }

  const submitRating = (key: string, rating: TriedRating) => {
    setRatingPopup(null)
    setActions(prev => {
      const next = { ...prev }
      if (!next[key]) next[key] = new Set()
      else next[key] = new Set(next[key])
      next[key].add('tried')
      storeActions(next)
      return next
    })
    setRatings(prev => {
      const next = { ...prev, [key]: rating }
      localStorage.setItem('scrunch_ratings', JSON.stringify(next))
      return next
    })

    // Persist to Supabase
    if (user && isUuid(key)) {
      const ratingMap: Record<TriedRating, number> = { loved: 5, ok: 3, disliked: 1 }
      const repurchaseMap: Record<TriedRating, string> = { loved: 'yes', ok: 'maybe', disliked: 'no' }
      supabase.from('product_reviews').upsert({
        user_id: user.id,
        product_id: key,
        status: 'tried_once',
        rating: ratingMap[rating],
        would_repurchase: repurchaseMap[rating],
      } as never, { onConflict: 'user_id,product_id' })
        .then(({ error }) => { if (error) console.error('Review upsert failed:', error) })
    }
  }

  const hasAction = (key: string, action: ProductAction) =>
    actions[key]?.has(action) ?? false

  const updateNote = (key: string, note: string) => {
    setNotes(prev => {
      const next = { ...prev }
      if (note.trim()) next[key] = note.trim()
      else delete next[key]
      storeNotes(next)
      return next
    })
    // Persist to Supabase for logged-in users
    if (user && isUuid(key)) {
      supabase
        .from('product_reviews')
        .upsert({
          user_id: user.id,
          product_id: key,
          results_notes: note.trim() || null,
        } as never, { onConflict: 'user_id,product_id' })
        .then(({ error }) => { if (error) console.error('Note upsert failed:', error) })
    }
  }

  const filteredProducts = products.filter(p => {
    if (selectedCategories.size > 0 && !selectedCategories.has(p.category)) return false
    if (showApprovedOnly && p.cg_status !== 'approved') return false
    if (showGoodPlus && computeScrunchScore(p).score < 60) return false
    if (search && !`${p.brand} ${p.name}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const approvedCount = products.filter(p => p.cg_status === 'approved').length
  const hasFilters = selectedCategories.size > 0 || showApprovedOnly || showGoodPlus || search

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-500 animate-pulse">Loading products…</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
      <p className="text-gray-600 mb-6">
        {products.length} products from the r/curlyhair holy grail list · {approvedCount} CG-approved
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
            const count = products.filter(p => p.category === cat).length
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
            <span className="text-gray-600">CG-approved only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={showGoodPlus}
              onChange={(e) => setShowGoodPlus(e.target.checked)}
              className="accent-emerald-600 w-4 h-4"
            />
            <span className="text-gray-600">Score 60+ only</span>
          </label>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setSelectedCategories(new Set()); setShowApprovedOnly(false); setShowGoodPlus(false) }}
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
          <button onClick={() => { setSearch(''); setSelectedCategories(new Set()); setShowApprovedOnly(false); setShowGoodPlus(false) }} className="text-sm text-violet-600 hover:underline cursor-pointer">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredProducts.map((product, i) => {
            const key = productKey(product)
            const { score, grade, reasons } = computeScrunchScore(product)
            const scoreConfig = SCRUNCH_SCORE_CONFIG[grade]
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
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 cursor-help ${scoreConfig.bg} ${scoreConfig.color}`}
                      title={`Scrunch Score: ${score}/100 (${scoreConfig.label})\n\n${reasons.join('\n')}`}
                    >
                      {score}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{PRODUCT_CATEGORY_LABELS[product.category]}</p>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => toggleAction(key, 'tried')}
                      className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition ${
                        hasAction(key, 'tried')
                          ? ratings[key] === 'loved' ? 'bg-green-100 border-green-300 text-green-700'
                            : ratings[key] === 'disliked' ? 'bg-red-100 border-red-300 text-red-700'
                            : 'bg-amber-100 border-amber-300 text-amber-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {hasAction(key, 'tried')
                        ? ratings[key] === 'loved' ? '👍 Loved it'
                          : ratings[key] === 'disliked' ? '👎 Didn\'t work'
                          : '😐 It was ok'
                        : 'Tried it?'}
                    </button>
                    <button
                      onClick={() => toggleAction(key, 'bookmarked')}
                      className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition ${
                        hasAction(key, 'bookmarked')
                          ? 'bg-violet-100 border-violet-300 text-violet-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {hasAction(key, 'bookmarked') ? '★ Saved' : '☆ Save'}
                    </button>
                  </div>

                  {/* Rating popup */}
                  {ratingPopup === key && (
                    <div className="mt-2 p-3 bg-violet-50 border border-violet-200 rounded-lg">
                      <p className="text-xs font-medium text-gray-700 mb-2">How was it for your hair?</p>
                      <div className="flex gap-2">
                        <button onClick={() => submitRating(key, 'loved')} className="flex-1 text-xs py-2 bg-green-100 text-green-700 rounded-lg border border-green-200 hover:bg-green-200 cursor-pointer font-medium">
                          👍 Loved it
                        </button>
                        <button onClick={() => submitRating(key, 'ok')} className="flex-1 text-xs py-2 bg-amber-100 text-amber-700 rounded-lg border border-amber-200 hover:bg-amber-200 cursor-pointer font-medium">
                          😐 It was ok
                        </button>
                        <button onClick={() => submitRating(key, 'disliked')} className="flex-1 text-xs py-2 bg-red-100 text-red-700 rounded-lg border border-red-200 hover:bg-red-200 cursor-pointer font-medium">
                          👎 Nope
                        </button>
                      </div>
                      <button onClick={() => setRatingPopup(null)} className="text-xs text-gray-400 mt-2 hover:text-gray-600 cursor-pointer">Cancel</button>
                    </div>
                  )}

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
