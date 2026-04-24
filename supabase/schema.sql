-- ============================================================
-- Scrunch Database Schema for Supabase
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rqmplfyuonkikdmqngrj/sql
-- ============================================================

-- 1. PROFILES (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text not null default '',
  avatar_url text,
  curl_pattern text check (curl_pattern in ('2A','2B','2C','3A','3B','3C','4A','4B','4C')),
  porosity text check (porosity in ('low','medium','high')),
  hair_density text check (hair_density in ('thin','medium','thick')),
  hair_width text check (hair_width in ('fine','medium','coarse')),
  scalp_type text check (scalp_type in ('dry','normal','oily')),
  hair_length text check (hair_length in ('short','medium','long','extra_long')),
  color_treatment text check (color_treatment in ('virgin','color_treated','bleached','highlighted')),
  climate text check (climate in ('humid','dry','variable','tropical')),
  country text,
  zip_code text,
  wash_frequency text,
  heat_tool_usage text check (heat_tool_usage in ('never','occasionally','frequently')),
  workout_frequency text check (workout_frequency in ('rarely','few_times_week','daily')),
  cgm_experience text check (cgm_experience in ('just_starting','under_1_year','1_to_3_years','3_plus_years')),
  fragrance_preference text check (fragrance_preference in ('love_it','no_preference','fragrance_free')),
  hair_goals text[] default '{}',
  sensitivities text[] default '{}',
  onboarding_completed boolean default false,
  profile_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Curly Friend'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  name text not null,
  category text not null,
  ingredients text[] default '{}',
  cg_status text not null default 'approved' check (cg_status in ('approved', 'not_approved', 'caution')),
  flagged_ingredients jsonb default '[]',
  curlscan_status text check (curlscan_status in ('approved', 'not_approved', 'caution')),
  isitcg_status text check (isitcg_status in ('approved', 'not_approved', 'caution')),
  country_availability text[] default '{US}',
  price_range text check (price_range in ('budget','mid','premium','luxury')),
  protein_free boolean,
  fragrance_free boolean,
  key_ingredients text[] default '{}',
  image_url text,
  avg_rating numeric(3,2),
  review_count integer default 0,
  verified boolean default false,
  submitted_by uuid references auth.users(id),
  notes text,
  cruelty_free text check (cruelty_free in ('yes', 'no', 'unclear')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists products_search_idx on products
  using gin (to_tsvector('english', brand || ' ' || name));
create index if not exists products_category_idx on products (category);
create index if not exists products_cg_status_idx on products (cg_status);

-- 3. PRODUCT REVIEWS
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  rating smallint check (rating between 1 and 5),
  status text check (status in ('currently_using','used_to_use','tried_once')),
  would_repurchase text check (would_repurchase in ('yes','no','maybe')),
  application_method text,
  results_notes text,
  routine_context text check (routine_context in ('wash_day','refresh_day','deep_treatment')),
  photo_urls text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, product_id)
);

-- 4. PRODUCT REQUESTS
create table if not exists public.product_requests (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  name text not null,
  category text,
  link text,
  requested_by uuid references auth.users(id),
  status text default 'pending' check (status in ('pending','auto_reviewed','approved','rejected','fulfilled')),
  upvote_count integer default 0,
  created_at timestamptz default now()
);

-- 5. QUESTIONS (Community Q&A)
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  body text not null,
  tags text[] default '{}',
  relevant_curl_patterns text[] default '{}',
  ai_answer text,
  ai_answer_accepted boolean default false,
  posted_to_community boolean default false,
  upvote_count integer default 0,
  answer_count integer default 0,
  created_at timestamptz default now()
);

-- 6. ANSWERS
create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  body text not null,
  is_ai_generated boolean default false,
  upvote_count integer default 0,
  marked_as_helpful boolean default false,
  created_at timestamptz default now()
);

-- 7. VOTES
create table if not exists public.votes (
  user_id uuid references auth.users(id) on delete cascade,
  target_type text check (target_type in ('question','answer','product_request')),
  target_id uuid,
  vote smallint check (vote in (-1, 1)),
  primary key (user_id, target_type, target_id)
);

-- 8. ROUTINES
create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  routine_type text check (routine_type in ('wash_day','refresh','deep_treatment','custom')),
  steps jsonb not null default '[]',
  is_public boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
alter table profiles enable row level security;
create policy "Anyone can view public profiles" on profiles for select
  using (profile_public = true or id = auth.uid());
create policy "Users can insert own profile" on profiles for insert
  with check (id = auth.uid());
create policy "Users can update own profile" on profiles for update
  using (id = auth.uid());

-- Products (public read, auth insert)
alter table products enable row level security;
create policy "Products are public" on products for select using (true);
create policy "Auth users can submit products" on products for insert
  with check (auth.uid() is not null);
create policy "Auth users can update products" on products for update
  using (auth.uid() is not null);

-- Product Reviews
alter table product_reviews enable row level security;
create policy "Reviews are public" on product_reviews for select using (true);
create policy "Auth users can insert reviews" on product_reviews for insert
  with check (user_id = auth.uid());
create policy "Users can update own reviews" on product_reviews for update
  using (user_id = auth.uid());
create policy "Users can delete own reviews" on product_reviews for delete
  using (user_id = auth.uid());

-- Product Requests
alter table product_requests enable row level security;
create policy "Requests are public" on product_requests for select using (true);
create policy "Anyone can submit requests" on product_requests for insert
  with check (true);

-- Questions
alter table questions enable row level security;
create policy "Questions are public" on questions for select using (true);
create policy "Auth users can ask questions" on questions for insert
  with check (author_id = auth.uid());
create policy "Users can update own questions" on questions for update
  using (author_id = auth.uid());

-- Answers
alter table answers enable row level security;
create policy "Answers are public" on answers for select using (true);
create policy "Auth users can answer" on answers for insert
  with check (author_id = auth.uid());
create policy "Users can update own answers" on answers for update
  using (author_id = auth.uid());

-- Votes
alter table votes enable row level security;
create policy "Votes are public" on votes for select using (true);
create policy "Auth users can vote" on votes for insert
  with check (user_id = auth.uid());
create policy "Users can change own votes" on votes for update
  using (user_id = auth.uid());
create policy "Users can remove own votes" on votes for delete
  using (user_id = auth.uid());

-- Routines
alter table routines enable row level security;
create policy "Public routines visible" on routines for select
  using (is_public = true or user_id = auth.uid());
create policy "Auth users can create routines" on routines for insert
  with check (user_id = auth.uid());
create policy "Users can update own routines" on routines for update
  using (user_id = auth.uid());
create policy "Users can delete own routines" on routines for delete
  using (user_id = auth.uid());
