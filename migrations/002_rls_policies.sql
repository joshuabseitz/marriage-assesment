-- SYMBIS Backend - Row Level Security Policies
-- Run this in Supabase SQL Editor AFTER running 001_initial_schema.sql

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USER_PROFILES POLICIES
-- ============================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can search other profiles by email (for partner matching)
CREATE POLICY "Users can search profiles by email"
  ON user_profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but policy needed)
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- RESPONSES POLICIES
-- ============================================================

-- Users can view their own responses
CREATE POLICY "Users can view own responses"
  ON responses FOR SELECT
  USING (auth.uid() = user_id);

-- Partners can view each other's responses (if partnership is accepted)
CREATE POLICY "Partners can view each other responses"
  ON responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM partnerships p
      WHERE p.status = 'accepted'
      AND (
        (p.user1_id = auth.uid() AND p.user2_id = responses.user_id) OR
        (p.user2_id = auth.uid() AND p.user1_id = responses.user_id)
      )
    )
  );

-- Users can insert their own responses
CREATE POLICY "Users can insert own responses"
  ON responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own responses
CREATE POLICY "Users can update own responses"
  ON responses FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own responses
CREATE POLICY "Users can delete own responses"
  ON responses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- PARTNERSHIPS POLICIES
-- ============================================================

-- Users can view partnerships they're part of
CREATE POLICY "Users view own partnerships"
  ON partnerships FOR SELECT
  USING (auth.uid() IN (user1_id, user2_id));

-- Users can create partnership requests
CREATE POLICY "Users create partnership requests"
  ON partnerships FOR INSERT
  WITH CHECK (
    auth.uid() = requested_by AND
    auth.uid() IN (user1_id, user2_id)
  );

-- Users can update partnerships they're part of (to accept/decline)
CREATE POLICY "Users update own partnerships"
  ON partnerships FOR UPDATE
  USING (auth.uid() IN (user1_id, user2_id));

-- Users can delete partnerships they're part of
CREATE POLICY "Users delete own partnerships"
  ON partnerships FOR DELETE
  USING (auth.uid() IN (user1_id, user2_id));

-- ============================================================
-- REPORTS POLICIES
-- ============================================================

-- Partners can view their shared reports
CREATE POLICY "Partners view shared reports"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM partnerships p
      WHERE p.id = reports.partnership_id
      AND p.status = 'accepted'
      AND auth.uid() IN (p.user1_id, p.user2_id)
    )
  );

-- Partners can create reports for their accepted partnerships
CREATE POLICY "Partners create reports"
  ON reports FOR INSERT
  WITH CHECK (
    auth.uid() = generated_by AND
    EXISTS (
      SELECT 1 FROM partnerships p
      WHERE p.id = reports.partnership_id
      AND p.status = 'accepted'
      AND auth.uid() IN (p.user1_id, p.user2_id)
    )
  );

-- Partners can delete their partnership reports
CREATE POLICY "Partners delete reports"
  ON reports FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM partnerships p
      WHERE p.id = reports.partnership_id
      AND p.status = 'accepted'
      AND auth.uid() IN (p.user1_id, p.user2_id)
    )
  );

