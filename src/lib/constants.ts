import type { CurlPattern, Porosity, ProductCategory, ScalpType, ColorTreatment, Climate, HeatToolUsage, WorkoutFrequency, CgmExperience, FragrancePreference, WaterType } from './database.types'

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

export const POROSITY_OPTIONS: { value: Porosity; label: string; description: string; characteristics: string[] }[] = [
  { value: 'low', label: 'Low', description: 'Hair resists absorbing moisture  -  products sit on top', characteristics: [
    'Water beads up on hair instead of absorbing',
    'Takes a long time to get fully wet and even longer to dry',
    'Products tend to build up quickly',
    'Shiny, smooth-feeling strands',
    'Resistant to chemical treatments (dye, relaxer)',
  ] },
  { value: 'medium', label: 'Medium', description: 'Hair absorbs and retains moisture well  -  easy to work with', characteristics: [
    'Hair gets wet fairly quickly and dries in a few hours',
    'Holds styles well and responds to products predictably',
    'Takes color as expected',
    'Generally healthy-looking with some shine',
  ] },
  { value: 'high', label: 'High', description: 'Hair absorbs fast but loses moisture quickly  -  needs sealing', characteristics: [
    'Gets wet immediately and may dry very fast',
    'Soaks in products quickly  -  may feel like nothing is "enough"',
    'Tangles easily, feels rough or bumpy',
    'Can look dull or feel dry',
    'May be from damage (heat, bleach, chemical treatments) or genetics',
  ] },
]

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  clarifying_shampoo: 'Clarifying Shampoo',
  dry_shampoo: 'Dry Shampoo',
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
  scalp_care: 'Scalp Care',
  bond_repair: 'Bond Repair',
}

export const PRODUCT_CATEGORY_DESCRIPTIONS: Record<ProductCategory, string> = {
  clarifying_shampoo: 'Contains sulfates to remove buildup. Use as your first wash when starting CG, then infrequently as needed.',
  dry_shampoo: 'Powder or spray that absorbs oil between wash days. Extends time between washes. Check ingredients  -  many contain non-CG alcohols or silicones.',
  low_poo: 'Gentle, sulfate-free shampoo. Good for low porosity, fine hair, and loose curls that need cleansing without stripping.',
  co_wash: 'Conditioner-based cleansing  -  replaces shampoo in the CG method. Great for high porosity, coarse, and tight curls.',
  rinse_out_conditioner: 'Standard conditioner for detangling and moisture. Almost everyone benefits from these. Can double as co-wash or leave-in.',
  deep_conditioner: 'Intensive treatment applied for minutes to an hour. Best for high porosity, damaged, or dry-climate hair. May contain protein.',
  leave_in_conditioner: 'Applied after washing, not rinsed out. Adds lasting moisture without hold. Also called "milks" or "sprays."',
  curl_cream: 'Heavier alternative to leave-in conditioner. Ultra conditioning with light hold. Some overlap with curl enhancers.',
  gel: '#1 recommended styler! Provides hold, increases definition, and reduces frizz. Don\'t forget to scrunch out the crunch (SOTC).',
  mousse: 'Lightweight alternative to gel. Great for low porosity, fine, or low density hair. Softer look than gel.',
  custard: 'Jelly-like texture that provides hold similar to gel. Some work as "one and done" stylers. Curl enhancers promote tighter curls.',
  oil_serum: 'Used to seal moisture (SOTC) or as a pre-poo. Look for pure, cold-pressed oils. Always check labels  -  many contain silicones.',
  spray_refresher: 'Revives curls between wash days or provides flexible hold. Virtually weightless.',
  protein_treatment: 'Helps curls "bounce back." Best for high porosity, fine, or damaged hair. Use when curls feel mushy or lack elasticity.',
  scalp_treatment: 'Products specifically targeting scalp health  -  dryness, flakiness, irritation, or buildup.',
  scalp_care: 'Scalp treatments, oils, and serums that nourish and support a healthy scalp environment.',
  bond_repair: 'Bond-building treatments that repair broken disulfide bonds in hair damaged by heat, color, or chemical processing.',
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

/**
 * Parse a sensitivity string that may include a strictness suffix.
 * Format: "silicone_free" (defaults to strict) or "silicone_free:flexible"
 */
export function parseSensitivity(encoded: string): { name: string; strictness: 'strict' | 'flexible' } {
  if (encoded.endsWith(':flexible')) {
    return { name: encoded.replace(':flexible', ''), strictness: 'flexible' }
  }
  if (encoded.endsWith(':strict')) {
    return { name: encoded.replace(':strict', ''), strictness: 'strict' }
  }
  return { name: encoded, strictness: 'strict' }
}

/** Encode a sensitivity name + strictness back into a storable string. */
export function encodeSensitivity(name: string, strictness: 'strict' | 'flexible'): string {
  return strictness === 'strict' ? `${name}:strict` : `${name}:flexible`
}

export const SENSITIVITIES = [
  'fragrance',
  'coconut',
  'protein',
  'sulfate',
  'silicone',
  'aloe',
] as const

export const SCALP_TYPE_OPTIONS: { value: ScalpType; label: string; description: string }[] = [
  { value: 'dry', label: 'Dry', description: 'Tight, flaky, or itchy scalp' },
  { value: 'normal', label: 'Normal', description: 'Balanced  -  not too oily, not too dry' },
  { value: 'oily', label: 'Oily', description: 'Gets greasy quickly, especially at the roots' },
]

export const COLOR_TREATMENT_OPTIONS: { value: ColorTreatment; label: string }[] = [
  { value: 'virgin', label: 'Virgin (untreated)' },
  { value: 'color_treated', label: 'Color-treated' },
  { value: 'bleached', label: 'Bleached / Lightened' },
  { value: 'highlighted', label: 'Highlighted / Balayage' },
]

export const HEAT_TOOL_OPTIONS: { value: HeatToolUsage; label: string }[] = [
  { value: 'never', label: 'Never' },
  { value: 'occasionally', label: 'Occasionally (a few times/year)' },
  { value: 'frequently', label: 'Frequently (weekly+)' },
]

export const CGM_EXPERIENCE_OPTIONS: { value: CgmExperience; label: string; description: string }[] = [
  { value: 'just_starting', label: 'Just starting', description: 'Haven\'t done a CGM routine yet' },
  { value: 'under_1_year', label: 'Under 1 year', description: 'Still experimenting' },
  { value: '1_to_3_years', label: '1–3 years', description: 'Know what works for my hair' },
  { value: '3_plus_years', label: '3+ years', description: 'Experienced CGM practitioner' },
]

export const CLIMATE_OPTIONS: { value: Climate; label: string; description: string }[] = [
  { value: 'humid', label: 'Humid', description: 'Sticky summers, dew points >60°F' },
  { value: 'dry', label: 'Dry', description: 'Arid, low humidity' },
  { value: 'variable', label: 'Variable', description: 'Seasons change a lot' },
  { value: 'tropical', label: 'Tropical', description: 'Hot and humid year-round' },
]

export const WORKOUT_FREQUENCY_OPTIONS: { value: WorkoutFrequency; label: string }[] = [
  { value: 'rarely', label: 'Rarely' },
  { value: 'few_times_week', label: 'A few times/week' },
  { value: 'daily', label: 'Daily' },
]

export const FRAGRANCE_PREFERENCE_OPTIONS: { value: FragrancePreference; label: string }[] = [
  { value: 'love_it', label: 'Love it  -  bring on the scents' },
  { value: 'no_preference', label: 'No preference' },
  { value: 'fragrance_free', label: 'Prefer fragrance-free' },
]

export const WATER_TYPE_OPTIONS: { value: WaterType; label: string; description: string }[] = [
  { value: 'hard', label: 'Hard water', description: 'Leaves mineral buildup  -  you may need chelating shampoo' },
  { value: 'soft', label: 'Soft water', description: 'Low mineral content' },
  { value: 'unknown', label: 'Not sure', description: 'Check with your local water utility' },
]

// ---------------------------------------------------------------------------
// Custom brand support (Prose, Function of Beauty, etc.)
// ---------------------------------------------------------------------------

export interface CustomBrand {
  id: string
  name: string
  categories: string[]
  description: string
}

export const CUSTOM_BRANDS: CustomBrand[] = [
  { id: 'prose', name: 'Prose', categories: ['shampoo', 'conditioner', 'curl_cream', 'dry_shampoo', 'gel', 'leave_in', 'mask', 'oil', 'supplements'], description: 'Custom haircare based on a hair quiz' },
  { id: 'function_of_beauty', name: 'Function of Beauty', categories: ['shampoo', 'conditioner', 'leave_in', 'mask', 'serum'], description: 'Personalized shampoo & conditioner' },
  { id: 'custom_other', name: 'Other custom brand', categories: [], description: 'Another brand that customizes products for you' },
]

export interface HeroIngredient {
  id: string
  label: string
  benefit: string
  group: 'oils' | 'proteins' | 'humectants' | 'clays_powders' | 'botanicals'
  /** Aliases for matching against product ingredient lists */
  aliases: string[]
}

export const HERO_INGREDIENT_GROUPS: Record<string, string> = {
  oils: '🫒 Oils & Butters',
  proteins: '💪 Proteins & Amino Acids',
  humectants: '💧 Humectants & Moisturizers',
  clays_powders: '🧱 Clays & Powders',
  botanicals: '🌿 Botanicals & Extracts',
}

export const HERO_INGREDIENTS: HeroIngredient[] = [
  // ── Oils & Butters ──
  { id: 'pequi_oil', label: 'Pequi Oil', benefit: 'Wave definition & frizz control', group: 'oils', aliases: ['pequi', 'caryocar brasiliense'] },
  { id: 'argan_oil', label: 'Argan Oil', benefit: 'Shine & nourishment', group: 'oils', aliases: ['argan', 'argania spinosa'] },
  { id: 'jojoba_oil', label: 'Jojoba Oil', benefit: 'Mimics natural scalp oils', group: 'oils', aliases: ['jojoba', 'simmondsia chinensis'] },
  { id: 'coconut_oil', label: 'Coconut Oil', benefit: 'Deep moisture & softness', group: 'oils', aliases: ['coconut oil', 'cocos nucifera oil'] },
  { id: 'marula_oil', label: 'Marula Oil', benefit: 'Lightweight moisture & repair', group: 'oils', aliases: ['marula', 'sclerocarya birrea'] },
  { id: 'sunflower_oil', label: 'Sunflower Seed Oil', benefit: 'Antioxidant & conditioning', group: 'oils', aliases: ['sunflower', 'helianthus annuus'] },
  { id: 'broccoli_seed_oil', label: 'Broccoli Seed Oil', benefit: 'Natural silicone alternative', group: 'oils', aliases: ['broccoli seed', 'brassica oleracea italica'] },
  { id: 'castor_oil', label: 'Castor Oil', benefit: 'Sealing & thickness', group: 'oils', aliases: ['castor', 'ricinus communis'] },
  { id: 'avocado_oil', label: 'Avocado Oil', benefit: 'Penetrating moisture', group: 'oils', aliases: ['avocado', 'persea gratissima'] },
  { id: 'shea_butter', label: 'Shea Butter', benefit: 'Rich moisture & sealing', group: 'oils', aliases: ['shea', 'butyrospermum parkii'] },
  { id: 'mango_butter', label: 'Mango Butter', benefit: 'Softening & protective', group: 'oils', aliases: ['mango butter', 'mangifera indica'] },
  { id: 'murumuru_butter', label: 'Murumuru Butter', benefit: 'Shine & frizz taming', group: 'oils', aliases: ['murumuru', 'astrocaryum murumuru'] },
  { id: 'baobab_oil', label: 'Baobab Oil', benefit: 'Elasticity & moisture', group: 'oils', aliases: ['baobab', 'adansonia'] },

  // ── Proteins & Amino Acids ──
  { id: 'rice_protein', label: 'Rice Protein', benefit: 'Strengthens & thickens', group: 'proteins', aliases: ['rice protein', 'hydrolyzed rice', 'oryza sativa protein'] },
  { id: 'pea_protein', label: 'Pea Protein', benefit: 'Strengthens hair', group: 'proteins', aliases: ['pea protein', 'hydrolyzed pea', 'pisum sativum'] },
  { id: 'quinoa_protein', label: 'Quinoa Protein', benefit: 'Repairs & protects', group: 'proteins', aliases: ['quinoa', 'hydrolyzed quinoa'] },
  { id: 'keratin', label: 'Keratin', benefit: 'Structural repair', group: 'proteins', aliases: ['keratin', 'hydrolyzed keratin'] },
  { id: 'silk_amino_acids', label: 'Silk Amino Acids', benefit: 'Smoothing & shine', group: 'proteins', aliases: ['silk amino', 'hydrolyzed silk'] },
  { id: 'arginine', label: 'Arginine', benefit: 'Hair strength & vitality', group: 'proteins', aliases: ['arginine', 'l-arginine'] },
  { id: 'wheat_protein', label: 'Wheat Protein', benefit: 'Volume & strength', group: 'proteins', aliases: ['wheat protein', 'hydrolyzed wheat', 'triticum vulgare'] },

  // ── Humectants & Moisturizers ──
  { id: 'linseed', label: 'Linseed (Flaxseed) Extract', benefit: 'Curl definition & hold', group: 'humectants', aliases: ['linseed', 'flaxseed', 'linum usitatissimum'] },
  { id: 'aloe_vera', label: 'Aloe Vera', benefit: 'Hydration & soothing', group: 'humectants', aliases: ['aloe', 'aloe barbadensis', 'aloe vera'] },
  { id: 'glycerin', label: 'Glycerin', benefit: 'Draws in moisture', group: 'humectants', aliases: ['glycerin', 'vegetable glycerin'] },
  { id: 'honey', label: 'Honey', benefit: 'Natural humectant & shine', group: 'humectants', aliases: ['honey', 'mel'] },
  { id: 'acv', label: 'Apple Cider Vinegar', benefit: 'Shine & healthy cuticle', group: 'humectants', aliases: ['apple cider vinegar', 'pyrus malus'] },
  { id: 'panthenol', label: 'Panthenol (Vitamin B5)', benefit: 'Moisture & shine', group: 'humectants', aliases: ['panthenol', 'provitamin b5', 'pro-vitamin b5'] },
  { id: 'hyaluronic_acid', label: 'Hyaluronic Acid', benefit: 'Deep hydration', group: 'humectants', aliases: ['hyaluronic acid', 'sodium hyaluronate'] },

  // ── Clays & Powders ──
  { id: 'hectorite', label: 'Hectorite', benefit: 'Volume & oil control', group: 'clays_powders', aliases: ['hectorite'] },
  { id: 'kaolin_clay', label: 'Kaolin Clay', benefit: 'Gentle cleansing & absorbing', group: 'clays_powders', aliases: ['kaolin'] },
  { id: 'rice_starch', label: 'Rice Starch', benefit: 'Oil absorption & volume', group: 'clays_powders', aliases: ['rice starch', 'oryza sativa starch'] },
  { id: 'binchotan_charcoal', label: 'Binchotan Charcoal', benefit: 'Detoxify & absorb impurities', group: 'clays_powders', aliases: ['binchotan', 'charcoal'] },
  { id: 'corn_starch', label: 'Corn Starch', benefit: 'Oil absorption', group: 'clays_powders', aliases: ['corn starch', 'zea mays starch'] },
  { id: 'corn_maltodextrin', label: 'Corn Maltodextrin', benefit: 'Soft hold & anti-humidity', group: 'clays_powders', aliases: ['maltodextrin', 'corn maltodextrin'] },

  // ── Botanicals & Extracts ──
  { id: 'jujube_bark', label: 'Jujube Bark Extract', benefit: 'Scalp health & flake control', group: 'botanicals', aliases: ['jujube', 'ziziphus jujuba'] },
  { id: 'witch_hazel', label: 'Witch Hazel', benefit: 'Oil control & soothing', group: 'botanicals', aliases: ['witch hazel', 'hamamelis virginiana'] },
  { id: 'turmeric', label: 'Turmeric Extract', benefit: 'Scalp soothing & anti-inflammatory', group: 'botanicals', aliases: ['turmeric', 'curcuma longa'] },
  { id: 'horsetail', label: 'Horsetail Extract', benefit: 'Hair growth & thickness', group: 'botanicals', aliases: ['horsetail', 'equisetum arvense'] },
  { id: 'green_tea', label: 'Green Tea Extract', benefit: 'Antioxidant & scalp health', group: 'botanicals', aliases: ['green tea', 'camellia sinensis'] },
  { id: 'tea_tree', label: 'Tea Tree Oil', benefit: 'Scalp cleansing & clarifying', group: 'botanicals', aliases: ['tea tree', 'melaleuca alternifolia'] },
  { id: 'peppermint', label: 'Peppermint Oil', benefit: 'Scalp stimulation & freshness', group: 'botanicals', aliases: ['peppermint', 'mentha piperita'] },
  { id: 'rosemary', label: 'Rosemary Extract', benefit: 'Hair growth & circulation', group: 'botanicals', aliases: ['rosemary', 'rosmarinus officinalis'] },
]

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
