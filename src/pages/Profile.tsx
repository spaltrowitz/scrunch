import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { CURL_PATTERNS, POROSITY_OPTIONS } from '../lib/constants'
import type { Profile } from '../lib/database.types'

export function ProfilePage() {
  const { user } = useAuth()
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
    setProfile(data)
    setLoading(false)
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

      {!profile ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Profile not set up yet.</p>
          <a href="#/onboarding" className="text-violet-600 hover:underline text-sm">Complete onboarding →</a>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Hair Profile</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Curl Pattern</span>
                <p className="font-medium text-gray-900">
                  {profile.curl_pattern ? CURL_PATTERNS.find(c => c.value === profile.curl_pattern)?.description ?? profile.curl_pattern : 'Not set'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Porosity</span>
                <p className="font-medium text-gray-900">
                  {profile.porosity ? POROSITY_OPTIONS.find(p => p.value === profile.porosity)?.label ?? profile.porosity : 'Not set'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Hair Density</span>
                <p className="font-medium text-gray-900 capitalize">{profile.hair_density ?? 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-500">Hair Width</span>
                <p className="font-medium text-gray-900 capitalize">{profile.hair_width ?? 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-500">Climate</span>
                <p className="font-medium text-gray-900 capitalize">{profile.climate ?? 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-500">CGM Experience</span>
                <p className="font-medium text-gray-900">{profile.cgm_experience?.replace(/_/g, ' ') ?? 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Goals & Sensitivities</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Hair Goals</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.hair_goals.length > 0 ? profile.hair_goals.map(g => (
                    <span key={g} className="text-xs px-2 py-1 bg-violet-50 text-violet-700 rounded-full">
                      {g.replace(/_/g, ' ')}
                    </span>
                  )) : <span className="text-sm text-gray-400">None set</span>}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Sensitivities</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.sensitivities.length > 0 ? profile.sensitivities.map(s => (
                    <span key={s} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full">
                      {s}
                    </span>
                  )) : <span className="text-sm text-gray-400">None set</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Share profile for recommendations</p>
              <p className="text-xs text-gray-500">Allow your anonymized hair data to power recommendations for others</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${profile.profile_public ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
              {profile.profile_public ? 'Shared' : 'Private'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
