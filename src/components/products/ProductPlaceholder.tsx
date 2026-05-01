import { useState } from 'react'
import type { ProductCategory } from '../../lib/database.types'

interface ProductPlaceholderProps {
  brand: string
  name: string
  category?: ProductCategory | null
  className?: string
}

const CATEGORY_CONFIG: Record<string, { icon: string; accent: string }> = {
  clarifying_shampoo: { icon: '🫧', accent: 'from-sky-100 to-sky-50' },
  low_poo: { icon: '🧴', accent: 'from-blue-100 to-blue-50' },
  co_wash: { icon: '💧', accent: 'from-cyan-100 to-cyan-50' },
  rinse_out_conditioner: { icon: '🪷', accent: 'from-pink-100 to-pink-50' },
  deep_conditioner: { icon: '🍯', accent: 'from-amber-100 to-amber-50' },
  leave_in_conditioner: { icon: '🌿', accent: 'from-emerald-100 to-emerald-50' },
  curl_cream: { icon: '☁️', accent: 'from-violet-100 to-violet-50' },
  gel: { icon: '✨', accent: 'from-indigo-100 to-indigo-50' },
  mousse: { icon: '🫐', accent: 'from-purple-100 to-purple-50' },
  custard: { icon: '🧈', accent: 'from-yellow-100 to-yellow-50' },
  oil_serum: { icon: '💎', accent: 'from-rose-100 to-rose-50' },
  spray_refresher: { icon: '💦', accent: 'from-teal-100 to-teal-50' },
  protein_treatment: { icon: '💪', accent: 'from-orange-100 to-orange-50' },
  scalp_treatment: { icon: '🌱', accent: 'from-lime-100 to-lime-50' },
}

const DEFAULT_CONFIG = { icon: '🌀', accent: 'from-violet-100 to-violet-50' }

const TOOLTIP_TEXT =
  '📸 No product image yet — we only use photos from approved sources to respect copyright.'

export function ProductPlaceholder({ brand, name, category, className = 'w-16 h-16' }: ProductPlaceholderProps) {
  const [showMobileTooltip, setShowMobileTooltip] = useState(false)
  const config = (category && CATEGORY_CONFIG[category]) || DEFAULT_CONFIG

  return (
    <div className={`relative group ${className} shrink-0`}>
      <div
        className={`w-full h-full bg-gradient-to-br ${config.accent} rounded-lg flex flex-col items-center justify-center overflow-hidden px-1 py-0.5 border border-gray-200/60`}
      >
        <span className="text-base leading-none" aria-hidden="true">
          {config.icon}
        </span>
        <span className="text-[8px] font-semibold text-gray-700 leading-tight text-center line-clamp-1">
          {brand}
        </span>
        <span className="text-[7px] text-gray-500 leading-tight text-center line-clamp-1">
          {name}
        </span>

        {/* Mobile info icon */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setShowMobileTooltip((prev) => !prev)
          }}
          className="absolute top-0.5 right-0.5 w-3.5 h-3.5 flex items-center justify-center rounded-full bg-violet-200/70 text-[8px] leading-none md:hidden"
          aria-label="Image info"
        >
          ℹ️
        </button>
      </div>

      {/* Desktop hover tooltip */}
      <div className="hidden group-hover:md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
        <div className="bg-violet-800 text-white text-[10px] leading-snug rounded-lg px-3 py-2 max-w-[200px] text-center shadow-lg whitespace-normal">
          {TOOLTIP_TEXT}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-violet-800" />
        </div>
      </div>

      {/* Mobile tap tooltip */}
      {showMobileTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 md:hidden">
          <div className="bg-violet-800 text-white text-[10px] leading-snug rounded-lg px-3 py-2 max-w-[200px] text-center shadow-lg whitespace-normal">
            {TOOLTIP_TEXT}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-violet-800" />
          </div>
        </div>
      )}
    </div>
  )
}
