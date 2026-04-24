import type { CurlPattern, Porosity, ProductCategory } from './database.types'

export const CURL_PATTERNS: { value: CurlPattern; label: string; description: string }[] = [
  { value: '2A', label: '2A', description: 'Almost straight with a slight bend' },
  { value: '2B', label: '2B', description: 'Like a loose "S"' },
  { value: '2C', label: '2C', description: 'Defined, S-shaped pattern' },
  { value: '3A', label: '3A', description: 'Like a loose "C"' },
  { value: '3B', label: '3B', description: 'Defined & springy C\'s' },
  { value: '3C', label: '3C', description: 'Like a corkscrew' },
  { value: '4A', label: '4A', description: 'Tight & springy, like a slinky' },
  { value: '4B', label: '4B', description: 'A less-defined "Z"' },
  { value: '4C', label: '4C', description: 'Like a sharply defined "Z"' },
]

export const POROSITY_OPTIONS: { value: Porosity; label: string; description: string }[] = [
  { value: 'low', label: 'Low', description: 'Water beads on hair, products sit on top' },
  { value: 'medium', label: 'Medium', description: 'Hair absorbs and retains moisture well' },
  { value: 'high', label: 'High', description: 'Hair absorbs quickly but loses moisture fast' },
]

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  clarifying_shampoo: 'Clarifying Shampoo',
  low_poo: 'Low-Poo (Sulfate-Free Shampoo)',
  co_wash: 'Co-Wash',
  rinse_out_conditioner: 'Rinse-Out Conditioner',
  deep_conditioner: 'Deep Conditioner / Hair Mask',
  leave_in_conditioner: 'Leave-In Conditioner',
  curl_cream: 'Curl Cream / Styling Cream',
  gel: 'Gel',
  mousse: 'Mousse / Foam',
  custard: 'Custard / Pudding',
  oil_serum: 'Oil / Serum',
  spray_refresher: 'Spray / Refresher',
  protein_treatment: 'Protein Treatment',
  scalp_treatment: 'Scalp Treatment',
}

export const HAIR_GOALS = [
  'moisture',
  'definition',
  'volume',
  'frizz_control',
  'length_retention',
  'repair',
  'shine',
  'scalp_health',
] as const

export const SENSITIVITIES = [
  'fragrance',
  'coconut',
  'protein',
  'sulfate',
  'silicone',
  'aloe',
] as const

export const CG_STATUS_CONFIG = {
  approved: { label: 'CG Approved', color: 'text-green-600', bg: 'bg-green-50', icon: '🟢' },
  not_approved: { label: 'Not CG Approved', color: 'text-red-600', bg: 'bg-red-50', icon: '🔴' },
  caution: { label: 'Caution', color: 'text-amber-600', bg: 'bg-amber-50', icon: '🟡' },
} as const
