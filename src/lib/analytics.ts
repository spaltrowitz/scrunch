import { supabase, isSupabaseConfigured } from './supabase'

type AnalyticsInsert = {
  event_type: string
  page_path?: string | null
  referrer?: string | null
  screen_width?: number | null
  metadata?: Record<string, unknown> | null
}

async function insertEvent(event: AnalyticsInsert) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generics don't resolve analytics_events Insert type correctly
  await (supabase.from('analytics_events') as any).insert(event)
}

export async function trackPageView(path: string) {
  if (!isSupabaseConfigured) return

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
  if (!isSupabaseConfigured) return

  try {
    await insertEvent({
      event_type: eventType,
      page_path: window.location.hash.replace('#', '') || '/',
      metadata: metadata ?? null,
    })
  } catch {
    // Analytics should never break the app
  }
}
