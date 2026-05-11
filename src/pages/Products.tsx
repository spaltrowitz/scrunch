import { useState, useMemo, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import type { ProductCategory, Product, ProductReview } from '../lib/database.types'
import { RequestProductForm } from '../components/products/RequestProductForm'
import { SearchBar } from '../components/products/SearchBar'
import { FilterPanel } from '../components/products/FilterPanel'
import { ProductCard } from '../components/products/ProductCard'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.utils'
import { useCatalogProducts, useUserReviews } from '../hooks/useProducts'
import { useToast } from '../hooks/useToast.utils'
import { MIN_RATINGS_FOR_ADVANCED } from '../components/recommendations/recommendationEngine'

type TriedRating = 'loved' | 'liked' | 'ok' | 'disliked'
type ProductAction = 'tried' | 'bookmarked'
type ProductActions = Record<string, Set<ProductAction>>
type ProductRatings = Record<string, TriedRating>
type ProductNotes = Record<string, string>

type DisplayProduct = Product

const PRODUCTS_PER_PAGE = 20

function productKey(p: DisplayProduct): string {
  if (!p.id || p.id.startsWith('seed-')) return `${p.brand}::${p.name}`
  return p.id
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
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const { data } = useCatalogProducts()
  const products = useMemo(() => data?.products ?? [], [data])
  const { data: userReviews = [], isLoading: reviewsLoading, error: reviewsError } = useUserReviews(user?.id)
  const loading = !data
  const userId = user?.id
  const [search, setSearch] = useState('')
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') as ProductCategory | null
  const [selectedCategories, setSelectedCategories] = useState<Set<ProductCategory>>(
    () => initialCategory ? new Set([initialCategory]) : new Set()
  )
  const [showApprovedOnly, setShowApprovedOnly] = useState(false)
  const [showGoodPlus, setShowGoodPlus] = useState(false)
  const [brandFilter, setBrandFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [actions, setActions] = useState<ProductActions>(getStoredActions)
  const [ratings, setRatings] = useState<ProductRatings>(() => {
    try { return JSON.parse(localStorage.getItem('scrunch_ratings') || '{}') } catch { return {} }
  })
  const [ratingPopup, setRatingPopup] = useState<string | null>(null)
  const [notes, setNotes] = useState<ProductNotes>(getStoredNotes)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE)

  // Render-time sync: load user reviews or revert to localStorage
  const [prevReviewsKey, setPrevReviewsKey] = useState<string | null>(null)
  const currentReviewsKey = user ? (reviewsLoading || reviewsError ? null : JSON.stringify(userReviews.map(r => r.product_id))) : 'logged-out'
  if (currentReviewsKey !== null && currentReviewsKey !== prevReviewsKey) {
    setPrevReviewsKey(currentReviewsKey)
    if (!user) {
      setActions(getStoredActions())
      setNotes(getStoredNotes())
    } else {
      const reviewData = userReviews as ProductReview[]
      const reviewActions: ProductActions = {}
      const reviewNotes: ProductNotes = {}
      const reviewRatings: ProductRatings = {}
      for (const review of reviewData) {
        const key = review.product_id
        reviewActions[key] = new Set()
        if (review.status) reviewActions[key].add('tried')
        if (review.rating != null) reviewActions[key].add('tried')
        if (review.results_notes) reviewNotes[key] = review.results_notes
        if (review.rating != null) {
          if (review.rating >= 5) reviewRatings[key] = 'loved'
          else if (review.rating >= 4) reviewRatings[key] = 'liked'
          else if (review.rating >= 2) reviewRatings[key] = 'ok'
          else reviewRatings[key] = 'disliked'
        }
      }
      const stored = getStoredActions()
      for (const [key, set] of Object.entries(stored)) {
        if (set.has('bookmarked')) {
          if (!reviewActions[key]) reviewActions[key] = new Set()
          reviewActions[key].add('bookmarked')
        }
      }
      setActions(reviewActions)
      setNotes(prev => ({ ...prev, ...reviewNotes }))
      setRatings(prev => ({ ...prev, ...reviewRatings }))
    }
  }

  const deleteReviewMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!userId) return
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
      if (error) throw error
    },
    onError: (error) => {
      console.error('Delete review failed:', error)
      addToast('Failed to remove review. Please try again.', 'error')
    },
    onSuccess: () => {
      addToast('Review removed', 'success')
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', userId] })
      }
    },
  })

  const upsertReviewMutation = useMutation({
    mutationFn: async ({ productId, rating }: { productId: string; rating: TriedRating }) => {
      if (!userId) return
      const ratingMap: Record<TriedRating, number> = { loved: 5, liked: 4, ok: 3, disliked: 1 }
      const repurchaseMap: Record<TriedRating, string> = { loved: 'yes', liked: 'yes', ok: 'maybe', disliked: 'no' }
      const { error } = await supabase.from('product_reviews').upsert({
        user_id: userId,
        product_id: productId,
        status: 'tried_once',
        rating: ratingMap[rating],
        would_repurchase: repurchaseMap[rating],
      } as never, { onConflict: 'user_id,product_id' })
      if (error) throw error
    },
    onError: (error) => {
      console.error('Review upsert failed:', error)
      addToast('Failed to save rating. Please try again.', 'error')
    },
    onSuccess: () => {
      addToast(userId ? 'Saved · synced' : 'Saved · on this device', 'success')
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', userId] })
      }
    },
  })

  const upsertNoteMutation = useMutation({
    mutationFn: async ({ productId, note }: { productId: string; note: string }) => {
      if (!userId) return
      const { error } = await supabase
        .from('product_reviews')
        .upsert({
          user_id: userId,
          product_id: productId,
          results_notes: note.trim() || null,
        } as never, { onConflict: 'user_id,product_id' })
      if (error) throw error
    },
    onError: (error) => {
      console.error('Note upsert failed:', error)
      addToast('Failed to save note. Please try again.', 'error')
    },
    onSuccess: () => {
      addToast(userId ? 'Note saved · synced' : 'Note saved · on this device', 'success')
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', userId] })
      }
    },
  })

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
          deleteReviewMutation.mutate(key)
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
      upsertReviewMutation.mutate({ productId: key, rating })
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
      upsertNoteMutation.mutate({ productId: key, note })
    }
  }

  const isNarrowView = selectedCategories.size > 0 || !!brandFilter || !!search

  const filteredProducts = useMemo(() => products.filter(p => {
    if (selectedCategories.size > 0 && !selectedCategories.has(p.category)) return false
    if (brandFilter && p.brand !== brandFilter) return false
    if (regionFilter && (p.country_availability || ['US'])[0] !== regionFilter) return false
    if (showApprovedOnly && p.cg_status !== 'approved') return false
    if (showGoodPlus && p.cruelty_free !== 'yes') return false
    if (search && !`${p.brand} ${p.name}`.toLowerCase().includes(search.toLowerCase())) return false
    if (!isNarrowView && user) {
      const key = productKey(p)
      if (actions[key]?.has('tried')) return false
    }
    return true
  }), [products, selectedCategories, brandFilter, regionFilter, showApprovedOnly, showGoodPlus, search, isNarrowView, user, actions])

  const allBrands = useMemo(() =>
    Array.from(new Set(products.map(p => p.brand))).sort()
  , [products])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return counts
  }, [products])

  const approvedCount = useMemo(() => products.filter(p => p.cg_status === 'approved').length, [products])
  const userRatingCount = Object.keys(ratings).length
  const ratingsNeeded = Math.max(0, MIN_RATINGS_FOR_ADVANCED - userRatingCount)
  const hasFilters = selectedCategories.size > 0 || showApprovedOnly || showGoodPlus || !!search || !!brandFilter || !!regionFilter

  const suggestions = useMemo(() => {
    if (search.length < 2) return []
    const all = Array.from(new Set([
      ...products.map(p => p.brand),
      ...products.map(p => `${p.brand} ${p.name}`),
    ])).sort()
    return all.filter(s => s.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
  }, [products, search])

  const clearFilters = useCallback(() => {
    setSearch('')
    setSelectedCategories(new Set())
    setShowApprovedOnly(false)
    setShowGoodPlus(false)
    setBrandFilter('')
    setRegionFilter('')
    setVisibleCount(PRODUCTS_PER_PAGE)
  }, [])

  const toggleCategory = useCallback((cat: ProductCategory) => {
    setSearch('')
    setVisibleCount(PRODUCTS_PER_PAGE)
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }, [])

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount],
  )
  const hasMore = visibleCount < filteredProducts.length

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
        <div className="h-4 w-72 bg-gray-100 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-white border border-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
      <p className="text-gray-600 mb-6">
        {products.length} products from the r/curlyhair holy grail list · {approvedCount} CG-approved
      </p>

      {user && ratingsNeeded > 0 && (
        <div className="mb-6 p-4 bg-violet-50 border border-violet-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-violet-900">
              Rate {ratingsNeeded} more product{ratingsNeeded !== 1 ? 's' : ''} to unlock personalized suggestions ✨
            </p>
            <p className="text-xs text-violet-600 mt-0.5">
              {userRatingCount}/{MIN_RATINGS_FOR_ADVANCED} rated - click "Tried it?" on products you've used
            </p>
          </div>
          <div className="w-full sm:w-24 h-2 bg-violet-200 rounded-full shrink-0">
            <div className="h-2 bg-violet-500 rounded-full transition-all" style={{ width: `${Math.min(100, (userRatingCount / MIN_RATINGS_FOR_ADVANCED) * 100)}%` }} />
          </div>
        </div>
      )}

      <SearchBar search={search} onSearchChange={(v) => { setSearch(v); setVisibleCount(PRODUCTS_PER_PAGE) }} suggestions={suggestions} />

      <FilterPanel
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        categoryCounts={categoryCounts}
        brandFilter={brandFilter}
        onBrandFilterChange={setBrandFilter}
        allBrands={allBrands}
        regionFilter={regionFilter}
        onRegionFilterChange={setRegionFilter}
        showApprovedOnly={showApprovedOnly}
        onShowApprovedOnlyChange={setShowApprovedOnly}
        showGoodPlus={showGoodPlus}
        onShowGoodPlusChange={setShowGoodPlus}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
        filteredCount={filteredProducts.length}
        onRequestProduct={() => setShowRequestForm(true)}
      />

      {showRequestForm && (
        <div className="mb-6">
          <RequestProductForm onClose={() => setShowRequestForm(false)} />
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            No products match your current filters. Try adjusting your search or filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-3 min-h-[44px] text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 cursor-pointer transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleProducts.map((product, i) => {
              const key = productKey(product)
              return (
                <ProductCard
                  key={`${key}-${i}`}
                  product={product}
                  productKey={key}
                  hasTried={hasAction(key, 'tried')}
                  hasBookmarked={hasAction(key, 'bookmarked')}
                  rating={ratings[key]}
                  note={notes[key]}
                  isEditingNote={editingNote === key}
                  isRatingPopup={ratingPopup === key}
                  onToggleTried={() => toggleAction(key, 'tried')}
                  onToggleBookmark={() => toggleAction(key, 'bookmarked')}
                  onSubmitRating={(r) => submitRating(key, r)}
                  onCloseRating={() => setRatingPopup(null)}
                  onStartEditNote={() => setEditingNote(key)}
                  onUpdateNote={(n) => updateNote(key, n)}
                  onStopEditNote={() => setEditingNote(null)}
                />
              )
            })}
          </div>
          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleCount(prev => prev + PRODUCTS_PER_PAGE)}
                className="px-6 py-3 min-h-[44px] text-sm font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 cursor-pointer transition"
              >
                Show more ({filteredProducts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
