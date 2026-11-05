import { hexToRgb, normalizeHex } from './color-converter.utils';
import { ContrastRating, PaletteContrastCheck } from '../types/tokens.types';

export function calculateLuminance(r: number, g: number, b: number): number {
  const normalize = (val: number) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b);
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;

  const lum1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

export function rateContrast(ratio: number): ContrastRating {
  if (ratio >= 7) {
    return { ratio, ratioText: `${ratio}:1`, level: 'AAA', isAccessible: true, message: 'وضوح استثنائي فائق (AAA)' };
  }
  if (ratio >= 4.5) {
    return { ratio, ratioText: `${ratio}:1`, level: 'AA', isAccessible: true, message: 'وضوح ممتاز معتمد (AA)' };
  }
  if (ratio >= 3) {
    return { ratio, ratioText: `${ratio}:1`, level: 'AA', isAccessible: true, message: 'مقبول للأزرار والنصوص الكبيرة' };
  }
  return { ratio, ratioText: `${ratio}:1`, level: 'FAIL', isAccessible: false, message: 'تباين ضعيف قد يصعب قراءته' };
}

export function evaluatePaletteContrast(primaryHex: string, accentHex: string): PaletteContrastCheck {
  const normPrimary = normalizeHex(primaryHex);
  const normAccent = normalizeHex(accentHex);

  const whiteRatio = getContrastRatio(normPrimary, '#FFFFFF');
  const darkRatio = getContrastRatio(normPrimary, '#0B0F19');
  const accentDarkRatio = getContrastRatio(normAccent, '#0B0F19');

  const primaryOnWhite = rateContrast(whiteRatio);
  const primaryOnDark = rateContrast(darkRatio);
  const accentOnDark = rateContrast(accentDarkRatio);

  const overallAccessible = primaryOnWhite.isAccessible || primaryOnDark.isAccessible;

  return {
    primaryOnWhite,
    primaryOnDark,
    accentOnDark,
    overallAccessible,
  };
}
