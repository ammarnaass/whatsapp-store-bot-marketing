/**
 * أداة معالجة وضغط الصورة الشخصية محلياً إلى Base64
 */
export async function processImageToAvatarDataUrl(
  file: File,
  maxSize = 256,
  quality = 0.85
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('الملف المحدد ليس صورة صالحة. يرجى اختيار ملف PNG أو JPG أو WEBP.');
  }

  // حد أقصى للحجم الأولي قبل الضغط: 10 ميغابايت
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 10 ميغابايت.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشلت قراءة ملف الصورة'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('فشل فك تشفير بيانات الصورة'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = maxSize;
          canvas.height = maxSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('تعذر معالجة رسوميات الصورة'));
            return;
          }

          // تطبيق قص وتوسيط مربع (Object-Cover Cropping)
          const sourceMin = Math.min(img.naturalWidth, img.naturalHeight);
          const sx = (img.naturalWidth - sourceMin) / 2;
          const sy = (img.naturalHeight - sourceMin) / 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, sx, sy, sourceMin, sourceMin, 0, 0, maxSize, maxSize);

          // التحويل لصيغة خفيفة ومضغوطة
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

