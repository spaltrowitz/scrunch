import { useState } from 'react'
import { findIngredientEducation, INGREDIENT_CATEGORY_LABELS } from '../../data/ingredientEducation'
import type { IngredientEducation } from '../../data/ingredientEducation'

interface IngredientRowProps {
  ingredient: string
  flagged?: { name: string; reason: string; severity: 'warning' | 'bad' } | null
}

function EducationCard({ edu }: { edu: IngredientEducation }) {
  const verdictColors = {
    approved: 'bg-green-50 text-green-700 border-green-200',
    not_approved: 'bg-red-50 text-red-700 border-red-200',
    caution: 'bg-amber-50 text-amber-700 border-amber-200',
    depends: 'bg-blue-50 text-blue-700 border-blue-200',
  }

  const verdictLabels = {
    approved: '✅ CG Approved',
    not_approved: '🚫 Not CG Approved',
    caution: '⚠️ Use with Caution',
    depends: '🔄 Depends on Context',
  }

  return (
    <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm animate-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {INGREDIENT_CATEGORY_LABELS[edu.category]}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded border ${verdictColors[edu.cgmVerdict]}`}>
          {verdictLabels[edu.cgmVerdict]}
        </span>
      </div>

      <p className="text-gray-700 mb-2">
        <span className="font-medium">What it does:</span> {edu.whatItDoes}
      </p>
      <p className="text-gray-700 mb-2">
        <span className="font-medium">Why it matters:</span> {edu.whyItMatters}
      </p>
      <p className="text-violet-700 bg-violet-50 px-3 py-2 rounded-md">
        💡 <span className="font-medium">Tip:</span> {edu.tip}
      </p>
    </div>
  )
}

export function IngredientRow({ ingredient, flagged }: IngredientRowProps) {
  const [expanded, setExpanded] = useState(false)
  const edu = findIngredientEducation(ingredient)
  const isTappable = !!edu

  return (
    <div>
      <button
        type="button"
        onClick={() => isTappable && setExpanded(!expanded)}
        className={`flex items-start gap-2 w-full text-left py-1 rounded-md transition ${
          isTappable ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'
        }`}
        disabled={!isTappable}
        aria-expanded={isTappable ? expanded : undefined}
      >
        <span className="mt-0.5 shrink-0">
          {flagged ? (flagged.severity === 'bad' ? '🔴' : '🟡') : '🟢'}
        </span>
        <span className={`break-words flex-1 ${flagged ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
          {ingredient}
          {flagged && <span className="text-gray-500 font-normal"> - {flagged.reason}</span>}
        </span>
        {isTappable && (
          <span className="shrink-0 text-gray-400 text-xs mt-1">
            {expanded ? '▼' : 'ⓘ'}
          </span>
        )}
      </button>
      {expanded && edu && <EducationCard edu={edu} />}
    </div>
  )
}
