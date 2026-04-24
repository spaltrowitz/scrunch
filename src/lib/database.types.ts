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

export type ProductCategory =
  | 'clarifying_shampoo' | 'low_poo' | 'co_wash'
  | 'rinse_out_conditioner' | 'deep_conditioner' | 'leave_in_conditioner'
  | 'curl_cream' | 'gel' | 'mousse' | 'custard'
  | 'oil_serum' | 'spray_refresher' | 'protein_treatment' | 'scalp_treatment'

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
  heat_tool_usage: HeatToolUsage | null
  workout_frequency: WorkoutFrequency | null
  cgm_experience: CgmExperience | null
  fragrance_preference: FragrancePreference | null
  hair_goals: string[]
  sensitivities: string[]
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
  status_conflict: boolean
  country_availability: string[]
  price_range: string | null
  protein_free: boolean | null
  fragrance_free: boolean | null
  key_ingredients: string[]
  avg_rating: number | null
  review_count: number
  verified: boolean
  submitted_by: string | null
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
  rating: number
  status: ReviewStatus
  would_repurchase: RepurchaseIntent
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

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> }
      products: { Row: Product; Insert: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'avg_rating' | 'review_count' | 'status_conflict'>; Update: Partial<Product> }
      product_reviews: { Row: ProductReview; Insert: Omit<ProductReview, 'id' | 'created_at' | 'updated_at'>; Update: Partial<ProductReview> }
    }
  }
}
