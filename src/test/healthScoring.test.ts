import { describe, it, expect } from 'vitest'
import { computeHealthScore, computeScores } from '../utils/healthScoring'

describe('computeHealthScore', () => {
  it('returns 100 for clean ingredients', () => {
    const result = computeHealthScore(['Water', 'Glycerin', 'Cetearyl Alcohol', 'Shea Butter'])
    expect(result.score).toBe(100)
    expect(result.grade).toBe('excellent')
    expect(result.flags).toHaveLength(0)
  })

  it('flags formaldehyde releasers as high severity', () => {
    const result = computeHealthScore(['Water', 'DMDM Hydantoin', 'Glycerin'])
    expect(result.flags).toHaveLength(1)
    expect(result.flags[0].category).toBe('carcinogen')
    expect(result.flags[0].severity).toBe('high')
    // Only 3 ingredients — position weighting disabled for short lists
    expect(result.score).toBe(85) // 100 - 15
  })

  it('flags parabens as endocrine disruptors', () => {
    const result = computeHealthScore(['Water', 'Methylparaben', 'Propylparaben'])
    expect(result.flags).toHaveLength(2)
    expect(result.flags.every(f => f.category === 'endocrine_disruptor')).toBe(true)
    expect(result.score).toBe(84) // 100 - 8 - 8
  })

  it('flags butylparaben as high severity', () => {
    const result = computeHealthScore(['Water', 'Butylparaben'])
    expect(result.flags[0].severity).toBe('high')
    expect(result.score).toBe(85)
  })

  it('flags fragrance/parfum as moderate allergen', () => {
    const result = computeHealthScore(['Water', 'Fragrance', 'Glycerin'])
    expect(result.flags).toHaveLength(1)
    expect(result.flags[0].category).toBe('allergen')
    expect(result.flags[0].severity).toBe('moderate')
    expect(result.score).toBe(92) // 100 - 8
  })

  it('flags multiple concerns and accumulates deductions', () => {
    const result = computeHealthScore([
      'Water', 'DMDM Hydantoin', 'Butylparaben', 'Fragrance', 'Triclosan',
    ])
    expect(result.flags.length).toBeGreaterThanOrEqual(4)
    // 100 - 15 (DMDM) - 15 (butylparaben) - 8 (fragrance) - 15 (triclosan) = 47
    expect(result.score).toBe(47)
    expect(result.grade).toBe('fair')
  })

  it('clamps score to 0 minimum', () => {
    const result = computeHealthScore([
      'DMDM Hydantoin', 'Quaternium-15', 'Imidazolidinyl Urea',
      'Diazolidinyl Urea', 'Coal Tar', 'Triclosan', 'BHA', 'Toluene',
    ])
    expect(result.score).toBe(0)
    expect(result.grade).toBe('poor')
  })

  it('does not double-count the same hazard ingredient', () => {
    const result = computeHealthScore(['DMDM Hydantoin', 'DMDM hydantoin'])
    expect(result.flags).toHaveLength(1)
  })

  it('amplifies deduction for hazards listed early in long ingredient lists', () => {
    const longList = [
      'DMDM Hydantoin', 'Water', 'Glycerin', 'Cetearyl Alcohol',
      'Stearamidopropyl Dimethylamine', 'Isopropyl Alcohol', 'Panthenol',
      'Tocopherol', 'Aloe Barbadensis', 'Citric Acid',
      'Sodium Benzoate', 'Potassium Sorbate',
    ]
    const result = computeHealthScore(longList)
    const dmdmFlag = result.flags.find(f => f.hazardName === 'DMDM Hydantoin')
    expect(dmdmFlag).toBeDefined()
    // Position 0 in 12-item list → multiplier 1.5x → 15 * 1.5 = 23
    expect(dmdmFlag!.positionMultiplier).toBe(1.5)
    expect(dmdmFlag!.deduction).toBe(23)
  })

  it('reduces deduction for hazards listed late in long ingredient lists', () => {
    const longList = Array(25).fill('Water')
    longList[22] = 'Methylparaben' // position 22 → multiplier 0.6
    const result = computeHealthScore(longList)
    const flag = result.flags.find(f => f.hazardName === 'Methylparaben')
    expect(flag).toBeDefined()
    expect(flag!.positionMultiplier).toBe(0.6)
    expect(flag!.deduction).toBe(5) // 8 * 0.6 = 4.8 → rounded to 5
  })

  it('uses 1.0 multiplier for short ingredient lists regardless of position', () => {
    const shortList = ['DMDM Hydantoin', 'Water', 'Glycerin']
    const result = computeHealthScore(shortList)
    const flag = result.flags[0]
    expect(flag.positionMultiplier).toBe(1.0)
    expect(flag.deduction).toBe(15)
  })

  it('detects low-severity fragrance allergens', () => {
    const result = computeHealthScore(['Water', 'Linalool', 'Limonene', 'Geraniol'])
    expect(result.flags).toHaveLength(3)
    expect(result.flags.every(f => f.severity === 'low')).toBe(true)
    expect(result.score).toBe(91) // 100 - 3 - 3 - 3
  })
})

describe('computeScores', () => {
  it('returns only Scrunch Score when no ingredients provided', () => {
    const result = computeScores({
      cg_status: 'approved',
      cruelty_free: 'yes',
      notes: 'Fragrance-free',
      category: 'gel',
    })
    expect(result.scrunchScore).toBe(100)
    expect(result.healthScore).toBeNull()
  })

  it('returns both scores independently when ingredients available', () => {
    const result = computeScores({
      cg_status: 'approved',
      cruelty_free: 'yes',
      notes: 'Fragrance-free',
      category: 'gel',
      ingredients: ['Water', 'Glycerin', 'DMDM Hydantoin'],
    })
    // Scrunch Score unchanged
    expect(result.scrunchScore).toBe(100)
    expect(result.scrunchGrade).toBe('excellent')
    // Health Score separate
    expect(result.healthScore).toBe(85)
    expect(result.healthGrade).toBe('excellent')
  })

  it('health score does not affect scrunch score', () => {
    const result = computeScores({
      cg_status: 'approved',
      cruelty_free: null,
      notes: null,
      category: 'gel',
      ingredients: ['DMDM Hydantoin', 'Butylparaben', 'Triclosan', 'Coal Tar'],
    })
    // Scrunch Score should still be 100 (all CG-approved ingredients from CG perspective)
    expect(result.scrunchScore).toBe(100)
    // Health Score should be terrible
    expect(result.healthScore).toBeLessThan(50)
    expect(result.healthGrade).toBe('poor')
  })
})
