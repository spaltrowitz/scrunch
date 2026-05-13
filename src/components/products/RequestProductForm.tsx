import { useState } from 'react'
import { PRODUCT_CATEGORY_LABELS } from '../../lib/constants'
import type { ProductCategory } from '../../lib/database.types'
import { supabase } from '../../lib/supabase'

interface ProductRequest {
  brand: string
  name: string
  category: ProductCategory | ''
  link: string
}

// Basic client-side validation for hair care product submissions
function validateProductRequest(request: ProductRequest): string | null {
  const brand = request.brand.trim()
  const name = request.name.trim()

  if (brand.length < 2 || brand.length > 100) return 'Brand name must be between 2 and 100 characters.'
  if (name.length < 2 || name.length > 200) return 'Product name must be between 2 and 200 characters.'

  const repeatedChars = /(.)\1{9,}/
  if (repeatedChars.test(brand) || repeatedChars.test(name)) return 'Brand or product name contains invalid repeated characters.'

  const suspicious = /^(test|asdf|qwerty|lorem|ipsum|foo|bar|baz|xxx|aaa)$/i
  if (suspicious.test(brand) || suspicious.test(name)) return 'Please enter a real brand and product name.'

  return null
}

export function RequestProductForm({ onClose }: { onClose: () => void }) {
  const [request, setRequest] = useState<ProductRequest>({ brand: '', name: '', category: '', link: '' })
  const [confirmed, setConfirmed] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = validateProductRequest(request)
    if (error) {
      setValidationError(error)
      return
    }
    setValidationError(null)
    setSubmitError(null)
    setSubmitting(true)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('submit-feedback', {
        body: {
          type: 'product-request',
          brand: request.brand.trim(),
          name: request.name.trim(),
          category: request.category || '',
          link: request.link.trim(),
        },
      })
      if (fnError) throw fnError
      if (!data?.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch (err) {
      console.error('Product request failed:', err)
      setSubmitError("Couldn't send right now. Please try again in a moment.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
        <div className="text-3xl mb-3">🎉</div>
        <h3 className="font-semibold text-gray-900 mb-1">Request submitted!</h3>
        <p className="text-sm text-gray-500 mb-4">
          Thanks! <strong>{request.brand} {request.name}</strong> has been queued up.
          The product details, image, and ingredient analysis are looked up automatically — it'll show up in the database within a day or two.
        </p>
        <button onClick={onClose} className="text-sm text-violet-600 hover:underline cursor-pointer">
          Close
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-xl border border-violet-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Request a Missing Product</h3>
          <p className="text-xs text-gray-500">Can't find what you're looking for? Let us know!</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Brand *</label>
            <input
              type="text"
              required
              value={request.brand}
              onChange={(e) => setRequest(r => ({ ...r, brand: e.target.value }))}
              placeholder="e.g., SheaMoisture"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={request.name}
              onChange={(e) => setRequest(r => ({ ...r, name: e.target.value }))}
              placeholder="e.g., Curl Smoothie"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Category</label>
          <select
            value={request.category}
            onChange={(e) => setRequest(r => ({ ...r, category: e.target.value as ProductCategory | '' }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="">Select a category (optional)</option>
            {Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Product link (optional)</label>
          <input
            type="url"
            value={request.link}
            onChange={(e) => setRequest(r => ({ ...r, link: e.target.value }))}
            placeholder="https://target.com/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 accent-violet-600"
          />
          <span>I confirm this is a <strong>hair care product</strong> for curly or wavy hair (shampoo, conditioner, gel, cream, oil, treatment, etc.)</span>
        </label>
        {validationError && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{validationError}</p>
        )}
        {submitError && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={!request.brand.trim() || !request.name.trim() || !confirmed || submitting}
          className="w-full py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? 'Submitting…' : 'Submit Request'}
        </button>
      </form>
    </div>
  )
}
