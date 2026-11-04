import { qrcodegen } from './qrcodegen';

/**
 * توليد رسم SVG لرمز الاستجابة السريعة QR بدقة عالية ومتجهية
 */
export function generateQrSvg(text: string, border: number = 4): string {
  try {
    const QrCode = qrcodegen.QrCode;
    const qr = QrCode.encodeText(text, QrCode.Ecc.MEDIUM);
    const size = qr.size;
    const scale = 8;
    const dimension = (size + border * 2) * scale;

    const parts: string[] = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (qr.getModule(x, y)) {
          parts.push(`M${(x + border) * scale},${(y + border) * scale}h${scale}v${scale}h-${scale}z`);
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dimension} ${dimension}" width="100%" height="100%" fill="currentColor"><path d="${parts.join('')}"/></svg>`;
  } catch (err) {
    console.error('[QR] Failed to generate SVG QR:', err);
    return '';
  }
}

/**
 * تحويل نص أو مسار إلى Data URL صالح للعرض المباشر في عنصر <img />
 */
export function formatQrCodeDataUrl(rawQrOrUrl: string, border: number = 4): string {
  if (!rawQrOrUrl || typeof rawQrOrUrl !== 'string') return '';

  const trimmed = rawQrOrUrl.trim();
  // إذا كانت القيمة بالفعل Data URL أو رابط صورة
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // إذا كانت القيمة نص خام (مثل كود الاقتران 2@... من WhatsApp Baileys)
  const svg = generateQrSvg(trimmed, border);
  if (!svg) return '';
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * توليد كود تجريبي افتراضي لبيئة العرض والتطوير (Sandbox Mock QR)
 */
export function getMockWhatsAppQrDataUrl(sessionId: string = 'wasell_main_store'): string {
  const timestamp = Math.floor(Date.now() / 20000);
  const mockPayload = `2@wasell:${sessionId}:${timestamp}:mock-whatsapp-handshake-multi-device`;
  return formatQrCodeDataUrl(mockPayload);
}
