import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { CURL_PATTERNS, POROSITY_OPTIONS, parseSensitivity, INGREDIENT_PREFERENCE_LABELS } from '../lib/constants'
import type { Profile } from '../lib/database.types'

export function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadProfile()
  }, [user])

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single()
    setProfile(data as Profile | null)
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Profile</h1>
        <p className="text-gray-600 mb-4">Sign in to view and edit your hair profile.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 cursor-pointer"
        >
          Sign In
        </button>
      </div>
    )
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  const isProfileEmpty = !profile || (!profile.curl_pattern && !profile.porosity && !profile.onboarding_completed)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={() => navigate('/onboarding')}
          className="text-sm px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 cursor-pointer"
        >
          {isProfileEmpty ? 'Set Up Profile' : 'Edit Profile'}
        </button>
      </div>

      {isProfileEmpty ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-4xl mb-4">👩‍🦱</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Let's set up your hair profile!</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Tell us about your hair type, porosity, and goals so we can personalize your experience and recommend products that work for people like you.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 cursor-pointer"
          >
            Start Hair Quiz (3 min) →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Hair Profile</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Curl Pattern', value: profile!.curl_pattern ? `${profile!.curl_pattern} — ${CURL_PATTERNS.find(c => c.value === profile!.curl_pattern)?.description}` : null },
                { label: 'Porosity', value: profile!.porosity ? POROSITY_OPTIONS.find(p => p.value === profile!.porosity)?.label : null },
                { label: 'Hair Density', value: profile!.hair_density },
                { label: 'Hair Width', value: profile!.hair_width },
                { label: 'Hair Length', value: profile!.hair_length?.replace(/_/g, ' ') },
                { label: 'Scalp Type', value: profile!.scalp_type },
                { label: 'Climate', value: profile!.climate },
                { label: 'CGM Experience', value: profile!.cgm_experience?.replace(/_/g, ' ') },
                { label: 'Heat Tools', value: profile!.heat_tool_usage?.replace(/_/g, ' ') },
                { label: 'Workout Frequency', value: profile!.workout_frequency?.replace(/_/g, ' ') },
                { label: 'Fragrance Preference', value: profile!.fragrance_preference?.replace(/_/g, ' ') },
                { label: 'Color Treatment', value: profile!.color_treatment?.replace(/_/g, ' ') },
              ].filter(f => f.value).map(f => (
                <ProfileField key={f.label} label={f.label} value={f.value} />
              ))}
            </div>

            {/* Count unset optional fields */}
            {(() => {
              const optional = [profile!.scalp_type, profile!.climate, profile!.cgm_experience, profile!.heat_tool_usage, profile!.workout_frequency, profile!.fragrance_preference, profile!.color_treatment]
              const unsetCount = optional.filter(v => !v).length
              if (unsetCount === 0) return null
              return (
                <button
                  onClick={() => navigate('/onboarding')}
                  className="mt-4 text-xs text-violet-600 hover:underline cursor-pointer"
                >
                  + Add {unsetCount} more detail{unsetCount !== 1 ? 's' : ''} for better recommendations
                </button>
              )
            })()}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Goals & Sensitivities</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Hair Goals</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile!.hair_goals.length > 0 ? profile!.hair_goals.map(g => (
                    <span key={g} className="text-xs px-2 py-1 bg-violet-50 text-violet-700 rounded-full">
                      {g.replace(/_/g, ' ')}
                    </span>
                  )) : <span className="text-sm text-gray-400">None set</span>}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Sensitivities</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile!.sensitivities.length > 0 ? profile!.sensitivities.map(s => {
                    const { name, strictness } = parseSensitivity(s)
                    const label = INGREDIENT_PREFERENCE_LABELS[name] || name.replace(/_/g, ' ')
                    return (
                      <span
                        key={s}
                        className={`text-xs px-2 py-1 rounded-full ${strictness === 'strict' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}
                      >
                        {strictness === 'strict' ? '🚫' : '⚠️'} {label}
                      </span>
                    )
                  }) : <span className="text-sm text-gray-400">None set</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Share profile for recommendations</p>
              <p className="text-xs text-gray-500">Allow your anonymized hair data to power recommendations for others</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${profile!.profile_public ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
              {profile!.profile_public ? 'Shared' : 'Private'}
            </span>
          </div>

          <button
            onClick={() => navigate('/onboarding')}
            className="w-full py-2.5 text-sm text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 cursor-pointer"
          >
            Edit Profile →
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-3">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/my-products')} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-300 text-left cursor-pointer transition">
                <h3 className="font-medium text-gray-900 text-sm">📋 My Shelf</h3>
                <p className="text-xs text-gray-500">Products you've tried and saved</p>
              </button>
              <button onClick={() => navigate('/recommendations')} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-300 text-left cursor-pointer transition">
                <h3 className="font-medium text-gray-900 text-sm">✨ For You</h3>
                <p className="text-xs text-gray-500">Personalized recommendations</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const HAIR_PROPERTY_GUIDES: Record<string, string> = {
  'Porosity': 'https://docs.google.com/document/d/1Q6Dj9WAZxlfBhJSyS5on2rw3-if5cOV3oV-dQ3B0AHA/edit#bookmark=kix.y3l0h5s9oqk9',
  'Hair Density': 'https://docs.google.com/document/d/1Q6Dj9WAZxlfBhJSyS5on2rw3-if5cOV3oV-dQ3B0AHA/edit#bookmark=id.8igp5xhonl09',
  'Hair Width': 'https://docs.google.com/document/d/1Q6Dj9WAZxlfBhJSyS5on2rw3-if5cOV3oV-dQ3B0AHA/edit#bookmark=id.epzf99ee7zm5',
}

function ProfileField({ label, value }: { label: string; value: string | null | undefined }) {
  const guideUrl = HAIR_PROPERTY_GUIDES[label]
  return (
    <div>
      <span className="text-gray-500">
        {label}
        {guideUrl && (
          <a
            href={guideUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1.5 text-violet-500 hover:text-violet-700 text-xs font-normal"
            title={`Learn more about ${label.toLowerCase()}`}
          >
            Learn more ↗
          </a>
        )}
      </span>
      <p className={`font-medium capitalize ${value ? 'text-gray-900' : 'text-gray-300'}`}>
        {value || 'Not set'}
      </p>
    </div>
  )
}
