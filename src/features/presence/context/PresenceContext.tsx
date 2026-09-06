import React, { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';
import type { PresenceContextType, UserPresencePayload } from '../types';
import type { User } from '@supabase/supabase-js';

const PresenceContext = createContext<PresenceContextType>({
  onlineUserIds: new Set(),
  isUserOnline: () => false,
  getOnlineCount: () => 0,
});

interface PresenceProviderProps {
  user: User | null;
  children: React.ReactNode;
}

export const PresenceProvider: React.FC<PresenceProviderProps> = ({ user, children }) => {
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setOnlineUserIds(new Set());
      return;
    }

    const currentUserId = user.id;
    const channelName = 'presence:global';

    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    const updatePresenceState = () => {
      const state = channel.presenceState<UserPresencePayload>();
      const ids = new Set<string>();
      for (const key of Object.keys(state)) {
        ids.add(key);
      }
      setOnlineUserIds(ids);
    };

    channel
      .on('presence', { event: 'sync' }, () => {
        updatePresenceState();
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.add(key);
          return next;
        });
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId: currentUserId,
            displayName: user.user_metadata?.display_name || user.email,
            avatarUrl: user.user_metadata?.avatar_url || null,
            onlineAt: new Date().toISOString(),
            isActive: typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
          });
        }
      });

    // Update presence on tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        channel.track({
          userId: currentUserId,
          displayName: user.user_metadata?.display_name || user.email,
          avatarUrl: user.user_metadata?.avatar_url || null,
          onlineAt: new Date().toISOString(),
          isActive: true,
        }).catch(() => {});
      } else {
        channel.track({
          userId: currentUserId,
          displayName: user.user_metadata?.display_name || user.email,
          avatarUrl: user.user_metadata?.avatar_url || null,
          onlineAt: new Date().toISOString(),
          isActive: false,
        }).catch(() => {});
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, [user]);

  const isUserOnline = useCallback(
    (userId?: string | null) => {
      if (!userId) return false;
      return onlineUserIds.has(userId);
    },
    [onlineUserIds]
  );

  const getOnlineCount = useCallback(
    (userIds: string[]) => {
      if (!userIds || userIds.length === 0) return 0;
      return userIds.filter((id) => onlineUserIds.has(id)).length;
    },
    [onlineUserIds]
  );

  const value = useMemo(
    () => ({
      onlineUserIds,
      isUserOnline,
      getOnlineCount,
    }),
    [onlineUserIds, isUserOnline, getOnlineCount]
  );

  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>;
};

export { PresenceContext };
