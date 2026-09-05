import { useState, useCallback } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { profileService, type UpdateProfileParams } from '../services/profileService';
import { useAppStore } from '../../../stores/appStore';

export function useProfile() {
  const { user, profile, refreshProfile } = useAuthStore();
  const addToast = useAppStore((state) => state.addToast);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearStatus = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
    setUploadProgress(0);
  }, []);

  const updateProfile = useCallback(
    async (updates: UpdateProfileParams) => {
      if (!user) {
        setError('Bạn chưa đăng nhập.');
        return;
      }

      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const updated = await profileService.updateProfile(user.id, updates);
        await refreshProfile();
        setSuccessMessage('Cập nhật thông tin thành công!');
        addToast({
          type: 'success',
          message: 'Đã cập nhật thông tin cá nhân.',
        });
        return updated;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Cập nhật thất bại.';
        setError(message);
        addToast({
          type: 'error',
          message,
        });
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [user, refreshProfile, addToast]
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!user) {
        setError('Bạn chưa đăng nhập.');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      setSuccessMessage(null);

      try {
        const result = await profileService.uploadAvatar(user.id, file, (percent) => {
          setUploadProgress(percent);
        });

        await refreshProfile();
        setSuccessMessage('Ảnh đại diện đã được cập nhật!');
        addToast({
          type: 'success',
          message: 'Tải ảnh đại diện thành công.',
        });
        return result;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Tải ảnh lên thất bại.';
        setError(message);
        addToast({
          type: 'error',
          message,
        });
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [user, refreshProfile, addToast]
  );

  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      await refreshProfile();
    } finally {
      setIsLoading(false);
    }
  }, [refreshProfile]);

  return {
    user,
    profile,
    isLoading,
    isSaving,
    isUploading,
    uploadProgress,
    error,
    successMessage,
    clearStatus,
    updateProfile,
    uploadAvatar,
    reload,
  };
}
