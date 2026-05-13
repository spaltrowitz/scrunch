import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth.utils'
import { PRODUCT_CATEGORY_LABELS } from '../../lib/constants'
import type { ProductCategory } from '../../lib/database.types'

export interface RoutineStep {
  order: number
  category: ProductCategory | ''
  brand: string
  product: string
  notes: string
}

interface RoutineFormData {
  name: string
  routineType: 'wash_day' | 'refresh' | 'deep_treatment' | 'custom'
  steps: RoutineStep[]
  stylingMethod: string
  dryingMethod: string
  sleepProtection: string
  refreshNotes: string
  isPublic: boolean
}

const ROUTINE_TYPES = [
  { value: 'wash_day', label: '🚿 Wash Day' },
  { value: 'refresh', label: '🔄 Refresh Day' },
  { value: 'deep_treatment', label: '🧖‍♀️ Deep Treatment' },
  { value: 'custom', label: '✨ Custom' },
] as const

const DRYING_METHODS = [
  'Diffuse',
  'Air dry',
  'Microfiber towel + air dry',
  'Plopping + air dry',
  'Plopping + diffuse',
  'Hover diffuse',
  'Other',
] as const

const EMPTY_STEP: RoutineStep = { order: 0, category: '', brand: '', product: '', notes: '' }

export function ShareRoutineForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { user } = useAuth()
  const [form, setForm] = useState<RoutineFormData>({
    name: '',
    routineType: 'wash_day',
    steps: [
      { ...EMPTY_STEP, order: 1 },
      { ...EMPTY_STEP, order: 2 },
      { ...EMPTY_STEP, order: 3 },
    ],
    stylingMethod: '',
    dryingMethod: '',
    sleepProtection: '',
    refreshNotes: '',
    isPublic: true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addStep = () => {
    setForm(f => ({
      ...f,
      steps: [...f.steps, { ...EMPTY_STEP, order: f.steps.length + 1 }],
    }))
  }

  const removeStep = (index: number) => {
    if (form.steps.length <= 1) return
    setForm(f => ({
      ...f,
      steps: f.steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 })),
    }))
  }

  const updateStep = (index: number, field: keyof RoutineStep, value: string) => {
    setForm(f => ({
      ...f,
      steps: f.steps.map((s, i) => i === index ? { ...s, [field]: value } : s),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const filledSteps = form.steps.filter(s => s.brand.trim() && s.product.trim())
    if (filledSteps.length === 0) {
      setError('Please add at least one product to your routine.')
      return
    }
    if (!form.name.trim()) {
      setError('Please give your routine a name.')
      return
    }

    setError(null)
    setSubmitting(true)

    try {
      const stepsPayload = filledSteps.map(s => ({
        order: s.order,
        category: s.category || null,
        brand: s.brand.trim(),
        product: s.product.trim(),
        notes: s.notes.trim() || null,
      }))

      const { error: dbError } = await supabase.from('routines').insert({
        user_id: user.id,
        name: form.name.trim(),
        routine_type: form.routineType,
        steps: JSON.stringify({
          products: stepsPayload,
          styling_method: form.stylingMethod.trim() || null,
          drying_method: form.dryingMethod || null,
          sleep_protection: form.sleepProtection.trim() || null,
          refresh_notes: form.refreshNotes.trim() || null,
        }),
        is_public: form.isPublic,
      })

      if (dbError) throw dbError
      onSuccess()
    } catch (err) {
      console.error('Routine submission failed:', err)
      setError('Could not save your routine. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-xl border border-violet-200 shadow-sm text-center">
        <p className="text-sm text-gray-600 mb-3">Sign in to share your routine with the community!</p>
        <a href="/login" className="text-sm text-violet-600 font-medium hover:underline">Sign in →</a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-violet-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b border-violet-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Share Your Routine</h3>
            <p className="text-xs text-gray-500 mt-0.5">Include all products — shampoo, conditioner, treatments, and styling.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">✕</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        {/* Name + Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Routine Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g., My CGM Wash Day"
              className="w-full px-3 py-3 min-h-[44px] border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Routine Type</label>
            <select
              value={form.routineType}
              onChange={(e) => setForm(f => ({ ...f, routineType: e.target.value as RoutineFormData['routineType'] }))}
              className="w-full px-3 py-3 min-h-[44px] border border-gray-300 rounded-lg text-sm bg-white"
            >
              {ROUTINE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Steps */}
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-2">Products Used *</label>
          <p className="text-xs text-gray-400 mb-3">List each product in the order you use them. Include brand and product name.</p>
          <div className="space-y-3">
            {form.steps.map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-xs font-bold text-violet-400 mt-3.5 w-5 shrink-0">{i + 1}.</span>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                  <input
                    type="text"
                    value={step.brand}
                    onChange={(e) => updateStep(i, 'brand', e.target.value)}
                    placeholder="Brand"
                    className="px-3 py-2.5 min-h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <input
                    type="text"
                    value={step.product}
                    onChange={(e) => updateStep(i, 'product', e.target.value)}
                    placeholder="Product name"
                    className="px-3 py-2.5 min-h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <select
                    value={step.category}
                    onChange={(e) => updateStep(i, 'category', e.target.value)}
                    className="px-2 py-2.5 min-h-[44px] border border-gray-200 rounded-lg text-xs bg-white"
                  >
                    <option value="">Category</option>
                    {Object.entries(PRODUCT_CATEGORY_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                {form.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="text-gray-300 hover:text-red-400 cursor-pointer mt-2.5 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Remove step"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="mt-3 text-xs text-violet-600 font-medium hover:underline cursor-pointer min-h-[44px] px-2"
          >
            + Add another product
          </button>
        </div>

        {/* Application + Drying */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Styling Method</label>
            <input
              type="text"
              value={form.stylingMethod}
              onChange={(e) => setForm(f => ({ ...f, stylingMethod: e.target.value }))}
              placeholder="e.g., Praying hands + scrunching"
              className="w-full px-3 py-3 min-h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Drying Method</label>
            <select
              value={form.dryingMethod}
              onChange={(e) => setForm(f => ({ ...f, dryingMethod: e.target.value }))}
              className="w-full px-3 py-3 min-h-[44px] border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="">Select...</option>
              {DRYING_METHODS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sleep + Refresh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Sleep Protection</label>
            <input
              type="text"
              value={form.sleepProtection}
              onChange={(e) => setForm(f => ({ ...f, sleepProtection: e.target.value }))}
              placeholder="e.g., Silk bonnet, pineapple"
              className="w-full px-3 py-3 min-h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Refresh Routine</label>
            <input
              type="text"
              value={form.refreshNotes}
              onChange={(e) => setForm(f => ({ ...f, refreshNotes: e.target.value }))}
              placeholder="e.g., Spray water + scrunch"
              className="w-full px-3 py-3 min-h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Public toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none group min-h-[44px]">
          <div className={`relative w-9 h-5 rounded-full transition-colors ${form.isPublic ? 'bg-violet-600' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isPublic ? 'translate-x-4' : 'translate-x-0.5'}`} />
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(e) => setForm(f => ({ ...f, isPublic: e.target.checked }))}
              className="sr-only"
            />
          </div>
          <span className="text-sm text-gray-600">Share with the community</span>
        </label>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 min-h-[44px] bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer transition"
        >
          {submitting ? 'Saving…' : '🌀 Share Routine'}
        </button>
      </form>
    </div>
  )
}
