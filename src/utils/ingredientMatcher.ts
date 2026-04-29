// ---------------------------------------------------------------------------
// Ingredient-based product matching for the recommendation engine
// ---------------------------------------------------------------------------

export interface IngredientProfile {
  /** Ingredients appearing in 2+ loved products */
  commonIngredients: string[]
  /** Ingredients appearing in 2+ disliked products */
  avoidIngredients: string[]
}

export interface IngredientScore {
  score: number // 0-100
  matchedIngredients: string[] // which loved ingredients matched
}

// Filler ingredients that appear in almost every product — ignore for matching
const FILLER_INGREDIENTS = new Set([
  'water', 'aqua', 'eau',
  'phenoxyethanol',
  'fragrance', 'parfum',
  'citric acid',
  'sodium benzoate',
  'potassium sorbate',
  'disodium edta', 'tetrasodium edta', 'edta',
  'sodium chloride',
  'xanthan gum',
  'carbomer',
  'tocopherol',
  'sodium hydroxide',
])

// Sensitivity keyword → ingredient patterns to flag
const SENSITIVITY_MAP: Record<string, RegExp[]> = {
  coconut: [
    /\bcoconut\b/i, /\bcocos nucifera\b/i, /\bcoco-/i,
    /\bcocamidopropyl\b/i, /\bcocamide\b/i, /\bcaprylic/i,
    /\bcapric/i, /\bcocogluc/i,
  ],
  protein: [
    /\bhydrolyzed\b.*\bprotein\b/i, /\bkeratin\b/i,
    /\bsilk amino acid/i, /\bcollagen\b/i, /\bwheat protein\b/i,
    /\brice protein\b/i, /\bsoy protein\b/i, /\bquinoa protein\b/i,
    /\bamino acid/i,
  ],
  sulfate: [
    /\bsodium lauryl sulfate\b/i, /\bsodium laureth sulfate\b/i,
    /\bammonium lauryl sulfate\b/i, /\bammonium laureth sulfate\b/i,
  ],
  silicone: [
    /\bdimethicone\b/i, /\bcyclomethicone\b/i, /\bamodimethicone\b/i,
    /\bmethicone\b/i, /\bsiloxane\b/i,
  ],
  fragrance: [/\bfragrance\b/i, /\bparfum\b/i, /\blinalool\b/i, /\blimonene\b/i],
  alcohol: [/\balcohol denat\b/i, /\bsd alcohol\b/i, /\bisopropyl alcohol\b/i],
  gluten: [
    /\bwheat\b/i, /\bhydrolyzed wheat\b/i, /\btriticum vulgare\b/i,
    /\bavena sativa\b/i, /\bhordeum vulgare\b/i,
  ],
  aloe: [/\baloe\b/i, /\baloe barbadensis\b/i, /\baloe vera\b/i],
}

function normalize(ingredient: string): string {
  return ingredient.toLowerCase().trim()
}

function isFiller(normalized: string): boolean {
  return FILLER_INGREDIENTS.has(normalized)
}

/**
 * Build an ingredient profile from a user's loved and disliked products.
 * "Common" means appearing in 2+ products.
 */
export function buildIngredientProfile(
  lovedProducts: { ingredients: string[] }[],
  dislikedProducts: { ingredients: string[] }[],
): IngredientProfile {
  const lovedCounts = countIngredients(lovedProducts)
  const dislikedCounts = countIngredients(dislikedProducts)

  const commonIngredients = Object.entries(lovedCounts)
    .filter(([ing, count]) => count >= 2 && !isFiller(ing))
    .sort((a, b) => b[1] - a[1])
    .map(([ing]) => ing)

  const avoidIngredients = Object.entries(dislikedCounts)
    .filter(([ing, count]) => count >= 2 && !isFiller(ing))
    .map(([ing]) => ing)

  return { commonIngredients, avoidIngredients }
}

function countIngredients(
  products: { ingredients: string[] }[],
): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const product of products) {
    const seen = new Set<string>()
    for (const ing of product.ingredients) {
      const n = normalize(ing)
      if (!seen.has(n)) {
        counts[n] = (counts[n] || 0) + 1
        seen.add(n)
      }
    }
  }
  return counts
}

/**
 * Score a product 0–100 based on ingredient overlap with the user's profile.
 * - Ingredients in the first 5 positions get a position bonus (higher concentration)
 * - Matches with loved ingredients add points
 * - Matches with avoid ingredients subtract points
 */
export function scoreProductByIngredients(
  product: { ingredients: string[] },
  profile: IngredientProfile,
): IngredientScore {
  if (profile.commonIngredients.length === 0) {
    return { score: 0, matchedIngredients: [] }
  }

  const normalizedIngredients = product.ingredients.map(normalize)
  const commonSet = new Set(profile.commonIngredients)
  const avoidSet = new Set(profile.avoidIngredients)

  let rawScore = 0
  const matchedIngredients: string[] = []

  for (let i = 0; i < normalizedIngredients.length; i++) {
    const ing = normalizedIngredients[i]
    // Position weight: first 5 ingredients get a bonus
    const positionWeight = i < 5 ? 2 : 1

    if (commonSet.has(ing)) {
      rawScore += 10 * positionWeight
      matchedIngredients.push(ing)
    }

    if (avoidSet.has(ing)) {
      rawScore -= 5 * positionWeight
    }
  }

  // Normalize to 0-100
  // Max possible ≈ loved-ingredient count × 20 (all in top 5) — cap at 100
  const maxPossible = Math.max(profile.commonIngredients.length * 15, 1)
  const score = Math.max(0, Math.min(100, Math.round((rawScore / maxPossible) * 100)))

  return { score, matchedIngredients }
}

/**
 * Check whether a product contains ingredients that match any of the user's
 * stated sensitivities. Returns a list of flagged ingredient names.
 */
export function checkSensitivities(
  product: { ingredients: string[] },
  sensitivities: string[],
): string[] {
  if (!sensitivities.length) return []

  const flagged: string[] = []
  for (const ing of product.ingredients) {
    for (const sensitivity of sensitivities) {
      const patterns = SENSITIVITY_MAP[sensitivity.toLowerCase()]
      if (patterns) {
        if (patterns.some(p => p.test(ing))) {
          flagged.push(ing.trim())
          break
        }
      } else {
        // Fallback: direct substring match for unknown sensitivities
        if (normalize(ing).includes(sensitivity.toLowerCase())) {
          flagged.push(ing.trim())
          break
        }
      }
    }
  }
  return flagged
}

/**
 * Format matched ingredients for display (capitalize first letter).
 * Returns e.g. "Glycerin and Aloe vera"
 */
export function formatIngredientList(ingredients: string[], max = 3): string {
  const capped = ingredients.slice(0, max)
  const formatted = capped.map(i => i.charAt(0).toUpperCase() + i.slice(1))
  if (formatted.length === 1) return formatted[0]
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`
  const last = formatted.pop()!
  return `${formatted.join(', ')}, and ${last}`
}
