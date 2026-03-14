-- =============================================
-- CreatorCanvas — Supabase Database Schema
-- =============================================
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Creator Profiles
CREATE TABLE IF NOT EXISTS creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  niche TEXT NOT NULL,
  goal TEXT NOT NULL CHECK (goal IN ('followers', 'leads', 'sales')),
  target_audience JSONB DEFAULT '{}',
  posting_style TEXT NOT NULL CHECK (posting_style IN ('reels', 'carousels', 'mixed', 'stories')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Weekly Plans
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE,
  posts JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Reel Scripts
CREATE TABLE IF NOT EXISTS reel_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  script TEXT NOT NULL,
  on_screen_text TEXT DEFAULT '',
  shot_guidance TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Captions
CREATE TABLE IF NOT EXISTS captions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  variants JSONB NOT NULL DEFAULT '[]',
  hashtags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Indexes for faster queries
-- =============================================
CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_id ON weekly_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_created_at ON weekly_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reel_scripts_user_id ON reel_scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_reel_scripts_created_at ON reel_scripts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_captions_user_id ON captions(user_id);
CREATE INDEX IF NOT EXISTS idx_captions_created_at ON captions(created_at DESC);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE reel_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE captions ENABLE ROW LEVEL SECURITY;

-- Creator Profiles: users can only access their own profile
CREATE POLICY "Users can view own profile"
  ON creator_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON creator_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON creator_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Weekly Plans: users can only access their own plans
CREATE POLICY "Users can view own plans"
  ON weekly_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans"
  ON weekly_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans"
  ON weekly_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Reel Scripts: users can only access their own scripts
CREATE POLICY "Users can view own scripts"
  ON reel_scripts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scripts"
  ON reel_scripts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts"
  ON reel_scripts FOR DELETE
  USING (auth.uid() = user_id);

-- Captions: users can only access their own captions
CREATE POLICY "Users can view own captions"
  ON captions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own captions"
  ON captions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own captions"
  ON captions FOR DELETE
  USING (auth.uid() = user_id);

