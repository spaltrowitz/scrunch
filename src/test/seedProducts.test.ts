import { describe, expect, it } from 'vitest'
import { SEED_PRODUCTS } from '../data/seedProducts'

describe('SEED_PRODUCTS', () => {
  it('includes the requested L\'oreal sulfate-free clarifying shampoo', () => {
    expect(SEED_PRODUCTS).toContainEqual(expect.objectContaining({
      brand: "L'oreal",
      name: 'Sulfate Free Clarifying Shampoo',
      category: 'clarifying_shampoo',
    }))
  })
})
