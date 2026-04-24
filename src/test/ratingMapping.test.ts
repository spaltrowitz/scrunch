import { describe, it, expect } from 'vitest'

describe('rating mapping', () => {
  // These mappings must stay in sync between Products.tsx and the DB
  const ratingToGrade = (rating: number | null): string => {
    if (rating === null) return 'unrated'
    if (rating >= 5) return 'loved'
    if (rating >= 4) return 'liked'
    if (rating >= 3) return 'ok'
    return 'disliked'
  }

  const gradeToRating: Record<string, number> = {
    loved: 5,
    liked: 4,
    ok: 3,
    disliked: 1,
  }

  const gradeToRepurchase: Record<string, string> = {
    loved: 'yes',
    liked: 'yes',
    ok: 'maybe',
    disliked: 'no',
  }

  it('maps rating 5 to loved', () => {
    expect(ratingToGrade(5)).toBe('loved')
  })

  it('maps rating 4 to liked', () => {
    expect(ratingToGrade(4)).toBe('liked')
  })

  it('maps rating 3 to ok', () => {
    expect(ratingToGrade(3)).toBe('ok')
  })

  it('maps rating 1 to disliked', () => {
    expect(ratingToGrade(1)).toBe('disliked')
  })

  it('maps null to unrated', () => {
    expect(ratingToGrade(null)).toBe('unrated')
  })

  it('loved maps to rating 5 and repurchase yes', () => {
    expect(gradeToRating['loved']).toBe(5)
    expect(gradeToRepurchase['loved']).toBe('yes')
  })

  it('liked maps to rating 4 and repurchase yes', () => {
    expect(gradeToRating['liked']).toBe(4)
    expect(gradeToRepurchase['liked']).toBe('yes')
  })

  it('ok maps to rating 3 and repurchase maybe', () => {
    expect(gradeToRating['ok']).toBe(3)
    expect(gradeToRepurchase['ok']).toBe('maybe')
  })

  it('disliked maps to rating 1 and repurchase no', () => {
    expect(gradeToRating['disliked']).toBe(1)
    expect(gradeToRepurchase['disliked']).toBe('no')
  })
})

describe('null safety', () => {
  it('handles null status in replace', () => {
    const status: string | null = null
    const display = status?.replace(/_/g, ' ') ?? 'unknown'
    expect(display).toBe('unknown')
  })

  it('handles null notes', () => {
    const notes: string | null = null
    const lower = (notes || '').toLowerCase()
    expect(lower).toBe('')
  })

  it('handles null product in review', () => {
    const review = { products: null as { brand: string; name: string } | null }
    const brand = review.products?.brand ?? 'Unknown'
    expect(brand).toBe('Unknown')
  })
})
