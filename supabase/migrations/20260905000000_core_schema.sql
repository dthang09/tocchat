-- Create types
CREATE TYPE conversation_type AS ENUM ('direct', 'group');
CREATE TYPE conversation_role AS ENUM ('member', 'admin');

-- profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    status TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type conversation_type NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- conversation_members table
CREATE TABLE conversation_members (
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    nickname TEXT,
    role conversation_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_profiles_display_name ON profiles(display_name);
CREATE INDEX idx_conversations_created_by ON conversations(created_by);
CREATE INDEX idx_conversation_members_user_id ON conversation_members(user_id);
CREATE INDEX idx_conversation_members_conversation_id ON conversation_members(conversation_id);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Security Definer Functions for RLS to avoid infinite recursion
CREATE OR REPLACE FUNCTION is_member_of(_user_id UUID, _conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_members
    WHERE user_id = _user_id AND conversation_id = _conversation_id
  );
$$;

CREATE OR REPLACE FUNCTION share_conversation(_user1 UUID, _user2 UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_members cm1
    JOIN conversation_members cm2 ON cm1.conversation_id = cm2.conversation_id
    WHERE cm1.user_id = _user1 AND cm2.user_id = _user2
  );
$$;

-- Policies

-- Profiles
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can read profiles of members in shared conversations"
    ON profiles FOR SELECT
    USING (auth.uid() = id OR share_conversation(auth.uid(), id));

-- Conversations
CREATE POLICY "Authenticated users can create conversations"
    ON conversations FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can read conversations they are members of"
    ON conversations FOR SELECT
    USING (is_member_of(auth.uid(), id));

CREATE POLICY "Members can update conversations"
    ON conversations FOR UPDATE
    USING (is_member_of(auth.uid(), id));

-- Conversation Members
CREATE POLICY "Users can read members of their conversations"
    ON conversation_members FOR SELECT
    USING (is_member_of(auth.uid(), conversation_id));

CREATE POLICY "Users can add members to conversations they belong to or created"
    ON conversation_members FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        OR is_member_of(auth.uid(), conversation_id)
        OR EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = conversation_id AND c.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update their own membership"
    ON conversation_members FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own membership"
    ON conversation_members FOR DELETE
    USING (auth.uid() = user_id);
