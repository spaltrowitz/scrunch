export interface IngredientResult {
  name: string
  status: 'approved' | 'caution' | 'not_approved'
  reason?: string
  category?: string
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

  // Sulfates (harsh)
  { pattern: /\bsodium lauryl sulfate\b/i, reason: 'Harsh sulfate — strips natural oils', category: 'sulfate', status: 'not_approved' },
  { pattern: /\bsodium laureth sulfate\b/i, reason: 'Harsh sulfate — strips natural oils', category: 'sulfate', status: 'not_approved' },
  { pattern: /\bammonium lauryl sulfate\b/i, reason: 'Harsh sulfate', category: 'sulfate', status: 'not_approved' },
  { pattern: /\bammonium laureth sulfate\b/i, reason: 'Harsh sulfate', category: 'sulfate', status: 'not_approved' },
  { pattern: /\bsodium c14-16 olefin sulfonate\b/i, reason: 'Harsh sulfonate surfactant', category: 'sulfate', status: 'not_approved' },

  // Drying alcohols
  { pattern: /\bisopropyl alcohol\b/i, reason: 'Drying alcohol — strips moisture', category: 'drying_alcohol', status: 'not_approved' },
  { pattern: /\balcohol denat\b/i, reason: 'Drying/denatured alcohol', category: 'drying_alcohol', status: 'not_approved' },
  { pattern: /\bsd alcohol\b/i, reason: 'Drying alcohol', category: 'drying_alcohol', status: 'not_approved' },
  { pattern: /\bpropanol\b/i, reason: 'Drying alcohol', category: 'drying_alcohol', status: 'not_approved' },

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

  // Commonly confused
  { pattern: /\bbehentrimonium methosulfate\b/i, reason: 'NOT a sulfate — this is a gentle conditioning agent and is CG-approved', category: 'safe', status: 'caution' },
]

const ALL_RULES = [...NOT_APPROVED_RULES, ...CAUTION_RULES]

function parseIngredientList(raw: string): string[] {
  return raw
    .split(/,|\n/)
    .map(i => i.trim())
    .filter(i => i.length > 0)
}

export function analyzeIngredients(raw: string): {
  ingredients: IngredientResult[]
  overallStatus: 'approved' | 'caution' | 'not_approved'
  summary: string
} {
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

  return { ingredients: results, overallStatus, summary }
}
