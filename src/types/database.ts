/**
 * Database schema definitions matching Supabase PostgreSQL schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ConversationType = 'direct' | 'group';
export type ConversationRole = 'member' | 'admin';
export type FriendshipStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export type Profile = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  type: ConversationType;
  name: string | null;
  avatar_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ConversationMember = {
  conversation_id: string;
  user_id: string;
  nickname: string | null;
  role: ConversationRole;
  joined_at: string;
};

export type Friendship = {
  id: string;
  user_a_id: string;
  user_b_id: string;
  status: FriendshipStatus;
  requested_by: string;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          display_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: Conversation;
        Insert: {
          id?: string;
          type: ConversationType;
          name?: string | null;
          avatar_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: ConversationType;
          name?: string | null;
          avatar_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversation_members: {
        Row: ConversationMember;
        Insert: {
          conversation_id: string;
          user_id: string;
          nickname?: string | null;
          role?: ConversationRole;
          joined_at?: string;
        };
        Update: {
          conversation_id?: string;
          user_id?: string;
          nickname?: string | null;
          role?: ConversationRole;
          joined_at?: string;
        };
        Relationships: [];
      };
      friendships: {
        Row: Friendship;
        Insert: {
          id?: string;
          user_a_id: string;
          user_b_id: string;
          status?: FriendshipStatus;
          requested_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_a_id?: string;
          user_b_id?: string;
          status?: FriendshipStatus;
          requested_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_member_of: {
        Args: {
          _user_id: string;
          _conversation_id: string;
        };
        Returns: boolean;
      };
      share_conversation: {
        Args: {
          _user1: string;
          _user2: string;
        };
        Returns: boolean;
      };
    };
  };
};
