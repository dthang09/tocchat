-- Migration: Allow authenticated users to search and read all profiles
-- Previously, profiles had: USING (auth.uid() = id OR share_conversation(auth.uid(), id))
-- which prevented finding users who aren't already in a shared conversation.

DROP POLICY IF EXISTS "Users can read profiles of members in shared conversations" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON profiles;

CREATE POLICY "Authenticated users can read all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);
