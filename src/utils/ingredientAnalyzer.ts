export interface IngredientResult {
  name: string
  status: 'approved' | 'caution' | 'not_approved'
  reason?: string
  category?: string
}

export interface IngredientAnalysis {
  ingredients: IngredientResult[]
  overallStatus: 'approved' | 'caution' | 'not_approved'
  summary: string
  humectants: string[]
  proteins: string[]
}

interface IngredientRule {
  pattern: RegExp
  reason: string
  category: string
  status: 'not_approved' | 'caution'
}

const NOT_APPROVED_RULES: IngredientRule[] = [
  // Silicones (non-water-soluble)
  { pattern: /\bdimethicone\b(?!.*(?:peg|ppg|bis-))/i, reason: 'Non-water-soluble silicone — causes buildup without sulfates', category: 'silicone', status: 'not_approved' },
  { pattern: /\bcyclomethicone\b/i, reason: 'Non-water-soluble silicone', category: 'silicone', status: 'not_approved' },
  { pattern: /\bamodimethicone\b(?!.*(?:peg|ppg))/i, reason: 'Non-water-soluble silicone (some consider it okay as it doesn\'t build up as much)', category: 'silicone', status: 'not_approved' },
  { pattern: /\btrimethylsilylamodimethicone\b/i, reason: 'Non-water-soluble silicone', category: 'silicone', status: 'not_approved' },
  { pattern: /\bcetyl dimethicone\b/i, reason: 'Non-water-soluble silicone', category: 'silicone', status: 'not_approved' },
  { pattern: /\bcetearyl methicone\b/i, reason: 'Non-water-soluble silicone', category: 'silicone', status: 'not_approved' },
  { pattern: /\bstearyl dimethicone\b/i, reason: 'Non-water-soluble silicone', category: 'silicone', status: 'not_approved' },
  { pattern: /\bdimethiconol\b/i, reason: 'Non-water-soluble silicone', category: 'silicone', status: 'not_approved' },
  { pattern: /\btrimethicone\b/i, reason: 'Non-water-soluble silicone', category: 'silicone', status: 'not_approved' },

  // Sulfates (harsh) — note: sodium coco-sulfate is intentionally excluded (it's gentle)
  { pattern: /\bsodium lauryl sulfate\b/i, reason: 'Harsh sulfate — strips natural oils', category: 'sulfate', status: 'not_approved' },
  { pattern: /\bsodium laureth sulfate\b/i, reason: 'Harsh sulfate — strips natural oils', category: 'sulfate', status: 'not_approved' },
  { pattern: /\bammonium lauryl sulfate\b/i, reason: 'Harsh sulfate', category: 'sulfate', status: 'not_approved' },
  { pattern: /\bammonium laureth sulfate\b/i, reason: 'Harsh sulfate', category: 'sulfate', status: 'not_approved' },
  { pattern: /\bsodium c14-16 olefin sulfonate\b/i, reason: 'Harsh sulfonate surfactant', category: 'sulfate', status: 'not_approved' },

  // Drying alcohols (expanded per CG guide)
  { pattern: /\bisopropyl alcohol\b/i, reason: 'Drying alcohol — strips moisture', category: 'drying_alcohol', status: 'not_approved' },
  { pattern: /\balcohol denat\b/i, reason: 'Drying/denatured alcohol', category: 'drying_alcohol', status: 'not_approved' },
  { pattern: /\bsd alcohol\b/i, reason: 'Drying alcohol', category: 'drying_alcohol', status: 'not_approved' },
  { pattern: /\bpropanol\b/i, reason: 'Drying alcohol', category: 'drying_alcohol', status: 'not_approved' },
  { pattern: /\bethanol\b(?!.*\bphenoxy)/i, reason: 'Drying alcohol', category: 'drying_alcohol', status: 'not_approved' },
  { pattern: /\bbenzyl alcohol\b/i, reason: 'Drying alcohol — can be irritating at high concentrations', category: 'drying_alcohol', status: 'not_approved' },

  // Waxes / Mineral oils
  { pattern: /\bmineral oil\b/i, reason: 'Can cause buildup, blocks moisture', category: 'wax', status: 'not_approved' },
  { pattern: /\bpetrolatum\b/i, reason: 'Petroleum-based — causes buildup', category: 'wax', status: 'not_approved' },
  { pattern: /\bparaffinum liquidum\b/i, reason: 'Mineral oil (INCI name) — causes buildup', category: 'wax', status: 'not_approved' },
]

const CAUTION_RULES: IngredientRule[] = [
  // Water-soluble silicones (some CGM followers avoid all silicones)
  { pattern: /\bpeg-.*dimethicone\b/i, reason: 'Water-soluble silicone — generally considered okay for CGM', category: 'silicone_ws', status: 'caution' },
  { pattern: /\bppg-.*dimethicone\b/i, reason: 'Water-soluble silicone', category: 'silicone_ws', status: 'caution' },
  { pattern: /\bbis-peg.*dimethicone\b/i, reason: 'Water-soluble silicone', category: 'silicone_ws', status: 'caution' },

  // Commonly confused — educate users
  { pattern: /\bbehentrimonium methosulfate\b/i, reason: 'NOT a sulfate — this is a gentle conditioning agent and is CG-approved', category: 'safe', status: 'caution' },

  // Gentle sulfate — okay for clarifying
  { pattern: /\bsodium coco[- ]?sulfate\b/i, reason: 'Gentle sulfate — milder than SLS. Acceptable for clarifying use', category: 'gentle_sulfate', status: 'caution' },
]

// Humectants — beneficial ingredients the guide highlights
const HUMECTANT_PATTERNS: RegExp[] = [
  /\bglycerin\b/i, /\bvegetable glycerin\b/i,
  /\bhoney\b/i,
  /\bsorbitol\b/i,
  /\baloe\b/i, /\baloe barbadensis\b/i, /\baloe vera\b/i,
  /\bpanthenol\b/i, /\bpro-vitamin b-?5\b/i,
  /\bhyaluronic acid\b/i,
  /\bpropylene glycol\b/i, /\bbutylene glycol\b/i,
  /\bfructose\b/i,
  /\bagave\b/i,
]

// Film-forming humectants — great for low dew points
const FILM_FORMING_PATTERNS: RegExp[] = [
  /\bflaxseed\b/i, /\blinum usitatissimum\b/i,
  /\bhydroxyethylcellulose\b/i,
  /\bxanthan gum\b/i,
  /\bmarshmallow root\b/i, /\balthaea officinalis\b/i,
  /\bslippery elm\b/i,
  /\bcarrageenan\b/i, /\birish (sea )?moss\b/i, /\bseaweed extract\b/i,
  /\bpectin\b/i,
  /\bokra\b/i,
]

// Protein patterns — for protein-moisture balance tracking
const PROTEIN_PATTERNS: { pattern: RegExp; type: string }[] = [
  { pattern: /\bhydrolyzed\b.*\bkeratin\b/i, type: 'keratin' },
  { pattern: /\bhydrolyzed\b.*\bsilk\b/i, type: 'silk' },
  { pattern: /\bhydrolyzed\b.*\bwheat\b/i, type: 'wheat' },
  { pattern: /\bhydrolyzed\b.*\brice\b/i, type: 'rice' },
  { pattern: /\bhydrolyzed\b.*\bsoy\b/i, type: 'soy' },
  { pattern: /\bhydrolyzed\b.*\bquinoa\b/i, type: 'quinoa' },
  { pattern: /\bhydrolyzed\b.*\bcollagen\b/i, type: 'collagen' },
  { pattern: /\bhydrolyzed\b.*\bcorn\b/i, type: 'corn' },
  { pattern: /\bhydrolyzed\b.*\boat\b/i, type: 'oat' },
  { pattern: /\bhydrolyzed\b.*\bprotein\b/i, type: 'protein' },
  { pattern: /\bkeratin\b/i, type: 'keratin' },
  { pattern: /\bsilk amino acid/i, type: 'silk' },
  { pattern: /\bcollagen\b/i, type: 'collagen' },
  { pattern: /\bamino acid/i, type: 'amino_acid' },
  { pattern: /\byeast extract\b/i, type: 'yeast' },
]

const ALL_RULES = [...NOT_APPROVED_RULES, ...CAUTION_RULES]

function parseIngredientList(raw: string): string[] {
  return raw
    .split(/,|\n/)
    .map(i => i.trim())
    .filter(i => i.length > 0)
}

function detectHumectants(ingredients: string[]): string[] {
  const allPatterns = [...HUMECTANT_PATTERNS, ...FILM_FORMING_PATTERNS]
  const found: string[] = []
  for (const ing of ingredients) {
    if (allPatterns.some(p => p.test(ing))) {
      found.push(ing.trim())
    }
  }
  return found
}

function detectProteins(ingredients: string[]): string[] {
  const found: string[] = []
  for (const ing of ingredients) {
    if (PROTEIN_PATTERNS.some(p => p.pattern.test(ing))) {
      found.push(ing.trim())
    }
  }
  return found
}

export function analyzeIngredients(raw: string): IngredientAnalysis {
  const parsed = parseIngredientList(raw)
  const results: IngredientResult[] = parsed.map(ingredient => {
    for (const rule of ALL_RULES) {
      if (rule.pattern.test(ingredient)) {
        return {
          name: ingredient,
          status: rule.status,
          reason: rule.reason,
          category: rule.category,
        }
      }
    }
    return { name: ingredient, status: 'approved' as const }
  })

  const hasNotApproved = results.some(r => r.status === 'not_approved')
  const hasCaution = results.some(r => r.status === 'caution')

  const overallStatus = hasNotApproved ? 'not_approved' : hasCaution ? 'caution' : 'approved'

  const badCount = results.filter(r => r.status === 'not_approved').length
  const cautionCount = results.filter(r => r.status === 'caution').length

  let summary: string
  if (overallStatus === 'approved') {
    summary = `All ${results.length} ingredients are CG-approved! ✨`
  } else if (overallStatus === 'caution') {
    summary = `${cautionCount} ingredient${cautionCount > 1 ? 's' : ''} flagged for caution, but no hard fails.`
  } else {
    summary = `${badCount} non-approved ingredient${badCount > 1 ? 's' : ''} found.${cautionCount > 0 ? ` Plus ${cautionCount} caution flag${cautionCount > 1 ? 's' : ''}.` : ''}`
  }

  const humectants = detectHumectants(parsed)
  const proteins = detectProteins(parsed)

  return { ingredients: results, overallStatus, summary, humectants, proteins }
}
