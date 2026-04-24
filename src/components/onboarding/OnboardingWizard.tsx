import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { CURL_PATTERNS, POROSITY_OPTIONS, HAIR_GOALS, SENSITIVITIES } from '../../lib/constants'
import type { CurlPattern, Porosity, HairDensity, HairWidth, ScalpType, HairLength, Climate, HeatToolUsage, WorkoutFrequency, CgmExperience, FragrancePreference } from '../../lib/database.types'

interface OnboardingData {
  curl_pattern: CurlPattern | null
  porosity: Porosity | null
  hair_density: HairDensity | null
  hair_width: HairWidth | null
  scalp_type: ScalpType | null
  hair_length: HairLength | null
  climate: Climate | null
  heat_tool_usage: HeatToolUsage | null
  workout_frequency: WorkoutFrequency | null
  cgm_experience: CgmExperience | null
  fragrance_preference: FragrancePreference | null
  hair_goals: string[]
  sensitivities: string[]
}

const TOTAL_STEPS = 8

export function OnboardingWizard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    curl_pattern: null, porosity: null, hair_density: null, hair_width: null,
    scalp_type: null, hair_length: null, climate: null, heat_tool_usage: null,
    workout_frequency: null, cgm_experience: null, fragrance_preference: null,
    hair_goals: [], sensitivities: [],
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

        {/* Steps */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What's your curl pattern?</h2>
            <p className="text-sm text-gray-500 mb-6">Select the closest match. You can always change this later.</p>
            <div className="grid grid-cols-3 gap-3">
              {CURL_PATTERNS.map(cp => (
                <OptionButton key={cp.value} selected={data.curl_pattern === cp.value} onClick={() => update('curl_pattern', cp.value)}>
                  <div className="font-semibold">{cp.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{cp.description}</div>
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What's your hair porosity?</h2>
            <p className="text-sm text-gray-500 mb-6">Porosity affects how your hair absorbs products.</p>
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

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Tell us about your hair</h2>
            <p className="text-sm text-gray-500 mb-6">Density and width help us find the right products for you.</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Hair density (how much hair)</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['thin', 'medium', 'thick'] as const).map(v => (
                    <OptionButton key={v} selected={data.hair_density === v} onClick={() => update('hair_density', v)}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </OptionButton>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Strand width (individual hair thickness)</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['fine', 'medium', 'coarse'] as const).map(v => (
                    <OptionButton key={v} selected={data.hair_width === v} onClick={() => update('hair_width', v)}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </OptionButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Scalp & length</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Scalp type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['dry', 'normal', 'oily'] as const).map(v => (
                    <OptionButton key={v} selected={data.scalp_type === v} onClick={() => update('scalp_type', v)}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </OptionButton>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Hair length</label>
                <div className="grid grid-cols-2 gap-3">
                  {([['short', 'Short (above ears)'], ['medium', 'Medium (shoulders)'], ['long', 'Long (past shoulders)'], ['extra_long', 'Extra Long']] as const).map(([v, label]) => (
                    <OptionButton key={v} selected={data.hair_length === v} onClick={() => update('hair_length', v)}>
                      {label}
                    </OptionButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your environment & lifestyle</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Climate</label>
                <div className="grid grid-cols-2 gap-3">
                  {([['humid', '💧 Humid'], ['dry', '🏜️ Dry'], ['variable', '🌤️ Variable'], ['tropical', '🌴 Tropical']] as const).map(([v, label]) => (
                    <OptionButton key={v} selected={data.climate === v} onClick={() => update('climate', v)}>
                      {label}
                    </OptionButton>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">How often do you work out?</label>
                <div className="grid grid-cols-3 gap-3">
                  {([['rarely', 'Rarely'], ['few_times_week', 'A few times/week'], ['daily', 'Daily']] as const).map(([v, label]) => (
                    <OptionButton key={v} selected={data.workout_frequency === v} onClick={() => update('workout_frequency', v)}>
                      {label}
                    </OptionButton>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Heat tool usage</label>
                <div className="grid grid-cols-3 gap-3">
                  {([['never', 'Never'], ['occasionally', 'Sometimes'], ['frequently', 'Often']] as const).map(([v, label]) => (
                    <OptionButton key={v} selected={data.heat_tool_usage === v} onClick={() => update('heat_tool_usage', v)}>
                      {label}
                    </OptionButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">CGM experience & preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">How long have you been following the Curly Girl Method?</label>
                <div className="grid grid-cols-2 gap-3">
                  {([['just_starting', '🌱 Just starting'], ['under_1_year', '< 1 year'], ['1_to_3_years', '1–3 years'], ['3_plus_years', '3+ years']] as const).map(([v, label]) => (
                    <OptionButton key={v} selected={data.cgm_experience === v} onClick={() => update('cgm_experience', v)}>
                      {label}
                    </OptionButton>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Fragrance preference</label>
                <div className="grid grid-cols-3 gap-3">
                  {([['love_it', '🌸 Love it'], ['no_preference', 'No pref'], ['fragrance_free', 'None please']] as const).map(([v, label]) => (
                    <OptionButton key={v} selected={data.fragrance_preference === v} onClick={() => update('fragrance_preference', v)}>
                      {label}
                    </OptionButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What are your hair goals?</h2>
            <p className="text-sm text-gray-500 mb-6">Select all that apply.</p>
            <div className="grid grid-cols-2 gap-3">
              {HAIR_GOALS.map(goal => (
                <OptionButton key={goal} selected={data.hair_goals.includes(goal)} onClick={() => toggleArrayItem('hair_goals', goal)}>
                  {goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {step === 8 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Any sensitivities or allergies?</h2>
            <p className="text-sm text-gray-500 mb-6">We'll flag products with these ingredients. Select all that apply, or skip.</p>
            <div className="grid grid-cols-2 gap-3">
              {SENSITIVITIES.map(s => (
                <OptionButton key={s} selected={data.sensitivities.includes(s)} onClick={() => toggleArrayItem('sensitivities', s)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
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
