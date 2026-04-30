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

export function ProductPlaceholder({ brand, name, category, className = 'w-16 h-16' }: ProductPlaceholderProps) {
  const config = (category && CATEGORY_CONFIG[category]) || DEFAULT_CONFIG

  return (
    <div
      className={`${className} bg-gradient-to-br ${config.accent} rounded-lg flex flex-col items-center justify-center gap-0.5 px-1.5 py-1 shrink-0 border border-gray-200/60`}
    >
      <span className="text-base leading-none" aria-hidden="true">
        {config.icon}
      </span>
      <span className="text-[9px] font-semibold text-gray-700 leading-tight text-center line-clamp-1">
        {brand}
      </span>
      <span className="text-[8px] text-gray-500 leading-tight text-center line-clamp-1">
        {name}
      </span>
    </div>
  )
}
