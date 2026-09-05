-- Add username column to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Create unique index on lower(username) for case-insensitive uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username_unique ON profiles (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_profiles_display_name_search ON profiles (LOWER(display_name));

-- Backfill any existing profiles without username
UPDATE profiles
SET username = LOWER(REGEXP_REPLACE(COALESCE(display_name, 'user'), '[^a-zA-Z0-9_]', '', 'g')) || '_' || SUBSTR(id::text, 1, 4)
WHERE username IS NULL;

-- Make username NOT NULL once populated if feasible, or ensure default
ALTER TABLE profiles ALTER COLUMN username SET DEFAULT '';

-- Update handle_new_user trigger to include username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  clean_username TEXT;
BEGIN
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );
  clean_username := LOWER(REGEXP_REPLACE(base_username, '[^a-zA-Z0-9_]', '', 'g'));
  IF clean_username = '' THEN
    clean_username := 'user';
  END IF;
  clean_username := clean_username || '_' || SUBSTR(NEW.id::text, 1, 4);

  INSERT INTO public.profiles (id, display_name, username, avatar_url, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1), 'Thành viên TocChat'),
    clean_username,
    NEW.raw_user_meta_data->>'avatar_url',
    'Đang hoạt động'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    username = COALESCE(public.profiles.username, EXCLUDED.username),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Friendship status type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'friendship_status') THEN
    CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');
  END IF;
END $$;

-- Friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status friendship_status NOT NULL DEFAULT 'pending',
  requested_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Canonical user pair to prevent duplicate inverted relationships: user_a_id < user_b_id
  CONSTRAINT canonical_user_pair CHECK (user_a_id < user_b_id),
  -- Prevent self-friendship
  CONSTRAINT no_self_friendship CHECK (user_a_id != user_b_id),
  -- Unique pair constraint
  CONSTRAINT unique_friendship_pair UNIQUE (user_a_id, user_b_id),
  -- Requester must be one of the participants
  CONSTRAINT valid_requester CHECK (requested_by = user_a_id OR requested_by = user_b_id)
);

-- Updated_at trigger for friendships
DROP TRIGGER IF EXISTS update_friendships_updated_at ON friendships;
CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_friendships_user_a ON friendships(user_a_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user_b ON friendships(user_b_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);
CREATE INDEX IF NOT EXISTS idx_friendships_requested_by ON friendships(requested_by);

-- Enable RLS
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Users can only read friendships involving themselves
DROP POLICY IF EXISTS "Users can view their own friendships" ON friendships;
CREATE POLICY "Users can view their own friendships"
  ON friendships FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- 2. INSERT: Only sender can create a pending request for themselves
DROP POLICY IF EXISTS "Users can send friend requests" ON friendships;
CREATE POLICY "Users can send friend requests"
  ON friendships FOR INSERT
  WITH CHECK (
    auth.uid() = requested_by
    AND (auth.uid() = user_a_id OR auth.uid() = user_b_id)
    AND status = 'pending'
  );

-- 3. UPDATE: Receiver can accept/decline; participants can block
DROP POLICY IF EXISTS "Participants can update friendship" ON friendships;
CREATE POLICY "Participants can update friendship"
  ON friendships FOR UPDATE
  USING (
    auth.uid() = user_a_id OR auth.uid() = user_b_id
  )
  WITH CHECK (
    (auth.uid() = user_a_id OR auth.uid() = user_b_id)
    AND (
      -- If accepting/declining a pending request, user must be the receiver
      (requested_by != auth.uid() AND status IN ('accepted', 'declined'))
      -- Or setting to blocked
      OR (status = 'blocked')
    )
  );

-- 4. DELETE: Sender can cancel pending; Receiver can decline; Either can unfriend accepted
DROP POLICY IF EXISTS "Participants can delete friendship" ON friendships;
CREATE POLICY "Participants can delete friendship"
  ON friendships FOR DELETE
  USING (
    auth.uid() = user_a_id OR auth.uid() = user_b_id
  );
