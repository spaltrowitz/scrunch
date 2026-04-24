import { useState } from 'react'
import { PRODUCT_CATEGORY_LABELS } from '../../lib/constants'
import type { ProductCategory } from '../../lib/database.types'

interface ProductRequest {
  brand: string
  name: string
  category: ProductCategory | ''
  link: string
}

export function RequestProductForm({ onClose }: { onClose: () => void }) {
  const [request, setRequest] = useState<ProductRequest>({ brand: '', name: '', category: '', link: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Create GitHub Issue with product-request label → triggers Copilot auto-add workflow
    const issueBody = [
      `### Brand\n${request.brand}`,
      `### Product Name\n${request.name}`,
      `### Category\n${request.category || 'Not specified'}`,
      request.link ? `### Product Link\n${request.link}` : '',
      `---`,
      `*Submitted via Scrunch app on ${new Date().toISOString()}*`,
    ].filter(Boolean).join('\n\n')

    const params = new URLSearchParams({
      title: `[Product Request] ${request.brand} — ${request.name}`,
      body: issueBody,
      labels: 'product-request,from-app',
    })
    window.open(`https://github.com/spaltrowitz/scrunch/issues/new?${params}`, '_blank')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
        <div className="text-3xl mb-3">🎉</div>
        <h3 className="font-semibold text-gray-900 mb-1">Request submitted!</h3>
        <p className="text-sm text-gray-500 mb-4">
          A GitHub issue has been created for <strong>{request.brand} {request.name}</strong>.
          Copilot will automatically look up the product details, find an image, run ingredient analysis, and create a PR to add it.
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
        <button
          type="submit"
          disabled={!request.brand.trim() || !request.name.trim()}
          className="w-full py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
        >
          Submit Request
        </button>
      </form>
    </div>
  )
}
