import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function Dashboard() {
  const { user } = useAuth()
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null)
  const [ratingCount, setRatingCount] = useState(0)

  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'friend'

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('profiles').select('onboarding_completed,curl_pattern').eq('id', user.id).single(),
      supabase.from('product_reviews').select('id').eq('user_id', user.id),
    ]).then(([profileRes, reviewsRes]) => {
      const p = profileRes.data as unknown as { onboarding_completed: boolean; curl_pattern: string | null } | null
      setProfileComplete(!!p?.onboarding_completed && !!p?.curl_pattern)
      setRatingCount((reviewsRes.data as unknown as unknown[] | null)?.length ?? 0)
    })
  }, [user])

  // Still loading
  if (profileComplete === null) return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-gray-500 animate-pulse">Loading...</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Hey {firstName} 👋</h1>

      {/* Step 1: Complete your profile */}
      {!profileComplete && (
        <div className="mb-8">
          <div className="p-6 bg-violet-50 border border-violet-200 rounded-xl">
            <h2 className="font-semibold text-gray-900 mb-2">First, let's set up your hair profile</h2>
            <p className="text-sm text-gray-600 mb-4">
              Tell us about your curl pattern, porosity, and goals — takes about 2 minutes.
              This lets us recommend products that work for people with hair like yours.
            </p>
            <Link
              to="/onboarding"
              className="inline-block px-5 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 no-underline"
            >
              Start Hair Quiz →
            </Link>
          </div>
        </div>
      )}

      {/* Step 2: Rate some products */}
      {profileComplete && ratingCount < 5 && (
        <div className="mb-8">
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
            <h2 className="font-semibold text-gray-900 mb-2">Now, rate products you've used</h2>
            <p className="text-sm text-gray-600 mb-4">
              You've rated {ratingCount} product{ratingCount !== 1 ? 's' : ''}. The more you rate, the better we can recommend
              products for your hair type.
            </p>
            <Link
              to="/products"
              className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 no-underline"
            >
              Browse & Rate Products →
            </Link>
          </div>
        </div>
      )}

      {/* Ready state: profile done + some ratings */}
      {profileComplete && ratingCount >= 5 && (
        <p className="text-gray-600 mb-6">Here's what's new for you.</p>
      )}

      {/* Main actions — always show but adapt */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/products" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition no-underline">
          <h3 className="font-semibold text-gray-900 mb-1">🔍 Browse Products</h3>
          <p className="text-xs text-gray-500">
            {ratingCount > 0
              ? `${285 - ratingCount}+ products to discover`
              : '285+ curly hair products to explore'}
          </p>
        </Link>

        <Link to="/recommendations" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition no-underline">
          <h3 className="font-semibold text-gray-900 mb-1">✨ For You</h3>
          <p className="text-xs text-gray-500">
            {profileComplete
              ? 'Recommendations based on your hair profile'
              : 'Complete your profile to unlock'}
          </p>
        </Link>

        <Link to="/my-products" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition no-underline">
          <h3 className="font-semibold text-gray-900 mb-1">📋 My Shelf</h3>
          <p className="text-xs text-gray-500">
            {ratingCount > 0
              ? `${ratingCount} product${ratingCount !== 1 ? 's' : ''} rated`
              : 'Track what works and what doesn\'t'}
          </p>
        </Link>

        <Link to="/community" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition no-underline">
          <h3 className="font-semibold text-gray-900 mb-1">💬 Community</h3>
          <p className="text-xs text-gray-500">Ask questions, search Reddit threads</p>
        </Link>
      </div>
    </div>
  )
}
