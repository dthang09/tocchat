import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Camera,
  Check,
  AlertCircle,
  User,
  Smile,
  Loader2,
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';

const STATUS_PRESETS = [
  'Đang hoạt động',
  '☕ Đang uống cafe',
  '📚 Đang bận học',
  '🎮 Đang chơi game',
  '🎧 Đang nghe nhạc',
  '😴 Chuẩn bị đi ngủ',
  '🏃‍♂️ Ra ngoài một chút',
];

export const EditProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    user,
    profile,
    updateProfile,
    uploadAvatar,
    isSaving,
    isUploading,
    uploadProgress,
    error,
    clearStatus,
  } = useProfile();

  const initialDisplayName =
    profile?.display_name ||
    (user?.user_metadata?.display_name as string) ||
    user?.email?.split('@')[0] ||
    '';

  const initialStatus = profile?.status || 'Đang hoạt động';

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [status, setStatus] = useState(initialStatus);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const [localError, setLocalError] = useState<string | null>(null);

  const hasChanges =
    displayName.trim() !== initialDisplayName.trim() ||
    status.trim() !== initialStatus.trim();

  // Handle avatar file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError(null);
    clearStatus();

    // Local instant preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    try {
      const result = await uploadAvatar(file);
      if (result) {
        setAvatarPreview(result.avatarUrl);
      }
    } catch (err: unknown) {
      // Revert preview on failure
      setAvatarPreview(profile?.avatar_url || null);
      const msg = err instanceof Error ? err.message : 'Tải ảnh đại diện thất bại.';
      setLocalError(msg);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearStatus();

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      setLocalError('Tên hiển thị không được để trống.');
      return;
    }

    try {
      await updateProfile({
        display_name: trimmedName,
        status: status.trim() || 'Đang hoạt động',
      });
      navigate(-1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lưu thay đổi.';
      setLocalError(msg);
    }
  };

  const displayedError = localError || error;

  return (
    <div className="flex flex-col flex-1 pb-10">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Sticky Mobile Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-safe px-4 pt-3 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isSaving || isUploading}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
          aria-label="Hủy và quay lại"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Chỉnh sửa hồ sơ
        </h1>

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving || isUploading}
          className="px-3.5 py-1.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          <span>{isSaving ? 'Đang lưu' : 'Lưu'}</span>
        </button>
      </header>

      <div className="px-4 space-y-6 pt-5">
        {/* Error Alert Banner */}
        {displayedError && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs font-medium animate-in fade-in-50 duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{displayedError}</div>
          </div>
        )}

        {/* Avatar Edit Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <div className="p-1 rounded-full ring-2 ring-brand-500/30 shadow-lg">
              <Avatar
                src={avatarPreview}
                name={displayName || 'User'}
                size="3xl"
              />
            </div>

            {/* Camera Overlay Badge Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md hover:bg-brand-500 active:scale-95 transition-all ring-2 ring-white dark:ring-slate-950 cursor-pointer"
              title="Thay đổi ảnh đại diện"
              aria-label="Thay đổi ảnh đại diện"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Uploading Spinner Overlay */}
            {isUploading && (
              <div className="absolute inset-0 rounded-full bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                <Loader2 className="w-6 h-6 animate-spin mb-1" />
                <span className="text-[10px] font-bold">{uploadProgress}%</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mt-3 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline p-1 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? `Đang tải lên (${uploadProgress}%)...` : 'Thay đổi ảnh đại diện'}
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Display Name Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="edit-display-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1"
            >
              Tên hiển thị
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                id="edit-display-name"
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (localError) setLocalError(null);
                }}
                placeholder="Nhập tên của bạn"
                maxLength={50}
                className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 ml-1">
              Tên này sẽ hiển thị với bạn bè của bạn trong các đoạn chat.
            </p>
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <label
              htmlFor="edit-status"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1"
            >
              Trạng thái cá nhân
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Smile className="w-4 h-4" />
              </div>
              <input
                id="edit-status"
                type="text"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  if (localError) setLocalError(null);
                }}
                placeholder="Bạn đang nghĩ gì?"
                maxLength={80}
                className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
              />
            </div>

            {/* Quick Status Chips */}
            <div className="pt-1">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block mb-1.5 ml-1">
                Gợi ý nhanh:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setStatus(preset)}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium active:scale-95 transition-all"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button (Bottom Action) */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              disabled={!hasChanges || isSaving || isUploading}
              className="w-full h-12 rounded-2xl text-sm font-semibold shadow-md shadow-brand-500/20 active:scale-98 transition-transform"
            >
              {isSaving ? 'Đang lưu thay đổi...' : 'Lưu thông tin'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
