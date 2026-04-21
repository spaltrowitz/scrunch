import { useState } from 'react'
import { analyzeIngredients, type IngredientResult } from '../../utils/ingredientAnalyzer'
import { CG_STATUS_CONFIG } from '../../lib/constants'

const EXAMPLE_INGREDIENTS = `Water, Cetearyl Alcohol, Glycerin, Behentrimonium Chloride, Fragrance, Dimethicone, Panthenol, Coconut Oil`

export function IngredientChecker() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<{
    ingredients: IngredientResult[]
    overallStatus: 'approved' | 'caution' | 'not_approved'
    summary: string
  } | null>(null)

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
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Ingredient Checker</h2>
        <p className="text-sm text-gray-500 mb-4">
          Paste a product's ingredient list to check if it's Curly Girl approved
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste ingredients here, separated by commas..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />

        <div className="flex gap-3 mt-3">
          <button
            onClick={handleAnalyze}
            disabled={!input.trim()}
            className="px-5 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Check Ingredients
          </button>
          <button
            onClick={handleTryExample}
            className="px-4 py-2 text-sm text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 cursor-pointer"
          >
            Try Example
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
                    <span className="text-gray-500 ml-2">— {ing.reason}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
