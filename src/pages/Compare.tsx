import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useProducts, useProduct } from '../hooks/useProducts'
import { usePageTitle } from '../hooks/usePageTitle'
import { ProductImage } from '../hooks/useProductImage'
import { PRODUCT_CATEGORY_LABELS } from '../lib/constants'
import { IngredientRow } from '../components/products/IngredientCard'
import type { Product } from '../lib/database.types'

const EMPTY_PRODUCTS: Product[] = []

function getCgStatusConfig(status: Product['cg_status']) {
  return {
    approved: { className: 'bg-green-50 text-green-600', shortLabel: '🟢 CG', label: '🟢 Approved' },
    caution: { className: 'bg-amber-50 text-amber-600', shortLabel: '🟡 Caution', label: '🟡 Caution' },
    not_approved: { className: 'bg-red-50 text-red-600', shortLabel: '🔴 Not CG', label: '🔴 Not Approved' },
  }[status]
}

function isFragranceFree(product: Product) {
  const productNotes = (product.notes || '').toLowerCase()
  return product.fragrance_free === true
    || productNotes.includes('fragrance-free')
    || productNotes.includes('fragrance free')
    || productNotes.includes('no added fragrance')
}

function ProductPicker({ label, selectedId, onSelect, excludeId }: {
  label: string
  selectedId: string | null
  onSelect: (id: string) => void
  excludeId?: string | null
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const { data } = useProducts()
  const products = data?.products ?? EMPTY_PRODUCTS

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return products
      .filter(p => p.id !== excludeId)
      .filter(p => p.brand.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query, products, excludeId])

  const selected = products.find(p => p.id === selectedId)

  if (selected && !open) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
        <ProductImage brand={selected.brand} name={selected.name} seedImageUrl={selected.image_url} category={selected.category} className="w-12 h-12 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">{selected.brand}</p>
          <p className="font-medium text-gray-900 truncate">{selected.name}</p>
        </div>
        <button
          onClick={() => { setOpen(true); setQuery('') }}
          className="text-xs text-violet-600 hover:underline cursor-pointer shrink-0 min-h-[44px] px-2"
        >
          Change
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="Search by brand or product name..."
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-lg max-h-64 overflow-y-auto">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p.id); setOpen(false); setQuery('') }}
              className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
            >
              <ProductImage brand={p.brand} name={p.name} seedImageUrl={p.image_url} category={p.category} className="w-8 h-8 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{p.brand}</p>
                <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && query.trim() && filtered.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-lg px-4 py-3 text-sm text-gray-500">
          No products found
        </div>
      )}
    </div>
  )
}

function ComparisonColumn({ product }: { product: Product }) {
  const cgStatusConfig = getCgStatusConfig(product.cg_status)
  const isCf = product.cruelty_free === 'yes'
  const isFragFree = isFragranceFree(product)

  return (
    <div className="flex-1 min-w-0">
      <Link to={`/products/${product.id}`} className="block text-center mb-4 no-underline group">
        <ProductImage
          brand={product.brand}
          name={product.name}
          seedImageUrl={product.image_url}
          category={product.category}
          className="w-20 h-20 mx-auto mb-2"
        />
        <p className="text-xs text-gray-500">{product.brand}</p>
        <p className="font-semibold text-gray-900 group-hover:text-violet-600 transition text-sm">{product.name}</p>
      </Link>

      {/* Badges */}
      <div className="flex flex-wrap justify-center gap-1 mb-4">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cgStatusConfig.className}`}>
          {cgStatusConfig.shortLabel}
        </span>
        {isCf && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">🐰</span>}
        {isFragFree && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">🌸</span>}
      </div>

      {/* Category & Rating */}
      <div className="text-center text-xs text-gray-500 mb-4">
        <p>{PRODUCT_CATEGORY_LABELS[product.category]}</p>
        {product.avg_rating != null && (
          <p className="mt-1">
            {'★'.repeat(Math.round(product.avg_rating))}{'☆'.repeat(5 - Math.round(product.avg_rating))}
            {' '}{product.avg_rating.toFixed(1)}
          </p>
        )}
      </div>
    </div>
  )
}

function IngredientsComparison({ productA, productB }: { productA: Product; productB: Product }) {
  const setB = new Set(productB.ingredients.map(i => i.toLowerCase().trim()))
  const setA = new Set(productA.ingredients.map(i => i.toLowerCase().trim()))

  const sharedCount = productA.ingredients.filter(i => setB.has(i.toLowerCase().trim())).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Product A ingredients */}
      <div>
        <h3 className="font-medium text-gray-900 text-sm mb-2">{productA.brand} {productA.name}</h3>
        <p className="text-xs text-gray-500 mb-3">Tap ⓘ to learn more</p>
        {productA.ingredients.length > 0 ? (
          <div className="space-y-1 text-sm">
            {productA.ingredients.map((ing, i) => {
              const flagged = productA.flagged_ingredients.find(f => ing.toLowerCase().includes(f.name.toLowerCase()))
              const isShared = setB.has(ing.toLowerCase().trim())
              return (
                <div key={i} className={isShared ? 'bg-blue-50 rounded px-1 -mx-1' : ''}>
                  <IngredientRow ingredient={ing} flagged={flagged ?? null} />
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-3">No ingredient list yet.</p>
        )}
      </div>

      {/* Product B ingredients */}
      <div>
        <h3 className="font-medium text-gray-900 text-sm mb-2">{productB.brand} {productB.name}</h3>
        <p className="text-xs text-gray-500 mb-3">Tap ⓘ to learn more</p>
        {productB.ingredients.length > 0 ? (
          <div className="space-y-1 text-sm">
            {productB.ingredients.map((ing, i) => {
              const flagged = productB.flagged_ingredients.find(f => ing.toLowerCase().includes(f.name.toLowerCase()))
              const isShared = setA.has(ing.toLowerCase().trim())
              return (
                <div key={i} className={isShared ? 'bg-blue-50 rounded px-1 -mx-1' : ''}>
                  <IngredientRow ingredient={ing} flagged={flagged ?? null} />
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-3">No ingredient list yet.</p>
        )}
      </div>

      {sharedCount > 0 && (
        <p className="md:col-span-2 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
          💡 {sharedCount} shared ingredient{sharedCount !== 1 ? 's' : ''} highlighted in blue
        </p>
      )}
    </div>
  )
}

export function Compare() {
  usePageTitle('Compare Products - Scrunch')

  const [searchParams, setSearchParams] = useSearchParams()
  const idA = searchParams.get('a')
  const idB = searchParams.get('b')

  const { data: productA } = useProduct(idA ?? undefined)
  const { data: productB } = useProduct(idB ?? undefined)

  const selectA = (id: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('a', id)
    setSearchParams(params)
  }
  const selectB = (id: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('b', id)
    setSearchParams(params)
  }

  const bothLoaded = productA && productB

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Compare Products</h1>
      <p className="text-gray-600 mb-8">Pick two products to see them side-by-side.</p>

      {/* Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ProductPicker label="Product A" selectedId={idA} onSelect={selectA} excludeId={idB} />
        <ProductPicker label="Product B" selectedId={idB} onSelect={selectB} excludeId={idA} />
      </div>

      {/* Comparison */}
      {bothLoaded && (
        <div className="space-y-6">
          {/* Header comparison */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex gap-4">
              <ComparisonColumn product={productA} />
              <div className="w-px bg-gray-200 shrink-0" />
              <ComparisonColumn product={productB} />
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Comparison</h2>
            <div className="space-y-3 text-sm">
              <CompareRow label="CG Status" a={getCgStatusConfig(productA.cg_status).label} b={getCgStatusConfig(productB.cg_status).label} />
              <CompareRow label="Cruelty-Free" a={productA.cruelty_free === 'yes' ? '🐰 Yes' : productA.cruelty_free === 'no' ? '❌ No' : '❓ Unknown'} b={productB.cruelty_free === 'yes' ? '🐰 Yes' : productB.cruelty_free === 'no' ? '❌ No' : '❓ Unknown'} />
              <CompareRow label="Ingredients" a={`${productA.ingredients.length} total`} b={`${productB.ingredients.length} total`} />
              <CompareRow label="Flagged" a={`${productA.flagged_ingredients.length} concern${productA.flagged_ingredients.length !== 1 ? 's' : ''}`} b={`${productB.flagged_ingredients.length} concern${productB.flagged_ingredients.length !== 1 ? 's' : ''}`} />
              {(productA.avg_rating != null || productB.avg_rating != null) && (
                <CompareRow
                  label="Rating"
                  a={productA.avg_rating != null ? `${productA.avg_rating.toFixed(1)} ★` : 'No ratings'}
                  b={productB.avg_rating != null ? `${productB.avg_rating.toFixed(1)} ★` : 'No ratings'}
                />
              )}
            </div>
          </div>

          {/* Ingredients side-by-side */}
          {(productA.ingredients.length > 0 || productB.ingredients.length > 0) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Ingredients</h2>
              <IngredientsComparison productA={productA} productB={productB} />
            </div>
          )}
        </div>
      )}

      {!bothLoaded && (idA || idB) && (
        <p className="text-center text-gray-500 py-8">Select both products to compare them.</p>
      )}
    </div>
  )
}

function CompareRow({ label, a, b }: { label: string; a: string; b: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr_1fr] gap-1 sm:gap-2 sm:items-center">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900">{a}</span>
      <span className="text-gray-900">{b}</span>
    </div>
  )
}
