import { useState } from 'react'
import { PRODUCT_CATEGORY_LABELS } from '../../lib/constants'
import type { ProductCategory } from '../../lib/database.types'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'

interface ProductRequest {
  brand: string
  name: string
  category: ProductCategory | ''
  link: string
  email: string
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
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = validateProductRequest(request)
    if (error) {
      setValidationError(error)
      return
    }
    setValidationError(null)

    // Create GitHub Issue with product-request label → triggers Copilot auto-add workflow
    const issueBody = [
      `### Brand\n${request.brand}`,
      `### Product Name\n${request.name}`,
      `### Category\n${request.category || 'Not specified'}`,
      request.link ? `### Product Link\n${request.link}` : '',
      `---`,
      `*Submitted via Scrunch app on ${new Date().toISOString()}*`,
    ].filter(Boolean).join('\n\n')

    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-product-issue', {
        body: {
          brand: request.brand.trim(),
          name: request.name.trim(),
          category: request.category || undefined,
          link: request.link.trim() || undefined,
          email: request.email.trim() || undefined,
        },
      })

      if (fnError) throw new Error(fnError.message || 'Failed to submit request')
      if (data?.error) throw new Error(data.error)

      // Track the request in the DB so we can surface it in "For You" later
      if (user) {
        await supabase.from('product_requests').insert({
          brand: request.brand.trim(),
          name: request.name.trim(),
          category: request.category || null,
          link: request.link.trim() || null,
          requested_by: user.id,
        }).then(() => {})  // fire-and-forget; don't block UX
      }

      setSubmittedProduct({ brand: request.brand.trim(), name: request.name.trim() })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddAnother = () => {
    setSubmittedProduct(null)
    setRequest(EMPTY_REQUEST)
    setError(null)
  }

  if (submittedProduct) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
        <div className="text-3xl mb-3">🎉</div>
        <h3 className="font-semibold text-gray-900 mb-1">Request submitted!</h3>
        <p className="text-sm text-gray-500 mb-4">
          <strong>{submittedProduct.brand} {submittedProduct.name}</strong> has been submitted.
          Copilot will automatically look up the product details, find an image, run ingredient analysis, and add it to the database.
          {request.email && ' We'll email you when it's live!'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleAddAnother}
            className="text-sm bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 cursor-pointer"
          >
            Add Another Product
          </button>
          <button onClick={onClose} className="text-sm text-gray-500 hover:underline cursor-pointer">
            Close
          </button>
        </div>
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

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

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
        <button
          type="submit"
          disabled={!request.brand.trim() || !request.name.trim() || !confirmed}
          className="w-full py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  )
}
