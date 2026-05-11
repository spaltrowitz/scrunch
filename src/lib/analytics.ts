import { supabase, isSupabaseConfigured } from './supabase'

type AnalyticsInsert = {
  event_type: string
  page_path?: string | null
  referrer?: string | null
  screen_width?: number | null
  metadata?: Record<string, unknown> | null
}

const OPT_OUT_KEY = 'scrunch_analytics_opt_out'
const MAX_METADATA_BYTES = 2048

function isOptedOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === 'true'
  } catch {
    return false
  }
}

export function setAnalyticsOptOut(optOut: boolean): void {
  try {
    if (optOut) localStorage.setItem(OPT_OUT_KEY, 'true')
    else localStorage.removeItem(OPT_OUT_KEY)
  } catch {
    // Storage may be unavailable; preference cannot be persisted but app still works
  }
}

export function getAnalyticsOptOut(): boolean {
  return isOptedOut()
}

function sanitizeMetadata(metadata?: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!metadata) return null
  try {
    const json = JSON.stringify(metadata)
    if (json.length > MAX_METADATA_BYTES) {
      return { _truncated: true, _size: json.length }
    }
    return metadata
  } catch {
    return null
  }
}

async function insertEvent(event: AnalyticsInsert) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generics don't resolve analytics_events Insert type correctly
  await (supabase.from('analytics_events') as any).insert(event)
}

export async function trackPageView(path: string) {
  if (!isSupabaseConfigured || isOptedOut()) return

  try {
    await insertEvent({
      event_type: 'page_view',
      page_path: path,
      referrer: document.referrer || null,
      screen_width: window.innerWidth,
    })
  } catch {
    // Analytics should never break the app
  }
}

export async function trackEvent(eventType: string, metadata?: Record<string, unknown>) {
  if (!isSupabaseConfigured || isOptedOut()) return

  try {
    await insertEvent({
      event_type: eventType,
      page_path: window.location.hash.replace('#', '') || '/',
      metadata: sanitizeMetadata(metadata),
    })
  } catch {
    // Analytics should never break the app
  }
}

// --- Tier 1 named helpers ---
// Using helpers (vs raw trackEvent strings) makes call sites typo-proof and
// makes the data contract greppable.

export function trackRecommendationShown(params: {
  product_id: string
  rank: number
  score?: number | null
  tier: string
  algorithm_version: string
}) {
  return trackEvent('recommendation_shown', params)
}

export function trackRecommendationEngaged(params: {
  product_id: string
  rank?: number
  tier?: string
  action: 'rate' | 'bookmark' | 'dismiss'
  algorithm_version: string
}) {
  return trackEvent('recommendation_engaged', params)
}

export function trackRatingSubmitted(params: {
  product_id: string
  rating: 'loved' | 'liked' | 'ok' | 'disliked'
  source: 'products' | 'detail' | 'recommendations'
  is_authenticated: boolean
}) {
  return trackEvent('rating_submitted', params)
}

export function trackSearchPerformed(params: {
  source: 'products' | 'community'
  query_length: number
  word_count: number
  results_count: number
}) {
  // Note: raw query text is intentionally NOT recorded — only shape stats —
  // to honor the Privacy promise (no PII in analytics).
  return trackEvent('search_performed', params)
}

export function trackFilterApplied(params: {
  filter_type: 'category' | 'brand' | 'region' | 'cg_status' | 'good_plus' | 'sort'
  value: string | null
}) {
  return trackEvent('filter_applied', params)
}

export function trackOnboardingStep(params: {
  step_index: number
  total_steps: number
  is_editing: boolean
}) {
  return trackEvent('onboarding_step_completed', params)
}

export function trackOnboardingCompleted(params: {
  total_steps: number
  is_editing: boolean
  is_authenticated: boolean
}) {
  return trackEvent('onboarding_completed', params)
}
