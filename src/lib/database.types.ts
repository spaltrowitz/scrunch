export type CurlPattern = '2A' | '2B' | '2C' | '3A' | '3B' | '3C' | '4A' | '4B' | '4C'
export type Porosity = 'low' | 'medium' | 'high'
export type HairDensity = 'thin' | 'medium' | 'thick'
export type HairWidth = 'fine' | 'medium' | 'coarse'
export type ScalpType = 'dry' | 'normal' | 'oily'
export type HairLength = 'short' | 'medium' | 'long' | 'extra_long'
export type ColorTreatment = 'virgin' | 'color_treated' | 'bleached' | 'highlighted'
export type Climate = 'humid' | 'dry' | 'variable' | 'tropical'
export type HeatToolUsage = 'never' | 'occasionally' | 'frequently'
export type WorkoutFrequency = 'rarely' | 'few_times_week' | 'daily'
export type CgmExperience = 'just_starting' | 'under_1_year' | '1_to_3_years' | '3_plus_years'
export type FragrancePreference = 'love_it' | 'no_preference' | 'fragrance_free'
export type WaterType = 'hard' | 'soft' | 'unknown'

export type ProductCategory =
  | 'clarifying_shampoo' | 'dry_shampoo' | 'low_poo' | 'co_wash'
  | 'rinse_out_conditioner' | 'deep_conditioner' | 'leave_in_conditioner'
  | 'curl_cream' | 'gel' | 'mousse' | 'custard'
  | 'oil_serum' | 'spray_refresher' | 'protein_treatment' | 'scalp_treatment'
  | 'bond_repair'

export type CgStatus = 'approved' | 'not_approved' | 'caution'

export type ReviewStatus = 'currently_using' | 'used_to_use' | 'tried_once'
export type RepurchaseIntent = 'yes' | 'no' | 'maybe'
export type RoutineContext = 'wash_day' | 'refresh_day' | 'deep_treatment'

export interface Profile {
  id: string
  display_name: string
  avatar_url: string | null
  curl_pattern: CurlPattern | null
  porosity: Porosity | null
  hair_density: HairDensity | null
  hair_width: HairWidth | null
  scalp_type: ScalpType | null
  hair_length: HairLength | null
  color_treatment: ColorTreatment | null
  climate: Climate | null
  country: string | null
  zip_code: string | null
  wash_frequency: string | null
  water_type: WaterType | null
  heat_tool_usage: HeatToolUsage | null
  workout_frequency: WorkoutFrequency | null
  cgm_experience: CgmExperience | null
  fragrance_preference: FragrancePreference | null
  hair_goals: string[]
  sensitivities: string[]
  custom_brand: string | null
  custom_hero_ingredients: string[]
  onboarding_completed: boolean
  profile_public: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  brand: string
  name: string
  category: ProductCategory
  ingredients: string[]
  cg_status: CgStatus
  flagged_ingredients: FlaggedIngredient[]
  curlscan_status: CgStatus | null
  isitcg_status: CgStatus | null
  country_availability: string[]
  price_range: string | null
  protein_free: boolean | null
  fragrance_free: boolean | null
  key_ingredients: string[]
  avg_rating: number | null
  review_count: number
  verified: boolean
  submitted_by: string | null
  image_url: string | null
  notes: string | null
  cruelty_free: 'yes' | 'no' | 'unclear' | null
  created_at: string
  updated_at: string
}

export interface FlaggedIngredient {
  name: string
  reason: string
  severity: 'warning' | 'bad'
}

export interface ProductReview {
  id: string
  user_id: string
  product_id: string
  rating: number | null
  status: ReviewStatus | null
  would_repurchase: RepurchaseIntent | null
  application_method: string | null
  results_notes: string | null
  routine_context: RoutineContext | null
  photo_urls: string[]
  created_at: string
  updated_at: string
  // Joined fields
  product?: Product
  profile?: Pick<Profile, 'display_name' | 'curl_pattern' | 'porosity' | 'hair_density'>
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  page_path: string | null
  referrer: string | null
  screen_width: number | null
  metadata: Record<string, unknown> | null
  user_id: string | null
  created_at: string
}

export interface RoutineStepData {
  order: number
  category: ProductCategory | null
  brand: string
  product: string
  notes: string | null
}

export interface RoutineStepsPayload {
  products: RoutineStepData[]
  styling_method: string | null
  drying_method: string | null
  sleep_protection: string | null
  refresh_notes: string | null
}

export interface Routine {
  id: string
  user_id: string
  name: string
  routine_type: 'wash_day' | 'refresh' | 'deep_treatment' | 'custom'
  steps: RoutineStepsPayload | string
  is_public: boolean
  created_at: string
  updated_at: string
  profiles?: Pick<Profile, 'display_name' | 'curl_pattern' | 'porosity'> | null
}

type SupabaseRecord<T> = T & Record<string, unknown>

export interface Database {
  public: {
    Tables: {
      profiles: { Row: SupabaseRecord<Profile>; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile>; Relationships: [] }
      products: { Row: SupabaseRecord<Product>; Insert: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'avg_rating' | 'review_count'>; Update: Partial<Product>; Relationships: [] }
      product_reviews: { Row: SupabaseRecord<ProductReview>; Insert: Omit<ProductReview, 'id' | 'created_at' | 'updated_at'>; Update: Partial<ProductReview>; Relationships: [] }
      routines: {
        Row: SupabaseRecord<Routine>
        Insert: {
          user_id: string
          name: string
          routine_type: Routine['routine_type']
          steps: string
          is_public: boolean
        }
        Update: Partial<Routine>
        Relationships: []
      }
      analytics_events: { Row: SupabaseRecord<AnalyticsEvent>; Insert: { event_type: string; page_path?: string | null; referrer?: string | null; screen_width?: number | null; metadata?: Record<string, unknown> | null }; Update: Partial<AnalyticsEvent>; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
