import { useEffect, useRef, useState } from 'react'
import { PRODUCT_CATEGORY_LABELS, PRODUCT_CATEGORY_DESCRIPTIONS } from '../../lib/constants'
import type { ProductCategory } from '../../lib/database.types'

interface FilterPanelProps {
  selectedCategories: Set<ProductCategory>
  onToggleCategory: (cat: ProductCategory) => void
  categoryCounts: Record<string, number>
  brandFilter: string
  onBrandFilterChange: (value: string) => void
  allBrands: string[]
  regionFilter: string
  onRegionFilterChange: (value: string) => void
  showApprovedOnly: boolean
  onShowApprovedOnlyChange: (value: boolean) => void
  showGoodPlus: boolean
  onShowGoodPlusChange: (value: boolean) => void
  hasFilters: boolean
  onClearFilters: () => void
  filteredCount: number
  totalCount: number
  approvedCount: number
  onRequestProduct: () => void
}

const CATEGORY_EMOJI: Record<ProductCategory, string> = {
  clarifying_shampoo: '🫧',
  dry_shampoo: '🌬️',
  low_poo: '🧴',
  co_wash: '🫗',
  rinse_out_conditioner: '🚿',
  deep_conditioner: '🧖‍♀️',
  leave_in_conditioner: '💧',
  curl_cream: '🧁',
  gel: '✨',
  mousse: '☁️',
  custard: '🍮',
  oil_serum: '🫒',
  spray_refresher: '💦',
  protein_treatment: '💪',
  scalp_treatment: '🌿',
  bond_repair: '🔗',
}

const CATEGORY_GROUPS: { label: string; categories: ProductCategory[] }[] = [
  { label: 'Cleanse', categories: ['clarifying_shampoo', 'low_poo', 'co_wash', 'dry_shampoo'] },
  { label: 'Condition', categories: ['rinse_out_conditioner', 'deep_conditioner', 'leave_in_conditioner'] },
  { label: 'Style', categories: ['curl_cream', 'gel', 'mousse', 'custard', 'spray_refresher'] },
  { label: 'Treat', categories: ['oil_serum', 'protein_treatment', 'scalp_treatment', 'bond_repair'] },
]

const REGION_OPTIONS: { value: string; label: string; flag: string }[] = [
  { value: '', label: 'All Countries', flag: '🌍' },
  { value: 'US', label: 'United States', flag: '🇺🇸' },
  { value: 'CA', label: 'Canada', flag: '🇨🇦' },
  { value: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'EU', label: 'Europe', flag: '🇪🇺' },
  { value: 'AU', label: 'Australia', flag: '🇦🇺' },
  { value: 'IN', label: 'India', flag: '🇮🇳' },
  { value: 'BR', label: 'Brazil', flag: '🇧🇷' },
  { value: 'JP', label: 'Japan', flag: '🇯🇵' },
  { value: 'KR', label: 'South Korea', flag: '🇰🇷' },
  { value: 'NG', label: 'Nigeria', flag: '🇳🇬' },
  { value: 'ZA', label: 'South Africa', flag: '🇿🇦' },
  { value: 'PH', label: 'Philippines', flag: '🇵🇭' },
  { value: 'MX', label: 'Mexico', flag: '🇲🇽' },
  { value: 'CO', label: 'Colombia', flag: '🇨🇴' },
  { value: 'AR', label: 'Argentina', flag: '🇦🇷' },
  { value: 'JM', label: 'Jamaica', flag: '🇯🇲' },
  { value: 'TR', label: 'Turkey', flag: '🇹🇷' },
  { value: 'SE', label: 'Scandinavia', flag: '🇸🇪' },
  { value: 'KE', label: 'East Africa', flag: '🇰🇪' },
]

function RegionDropdown({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = REGION_OPTIONS.find((r) => r.value === value) ?? REGION_OPTIONS[0]

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2.5 min-h-[44px] border border-gray-200 rounded-lg text-sm bg-white hover:border-violet-300 transition"
      >
        <span className="truncate">
          <span className="mr-1.5">{selected.flag}</span>
          {selected.label}
        </span>
        <span className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden>▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Region"
          className="absolute z-20 left-0 right-0 sm:right-auto sm:min-w-[14rem] mt-1 max-h-72 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1"
        >
          {REGION_OPTIONS.map((opt) => {
            const isSelected = opt.value === value
            return (
              <li key={opt.value || 'all'}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-violet-50 transition ${
                    isSelected ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span>{opt.flag}</span>
                  <span className="flex-1">{opt.label}</span>
                  {isSelected && <span aria-hidden>✓</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function FilterPanel({
  selectedCategories,
  onToggleCategory,
  categoryCounts,
  brandFilter,
  onBrandFilterChange,
  allBrands,
  regionFilter,
  onRegionFilterChange,
  showApprovedOnly,
  onShowApprovedOnlyChange,
  showGoodPlus,
  onShowGoodPlusChange,
  hasFilters,
  onClearFilters,
  filteredCount,
  totalCount,
  approvedCount,
  onRequestProduct,
}: FilterPanelProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const activeFilterCount = (selectedCategories.size > 0 ? 1 : 0)
    + (brandFilter ? 1 : 0)
    + (regionFilter ? 1 : 0)
    + (showApprovedOnly ? 1 : 0)
    + (showGoodPlus ? 1 : 0)

  return (
    <>
      {/* Mobile filter toggle + count row */}
      <div className="flex items-center justify-between mb-3 md:hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium border border-gray-300 rounded-lg bg-white cursor-pointer transition hover:border-violet-300"
        >
          <span>☰ Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-violet-100 text-violet-700 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-400">{filteredCount} products</p>
          {hasFilters && (
            <button onClick={onClearFilters} className="text-xs text-violet-600 hover:underline cursor-pointer">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter content - always visible on desktop, toggled on mobile */}
      <div className={`${filtersOpen ? 'block' : 'hidden'} md:block`}>
        {/* Category groups */}
        <div className="mb-4 space-y-2">
          {CATEGORY_GROUPS.map(group => (
            <div key={group.label} className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 w-16 shrink-0">
                {group.label}
              </span>
              {group.categories.map(cat => {
                const isSelected = selectedCategories.has(cat)
                const count = categoryCounts[cat] ?? 0
                return (
                  <button
                    key={cat}
                    onClick={() => onToggleCategory(cat)}
                    title={PRODUCT_CATEGORY_DESCRIPTIONS[cat]}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 min-h-[36px] rounded-full border cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-violet-600 border-violet-600 text-white shadow-sm shadow-violet-200'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:bg-violet-50'
                    }`}
                  >
                    <span className="text-xs leading-none">{CATEGORY_EMOJI[cat]}</span>
                    <span className="font-medium">{PRODUCT_CATEGORY_LABELS[cat]}</span>
                    <span className={`text-[10px] tabular-nums ${isSelected ? 'text-violet-200' : 'text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Brand + Region filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select
            value={brandFilter}
            onChange={(e) => onBrandFilterChange(e.target.value)}
            className="px-3 py-2.5 min-h-[44px] border border-gray-200 rounded-lg text-sm bg-white hover:border-violet-300 transition"
          >
            <option value="">All Brands ({allBrands.length})</option>
            {allBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <RegionDropdown value={regionFilter} onChange={onRegionFilterChange} />
        </div>

        {/* Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mb-4">
          <label className="flex items-center gap-2.5 cursor-pointer text-sm min-h-[44px] sm:min-h-0 select-none group">
            <div className={`relative w-9 h-5 rounded-full transition-colors ${showApprovedOnly ? 'bg-violet-600' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${showApprovedOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
              <input
                type="checkbox"
                checked={showApprovedOnly}
                onChange={(e) => onShowApprovedOnlyChange(e.target.checked)}
                className="sr-only"
              />
            </div>
            <span className="text-gray-600">CG-approved only</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-sm min-h-[44px] sm:min-h-0 select-none group">
            <div className={`relative w-9 h-5 rounded-full transition-colors ${showGoodPlus ? 'bg-emerald-600' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${showGoodPlus ? 'translate-x-4' : 'translate-x-0.5'}`} />
              <input
                type="checkbox"
                checked={showGoodPlus}
                onChange={(e) => onShowGoodPlusChange(e.target.checked)}
                className="sr-only"
              />
            </div>
            <span className="text-gray-600">🐰 Cruelty-free only</span>
          </label>
        </div>
      </div>

      {/* Count + actions row - always visible on desktop */}
      <div className="hidden md:flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">
            {hasFilters ? (
              <><span className="font-medium">{filteredCount}</span> of {totalCount} products</>
            ) : (
              <><span className="font-medium">{totalCount}</span> products · <span className="text-green-600">{approvedCount} CG-approved</span></>
            )}
          </p>
          {hasFilters && (
            <button onClick={onClearFilters} className="text-xs text-violet-600 hover:underline cursor-pointer font-medium">
              Clear all filters
            </button>
          )}
        </div>
        <button
          onClick={onRequestProduct}
          className="text-xs px-4 py-2 text-violet-600 border border-violet-200 rounded-full hover:bg-violet-50 cursor-pointer transition font-medium"
        >
          + Request a product
        </button>
      </div>

      {/* Request product - mobile */}
      <div className="md:hidden mb-4">
        <button
          onClick={onRequestProduct}
          className="w-full text-sm px-4 py-2.5 min-h-[44px] text-violet-600 border border-violet-200 rounded-full hover:bg-violet-50 cursor-pointer transition font-medium"
        >
          + Request a product
        </button>
      </div>
    </>
  )
}
