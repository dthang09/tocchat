export interface UserPresencePayload {
  userId: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  onlineAt: string;
  isActive?: boolean;
}

export interface PresenceContextType {
  onlineUserIds: Set<string>;
  isUserOnline: (userId?: string | null) => boolean;
  getOnlineCount: (userIds: string[]) => number;
}
