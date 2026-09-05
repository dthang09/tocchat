import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import {
  conversationService,
  type ConversationWithDetails,
  type CreateGroupParams,
} from '../services/conversationService';
import type { Profile } from '../../../types';
import { useAppStore } from '../../../stores/appStore';

export function useConversations() {
  const { user } = useAuthStore();
  const addToast = useAppStore((state) => state.addToast);

  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await conversationService.getUserConversations(user.id);
      setConversations(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách đoạn chat.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadAvailableProfiles = useCallback(async () => {
    if (!user) return;
    try {
      const data = await conversationService.getAvailableProfiles(user.id);
      setAvailableProfiles(data);
    } catch (err) {
      console.warn('[useConversations] loadAvailableProfiles error:', err);
    }
  }, [user]);

  useEffect(() => {
    loadConversations();
    loadAvailableProfiles();
  }, [loadConversations, loadAvailableProfiles]);

  const createGroup = useCallback(
    async (params: CreateGroupParams) => {
      if (!user) {
        throw new Error('Bạn chưa đăng nhập.');
      }
      setIsCreating(true);
      setError(null);
      try {
        const newConv = await conversationService.createGroupConversation(user.id, params);
        setConversations((prev) => [newConv, ...prev.filter((c) => c.id !== newConv.id)]);
        addToast({
          type: 'success',
          message: `Đã tạo nhóm "${params.name}" thành công!`,
        });
        return newConv;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Tạo nhóm thất bại.';
        setError(msg);
        addToast({
          type: 'error',
          message: msg,
        });
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [user, addToast]
  );

  const createDirect = useCallback(
    async (recipientId: string) => {
      if (!user) {
        throw new Error('Bạn chưa đăng nhập.');
      }
      setIsCreating(true);
      setError(null);
      try {
        const conv = await conversationService.createDirectConversation(user.id, recipientId);
        setConversations((prev) => [conv, ...prev.filter((c) => c.id !== conv.id)]);
        return conv;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Không thể tạo cuộc trò chuyện.';
        setError(msg);
        addToast({
          type: 'error',
          message: msg,
        });
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [user, addToast]
  );

  return {
    conversations,
    availableProfiles,
    isLoading,
    isCreating,
    error,
    refresh: loadConversations,
    loadAvailableProfiles,
    createGroup,
    createDirect,
  };
}
