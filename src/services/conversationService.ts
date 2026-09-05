import { supabase } from '../lib/supabase';
import type { Conversation, ConversationMember, Profile, ConversationType } from '../types';

export interface ConversationMemberWithProfile extends ConversationMember {
  profile: Profile | null;
}

export interface ConversationWithDetails extends Conversation {
  members: ConversationMemberWithProfile[];
  memberCount: number;
}

export interface CreateGroupParams {
  name: string;
  avatar_url?: string | null;
  member_ids: string[];
}

export const conversationService = {
  /**
   * Fetch all registered profiles in this private group (excluding current user by default)
   */
  async getAvailableProfiles(currentUserId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId)
      .order('display_name', { ascending: true });

    if (error) {
      console.warn('[conversationService] getAvailableProfiles error:', error.message);
      return [];
    }

    return (data as Profile[]) || [];
  },

  /**
   * Fetch conversations the user is a member of, with all member details
   */
  async getUserConversations(userId: string): Promise<ConversationWithDetails[]> {
    // 1. Get conversation IDs where the user is a member
    const { data: memberRows, error: memberError } = await supabase
      .from('conversation_members')
      .select('conversation_id')
      .eq('user_id', userId);

    if (memberError) {
      console.warn('[conversationService] getUserConversations error:', memberError.message);
      return [];
    }

    if (!memberRows || memberRows.length === 0) {
      return [];
    }

    const conversationIds = memberRows.map((r) => r.conversation_id);

    // 2. Fetch conversation metadata
    const { data: conversationsData, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });

    if (convError || !conversationsData) {
      console.warn('[conversationService] fetch conversations error:', convError?.message);
      return [];
    }

    // 3. Fetch all members and their profiles for these conversations
    const { data: allMembersData } = await supabase
      .from('conversation_members')
      .select('*')
      .in('conversation_id', conversationIds);

    const allMembers = (allMembersData as ConversationMember[]) || [];
    const allUserIds = Array.from(new Set(allMembers.map((m) => m.user_id)));

    let profilesMap: Record<string, Profile> = {};
    if (allUserIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', allUserIds);

      if (profilesData) {
        profilesMap = (profilesData as Profile[]).reduce((acc, p) => {
          acc[p.id] = p;
          return acc;
        }, {} as Record<string, Profile>);
      }
    }

    // 4. Combine into ConversationWithDetails
    const result: ConversationWithDetails[] = (conversationsData as Conversation[]).map((conv) => {
      const membersForConv = allMembers.filter((m) => m.conversation_id === conv.id);
      const membersWithProfile: ConversationMemberWithProfile[] = membersForConv.map((m) => ({
        ...m,
        profile: profilesMap[m.user_id] || null,
      }));

      // For direct conversations without an explicit name, derive name from other participant
      let derivedName = conv.name;
      let derivedAvatar = conv.avatar_url;

      if (conv.type === 'direct' && !derivedName) {
        const otherMember = membersWithProfile.find((m) => m.user_id !== userId);
        if (otherMember?.profile) {
          derivedName = otherMember.profile.display_name || 'Người dùng TocChat';
          derivedAvatar = derivedAvatar || otherMember.profile.avatar_url;
        }
      }

      return {
        ...conv,
        name: derivedName,
        avatar_url: derivedAvatar,
        members: membersWithProfile,
        memberCount: membersWithProfile.length,
      };
    });

    return result;
  },

  /**
   * Fetch single conversation by ID with member profiles
   */
  async getConversationById(
    conversationId: string,
    currentUserId?: string
  ): Promise<ConversationWithDetails | null> {
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .maybeSingle();

    if (convError || !conv) {
      console.warn('[conversationService] getConversationById error:', convError?.message);
      return null;
    }

    // Fetch members
    const { data: membersData } = await supabase
      .from('conversation_members')
      .select('*')
      .eq('conversation_id', conversationId);

    const members = (membersData as ConversationMember[]) || [];
    const userIds = members.map((m) => m.user_id);

    let profilesMap: Record<string, Profile> = {};
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesData) {
        profilesMap = (profilesData as Profile[]).reduce((acc, p) => {
          acc[p.id] = p;
          return acc;
        }, {} as Record<string, Profile>);
      }
    }

    const membersWithProfile: ConversationMemberWithProfile[] = members.map((m) => ({
      ...m,
      profile: profilesMap[m.user_id] || null,
    }));

    let derivedName = conv.name;
    let derivedAvatar = conv.avatar_url;

    if (conv.type === 'direct' && !derivedName && currentUserId) {
      const otherMember = membersWithProfile.find((m) => m.user_id !== currentUserId);
      if (otherMember?.profile) {
        derivedName = otherMember.profile.display_name || 'Người dùng TocChat';
        derivedAvatar = derivedAvatar || otherMember.profile.avatar_url;
      }
    }

    return {
      ...(conv as Conversation),
      name: derivedName,
      avatar_url: derivedAvatar,
      members: membersWithProfile,
      memberCount: membersWithProfile.length,
    };
  },

  /**
   * Create a group conversation with name, optional avatar, and selected members
   */
  async createGroupConversation(
    creatorId: string,
    params: CreateGroupParams
  ): Promise<ConversationWithDetails> {
    const trimmedName = params.name.trim();
    if (!trimmedName) {
      throw new Error('Vui lòng nhập tên nhóm.');
    }

    const convId = crypto.randomUUID();
    const now = new Date().toISOString();

    // 1. Insert conversation row without .select() to prevent SELECT policy evaluation before membership exists
    const { error: convError } = await supabase
      .from('conversations')
      .insert({
        id: convId,
        type: 'group' as ConversationType,
        name: trimmedName,
        avatar_url: params.avatar_url || null,
        created_by: creatorId,
        created_at: now,
        updated_at: now,
      });

    if (convError) {
      throw new Error(`Không thể tạo nhóm: ${convError.message}`);
    }

    // 2. Insert creator membership first so creator is officially a member
    const { error: creatorMemberError } = await supabase
      .from('conversation_members')
      .insert({
        conversation_id: convId,
        user_id: creatorId,
        role: 'admin',
        joined_at: now,
      });

    if (creatorMemberError) {
      console.warn('[conversationService] add creator member error:', creatorMemberError.message);
    }

    // 3. Insert other members
    const otherMemberIds = params.member_ids.filter((id) => id !== creatorId);
    if (otherMemberIds.length > 0) {
      const otherMemberRows = otherMemberIds.map((uid) => ({
        conversation_id: convId,
        user_id: uid,
        role: 'member' as const,
        joined_at: now,
      }));

      const { error: othersError } = await supabase
        .from('conversation_members')
        .insert(otherMemberRows);

      if (othersError) {
        console.warn('[conversationService] add other members error:', othersError.message);
      }
    }

    const allMemberIds = [creatorId, ...otherMemberIds];
    const detailed = await conversationService.getConversationById(convId, creatorId);
    return (
      detailed || {
        id: convId,
        type: 'group',
        name: trimmedName,
        avatar_url: params.avatar_url || null,
        created_by: creatorId,
        created_at: now,
        updated_at: now,
        members: [],
        memberCount: allMemberIds.length,
      }
    );
  },

  /**
   * Create or find an existing direct 1-on-1 conversation
   */
  async createDirectConversation(
    creatorId: string,
    recipientId: string
  ): Promise<ConversationWithDetails> {
    if (creatorId === recipientId) {
      throw new Error('Không thể tạo cuộc trò chuyện với chính mình.');
    }

    // Check if direct conversation already exists between creator and recipient
    const { data: myMemberships } = await supabase
      .from('conversation_members')
      .select('conversation_id')
      .eq('user_id', creatorId);

    if (myMemberships && myMemberships.length > 0) {
      const myConvIds = myMemberships.map((m) => m.conversation_id);
      const { data: sharedRows } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', recipientId)
        .in('conversation_id', myConvIds);

      if (sharedRows && sharedRows.length > 0) {
        for (const row of sharedRows) {
          const conv = await conversationService.getConversationById(row.conversation_id, creatorId);
          if (conv && conv.type === 'direct') {
            return conv;
          }
        }
      }
    }

    const convId = crypto.randomUUID();
    const now = new Date().toISOString();

    // If not found, create new direct conversation without immediate .select()
    const { error: convError } = await supabase
      .from('conversations')
      .insert({
        id: convId,
        type: 'direct' as ConversationType,
        name: null,
        avatar_url: null,
        created_by: creatorId,
        created_at: now,
        updated_at: now,
      });

    if (convError) {
      throw new Error(`Không thể bắt đầu cuộc trò chuyện: ${convError.message}`);
    }

    // Insert creator first, then recipient
    await supabase.from('conversation_members').insert([
      { conversation_id: convId, user_id: creatorId, role: 'member', joined_at: now },
      { conversation_id: convId, user_id: recipientId, role: 'member', joined_at: now },
    ]);

    const detailed = await conversationService.getConversationById(convId, creatorId);
    return (
      detailed || {
        id: convId,
        type: 'direct',
        name: null,
        avatar_url: null,
        created_by: creatorId,
        created_at: now,
        updated_at: now,
        members: [],
        memberCount: 2,
      }
    );
  },
};
