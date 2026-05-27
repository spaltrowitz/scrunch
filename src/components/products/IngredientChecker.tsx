import { useState } from 'react'
import { analyzeIngredients } from '../../utils/ingredientAnalyzer'
import { CG_STATUS_CONFIG, HEALTH_SCORE_CONFIG } from '../../lib/constants'
import { HAZARD_CATEGORY_LABELS } from '../../utils/healthHazardDb'

const EXAMPLE_INGREDIENTS = `Water, Cetearyl Alcohol, Glycerin, Behentrimonium Chloride, Fragrance, Dimethicone, Panthenol, Coconut Oil`

export function IngredientChecker() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<ReturnType<typeof analyzeIngredients> | null>(null)

  const handleAnalyze = () => {
    if (!input.trim()) return
    setResults(analyzeIngredients(input))
  }

  const handleTryExample = () => {
    setInput(EXAMPLE_INGREDIENTS)
    setResults(analyzeIngredients(EXAMPLE_INGREDIENTS))
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste ingredients here, separated by commas..."
          className="w-full h-32 p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />

        <div className="flex gap-3 mt-3">
          <button
            onClick={handleAnalyze}
            disabled={!input.trim()}
            className="px-5 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
          >
            Check Ingredients
          </button>
          <button
            onClick={handleTryExample}
            className="px-4 py-2 text-sm text-violet-600 border border-violet-200 rounded-xl hover:bg-violet-50 cursor-pointer min-h-[44px]"
          >
            See it in action
          </button>
        </div>
      </div>

      {results && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${CG_STATUS_CONFIG[results.overallStatus].bg}`}>
            <span className="text-xl">{CG_STATUS_CONFIG[results.overallStatus].icon}</span>
            <div>
              <p className={`font-semibold ${CG_STATUS_CONFIG[results.overallStatus].color}`}>
                {CG_STATUS_CONFIG[results.overallStatus].label}
              </p>
              <p className="text-sm text-gray-600">{results.summary}</p>
            </div>
          </div>

          <div className="space-y-1">
            {results.ingredients.map((ing, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 text-sm">
                <span className="mt-0.5 shrink-0">
                  {ing.status === 'approved' ? '🟢' : ing.status === 'caution' ? '🟡' : '🔴'}
                </span>
                <div>
                  <span className="text-gray-900">{ing.name}</span>
                  {ing.reason && (
                    <span className="text-gray-500 ml-2">- {ing.reason}</span>
                  )}
                  {ing.healthFlags && ing.healthFlags.length > 0 && (
                    <div className="mt-0.5">
                      {ing.healthFlags.map((flag, j) => (
                        <span key={j} className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 mr-1">
                          {HAZARD_CATEGORY_LABELS[flag.category].icon} {flag.concern}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Health Safety Score Section */}
          {results.healthScore && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">🛡️ Health & Safety Score</h3>
              <div className={`flex items-center gap-2 p-3 rounded-lg ${HEALTH_SCORE_CONFIG[results.healthScore.grade].bg}`}>
                <span className="text-xl">{HEALTH_SCORE_CONFIG[results.healthScore.grade].icon}</span>
                <div>
                  <p className={`font-semibold ${HEALTH_SCORE_CONFIG[results.healthScore.grade].color}`}>
                    {results.healthScore.score}/100 — {HEALTH_SCORE_CONFIG[results.healthScore.grade].label}
                  </p>
                  <p className="text-sm text-gray-600">{results.healthScore.summary}</p>
                </div>
              </div>
              {results.healthScore.flags.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {results.healthScore.flags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className={`shrink-0 px-1.5 py-0.5 rounded font-medium ${
                        flag.severity === 'high' ? 'bg-red-100 text-red-700' :
                        flag.severity === 'moderate' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {flag.severity}
                      </span>
                      <span>
                        <strong>{flag.hazardName}</strong> — {flag.concern}
                        <span className="text-gray-400 ml-1">({flag.source})</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
