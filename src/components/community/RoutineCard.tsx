import { PRODUCT_CATEGORY_LABELS } from '../../lib/constants'

interface RoutineStepData {
  order: number
  category: string | null
  brand: string
  product: string
  notes: string | null
}

interface RoutineStepsPayload {
  products: RoutineStepData[]
  styling_method: string | null
  drying_method: string | null
  sleep_protection: string | null
  refresh_notes: string | null
}

interface Routine {
  id: string
  name: string
  routine_type: string
  steps: RoutineStepsPayload
  is_public: boolean
  created_at: string
  profiles?: { display_name: string; curl_pattern: string | null; porosity: string | null } | null
}

const TYPE_LABELS: Record<string, string> = {
  wash_day: '🚿 Wash Day',
  refresh: '🔄 Refresh',
  deep_treatment: '🧖‍♀️ Deep Treatment',
  custom: '✨ Custom',
}

export function RoutineCard({ routine }: { routine: Routine }) {
  const steps = typeof routine.steps === 'string' ? JSON.parse(routine.steps) : routine.steps
  const products: RoutineStepData[] = steps?.products || []
  const profile = routine.profiles

  const hairInfo = [
    profile?.curl_pattern,
    profile?.porosity ? `${profile.porosity} porosity` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-violet-200 transition">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{routine.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs text-violet-600 font-medium">
                {TYPE_LABELS[routine.routine_type] || routine.routine_type}
              </span>
              {profile?.display_name && (
                <span className="text-xs text-gray-400">by {profile.display_name}</span>
              )}
              {hairInfo && (
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{hairInfo}</span>
              )}
            </div>
          </div>
          <span className="text-xs text-gray-400 shrink-0">
            {new Date(routine.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Products */}
      <div className="px-5 py-4">
        <div className="space-y-2">
          {products.map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs font-bold text-violet-300 mt-0.5 w-4 shrink-0">{step.order}.</span>
              <div className="min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{step.brand}</span>{' '}
                  <span className="text-gray-600">{step.product}</span>
                </p>
                {step.category && (
                  <span className="text-[10px] text-gray-400">
                    {PRODUCT_CATEGORY_LABELS[step.category as keyof typeof PRODUCT_CATEGORY_LABELS] || step.category}
                  </span>
                )}
                {step.notes && (
                  <p className="text-xs text-gray-500 italic mt-0.5">{step.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Method details */}
        {(steps.styling_method || steps.drying_method || steps.sleep_protection || steps.refresh_notes) && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1.5">
            {steps.styling_method && (
              <span className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">Style:</span> {steps.styling_method}
              </span>
            )}
            {steps.drying_method && (
              <span className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">Dry:</span> {steps.drying_method}
              </span>
            )}
            {steps.sleep_protection && (
              <span className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">Sleep:</span> {steps.sleep_protection}
              </span>
            )}
            {steps.refresh_notes && (
              <span className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">Refresh:</span> {steps.refresh_notes}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
