import { describe, it, expect } from 'vitest'
import { analyzeIngredients } from '../utils/ingredientAnalyzer'

describe('ingredientAnalyzer', () => {
  it('marks dimethicone as not approved', () => {
    const result = analyzeIngredients('Water, Dimethicone, Glycerin')
    expect(result.overallStatus).toBe('not_approved')
    expect(result.ingredients.find(i => i.name.toLowerCase().includes('dimethicone'))?.status).toBe('not_approved')
  })

  it('marks all-clean ingredients as approved', () => {
    const result = analyzeIngredients('Water, Glycerin, Aloe Vera, Coconut Oil')
    expect(result.overallStatus).toBe('approved')
    expect(result.ingredients.every(i => i.status === 'approved')).toBe(true)
  })

  it('flags sodium lauryl sulfate', () => {
    const result = analyzeIngredients('Water, Sodium Lauryl Sulfate')
    expect(result.overallStatus).toBe('not_approved')
    expect(result.ingredients[1].category).toBe('sulfate')
  })

  it('flags drying alcohols', () => {
    const result = analyzeIngredients('Water, Isopropyl Alcohol')
    expect(result.overallStatus).toBe('not_approved')
  })

  it('marks behentrimonium methosulfate as caution not bad', () => {
    const result = analyzeIngredients('Water, Behentrimonium Methosulfate')
    expect(result.overallStatus).toBe('caution')
    expect(result.ingredients[1].status).toBe('caution')
  })

  it('handles empty input', () => {
    const result = analyzeIngredients('')
    expect(result.ingredients).toHaveLength(0)
    expect(result.overallStatus).toBe('approved')
  })

  it('handles commas and newlines', () => {
    const result = analyzeIngredients('Water\nGlycerin, Aloe Vera')
    expect(result.ingredients).toHaveLength(3)
  })
})
