import { useState } from 'react'
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
  onRequestProduct: () => void
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
        {/* Category chips */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => {
              const cat = value as ProductCategory
              const isSelected = selectedCategories.has(cat)
              const count = categoryCounts[cat] ?? 0
              return (
                <button
                  key={value}
                  onClick={() => onToggleCategory(cat)}
                  title={PRODUCT_CATEGORY_DESCRIPTIONS[cat]}
                  className={`text-xs px-3 py-2 min-h-[44px] rounded-full border cursor-pointer transition ${
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

        {/* Brand + Region filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select
            value={brandFilter}
            onChange={(e) => onBrandFilterChange(e.target.value)}
            className="px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="">All Brands ({allBrands.length})</option>
            {allBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <select
            value={regionFilter}
            onChange={(e) => onRegionFilterChange(e.target.value)}
            className="px-3 py-2.5 min-h-[44px] border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="">🌍 All Countries</option>
            <option value="US">🇺🇸 United States</option>
            <option value="CA">🇨🇦 Canada</option>
            <option value="UK">🇬🇧 United Kingdom</option>
            <option value="EU">🇪🇺 Europe</option>
            <option value="AU">🇦🇺 Australia</option>
            <option value="IN">🇮🇳 India</option>
            <option value="BR">🇧🇷 Brazil</option>
            <option value="JP">🇯🇵 Japan</option>
            <option value="KR">🇰🇷 South Korea</option>
            <option value="NG">🇳🇬 Nigeria</option>
            <option value="ZA">🇿🇦 South Africa</option>
            <option value="PH">🇵🇭 Philippines</option>
            <option value="MX">🇲🇽 Mexico</option>
            <option value="CO">🇨🇴 Colombia</option>
            <option value="AR">🇦🇷 Argentina</option>
            <option value="JM">🇯🇲 Jamaica</option>
            <option value="TR">🇹🇷 Turkey</option>
            <option value="SE">🇸🇪 Scandinavia</option>
            <option value="KE">🇰🇪 East Africa</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm min-h-[44px] sm:min-h-0">
            <input
              type="checkbox"
              checked={showApprovedOnly}
              onChange={(e) => onShowApprovedOnlyChange(e.target.checked)}
              className="accent-violet-600 w-5 h-5 sm:w-4 sm:h-4"
            />
            <span className="text-gray-600">CG-approved only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm min-h-[44px] sm:min-h-0">
            <input
              type="checkbox"
              checked={showGoodPlus}
              onChange={(e) => onShowGoodPlusChange(e.target.checked)}
              className="accent-emerald-600 w-5 h-5 sm:w-4 sm:h-4"
            />
            <span className="text-gray-600">🐰 Cruelty-free only</span>
          </label>
        </div>
      </div>

      {/* Count + actions row - always visible on desktop */}
      <div className="hidden md:flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400">{filteredCount} products</p>
          {hasFilters && (
            <button onClick={onClearFilters} className="text-xs text-violet-600 hover:underline cursor-pointer">
              Clear all filters
            </button>
          )}
        </div>
        <button
          onClick={onRequestProduct}
          className="text-xs px-3 py-1.5 text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 cursor-pointer"
        >
          Can't find a product? Request it →
        </button>
      </div>

      {/* Request product - mobile */}
      <div className="md:hidden mb-4">
        <button
          onClick={onRequestProduct}
          className="w-full text-sm px-4 py-2.5 min-h-[44px] text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 cursor-pointer"
        >
          Can't find a product? Request it →
        </button>
      </div>
    </>
  )
}
