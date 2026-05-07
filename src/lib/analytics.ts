import { supabase, isSupabaseConfigured } from './supabase'

export async function trackPageView(path: string) {
  if (!isSupabaseConfigured) return

  try {
    await supabase.from('analytics_events').insert({
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
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      page_path: window.location.hash.replace('#', '') || '/',
      metadata: metadata ?? null,
    })
  } catch {
    // Analytics should never break the app
  }
}
