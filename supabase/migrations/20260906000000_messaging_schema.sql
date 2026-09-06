-- Create message type
CREATE TYPE message_type AS ENUM ('text', 'image', 'video', 'audio', 'file', 'sticker', 'link', 'system', 'bot');

-- messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    type message_type NOT NULL DEFAULT 'text',
    content TEXT,
    reply_to_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    edited_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    metadata JSONB
);

-- attachments table
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    thumbnail_path TEXT,
    file_name TEXT NOT NULL,
    mime_type TEXT,
    file_size BIGINT,
    width INTEGER,
    height INTEGER,
    duration INTEGER,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- message_reactions table
CREATE TABLE message_reactions (
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (message_id, user_id, emoji)
);

-- message_reads table
CREATE TABLE message_reads (
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (message_id, user_id)
);

-- pinned_messages table
CREATE TABLE pinned_messages (
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    pinned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    pinned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (conversation_id, message_id)
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE pinned_messages ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_reply_to_message_id ON messages(reply_to_message_id);

CREATE INDEX idx_attachments_message_id ON attachments(message_id);

CREATE INDEX idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON message_reactions(user_id);

CREATE INDEX idx_message_reads_message_id ON message_reads(message_id);
CREATE INDEX idx_message_reads_user_id ON message_reads(user_id);

CREATE INDEX idx_pinned_messages_conversation_id ON pinned_messages(conversation_id);
CREATE INDEX idx_pinned_messages_message_id ON pinned_messages(message_id);

-- Policies

-- messages
CREATE POLICY "Users can read messages in their conversations"
    ON messages FOR SELECT
    USING (is_member_of(auth.uid(), conversation_id));

CREATE POLICY "Users can insert messages in their conversations"
    ON messages FOR INSERT
    WITH CHECK (is_member_of(auth.uid(), conversation_id) AND auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
    ON messages FOR UPDATE
    USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages"
    ON messages FOR DELETE
    USING (auth.uid() = sender_id);

-- attachments
CREATE POLICY "Users can read attachments in their conversations"
    ON attachments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM messages m
            WHERE m.id = message_id AND is_member_of(auth.uid(), m.conversation_id)
        )
    );

CREATE POLICY "Users can insert attachments for their own messages"
    ON attachments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM messages m
            WHERE m.id = message_id AND m.sender_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete attachments for their own messages"
    ON attachments FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM messages m
            WHERE m.id = message_id AND m.sender_id = auth.uid()
        )
    );

-- message_reactions
CREATE POLICY "Users can read reactions in their conversations"
    ON message_reactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM messages m
            WHERE m.id = message_id AND is_member_of(auth.uid(), m.conversation_id)
        )
    );

CREATE POLICY "Users can insert their own reactions"
    ON message_reactions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM messages m
            WHERE m.id = message_id AND is_member_of(auth.uid(), m.conversation_id)
        )
        AND auth.uid() = user_id
    );

CREATE POLICY "Users can delete their own reactions"
    ON message_reactions FOR DELETE
    USING (auth.uid() = user_id);

-- message_reads
CREATE POLICY "Users can read read receipts in their conversations"
    ON message_reads FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM messages m
            WHERE m.id = message_id AND is_member_of(auth.uid(), m.conversation_id)
        )
    );

CREATE POLICY "Users can insert their own read receipts"
    ON message_reads FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM messages m
            WHERE m.id = message_id AND is_member_of(auth.uid(), m.conversation_id)
        )
        AND auth.uid() = user_id
    );

CREATE POLICY "Users can update their own read receipts"
    ON message_reads FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own read receipts"
    ON message_reads FOR DELETE
    USING (auth.uid() = user_id);

-- pinned_messages
CREATE POLICY "Users can read pinned messages in their conversations"
    ON pinned_messages FOR SELECT
    USING (is_member_of(auth.uid(), conversation_id));

CREATE POLICY "Users can pin messages in their conversations"
    ON pinned_messages FOR INSERT
    WITH CHECK (is_member_of(auth.uid(), conversation_id) AND auth.uid() = pinned_by);

CREATE POLICY "Users can unpin messages in their conversations"
    ON pinned_messages FOR DELETE
    USING (is_member_of(auth.uid(), conversation_id));
