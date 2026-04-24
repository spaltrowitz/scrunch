import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { CURL_PATTERNS, POROSITY_OPTIONS, HAIR_GOALS, HAIR_GOAL_LABELS, INGREDIENT_PREFERENCES, INGREDIENT_PREFERENCE_LABELS } from '../../lib/constants'

import type { CurlPattern, Porosity, HairDensity, HairWidth, ScalpType, HairLength, ColorTreatment, Climate, HeatToolUsage, WorkoutFrequency, CgmExperience, FragrancePreference } from '../../lib/database.types'

interface OnboardingData {
  curl_pattern: CurlPattern | null
  porosity: Porosity | null
  hair_density: HairDensity | null
  hair_width: HairWidth | null
  scalp_type: ScalpType | null
  hair_length: HairLength | null
  color_treatment: ColorTreatment | null
  climate: Climate | null
  heat_tool_usage: HeatToolUsage | null
  workout_frequency: WorkoutFrequency | null
  cgm_experience: CgmExperience | null
  fragrance_preference: FragrancePreference | null
  hair_goals: string[]
  sensitivities: string[]
}

const TOTAL_STEPS = 6

export function OnboardingWizard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    curl_pattern: null, porosity: null, hair_density: null, hair_width: null,
    scalp_type: null, hair_length: null, color_treatment: null, climate: null,
    heat_tool_usage: null, workout_frequency: null, cgm_experience: null,
    fragrance_preference: null, hair_goals: [], sensitivities: [],
  })

  // Load existing profile data if editing
  useEffect(() => {
    if (!user) { setLoadingProfile(false); return }
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data: rawProfile }) => {
      const profile = rawProfile as Record<string, unknown> | null
      if (profile && profile.onboarding_completed) {
        setIsEditing(true)
        setData({
          curl_pattern: (profile.curl_pattern as CurlPattern) || null,
          porosity: (profile.porosity as Porosity) || null,
          hair_density: (profile.hair_density as HairDensity) || null,
          hair_width: (profile.hair_width as HairWidth) || null,
          scalp_type: (profile.scalp_type as ScalpType) || null,
          hair_length: (profile.hair_length as HairLength) || null,
          color_treatment: (profile.color_treatment as ColorTreatment) || null,
          climate: (profile.climate as Climate) || null,
          heat_tool_usage: (profile.heat_tool_usage as HeatToolUsage) || null,
          workout_frequency: (profile.workout_frequency as WorkoutFrequency) || null,
          cgm_experience: (profile.cgm_experience as CgmExperience) || null,
          fragrance_preference: (profile.fragrance_preference as FragrancePreference) || null,
          hair_goals: (profile.hair_goals as string[]) || [],
          sensitivities: (profile.sensitivities as string[]) || [],
        })
      }
      setLoadingProfile(false)
    })
  }, [user])

  const update = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData(d => ({ ...d, [key]: value }))
  }

  const toggleArrayItem = (key: 'hair_goals' | 'sensitivities', item: string) => {
    setData(d => ({
      ...d,
      [key]: d[key].includes(item) ? d[key].filter(i => i !== item) : [...d[key], item],
    }))
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Curly Friend',
      ...data,
      onboarding_completed: true,
    } as never)
    setSaving(false)
    if (!error) navigate('/profile')
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sign in to set up your hair profile</h2>
          <p className="text-sm text-gray-500 mb-6">Create an account or sign in to save your hair profile and get personalized recommendations.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 cursor-pointer"
          >
            Sign In →
          </button>
        </div>
      </div>
    )
  }

  if (loadingProfile) return <div className="text-center py-12 text-gray-500">Loading...</div>

  const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-lg border text-sm text-left cursor-pointer transition-colors ${
        selected ? 'border-violet-500 bg-violet-50 text-violet-700 font-medium' : 'border-gray-200 hover:border-gray-300 text-gray-700'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        {isEditing && step === 1 && (
          <p className="text-sm text-violet-600 mb-4">✏️ Editing your hair profile — your current selections are pre-loaded</p>
        )}
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step {step} of {TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Curl Pattern */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What's your natural, air-dried hair texture?</h2>
            <p className="text-sm text-gray-500 mb-3">If your hair is treated, think back to its natural state. Select the closest match.</p>
            <a
              href="https://www.reddit.com/r/curlyhair/wiki/index/#wiki_hair_typing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 mb-5 font-medium"
            >
              📸 Not sure? See the r/curlyhair visual guide with real photos →
            </a>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Wavy (Type 2)</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {CURL_PATTERNS.filter(cp => cp.value.startsWith('2')).map(cp => (
                  <OptionButton key={cp.value} selected={data.curl_pattern === cp.value} onClick={() => update('curl_pattern', cp.value)}>
                    <div className="text-center">
                      <span className="font-bold text-base block">{cp.label}</span>
                      <div className="text-xs text-gray-500 mt-1">{cp.description}</div>
                    </div>
                  </OptionButton>
                ))}
              </div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Curly (Type 3)</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {CURL_PATTERNS.filter(cp => cp.value.startsWith('3')).map(cp => (
                  <OptionButton key={cp.value} selected={data.curl_pattern === cp.value} onClick={() => update('curl_pattern', cp.value)}>
                    <div className="text-center">
                      <span className="font-bold text-base block">{cp.label}</span>
                      <div className="text-xs text-gray-500 mt-1">{cp.description}</div>
                    </div>
                  </OptionButton>
                ))}
              </div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Coily (Type 4)</p>
              <div className="grid grid-cols-3 gap-3">
                {CURL_PATTERNS.filter(cp => cp.value.startsWith('4')).map(cp => (
                  <OptionButton key={cp.value} selected={data.curl_pattern === cp.value} onClick={() => update('curl_pattern', cp.value)}>
                    <div className="text-center">
                      <span className="font-bold text-base block">{cp.label}</span>
                      <div className="text-xs text-gray-500 mt-1">{cp.description}</div>
                    </div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Porosity */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What's your hair porosity?</h2>
            <p className="text-sm text-gray-500 mb-4">Porosity affects how your hair absorbs products.</p>
            <a
              href="https://curlmaven.ie/porosity-quiz/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 mb-6"
            >
              🤔 Not sure? Learn how to test your porosity →
            </a>
            <div className="space-y-3">
              {POROSITY_OPTIONS.map(p => (
                <OptionButton key={p.value} selected={data.porosity === p.value} onClick={() => update('porosity', p.value)}>
                  <div className="font-semibold">{p.label} Porosity</div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.description}</div>
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Hair Density + Strand Width */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Hair density & strand width</h2>
            <p className="text-sm text-gray-500 mb-6">Two quick checks to understand your hair structure.</p>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Density</h3>
              <p className="text-xs text-gray-500 mb-3">Part your hair and check the mirror — the more scalp you see, the less dense.</p>
              <div className="grid grid-cols-3 gap-3">
                {(['thin', 'medium', 'thick'] as const).map(v => (
                  <OptionButton key={v} selected={data.hair_density === v} onClick={() => update('hair_density', v)}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Strand Width</h3>
              <p className="text-xs text-gray-500 mb-3">Roll a single strand between your fingers — can you feel it?</p>
              <div className="grid grid-cols-3 gap-3">
                {(['fine', 'medium', 'coarse'] as const).map(v => (
                  <OptionButton key={v} selected={data.hair_width === v} onClick={() => update('hair_width', v)}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Hair Length */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">How long is your hair?</h2>
            <p className="text-sm text-gray-500 mb-6">If curly, pull the curl all the way down to measure.</p>
            <div className="grid grid-cols-2 gap-3">
              {([['short', 'Short (above ears)'], ['medium', 'Medium (shoulders)'], ['long', 'Long (past shoulders)'], ['extra_long', 'Extra Long (waist+)']] as const).map(([v, label]) => (
                <OptionButton key={v} selected={data.hair_length === v} onClick={() => update('hair_length', v)}>
                  {label}
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Hair Goals */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What are your hair goals?</h2>
            <p className="text-sm text-gray-500 mb-6">Select all that apply.</p>
            <div className="grid grid-cols-2 gap-3">
              {HAIR_GOALS.map(goal => (
                <OptionButton key={goal} selected={data.hair_goals.includes(goal)} onClick={() => toggleArrayItem('hair_goals', goal)}>
                  {HAIR_GOAL_LABELS[goal]}
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Ingredient Preferences */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Any ingredient preferences?</h2>
            <p className="text-sm text-gray-500 mb-6">We'll flag products with these ingredients. Select all that apply, or skip.</p>
            <div className="grid grid-cols-2 gap-3">
              {INGREDIENT_PREFERENCES.map(pref => (
                <OptionButton key={pref} selected={data.sensitivities.includes(pref)} onClick={() => toggleArrayItem('sensitivities', pref)}>
                  {INGREDIENT_PREFERENCE_LABELS[pref]}
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-4 py-2 text-sm text-gray-600 disabled:opacity-30 cursor-pointer"
          >
            ← Back
          </button>

          {step < TOTAL_STEPS ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 cursor-pointer"
              >
                Next →
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes ✨' : 'Complete Setup ✨'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
