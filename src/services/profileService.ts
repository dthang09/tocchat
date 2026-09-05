import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { validateAvatarFile, resizeAndCompressAvatar } from '../features/profiles/utils/imagePipeline';

export interface UpdateProfileParams {
  display_name?: string;
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
   * Update profile fields (display name, status, avatar URL)
   */
  async updateProfile(userId: string, updates: UpdateProfileParams): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
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
