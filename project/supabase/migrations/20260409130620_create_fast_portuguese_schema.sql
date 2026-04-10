
/*
  # Fast Portuguese - Complete Database Schema

  ## Summary
  Creates the full schema for the Fast Portuguese language learning SaaS app.

  ## New Tables

  ### profiles
  Stores user profile data linked to Supabase Auth users.
  - id: references auth.users
  - name: display name
  - email: user email
  - level: current CEFR level (A0-B1)
  - streak: consecutive days studied
  - last_session_date: date of last study session
  - is_premium: premium subscription status
  - created_at: account creation timestamp

  ### lessons_completed
  Tracks which lessons each user has finished.
  - id: unique record id
  - user_id: references profiles
  - lesson_number: lesson identifier
  - score: quiz score (0-100)
  - date_completed: when the lesson was finished

  ### vocabulary_learned
  Tracks vocabulary words each user has encountered and learned.
  - id: unique record id
  - user_id: references profiles
  - word: the Portuguese word/phrase
  - translation: Spanish translation
  - next_review: spaced repetition next review date
  - review_count: how many times reviewed
  - mastery: 0-5 mastery level

  ### conversation_sessions
  Stores AI conversation session metadata.
  - id: unique session id
  - user_id: references profiles
  - scenario: conversation scenario type
  - message_count: total messages exchanged
  - created_at: session start time

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  level text NOT NULL DEFAULT 'A0',
  streak integer NOT NULL DEFAULT 0,
  last_session_date date,
  is_premium boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS lessons_completed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_number integer NOT NULL,
  score integer NOT NULL DEFAULT 0,
  date_completed timestamptz DEFAULT now()
);

ALTER TABLE lessons_completed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lessons"
  ON lessons_completed FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lessons"
  ON lessons_completed FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS vocabulary_learned (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  word text NOT NULL,
  translation text NOT NULL DEFAULT '',
  next_review timestamptz DEFAULT now(),
  review_count integer NOT NULL DEFAULT 0,
  mastery integer NOT NULL DEFAULT 0,
  learned_date timestamptz DEFAULT now()
);

ALTER TABLE vocabulary_learned ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vocabulary"
  ON vocabulary_learned FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary"
  ON vocabulary_learned FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary"
  ON vocabulary_learned FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS conversation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scenario text NOT NULL DEFAULT 'general',
  messages jsonb NOT NULL DEFAULT '[]',
  message_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON conversation_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON conversation_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON conversation_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS lessons_completed_user_id_idx ON lessons_completed(user_id);
CREATE INDEX IF NOT EXISTS vocabulary_learned_user_id_idx ON vocabulary_learned(user_id);
CREATE INDEX IF NOT EXISTS vocabulary_learned_next_review_idx ON vocabulary_learned(next_review);
CREATE INDEX IF NOT EXISTS conversation_sessions_user_id_idx ON conversation_sessions(user_id);
