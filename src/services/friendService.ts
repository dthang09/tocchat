import { supabase } from '../lib/supabase';
import type { Friendship, Profile, FriendshipStatus } from '../types';

export type RelationshipState =
  | 'none'
  | 'pending_sent'
  | 'pending_received'
  | 'accepted'
  | 'declined'
  | 'blocked';

export interface UserSearchResult {
  profile: Profile;
  relationship: RelationshipState;
  friendshipId?: string;
}

export interface FriendItem {
  friendshipId: string;
  friend: Profile;
  created_at: string;
}

export interface FriendRequestsSummary {
  incoming: { friendship: Friendship; sender: Profile }[];
  sent: { friendship: Friendship; recipient: Profile }[];
}

export const friendService = {
  /**
   * Helper to ensure user pair is ordered canonically (user_a_id < user_b_id)
   */
  getCanonicalPair(userId1: string, userId2: string): { user_a_id: string; user_b_id: string } {
    if (userId1 === userId2) {
      throw new Error('Không thể kết bạn với chính mình.');
    }
    return userId1 < userId2
      ? { user_a_id: userId1, user_b_id: userId2 }
      : { user_a_id: userId2, user_b_id: userId1 };
  },

  /**
   * Search registered users by username or display name
   * Does not return the current user
   */
  async searchUsers(query: string, currentUserId: string): Promise<UserSearchResult[]> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    // Query profiles matching username or display_name
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, display_name, username, avatar_url, status, created_at, updated_at')
      .neq('id', currentUserId)
      .or(`display_name.ilike.%${trimmed}%,username.ilike.%${trimmed}%`)
      .limit(25);

    if (error) {
      console.warn('[friendService] searchUsers error:', error.message);
      return [];
    }

    if (!profiles || profiles.length === 0) return [];

    // Query any existing friendships involving current user and these found users
    const { data: friendshipsData } = await supabase
      .from('friendships')
      .select('*')
      .or(`user_a_id.eq.${currentUserId},user_b_id.eq.${currentUserId}`);

    const existingFriendships = (friendshipsData as Friendship[]) || [];

    return (profiles as Profile[]).map((profile) => {
      const friendship = existingFriendships.find(
        (f) =>
          (f.user_a_id === profile.id && f.user_b_id === currentUserId) ||
          (f.user_a_id === currentUserId && f.user_b_id === profile.id)
      );

      let relationship: RelationshipState = 'none';

      if (friendship) {
        if (friendship.status === 'accepted') {
          relationship = 'accepted';
        } else if (friendship.status === 'pending') {
          relationship =
            friendship.requested_by === currentUserId
              ? 'pending_sent'
              : 'pending_received';
        } else if (friendship.status === 'declined') {
          relationship = 'declined';
        } else if (friendship.status === 'blocked') {
          relationship = 'blocked';
        }
      }

      return {
        profile,
        relationship,
        friendshipId: friendship?.id,
      };
    });
  },

  /**
   * Get list of accepted friends for a user
   */
  async getFriends(userId: string): Promise<FriendItem[]> {
    const { data: friendships, error } = await supabase
      .from('friendships')
      .select('*')
      .eq('status', 'accepted')
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('[friendService] getFriends error:', error.message);
      return [];
    }

    if (!friendships || friendships.length === 0) return [];

    // Extract friend IDs
    const friendIds = friendships.map((f) =>
      f.user_a_id === userId ? f.user_b_id : f.user_a_id
    );

    const { data: profiles, error: pError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', friendIds);

    if (pError || !profiles) return [];

    const profilesMap = (profiles as Profile[]).reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {} as Record<string, Profile>);

    return (friendships as Friendship[])
      .map((f) => {
        const friendId = f.user_a_id === userId ? f.user_b_id : f.user_a_id;
        const friend = profilesMap[friendId];
        if (!friend) return null;
        return {
          friendshipId: f.id,
          friend,
          created_at: f.created_at,
        };
      })
      .filter((item): item is FriendItem => Boolean(item));
  },

  /**
   * Get pending incoming and sent friend requests
   */
  async getPendingRequests(userId: string): Promise<FriendRequestsSummary> {
    const { data: friendships, error } = await supabase
      .from('friendships')
      .select('*')
      .eq('status', 'pending')
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error || !friendships) {
      console.warn('[friendService] getPendingRequests error:', error?.message);
      return { incoming: [], sent: [] };
    }

    const allOtherIds = friendships.map((f) =>
      f.user_a_id === userId ? f.user_b_id : f.user_a_id
    );

    let profilesMap: Record<string, Profile> = {};
    if (allOtherIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', allOtherIds);

      if (profiles) {
        profilesMap = (profiles as Profile[]).reduce((acc, p) => {
          acc[p.id] = p;
          return acc;
        }, {} as Record<string, Profile>);
      }
    }

    const incoming: { friendship: Friendship; sender: Profile }[] = [];
    const sent: { friendship: Friendship; recipient: Profile }[] = [];

    for (const f of friendships as Friendship[]) {
      if (f.requested_by === userId) {
        // Sent by me
        const recipientId = f.user_a_id === userId ? f.user_b_id : f.user_a_id;
        const recipient = profilesMap[recipientId];
        if (recipient) {
          sent.push({ friendship: f, recipient });
        }
      } else {
        // Incoming to me
        const sender = profilesMap[f.requested_by];
        if (sender) {
          incoming.push({ friendship: f, sender });
        }
      }
    }

    return { incoming, sent };
  },

  /**
   * Send a friend request
   */
  async sendFriendRequest(
    senderId: string,
    recipientId: string
  ): Promise<Friendship> {
    const { user_a_id, user_b_id } = friendService.getCanonicalPair(senderId, recipientId);

    // Check existing
    const { data: existing } = await supabase
      .from('friendships')
      .select('*')
      .eq('user_a_id', user_a_id)
      .eq('user_b_id', user_b_id)
      .maybeSingle();

    if (existing) {
      const f = existing as Friendship;
      if (f.status === 'accepted') {
        throw new Error('Hai bạn đã là bạn bè.');
      }
      if (f.status === 'pending') {
        if (f.requested_by === senderId) {
          throw new Error('Bạn đã gửi lời mời kết bạn trước đó.');
        } else {
          // If the other person already sent a request, automatically accept it!
          return friendService.acceptFriendRequest(f.id, senderId);
        }
      }
      // If declined, delete the declined record first to allow sending fresh request
      if (f.status === 'declined') {
        await supabase.from('friendships').delete().eq('id', f.id);
      }
    }

    const { data, error } = await supabase
      .from('friendships')
      .insert({
        user_a_id,
        user_b_id,
        status: 'pending' as FriendshipStatus,
        requested_by: senderId,
      })
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(`Gửi lời mời kết bạn thất bại: ${error?.message}`);
    }

    return data as Friendship;
  },

  /**
   * Accept an incoming friend request
   */
  async acceptFriendRequest(friendshipId: string, currentUserId: string): Promise<Friendship> {
    const { data, error } = await supabase
      .from('friendships')
      .update({
        status: 'accepted' as FriendshipStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', friendshipId)
      .or(`user_a_id.eq.${currentUserId},user_b_id.eq.${currentUserId}`)
      .neq('requested_by', currentUserId)
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(`Chấp nhận kết bạn thất bại: ${error?.message || 'Không có quyền'}`);
    }

    return data as Friendship;
  },

  /**
   * Decline an incoming friend request (removes the request)
   */
  async declineFriendRequest(friendshipId: string, currentUserId: string): Promise<void> {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId)
      .or(`user_a_id.eq.${currentUserId},user_b_id.eq.${currentUserId}`)
      .neq('requested_by', currentUserId);

    if (error) {
      throw new Error(`Từ chối lời mời thất bại: ${error.message}`);
    }
  },

  /**
   * Cancel a sent friend request
   */
  async cancelFriendRequest(friendshipId: string, currentUserId: string): Promise<void> {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId)
      .eq('requested_by', currentUserId)
      .eq('status', 'pending');

    if (error) {
      throw new Error(`Hủy lời mời thất bại: ${error.message}`);
    }
  },

  /**
   * Remove an existing friend
   */
  async removeFriend(friendshipId: string, currentUserId: string): Promise<void> {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId)
      .or(`user_a_id.eq.${currentUserId},user_b_id.eq.${currentUserId}`)
      .eq('status', 'accepted');

    if (error) {
      throw new Error(`Hủy kết bạn thất bại: ${error.message}`);
    }
  },
};
