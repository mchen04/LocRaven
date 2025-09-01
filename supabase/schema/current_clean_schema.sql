-- LocRaven Clean Database Schema - CURRENT VERSION  
-- Generated: 2025-01-02
-- Reflects optimized database structure after cleanup
-- 8 focused tables for AI-optimized local business page generation

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

CREATE TYPE primary_category AS ENUM (
  'food-dining',
  'shopping', 
  'beauty-grooming',
  'health-medical',
  'repairs-services',
  'professional-services',
  'activities-entertainment',
  'education-training',
  'creative-digital',
  'transportation-delivery'
);

CREATE TYPE static_tag AS ENUM (
  'online-only',
  'physical-location',
  'hybrid',
  'mobile-service',
  'delivery-available',
  'pickup-available',
  'ships-nationwide',
  '24-hours',
  'emergency-service',
  'same-day',
  'by-appointment',
  'walk-ins',
  'online-booking',
  'instant-service',
  'subscription',
  'one-time',
  'hourly',
  'project-based',
  'free-consultation',
  'free-trial',
  'freemium',
  'locally-owned',
  'franchise',
  'certified',
  'licensed',
  'women-owned',
  'veteran-owned',
  'minority-owned',
  'wheelchair-accessible',
  'remote-available',
  'multilingual',
  'beginner-friendly',
  'kid-friendly',
  'pet-friendly'
);

CREATE TYPE subscription_status AS ENUM (
  'incomplete',
  'incomplete_expired', 
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'paused'
);

-- ============================================================================
-- CORE BUSINESS TABLES
-- ============================================================================

-- businesses table - Central business information repository
CREATE TABLE businesses (
  -- Core Identity (4 fields)
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(255),
  email text UNIQUE,
  slug text UNIQUE,
  
  -- Location Data (5 fields)  
  address_street varchar(255),
  address_city varchar(255),
  address_state varchar(255),
  zip_code text,
  country text DEFAULT 'US',
  
  -- Contact Information (3 fields)
  phone varchar(20) CHECK (phone IS NULL OR phone ~ '^[0-9]{10,15}$'),
  phone_country_code varchar(10) DEFAULT '+1',
  website varchar(500),
  
  -- Business Information (2 fields)
  primary_category primary_category,
  description text,
  
  -- Business Features (1 field)
  static_tags static_tag[] CHECK (array_length(static_tags, 1) <= 5),
  
  -- AI Fields (2 fields - key for AI query matching)
  specialties jsonb DEFAULT '[]'::jsonb,
  services jsonb DEFAULT '[]'::jsonb,
  
  -- Basic Operations (2 fields)
  hours text,
  price_positioning varchar(50), -- 'budget', 'mid-range', 'premium', 'luxury'
  
  -- Authority Signals (2 fields)
  awards jsonb DEFAULT '[]'::jsonb,
  certifications jsonb DEFAULT '[]'::jsonb,
  
  -- Social Media (1 field)
  social_media jsonb DEFAULT '{}'::jsonb,
  
  -- Enhanced Fields for AI Discoverability
  latitude numeric,
  longitude numeric,
  availability_policy jsonb DEFAULT '{"type": "contact-for-availability"}'::jsonb,
  payment_methods text[] DEFAULT ARRAY['Cash', 'Credit Card'],
  languages_spoken text[] DEFAULT ARRAY['English'],
  parking_info text,
  accessibility_features text[],
  business_faqs jsonb DEFAULT '[]'::jsonb,
  service_area text,
  structured_hours jsonb,
  featured_items jsonb DEFAULT '[]'::jsonb,
  review_summary jsonb,
  status_override varchar(50) CHECK (status_override IS NULL OR status_override IN ('closed_emergency', 'closed_holiday', 'closed_maintenance', 'temporarily_closed', 'normal_operations')),
  enhanced_parking_info jsonb DEFAULT '{}'::jsonb,
  service_area_details jsonb DEFAULT '{}'::jsonb,
  
  -- System Fields (3 fields)
  established_year integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- updates table - Business updates and content input
CREATE TABLE updates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  content_text text NOT NULL,
  status varchar NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  ai_provider varchar DEFAULT 'gemini',
  created_at timestamptz DEFAULT now(),
  error_message text,
  processing_time_ms integer,
  special_hours_today jsonb,
  deal_terms text,
  expiration_date_time timestamp,
  update_category varchar DEFAULT 'general' CHECK (update_category IN ('general', 'special', 'hours', 'event', 'new_service', 'closure')),
  update_faqs jsonb DEFAULT '[]'::jsonb
);

-- generated_pages table - AI-generated HTML pages
CREATE TABLE generated_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  update_id uuid NOT NULL REFERENCES updates(id) ON DELETE NO ACTION,
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  file_path varchar NOT NULL UNIQUE,
  title varchar NOT NULL,
  html_content text,
  content_intent varchar,
  created_at timestamptz DEFAULT now(),
  slug text UNIQUE,
  page_type text CHECK (page_type IN ('business', 'update', 'category', 'location')),
  expires_at timestamptz,
  expired boolean DEFAULT false,
  expired_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  dynamic_tags text[],
  tags_expire_at timestamptz,
  ai_citation_score integer DEFAULT 0,
  last_status_calculation timestamp,
  intent_type varchar DEFAULT 'direct' CHECK (intent_type IN ('direct', 'local', 'category', 'branded-local', 'service-urgent', 'competitive')),
  page_variant varchar,
  generation_batch_id uuid,
  published boolean DEFAULT false,
  published_at timestamptz,
  template_id varchar,
  page_data jsonb,
  rendered_size_kb integer
);

-- ============================================================================
-- SUBSCRIPTION SYSTEM (Stripe Integration)
-- ============================================================================

-- products table - Stripe product definitions
CREATE TABLE products (
  id text PRIMARY KEY,
  active boolean DEFAULT true,
  name text,
  description text,
  image text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created timestamptz DEFAULT timezone('utc', now()),
  updated timestamptz DEFAULT timezone('utc', now())
);

-- prices table - Stripe pricing tiers
CREATE TABLE prices (
  id text PRIMARY KEY,
  product_id text REFERENCES products(id),
  active boolean DEFAULT true,
  currency text DEFAULT 'usd',
  interval text CHECK (interval IN ('day', 'week', 'month', 'year')),
  interval_count integer DEFAULT 1,
  trial_period_days integer DEFAULT 0,
  type text CHECK (type IN ('one_time', 'recurring')),
  unit_amount bigint,
  metadata jsonb DEFAULT '{}'::jsonb,
  created timestamptz DEFAULT timezone('utc', now()),
  updated timestamptz DEFAULT timezone('utc', now())
);

-- subscriptions table - User subscription records
CREATE TABLE subscriptions (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  price_id text REFERENCES prices(id),
  status subscription_status,
  metadata jsonb DEFAULT '{}',
  quantity integer,
  cancel_at_period_end boolean DEFAULT false,
  created timestamptz DEFAULT timezone('utc', now()),
  current_period_start timestamptz,
  current_period_end timestamptz,
  ended_at timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz
);

-- ============================================================================
-- SYSTEM UTILITIES
-- ============================================================================

-- business_usage_tracking table - Track plan limits
CREATE TABLE business_usage_tracking (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  usage_period_start timestamptz NOT NULL,
  usage_period_end timestamptz NOT NULL,
  updates_used integer DEFAULT 0,
  updates_limit integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- cache_invalidation_queue table - Cache management
CREATE TABLE cache_invalidation_queue (
  id serial PRIMARY KEY,
  cache_key varchar(255) NOT NULL,
  invalidation_type varchar(50) NOT NULL, -- 'category_page', 'business_profile', 'event_page'
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed'))
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Core business indexes
CREATE INDEX IF NOT EXISTS idx_businesses_email ON businesses(email);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_primary_category ON businesses(primary_category);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(address_city, address_state);

-- Update indexes
CREATE INDEX IF NOT EXISTS idx_updates_business_id ON updates(business_id);
CREATE INDEX IF NOT EXISTS idx_updates_status ON updates(status);

-- Generated pages indexes
CREATE INDEX IF NOT EXISTS idx_generated_pages_business_id ON generated_pages(business_id);
CREATE INDEX IF NOT EXISTS idx_generated_pages_file_path ON generated_pages(file_path);
CREATE INDEX IF NOT EXISTS idx_generated_pages_expires_at ON generated_pages(expires_at);
CREATE INDEX IF NOT EXISTS idx_generated_pages_expired ON generated_pages(expired);

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_price_id ON subscriptions(price_id);

-- Cache indexes
CREATE INDEX IF NOT EXISTS idx_cache_invalidation_processing ON cache_invalidation_queue(status, created_at) WHERE status = 'pending';

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_invalidation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Auth helper function
CREATE OR REPLACE FUNCTION auth_user_email()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'email',
    current_setting('request.jwt.claims', true)::json->'user_metadata'->>'email',
    ''
  )
$$;

-- Businesses table policies
CREATE POLICY "Users can view their own business profiles" ON businesses
  FOR SELECT USING (email = auth_user_email());

CREATE POLICY "Users can insert their own business profiles" ON businesses
  FOR INSERT WITH CHECK (email = auth_user_email());

CREATE POLICY "Users can update their own business profiles" ON businesses
  FOR UPDATE USING (email = auth_user_email()) WITH CHECK (email = auth_user_email());

CREATE POLICY "Users can delete their own business profiles" ON businesses
  FOR DELETE USING (email = auth_user_email());

-- Updates table policies
CREATE POLICY "Users can view their own updates" ON updates
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE email = auth_user_email())
  );

CREATE POLICY "Users can insert updates for their own businesses" ON updates
  FOR INSERT WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE email = auth_user_email())
  );

-- Generated pages table policies
CREATE POLICY "Users can view their own generated pages" ON generated_pages
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE email = auth_user_email())
  );

CREATE POLICY "Users can insert pages for their own businesses" ON generated_pages
  FOR INSERT WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE email = auth_user_email())
  );

-- Subscription policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Product/Price policies (public read, service manage)
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (active = true);

CREATE POLICY "Anyone can view active prices" ON prices
  FOR SELECT USING (active = true);

CREATE POLICY "Service role can manage products" ON products
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage prices" ON prices
  FOR ALL USING (auth.role() = 'service_role');

-- Update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_businesses_updated_at 
  BEFORE UPDATE ON businesses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CURRENT ARCHITECTURE SUMMARY
-- ============================================================================

/*
OPTIMIZED STRUCTURE - 8 FOCUSED TABLES:

CORE BUSINESS (3 tables):
- businesses: Central business data repository
- updates: Raw content input for AI processing
- generated_pages: AI-generated HTML output

SUBSCRIPTION SYSTEM (3 tables):
- products: Plan definitions (Basic, Pro, Enterprise)
- prices: Pricing tiers (monthly/yearly)
- subscriptions: User subscription records

SYSTEM UTILITIES (2 tables):
- business_usage_tracking: Plan usage limits
- cache_invalidation_queue: Cache management

REMOVED TABLES (cleanup completed):
- subscription_plans (redundant with products)
- user_subscriptions (redundant with subscriptions)
- agent_conversations (historical chat data)
- business_events (unused planned feature)
- agent_analytics (empty)
- performance_alerts (empty)

BUSINESS FLOW:
1. Business signs up → businesses table
2. Creates update → updates table
3. AI processes → generated_pages created
4. Pages published → Available at URLs
5. Usage tracked → business_usage_tracking
6. Cache managed → cache_invalidation_queue

This schema is optimized for LocRaven's core mission:
Generating AI-optimized pages for local businesses.
*/