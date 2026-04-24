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
  'more_volume',
  'more_shine',
  'curl_definition',
  'less_shedding',
  'more_smoothness',
  'hair_growth',
  'moisture',
  'frizz_control',
  'repair',
  'scalp_health',
  'reduce_breakage',
  'length_retention',
] as const

export const HAIR_GOAL_LABELS: Record<string, string> = {
  more_volume: 'More Volume',
  more_shine: 'More Shine',
  curl_definition: 'More Curl Definition',
  less_shedding: 'Less Shedding',
  more_smoothness: 'More Smoothness',
  hair_growth: 'More Hair Growth',
  moisture: 'Moisture',
  frizz_control: 'Frizz Control',
  repair: 'Repair & Strengthen',
  scalp_health: 'Scalp Health',
  reduce_breakage: 'Reduce Breakage',
  length_retention: 'Length Retention',
}

export const INGREDIENT_PREFERENCES = [
  'vegan',
  'silicone_free',
  'sulfate_free',
  'fragrance_free',
  'protein_free',
  'coconut_free',
  'aloe_free',
] as const

export const INGREDIENT_PREFERENCE_LABELS: Record<string, string> = {
  vegan: '🌱 Vegan',
  silicone_free: 'Silicone-Free',
  sulfate_free: 'Sulfate-Free',
  fragrance_free: 'Fragrance-Free',
  protein_free: 'Protein-Free',
  coconut_free: 'Coconut-Free',
  aloe_free: 'Aloe-Free',
}

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
