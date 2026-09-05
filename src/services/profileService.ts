import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { validateAvatarFile, resizeAndCompressAvatar } from '../features/profiles/utils/imagePipeline';

export interface UpdateProfileParams {
  display_name?: string;
  username?: string | null;
  status?: string;
  avatar_url?: string;
}

export const profileService = {
  /**
   * Fetch profile by user ID
   */
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[profileService] getProfile error:', error.message);
      return null;
    }

    return data as Profile | null;
  },

  /**
   * Update profile fields (display name, username, status, avatar URL)
   */
  async updateProfile(userId: string, updates: UpdateProfileParams): Promise<Profile> {
    const payload: {
      display_name?: string | null;
      username?: string | null;
      status?: string | null;
      avatar_url?: string | null;
      updated_at?: string;
    } = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (typeof updates.username === 'string') {
      const clean = updates.username.trim().replace(/^@/, '').toLowerCase();
      payload.username = clean || null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error(
          `Tên người dùng "@${updates.username}" đã có người sử dụng. Vui lòng chọn tên khác.`
        );
      }
      if (error.code === '42703') {
        throw new Error(
          'Cơ sở dữ liệu Supabase chưa có cột "username". Vui lòng thực thi migration 20260905120000_friendships_schema.sql trong Supabase SQL Editor.'
        );
      }
      throw new Error(`Cập nhật trang cá nhân thất bại: ${error.message}`);
    }

    if (!data) {
      throw new Error('Không tìm thấy thông tin trang cá nhân để cập nhật.');
    }

    return data as Profile;
  },

  /**
   * Complete avatar pipeline:
   * select image -> validate -> resize/compress -> upload to Supabase Storage -> update profile.avatar_url
   */
  async uploadAvatar(
    userId: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ profile: Profile; avatarUrl: string }> {
    // 1. Validate
    validateAvatarFile(file);
    onProgress?.(20);

    // 2. Resize and compress image
    const { blob, extension, mimeType } = await resizeAndCompressAvatar(file);
    onProgress?.(50);

    // 3. Upload to Supabase Storage
    const fileName = `avatar_${Date.now()}.${extension}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      const msg = uploadError.message || '';
      if (msg.toLowerCase().includes('bucket not found')) {
        throw new Error(
          'Chưa tạo bucket "avatars" trên Supabase Storage. Vui lòng tạo bucket "avatars" (chế độ Public) trong mục Storage của Supabase.'
        );
      }
      if (
        msg.toLowerCase().includes('row-level security') ||
        msg.toLowerCase().includes('violates row-level security')
      ) {
        throw new Error(
          'Chưa phân quyền lưu trữ ảnh. Vui lòng thêm chính sách Storage Policy cho bucket "avatars".'
        );
      }
      throw new Error(`Tải ảnh lên máy chủ thất bại: ${uploadError.message}`);
    }

    onProgress?.(80);

    // 4. Retrieve public URL
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    // 5. Update profile row
    const updatedProfile = await profileService.updateProfile(userId, {
      avatar_url: publicUrl,
    });

    onProgress?.(100);

    return {
      profile: updatedProfile,
      avatarUrl: publicUrl,
    };
  },
};
