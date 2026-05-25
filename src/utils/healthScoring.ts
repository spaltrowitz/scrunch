import { HAZARD_DB, SEVERITY_DEDUCTIONS, type HazardCategory, type HazardSeverity } from './healthHazardDb'

export interface HealthFlag {
  ingredient: string
  hazardName: string
  category: HazardCategory
  severity: HazardSeverity
  concern: string
  source: string
  deduction: number
}

export interface HealthScoreResult {
  score: number
  grade: 'excellent' | 'good' | 'fair' | 'poor'
  flags: HealthFlag[]
  summary: string
}

/**
 * Compute a health/safety score for a product based on its ingredient list.
 * Returns a 0-100 score where 100 = no known hazards found.
 */
export function computeHealthScore(ingredients: string[]): HealthScoreResult {
  const flags: HealthFlag[] = []
  const matched = new Set<string>()

  for (const ingredient of ingredients) {
    const normalized = ingredient.trim()
    if (!normalized) continue

    for (const hazard of HAZARD_DB) {
      // Skip if we already matched this hazard (avoid double-counting)
      if (matched.has(hazard.name)) continue

      const isMatch = hazard.aliases.some(pattern => pattern.test(normalized))
      if (isMatch) {
        matched.add(hazard.name)
        flags.push({
          ingredient: normalized,
          hazardName: hazard.name,
          category: hazard.category,
          severity: hazard.severity,
          concern: hazard.concern,
          source: hazard.source,
          deduction: SEVERITY_DEDUCTIONS[hazard.severity],
        })
      }
    }
  }

  const totalDeduction = flags.reduce((sum, f) => sum + f.deduction, 0)
  const score = Math.max(0, Math.min(100, 100 - totalDeduction))

  const grade = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor'

  const highCount = flags.filter(f => f.severity === 'high').length
  const modCount = flags.filter(f => f.severity === 'moderate').length

  let summary: string
  if (flags.length === 0) {
    summary = 'No known health concerns detected ✨'
  } else if (highCount > 0) {
    summary = `${highCount} high-concern ingredient${highCount > 1 ? 's' : ''} found${modCount > 0 ? ` + ${modCount} moderate` : ''}`
  } else if (modCount > 0) {
    summary = `${modCount} moderate concern${modCount > 1 ? 's' : ''} found — no high-severity issues`
  } else {
    summary = `${flags.length} low-level concern${flags.length > 1 ? 's' : ''} — generally considered safe`
  }

  return { score, grade, flags, summary }
}

export type CompositeGrade = 'excellent' | 'good' | 'fair' | 'poor'

export interface CompositeScoreResult {
  /** CG compliance score (0-100) — the original Scrunch Score, unchanged */
  scrunchScore: number
  scrunchGrade: 'excellent' | 'good' | 'fair' | 'poor'
  scrunchReasons: string[]
  /** Health safety score (0-100), null if no ingredients available */
  healthScore: number | null
  healthGrade: 'excellent' | 'good' | 'fair' | 'poor' | null
  healthFlags: HealthFlag[]
  healthSummary: string | null
}

/**
 * Compute both scores independently: Scrunch Score (CG compliance) and
 * Health Score (ingredient safety). They are displayed side-by-side, not blended.
 */
export function computeScores(product: {
  cg_status: 'approved' | 'not_approved' | 'caution'
  cruelty_free: 'yes' | 'no' | 'unclear' | null
  notes: string | null
  category: string
  ingredients?: string[] | null
}): CompositeScoreResult {
  const cgResult = computeCgSubScore(product)

  let healthResult: HealthScoreResult | null = null
  if (product.ingredients && product.ingredients.length > 0) {
    healthResult = computeHealthScore(product.ingredients)
  }

  return {
    scrunchScore: cgResult.score,
    scrunchGrade: cgResult.grade,
    scrunchReasons: cgResult.reasons,
    healthScore: healthResult?.score ?? null,
    healthGrade: healthResult?.grade ?? null,
    healthFlags: healthResult?.flags ?? [],
    healthSummary: healthResult?.summary ?? null,
  }
}

/** CG sub-score computation (mirrors existing computeScrunchScore logic) */
function computeCgSubScore(product: {
  cg_status: 'approved' | 'not_approved' | 'caution'
  cruelty_free: 'yes' | 'no' | 'unclear' | null
  notes: string | null
  category: string
}): { score: number; grade: 'excellent' | 'good' | 'fair' | 'poor'; reasons: string[] } {
  let score = 100
  const reasons: string[] = []

  if (product.cg_status === 'not_approved') { score -= 40; reasons.push('Not CG-approved (−40)') }
  else if (product.cg_status === 'caution') { score -= 15; reasons.push('CG caution (−15)') }
  else { reasons.push('CG-approved ✓') }

  const n = (product.notes || '').toLowerCase()
  if (n.includes('drying alcohol')) { score -= 15; reasons.push('Contains drying alcohol (−15)') }
  if (n.includes('silicone')) { score -= 20; reasons.push('Contains silicone (−20)') }
  if (n.includes('sulfate') && product.category !== 'clarifying_shampoo') { score -= 20; reasons.push('Contains sulfate (−20)') }
  if (n.includes('mineral oil')) { score -= 15; reasons.push('Contains mineral oil (−15)') }
  if (n.includes('wax')) { score -= 10; reasons.push('Contains wax (−10)') }

  if (product.cruelty_free === 'yes') { score += 5; reasons.push('Cruelty-free (+5)') }
  if (n.includes('fragrance-free') || n.includes('fragrance free')) { score += 3; reasons.push('Fragrance-free (+3)') }
  if (n.includes('sample sizes')) { score += 2; reasons.push('Sample sizes available (+2)') }

  score = Math.max(0, Math.min(100, score))
  const grade = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor'
  return { score, grade, reasons }
}
