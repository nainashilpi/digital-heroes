-- ================================================================
-- DIGITAL HEROES PLATFORM (Level 1 PRD)
-- SUPABASE POSTGRESQL DATABASE SCHEMA & MIGRATION SCRIPT
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
  avatar_url TEXT,
  handicap NUMERIC(4, 1) DEFAULT 14.2,
  home_club TEXT DEFAULT 'St. Andrews Old Course Links',
  selected_charity_id UUID,
  charity_percentage NUMERIC(5, 2) NOT NULL DEFAULT 10.00 CHECK (charity_percentage >= 10.00 AND charity_percentage <= 100.00),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'lapsed', 'none')),
  amount NUMERIC(10, 2) NOT NULL DEFAULT 19.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  renewal_date TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. GOLF SCORES TABLE (Strict Stableford 1-45 rolling 5-score logic)
CREATE TABLE IF NOT EXISTS public.golf_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  date DATE NOT NULL,
  course_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  -- PRD requirement §05: Only one score entry is permitted per date per user
  CONSTRAINT unique_user_score_date UNIQUE (user_id, date)
);

-- 4. CHARITIES TABLE
CREATE TABLE IF NOT EXISTS public.charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Health & Medical',
    'Youth & Education',
    'Veterans & First Responders',
    'Environment & Wildlife',
    'Community Care'
  )),
  description TEXT NOT NULL,
  tagline TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  banner_url TEXT NOT NULL,
  website TEXT,
  impact_metrics JSONB DEFAULT '[]'::jsonb,
  total_raised NUMERIC(12, 2) DEFAULT 0.00,
  featured BOOLEAN DEFAULT false,
  upcoming_events JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add foreign key constraint to profiles for selected charity
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_selected_charity
  FOREIGN KEY (selected_charity_id)
  REFERENCES public.charities(id)
  ON DELETE SET NULL;

-- 5. DRAWS TABLE (PRD §06 & §07)
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  cadence TEXT NOT NULL,
  draw_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'simulated', 'published')),
  logic TEXT NOT NULL DEFAULT 'random' CHECK (logic IN ('random', 'algorithmic')),
  winning_numbers INTEGER[] DEFAULT '{}',
  total_prize_pool NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  rollover_jackpot_in NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  rollover_jackpot_out NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tiers JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_participants INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. WINNERS & VERIFICATION TABLE (PRD §09)
CREATE TABLE IF NOT EXISTS public.winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_count INTEGER NOT NULL CHECK (matched_count IN (3, 4, 5)),
  matched_numbers INTEGER[] NOT NULL,
  user_numbers INTEGER[] NOT NULL,
  prize_amount NUMERIC(12, 2) NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'unsubmitted' CHECK (verification_status IN ('unsubmitted', 'pending', 'verified', 'rejected')),
  proof_url TEXT,
  proof_notes TEXT,
  proof_submitted_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  rejection_reason TEXT,
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid')),
  payout_reference TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. DIRECT DONATIONS TABLE (PRD §08)
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  frequency TEXT NOT NULL DEFAULT 'one-time' CHECK (frequency IN ('one-time', 'monthly')),
  message TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.golf_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Charities & Draws are viewable by anyone (public visitor)
CREATE POLICY "Public charities viewable by all" ON public.charities FOR SELECT USING (true);
CREATE POLICY "Public draws viewable by all" ON public.draws FOR SELECT USING (true);

-- User profiles: Users can read/write their own profile; admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Golf scores: Users can read and mutate their own scores; admins can inspect
CREATE POLICY "Users can view own golf scores" ON public.golf_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own golf scores" ON public.golf_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own golf scores" ON public.golf_scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own golf scores" ON public.golf_scores FOR DELETE USING (auth.uid() = user_id);

-- Winners: Users can view their own winner entries; admins can view & verify all
CREATE POLICY "Users can view own winnings" ON public.winners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload verification proof" ON public.winners FOR UPDATE USING (auth.uid() = user_id);
