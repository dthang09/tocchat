import React, { useState, useRef } from 'react';
import { X, Camera, Users, Check, Search, AlertCircle, Loader2 } from 'lucide-react';
import type { Profile } from '../../../types';
import type { ConversationWithDetails } from '../services/conversationService';
import { useConversations } from '../hooks/useConversations';
import { useProfile } from '../../profiles/hooks/useProfile';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';

export interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (conversation: ConversationWithDetails) => void;
  availableProfiles: Profile[];
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  availableProfiles,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createGroup, isCreating } = useConversations();
  const { uploadAvatar } = useProfile();

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchMember, setSearchMember] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setError(null);
    try {
      const result = await uploadAvatar(file);
      if (result) {
        setAvatarUrl(result.avatarUrl);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tải ảnh nhóm thất bại.';
      setError(msg);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Vui lòng nhập tên nhóm.');
      return;
    }

    if (selectedIds.length === 0) {
      setError('Vui lòng chọn ít nhất một thành viên cho nhóm.');
      return;
    }

    try {
      const created = await createGroup({
        name: trimmedName,
        avatar_url: avatarUrl,
        member_ids: selectedIds,
      });
      onCreated(created);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tạo nhóm.';
      setError(msg);
    }
  };

  const filteredProfiles = availableProfiles.filter((p) => {
    const query = searchMember.toLowerCase().trim();
    if (!query) return true;
    return (
      (p.display_name && p.display_name.toLowerCase().includes(query)) ||
      (p.status && p.status.toLowerCase().includes(query))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 select-none animate-in fade-in-50 duration-200">
      <div className="w-full max-w-[440px] max-h-[90dvh] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold">Tạo nhóm mới</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center active:scale-95 transition-all"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Group Name & Avatar Section */}
          <div className="flex items-center gap-3.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFile}
            />

            <div className="relative shrink-0">
              <Avatar
                src={avatarUrl}
                name={name || 'Group'}
                size="xl"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-950 hover:bg-brand-500 active:scale-95 transition-all"
                title="Chọn ảnh nhóm"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Camera className="w-3 h-3" />
                )}
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <label htmlFor="group-name-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tên nhóm
              </label>
              <input
                id="group-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nhóm bạn thân, Học tập..."
                maxLength={60}
                required
                className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Member Selection Section */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Chọn thành viên
              </label>
              <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 px-2 py-0.5 bg-brand-50 dark:bg-brand-950/60 rounded-full">
                Đã chọn: {selectedIds.length}
              </span>
            </div>

            {/* Filter Search */}
            <div className="relative flex items-center h-9 w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 text-slate-400">
              <Search className="w-3.5 h-3.5 mr-2 shrink-0" />
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Tìm bạn bè theo tên..."
                className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Members List */}
            <div className="max-h-[220px] overflow-y-auto no-scrollbar space-y-1 pt-1">
              {filteredProfiles.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  {availableProfiles.length === 0
                    ? 'Chưa có thành viên nào khác trong danh sách.'
                    : 'Không tìm thấy thành viên phù hợp.'}
                </div>
              ) : (
                filteredProfiles.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleMember(p.id)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar
                          src={p.avatar_url}
                          name={p.display_name}
                          size="md"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {p.display_name || 'Người dùng TocChat'}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {p.status || 'Đang hoạt động'}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-brand-600 border-brand-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isCreating}
              disabled={!name.trim() || selectedIds.length === 0 || isCreating}
              className="w-full h-11 rounded-2xl text-xs font-semibold shadow-md shadow-brand-500/20 active:scale-98 transition-transform"
            >
              {isCreating ? 'Đang tạo nhóm...' : `Tạo nhóm (${selectedIds.length + 1} người)`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
