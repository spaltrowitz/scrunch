import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rqmplfyuonkikdmqngrj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbXBsZnl1b25raWtkbXFuZ3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzAxOTMsImV4cCI6MjA5MjYwNjE5M30.XRKUcxszwbqBo1fXFWMHK58aRWf-r9qWYvczwBQ-0pk'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
export const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co'
