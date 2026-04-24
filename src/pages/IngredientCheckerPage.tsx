import { IngredientChecker } from '../components/products/IngredientChecker'

export function IngredientCheckerPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 Ingredient Checker</h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Paste any product's ingredient list to instantly check if it's Curly Girl Method approved, cross-referenced against CurlScan and IsItCG.
        </p>
      </div>
      <IngredientChecker />
    </div>
  )
}
