import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { useAppStore } from '../../../stores/appStore';
import {
  friendService,
  type FriendItem,
  type FriendRequestsSummary,
} from '../services/friendService';

export function useFriends() {
  const { user } = useAuthStore();
  const addToast = useAppStore((state) => state.addToast);

  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [requests, setRequests] = useState<FriendRequestsSummary>({ incoming: [], sent: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingIds, setActionLoadingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    if (!user) return;
    try {
      const data = await friendService.getFriends(user.id);
      setFriends(data);
    } catch (err: unknown) {
      console.warn('[useFriends] loadFriends error:', err);
    }
  }, [user]);

  const loadRequests = useCallback(async () => {
    if (!user) return;
    try {
      const data = await friendService.getPendingRequests(user.id);
      setRequests(data);
    } catch (err: unknown) {
      console.warn('[useFriends] loadRequests error:', err);
    }
  }, [user]);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([loadFriends(), loadRequests()]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải thông tin bạn bè.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [user, loadFriends, loadRequests]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setActionLoading = (id: string, loading: boolean) => {
    setActionLoadingIds((prev) => {
      const next = new Set(prev);
      if (loading) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const isActionLoading = useCallback(
    (id: string) => actionLoadingIds.has(id),
    [actionLoadingIds]
  );

  // Send request
  const sendRequest = useCallback(
    async (recipientId: string) => {
      if (!user) return;
      if (isActionLoading(recipientId)) return;

      setActionLoading(recipientId, true);
      try {
        await friendService.sendFriendRequest(user.id, recipientId);
        addToast({
          type: 'success',
          message: 'Đã gửi lời mời kết bạn!',
        });
        await loadRequests();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gửi lời mời thất bại.';
        addToast({
          type: 'error',
          message: msg,
        });
        throw err;
      } finally {
        setActionLoading(recipientId, false);
      }
    },
    [user, isActionLoading, addToast, loadRequests]
  );

  // Accept request
  const acceptRequest = useCallback(
    async (friendshipId: string) => {
      if (!user) return;
      if (isActionLoading(friendshipId)) return;

      setActionLoading(friendshipId, true);
      try {
        await friendService.acceptFriendRequest(friendshipId, user.id);
        addToast({
          type: 'success',
          message: 'Đã chấp nhận lời mời kết bạn!',
        });
        await Promise.all([loadFriends(), loadRequests()]);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Chấp nhận lời mời thất bại.';
        addToast({
          type: 'error',
          message: msg,
        });
      } finally {
        setActionLoading(friendshipId, false);
      }
    },
    [user, isActionLoading, addToast, loadFriends, loadRequests]
  );

  // Decline request
  const declineRequest = useCallback(
    async (friendshipId: string) => {
      if (!user) return;
      if (isActionLoading(friendshipId)) return;

      setActionLoading(friendshipId, true);
      try {
        await friendService.declineFriendRequest(friendshipId, user.id);
        addToast({
          type: 'info',
          message: 'Đã xóa lời mời kết bạn.',
        });
        await loadRequests();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Từ chối lời mời thất bại.';
        addToast({
          type: 'error',
          message: msg,
        });
      } finally {
        setActionLoading(friendshipId, false);
      }
    },
    [user, isActionLoading, addToast, loadRequests]
  );

  // Cancel sent request
  const cancelRequest = useCallback(
    async (friendshipId: string) => {
      if (!user) return;
      if (isActionLoading(friendshipId)) return;

      setActionLoading(friendshipId, true);
      try {
        await friendService.cancelFriendRequest(friendshipId, user.id);
        addToast({
          type: 'info',
          message: 'Đã hủy lời mời kết bạn.',
        });
        await loadRequests();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Hủy lời mời thất bại.';
        addToast({
          type: 'error',
          message: msg,
        });
      } finally {
        setActionLoading(friendshipId, false);
      }
    },
    [user, isActionLoading, addToast, loadRequests]
  );

  // Remove friend
  const removeFriend = useCallback(
    async (friendshipId: string, friendName: string) => {
      if (!user) return;
      if (isActionLoading(friendshipId)) return;

      setActionLoading(friendshipId, true);
      try {
        await friendService.removeFriend(friendshipId, user.id);
        addToast({
          type: 'info',
          message: `Đã hủy kết bạn với ${friendName}.`,
        });
        await loadFriends();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Hủy kết bạn thất bại.';
        addToast({
          type: 'error',
          message: msg,
        });
      } finally {
        setActionLoading(friendshipId, false);
      }
    },
    [user, isActionLoading, addToast, loadFriends]
  );

  return {
    friends,
    requests,
    incomingCount: requests.incoming.length,
    sentCount: requests.sent.length,
    isLoading,
    error,
    refresh,
    sendRequest,
    acceptRequest,
    declineRequest,
    cancelRequest,
    removeFriend,
    isActionLoading,
  };
}
