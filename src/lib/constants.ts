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

export const PRODUCT_CATEGORY_DESCRIPTIONS: Record<ProductCategory, string> = {
  clarifying_shampoo: 'Contains sulfates to remove buildup. Use as your first wash when starting CG, then infrequently as needed.',
  low_poo: 'Gentle, sulfate-free shampoo. Good for low porosity, fine hair, and loose curls that need cleansing without stripping.',
  co_wash: 'Conditioner-based cleansing — replaces shampoo in the CG method. Great for high porosity, coarse, and tight curls.',
  rinse_out_conditioner: 'Standard conditioner for detangling and moisture. Almost everyone benefits from these. Can double as co-wash or leave-in.',
  deep_conditioner: 'Intensive treatment applied for minutes to an hour. Best for high porosity, damaged, or dry-climate hair. May contain protein.',
  leave_in_conditioner: 'Applied after washing, not rinsed out. Adds lasting moisture without hold. Also called "milks" or "sprays."',
  curl_cream: 'Heavier alternative to leave-in conditioner. Ultra conditioning with light hold. Some overlap with curl enhancers.',
  gel: '#1 recommended styler! Provides hold, increases definition, and reduces frizz. Don\'t forget to scrunch out the crunch (SOTC).',
  mousse: 'Lightweight alternative to gel. Great for low porosity, fine, or low density hair. Softer look than gel.',
  custard: 'Jelly-like texture that provides hold similar to gel. Some work as "one and done" stylers. Curl enhancers promote tighter curls.',
  oil_serum: 'Used to seal moisture (SOTC) or as a pre-poo. Look for pure, cold-pressed oils. Always check labels — many contain silicones.',
  spray_refresher: 'Revives curls between wash days or provides flexible hold. Virtually weightless.',
  protein_treatment: 'Helps curls "bounce back." Best for high porosity, fine, or damaged hair. Use when curls feel mushy or lack elasticity.',
  scalp_treatment: 'Products specifically targeting scalp health — dryness, flakiness, irritation, or buildup.',
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

export type ScrunchScore = 'excellent' | 'good' | 'fair' | 'poor'

export const SCRUNCH_SCORE_CONFIG: Record<ScrunchScore, { label: string; color: string; bg: string; description: string; minScore: number }> = {
  excellent: { label: 'Excellent', color: 'text-emerald-700', bg: 'bg-emerald-50', description: 'Clean ingredients, CG-approved, no concerns', minScore: 80 },
  good: { label: 'Good', color: 'text-green-600', bg: 'bg-green-50', description: 'CG-approved with minor considerations', minScore: 60 },
  fair: { label: 'Fair', color: 'text-amber-600', bg: 'bg-amber-50', description: 'Some questionable ingredients', minScore: 40 },
  poor: { label: 'Poor', color: 'text-red-600', bg: 'bg-red-50', description: 'Contains harsh or harmful ingredients', minScore: 0 },
} as const
