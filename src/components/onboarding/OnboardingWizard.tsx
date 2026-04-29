import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import {
  CURL_PATTERNS, POROSITY_OPTIONS, HAIR_GOALS, HAIR_GOAL_LABELS,
  INGREDIENT_PREFERENCES, INGREDIENT_PREFERENCE_LABELS,
  SCALP_TYPE_OPTIONS, COLOR_TREATMENT_OPTIONS, HEAT_TOOL_OPTIONS,
  CGM_EXPERIENCE_OPTIONS, CLIMATE_OPTIONS, WORKOUT_FREQUENCY_OPTIONS,
  FRAGRANCE_PREFERENCE_OPTIONS, WATER_TYPE_OPTIONS,
} from '../../lib/constants'

import type {
  CurlPattern, Porosity, HairDensity, HairWidth, ScalpType, HairLength,
  ColorTreatment, Climate, HeatToolUsage, WorkoutFrequency, CgmExperience,
  FragrancePreference, WaterType,
} from '../../lib/database.types'

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
  water_type: WaterType | null
  hair_goals: string[]
  sensitivities: string[]
}

const TOTAL_STEPS = 7

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
    fragrance_preference: null, water_type: null, hair_goals: [], sensitivities: [],
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
          water_type: (profile.water_type as WaterType) || null,
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
      className={`px-4 py-3 rounded-lg border text-sm text-left cursor-pointer transition-colors min-h-[4.5rem] ${
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

        {/* ── Step 1: POROSITY (most important per CG guide) ── */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What's your hair porosity?</h2>
            <p className="text-sm text-gray-500 mb-1">Porosity is the <strong>single most important factor</strong> for choosing products. It determines how your hair absorbs and retains moisture.</p>
            <p className="text-xs text-gray-400 mb-3">Along with texture, this is how you pick products and decide on methods.</p>

            <details className="mb-5 bg-violet-50 border border-violet-200 rounded-lg">
              <summary className="px-4 py-2.5 text-sm text-violet-700 font-medium cursor-pointer">
                🤔 Not sure? Use these characteristics to identify yours
              </summary>
              <div className="px-4 pb-4 text-xs text-gray-700 space-y-4">
                {POROSITY_OPTIONS.map(p => (
                  <div key={p.value}>
                    <p className="font-semibold text-gray-900 mb-1">{p.label} Porosity</p>
                    <ul className="space-y-0.5 ml-4 list-disc">
                      {p.characteristics.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                ))}
                <div className="pt-2 border-t border-violet-200">
                  <p className="font-semibold text-gray-900 mb-1">💧 Quick Spray Test</p>
                  <p>Mist a small section of clean, product-free, dry hair with water.</p>
                  <ul className="mt-1 space-y-0.5 ml-4 list-disc">
                    <li><strong>Water beads up and sits</strong> → Low porosity</li>
                    <li><strong>Slowly absorbs</strong> → Medium porosity</li>
                    <li><strong>Soaks in immediately</strong> → High porosity</li>
                  </ul>
                </div>
                <p className="text-gray-500 italic">⚠️ The "float test" (hair in water) is unreliable — fine hair floats regardless of porosity, and product residue skews results. The spray test and characteristics above are more accurate.</p>
              </div>
            </details>

            <div className="space-y-3">
              {POROSITY_OPTIONS.map(p => (
                <OptionButton key={p.value} selected={data.porosity === p.value} onClick={() => update('porosity', p.value)}>
                  <div className="font-semibold">{p.label} Porosity</div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.description}</div>
                </OptionButton>
              ))}
              <button
                type="button"
                onClick={() => { update('porosity', null as unknown as Porosity); setStep(s => s + 1) }}
                className="w-full px-4 py-3 rounded-lg border border-dashed border-gray-300 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 cursor-pointer transition text-left"
              >
                🧪 Not sure yet — I'll figure it out later
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Density + Strand Width (texture) ── */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Hair density & strand width</h2>
            <p className="text-sm text-gray-500 mb-6">Along with porosity, texture (strand width) is one of the most important factors for choosing products.</p>

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
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Strand Width (Texture)</h3>
              <p className="text-xs text-gray-500 mb-3">Roll a single strand between your fingers. Compare to sewing thread — fine is thinner, coarse is thicker.</p>
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

        {/* ── Step 3: Hair History (scalp, color, heat, CGM experience) ── */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Hair history & scalp</h2>
            <p className="text-sm text-gray-500 mb-6">This helps us understand your hair's current condition and tailor recommendations.</p>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Scalp Type</h3>
              <p className="text-xs text-gray-500 mb-3">How does your scalp feel between washes?</p>
              <div className="grid grid-cols-3 gap-3">
                {SCALP_TYPE_OPTIONS.map(s => (
                  <OptionButton key={s.value} selected={data.scalp_type === s.value} onClick={() => update('scalp_type', s.value)}>
                    <div className="text-center">
                      <span className="font-medium block">{s.label}</span>
                      <div className="text-xs text-gray-500 mt-0.5">{s.description}</div>
                    </div>
                  </OptionButton>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Color Treatment</h3>
              <p className="text-xs text-gray-500 mb-3">Any chemical color processing affects porosity and product needs.</p>
              <div className="grid grid-cols-2 gap-3">
                {COLOR_TREATMENT_OPTIONS.map(c => (
                  <OptionButton key={c.value} selected={data.color_treatment === c.value} onClick={() => update('color_treatment', c.value)}>
                    {c.label}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Heat Tool Usage</h3>
              <div className="grid grid-cols-3 gap-3">
                {HEAT_TOOL_OPTIONS.map(h => (
                  <OptionButton key={h.value} selected={data.heat_tool_usage === h.value} onClick={() => update('heat_tool_usage', h.value)}>
                    {h.label}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">CGM Experience</h3>
              <p className="text-xs text-gray-500 mb-3">How long have you been following the Curly Girl Method?</p>
              <div className="grid grid-cols-2 gap-3">
                {CGM_EXPERIENCE_OPTIONS.map(e => (
                  <OptionButton key={e.value} selected={data.cgm_experience === e.value} onClick={() => update('cgm_experience', e.value)}>
                    <div className="font-medium">{e.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{e.description}</div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Lifestyle (climate, workout, water type) ── */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Lifestyle & environment</h2>
            <p className="text-sm text-gray-500 mb-6">Climate, water, and activity level all affect product performance.</p>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Climate</h3>
              <p className="text-xs text-gray-500 mb-3">Humidity affects how humectants in products behave on your hair.</p>
              <div className="grid grid-cols-2 gap-3">
                {CLIMATE_OPTIONS.map(c => (
                  <OptionButton key={c.value} selected={data.climate === c.value} onClick={() => update('climate', c.value)}>
                    <div className="font-medium">{c.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{c.description}</div>
                  </OptionButton>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Water Type</h3>
              <p className="text-xs text-gray-500 mb-3">Hard water deposits minerals that cause buildup, dullness, and dryness. A chelating shampoo can help.</p>
              <div className="grid grid-cols-3 gap-3">
                {WATER_TYPE_OPTIONS.map(w => (
                  <OptionButton key={w.value} selected={data.water_type === w.value} onClick={() => update('water_type', w.value)}>
                    <div className="text-center">
                      <span className="font-medium block">{w.label}</span>
                      <div className="text-xs text-gray-500 mt-0.5">{w.description}</div>
                    </div>
                  </OptionButton>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Workout Frequency</h3>
              <p className="text-xs text-gray-500 mb-3">Affects how often you need to wash.</p>
              <div className="grid grid-cols-3 gap-3">
                {WORKOUT_FREQUENCY_OPTIONS.map(w => (
                  <OptionButton key={w.value} selected={data.workout_frequency === w.value} onClick={() => update('workout_frequency', w.value)}>
                    {w.label}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Hair Length</h3>
              <p className="text-xs text-gray-500 mb-3">If curly, pull the curl all the way down to measure.</p>
              <div className="grid grid-cols-2 gap-3">
                {([['short', 'Short (above ears)'], ['medium', 'Medium (shoulders)'], ['long', 'Long (past shoulders)'], ['extra_long', 'Extra Long (waist+)']] as const).map(([v, label]) => (
                  <OptionButton key={v} selected={data.hair_length === v} onClick={() => update('hair_length', v)}>
                    {label}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 5: Hair Goals ── */}
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

        {/* ── Step 6: Ingredient Preferences + Fragrance ── */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Any ingredient preferences?</h2>
            <p className="text-sm text-gray-500 mb-6">We'll flag products with these ingredients. Select all that apply, or skip.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {INGREDIENT_PREFERENCES.map(pref => (
                <OptionButton key={pref} selected={data.sensitivities.includes(pref)} onClick={() => toggleArrayItem('sensitivities', pref)}>
                  {INGREDIENT_PREFERENCE_LABELS[pref]}
                </OptionButton>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Fragrance Preference</h3>
              <div className="grid grid-cols-3 gap-3">
                {FRAGRANCE_PREFERENCE_OPTIONS.map(f => (
                  <OptionButton key={f.value} selected={data.fragrance_preference === f.value} onClick={() => update('fragrance_preference', f.value)}>
                    {f.label}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 7: Curl Pattern (OPTIONAL — last, because porosity+texture matter more) ── */}
        {step === 7 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What's your curl pattern? <span className="text-sm font-normal text-gray-400">(optional)</span></h2>
            <p className="text-sm text-gray-500 mb-1">Curl type can change over time and varies across your head — that's normal!</p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <p className="text-xs text-amber-800">
                💡 <strong>Porosity and texture matter more than curl type for choosing products.</strong> This is optional — your porosity and strand width (already captured) are what drive our recommendations.
              </p>
            </div>
            <a
              href="https://www.reddit.com/r/curlyhair/wiki/index/#wiki_hair_typing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 mb-5 font-medium"
            >
              📸 See the r/curlyhair visual guide with real photos →
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
                className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                I'll come back to this →
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
