# 📊 How Data is Saved in Supabase

## ✅ Current Schema (What We Have)

Your schema has these tables:
1. ✅ `creator_profiles` - User onboarding data
2. ✅ `reel_scripts` - Generated reel scripts
3. ✅ `captions` - Generated captions & hashtags
4. ✅ `videos` - Generated videos

## 🔄 How Data Flows

### 1. Reel Script Generation ✅

**Flow:**
```
User enters idea → Frontend → Backend API → OpenAI → Backend saves to Supabase
```

**What gets saved:**
- `user_id` - Who created it
- `topic` - The user's idea/prompt
- `script` - The full script text
- `on_screen_text` - Text overlays
- `shot_guidance` - Shot directions
- `created_at` - Timestamp

**Table:** `reel_scripts` ✅

**Backend Route:** `/api/reel-script/generate` ✅

### 2. Caption Generation ✅

**Flow:**
```
User enters topic → Frontend → Backend API → OpenAI → Backend saves to Supabase
```

**What gets saved:**
- `user_id` - Who created it
- `topic` - The post topic
- `variants` - Array of 3 caption options (JSONB)
- `hashtags` - Array of hashtags (TEXT[])
- `created_at` - Timestamp

**Table:** `captions` ✅

**Backend Route:** `/api/captions/generate` ✅

### 3. Video Generation ⚠️

**Flow:**
```
User enters description → Frontend → Backend API → Sora/Video AI → Backend saves to Supabase
```

**What should be saved:**
- `user_id` - Who created it
- `description` - Video description
- `video_url` - URL to generated video
- `status` - pending/processing/completed/failed
- `metadata` - Additional data (JSONB)
- `created_at` - Timestamp

**Table:** `videos` ✅ (exists in schema)

**Backend Route:** ❌ **MISSING** - Need to create `/api/video/generate`

### 4. Calendar/Weekly Plans ⚠️ **PROBLEM**

**Current Status:**
- ❌ `weekly_plans` table was **removed** from schema
- ⚠️ Backend route `/api/weekly-plan/generate` **still exists** and tries to save to `weekly_plans`
- ❌ This will **FAIL** because table doesn't exist

**What the backend tries to save:**
- `user_id` - Who created it
- `week_start` - Date of week start
- `posts` - Array of 5 post objects (JSONB)

**Table:** `weekly_plans` ❌ **DOESN'T EXIST**

**Backend Route:** `/api/weekly-plan/generate` ⚠️ **WILL FAIL**

## 🐛 Issues Found

### Issue 1: Weekly Plans Table Missing
- Schema doesn't have `weekly_plans` table
- Backend route tries to use it
- **Result:** Weekly plan generation will fail with "table doesn't exist" error

### Issue 2: Video Generation Route Missing
- Schema has `videos` table ✅
- No backend route to save videos ❌
- **Result:** Video generation can't save to database

## ✅ What Works Right Now

1. **Reel Scripts** ✅
   - Schema: ✅ Has table
   - Backend: ✅ Saves to database
   - **Status:** Fully working

2. **Captions** ✅
   - Schema: ✅ Has table
   - Backend: ✅ Saves to database
   - **Status:** Fully working

3. **Videos** ⚠️
   - Schema: ✅ Has table
   - Backend: ❌ No route to save
   - **Status:** Table ready, but no save functionality

4. **Weekly Plans/Calendar** ❌
   - Schema: ❌ No table
   - Backend: ⚠️ Route exists but will fail
   - **Status:** Will break if used

## 🔧 What Needs to Be Fixed

### Option 1: Add Weekly Plans Back (If You Want Calendar Feature)

Add this to your schema:
```sql
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE,
  posts JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_id ON weekly_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_created_at ON weekly_plans(created_at DESC);

ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans"
  ON weekly_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans"
  ON weekly_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans"
  ON weekly_plans FOR DELETE
  USING (auth.uid() = user_id);
```

### Option 2: Remove Weekly Plans Route (If You Don't Want Calendar)

Remove or disable the weekly plan route from backend.

### Option 3: Create Video Generation Route

Create `/api/video/generate` route to save videos to `videos` table.

## 📋 Summary

**Currently Working:**
- ✅ Reel scripts save to `reel_scripts` table
- ✅ Captions save to `captions` table

**Needs Fix:**
- ⚠️ Weekly plans route will fail (table missing)
- ⚠️ Video generation route doesn't exist

**Your Question:** "Does the schema handle everything?"

**Answer:** 
- ✅ Schema handles reel scripts and captions perfectly
- ✅ Schema has videos table ready
- ❌ Schema is missing weekly_plans table (but backend route expects it)
- ⚠️ Need to either add weekly_plans table OR remove the route

---

**Next Step:** Do you want weekly plans/calendar feature? If yes, I'll add the table back. If no, I'll remove the route.

