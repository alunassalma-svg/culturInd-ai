/*
# CulturInd.ai — Authentication & Persistent User Progress

## Purpose
Upgrades CulturInd.ai from localStorage-only state to Supabase-backed
authentication and persistent per-user progress. Every authenticated user
gets a profile row, progress record, saved outfit designs, and bookmarks
that follow them across devices.

## New Tables

### 1. user_profiles
One row per authenticated user. Stores the app-level profile that today
lives only in localStorage: nickname, avatar, age group, mode, gamification
(points, streak, badges), and favorite club.
- user_id (uuid PK, = auth.users.id, defaults to auth.uid())
- nickname (text)
- avatar_seed (text)
- avatar_pattern (text)
- avatar_color (text)
- age_group (text: under7 | kid | teen | adult)
- mode (text: Explorer | Creator | Guest | ViewOnly)
- points (int, default 0)
- streak (int, default 1)
- badges (text[], default '{}')
- favorite_club (text, nullable)
- created_at, updated_at (timestamptz)

### 2. user_progress
One row per user. Flexible JSONB columns store all learning progress so new
activity types can be added without schema changes: completed legends, quiz
scores, IRL challenges, language learning progress, dance lessons completed,
dance last step, impact counts, and any future progress keys.
- user_id (uuid PK, defaults to auth.uid())
- completed_legends (text[], default '{}')
- quiz_scores (jsonb, default '{}')   -- { quizId: bestScore }
- completed_irl (text[], default '{}')
- language_progress (jsonb, default '{}') -- { wordId: true }
- dance_progress (jsonb, default '{}')     -- { danceId: { completed: bool, lastStep: int } }
- impact_counts (jsonb, default '{}')      -- global counter contributions
- extra (jsonb, default '{}')              -- future-proof bucket
- created_at, updated_at

### 3. user_preferences
One row per user. Stores UI/UX preferences: language, learning style,
accessibility settings (text size, high contrast, reduce motion, dyslexia font).
- user_id (uuid PK, defaults to auth.uid())
- language (text: EN | ID)
- learning_style (text: Visual | Auditory | Kinesthetic)
- accessibility (jsonb)  -- { textSize, highContrast, reduceMotion, dyslexiaFont }
- created_at, updated_at

### 4. user_outfit_designs
Multiple rows per user. Each is a saved Outfit Studio creation.
- id (uuid PK)
- user_id (uuid, defaults to auth.uid())
- name (text)
- design (jsonb)  -- full design payload (garment, colors, accessories, etc.)
- created_at, updated_at

### 5. user_bookmarks
Multiple rows per user. Bookmark any content (legends, recipes, gallery items).
- id (uuid PK)
- user_id (uuid, defaults to auth.uid())
- content_type (text)  -- 'legend' | 'recipe' | 'gallery' | 'irl' | etc.
- content_id (text)
- created_at

## Security (RLS)
All five tables enable Row Level Security with owner-scoped policies.
Each table gets 4 policies (SELECT/INSERT/UPDATE/DELETE) scoped to
`TO authenticated` using `auth.uid() = user_id`. The user_id columns
default to `auth.uid()` so client inserts that omit user_id still
satisfy the INSERT WITH CHECK constraint.

## Important Notes
1. This migration is idempotent — safe to re-run.
2. No destructive operations; no existing data at risk (tables are new).
3. Email/password auth is handled by Supabase Auth (auth.users) — no
   custom auth tables. Email confirmation stays OFF.
4. Passwords are never stored in plaintext — Supabase Auth hashes them.
*/

-- ============================================================
-- 1. user_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text NOT NULL DEFAULT 'Explorer',
  avatar_seed text NOT NULL DEFAULT 'default',
  avatar_pattern text NOT NULL DEFAULT 'batik-parang',
  avatar_color text NOT NULL DEFAULT '#00D4FF',
  age_group text NOT NULL DEFAULT 'adult',
  mode text NOT NULL DEFAULT 'Explorer',
  points integer NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 1,
  badges text[] NOT NULL DEFAULT '{}',
  favorite_club text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_profile" ON user_profiles;
CREATE POLICY "delete_own_profile" ON user_profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 2. user_progress
-- ============================================================
CREATE TABLE IF NOT EXISTS user_progress (
  user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_legends text[] NOT NULL DEFAULT '{}',
  quiz_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_irl text[] NOT NULL DEFAULT '{}',
  language_progress jsonb NOT NULL DEFAULT '{}'::jsonb,
  dance_progress jsonb NOT NULL DEFAULT '{}'::jsonb,
  impact_counts jsonb NOT NULL DEFAULT '{}'::jsonb,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON user_progress;
CREATE POLICY "select_own_progress" ON user_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON user_progress;
CREATE POLICY "insert_own_progress" ON user_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON user_progress;
CREATE POLICY "update_own_progress" ON user_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_progress" ON user_progress;
CREATE POLICY "delete_own_progress" ON user_progress FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 3. user_preferences
-- ============================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  language text NOT NULL DEFAULT 'EN',
  learning_style text NOT NULL DEFAULT 'Visual',
  accessibility jsonb NOT NULL DEFAULT '{"textSize":"medium","highContrast":false,"reduceMotion":false,"dyslexiaFont":false}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_preferences" ON user_preferences;
CREATE POLICY "select_own_preferences" ON user_preferences FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_preferences" ON user_preferences;
CREATE POLICY "insert_own_preferences" ON user_preferences FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_preferences" ON user_preferences;
CREATE POLICY "update_own_preferences" ON user_preferences FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_preferences" ON user_preferences;
CREATE POLICY "delete_own_preferences" ON user_preferences FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 4. user_outfit_designs
-- ============================================================
CREATE TABLE IF NOT EXISTS user_outfit_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My Design',
  design jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_outfit_designs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_designs" ON user_outfit_designs;
CREATE POLICY "select_own_designs" ON user_outfit_designs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_designs" ON user_outfit_designs;
CREATE POLICY "insert_own_designs" ON user_outfit_designs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_designs" ON user_outfit_designs;
CREATE POLICY "update_own_designs" ON user_outfit_designs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_designs" ON user_outfit_designs;
CREATE POLICY "delete_own_designs" ON user_outfit_designs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 5. user_bookmarks
-- ============================================================
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text NOT NULL,
  content_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, content_type, content_id)
);

ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookmarks" ON user_bookmarks;
CREATE POLICY "select_own_bookmarks" ON user_bookmarks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookmarks" ON user_bookmarks;
CREATE POLICY "insert_own_bookmarks" ON user_bookmarks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookmarks" ON user_bookmarks;
CREATE POLICY "delete_own_bookmarks" ON user_bookmarks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_outfit_designs_user ON user_outfit_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON user_bookmarks(user_id);

-- ============================================================
-- updated_at trigger function (reusable)
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated ON user_profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_progress_updated ON user_progress;
CREATE TRIGGER trg_progress_updated BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_preferences_updated ON user_preferences;
CREATE TRIGGER trg_preferences_updated BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_designs_updated ON user_outfit_designs;
CREATE TRIGGER trg_designs_updated BEFORE UPDATE ON user_outfit_designs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
