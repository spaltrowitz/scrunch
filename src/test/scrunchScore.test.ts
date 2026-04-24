import { describe, it, expect } from 'vitest'
import { computeScrunchScore } from '../data/seedProducts'

describe('computeScrunchScore', () => {
  it('gives 100+ for clean CG-approved cruelty-free product', () => {
    const { score, grade } = computeScrunchScore({
      cg_status: 'approved',
      cruelty_free: 'yes',
      notes: 'Fragrance-free',
      category: 'gel',
    })
    expect(score).toBe(100) // capped at 100
    expect(grade).toBe('excellent')
  })

  it('penalizes not_approved heavily', () => {
    const { score } = computeScrunchScore({
      cg_status: 'not_approved',
      cruelty_free: null,
      notes: null,
      category: 'gel',
    })
    expect(score).toBe(60) // 100 - 40
  })

  it('penalizes silicone', () => {
    const { score } = computeScrunchScore({
      cg_status: 'not_approved',
      cruelty_free: null,
      notes: 'Contains silicone',
      category: 'gel',
    })
    expect(score).toBe(40) // 100 - 40 - 20
  })

  it('does not penalize sulfate in clarifying shampoo', () => {
    const { score } = computeScrunchScore({
      cg_status: 'not_approved',
      cruelty_free: null,
      notes: 'Contains sulfate',
      category: 'clarifying_shampoo',
    })
    expect(score).toBe(60) // only -40 for not_approved, no sulfate penalty
  })

  it('penalizes sulfate in non-clarifying products', () => {
    const { score } = computeScrunchScore({
      cg_status: 'not_approved',
      cruelty_free: null,
      notes: 'Contains sulfate',
      category: 'low_poo',
    })
    expect(score).toBe(40) // -40 not_approved + -20 sulfate
  })

  it('gives reasons for each factor', () => {
    const { reasons } = computeScrunchScore({
      cg_status: 'approved',
      cruelty_free: 'yes',
      notes: 'Fragrance-free. Contains drying alcohol',
      category: 'gel',
    })
    expect(reasons).toContain('CG-approved ✓')
    expect(reasons).toContain('Cruelty-free (+5)')
    expect(reasons).toContain('Fragrance-free (+3)')
    expect(reasons).toContain('Contains drying alcohol (−15)')
  })

  it('clamps score to 0 minimum', () => {
    const { score } = computeScrunchScore({
      cg_status: 'not_approved',
      cruelty_free: null,
      notes: 'Contains silicone, sulfate, drying alcohol, mineral oil, wax',
      category: 'gel',
    })
    expect(score).toBeGreaterThanOrEqual(0)
  })
})
