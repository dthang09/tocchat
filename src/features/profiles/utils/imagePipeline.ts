/**
 * Image processing pipeline for avatar uploads
 * Validates, center-crops/resizes and compresses images client-side
 */

export interface ProcessedImage {
  blob: Blob;
  extension: string;
  mimeType: string;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validate selected image file
 */
export function validateAvatarFile(file: File): void {
  if (!file) {
    throw new Error('Vui lòng chọn một tệp hình ảnh.');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    throw new Error('Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh JPG, PNG, WebP hoặc GIF.');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 5MB).');
  }
}

/**
 * Resize and compress an image file to a square avatar canvas
 * Output is an optimized JPEG blob
 */
export function resizeAndCompressAvatar(
  file: File,
  targetSize = 512,
  quality = 0.85
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    // If it's an animated GIF, keep original blob to preserve animation
    if (file.type === 'image/gif') {
      resolve({
        blob: file,
        extension: 'gif',
        mimeType: 'image/gif',
      });
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tệp hình ảnh đã chọn.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Tệp hình ảnh bị hỏng hoặc không hợp lệ.'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Trình duyệt không hỗ trợ xử lý đồ họa ảnh (Canvas context missing).'));
            return;
          }

          // Center-crop to a clean 1:1 square
          const minEdge = Math.min(img.width, img.height);
          const startX = (img.width - minEdge) / 2;
          const startY = (img.height - minEdge) / 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(
            img,
            startX,
            startY,
            minEdge,
            minEdge,
            0,
            0,
            targetSize,
            targetSize
          );

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Không thể nén hình ảnh.'));
                return;
              }
              resolve({
                blob,
                extension: 'jpg',
                mimeType: 'image/jpeg',
              });
            },
            'image/jpeg',
            quality
          );
        } catch (err) {
          reject(err);
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
