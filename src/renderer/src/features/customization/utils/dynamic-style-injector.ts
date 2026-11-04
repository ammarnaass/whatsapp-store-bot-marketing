import { AccentColorMeta, ArabicFontFamily } from '../types/customization.types';
import { ARABIC_FONT_FAMILIES } from '../constants/typography.constants';

export const PALETTE_SHADES: Record<string, { dark: string }> = {
  emerald: { dark: '#075E54' }, ocean: { dark: '#0369A1' }, indigo: { dark: '#4338CA' },
  violet: { dark: '#5B21B6' }, amber: { dark: '#92400E' }, rose: { dark: '#9F1239' },
};

export function injectDynamicAppStyles(palette: AccentColorMeta, fontFamily: ArabicFontFamily): void {
  if (typeof document === 'undefined') return;

  let styleEl = document.getElementById('wasell-dynamic-customization') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'wasell-dynamic-customization';
    document.head.appendChild(styleEl);
  }

  const fontConfig = ARABIC_FONT_FAMILIES[fontFamily] || ARABIC_FONT_FAMILIES.cairo;
  const shades = PALETTE_SHADES[palette.id] || { dark: '#075E54' };
  const primaryDark = shades.dark;
  const p = palette.primary;
  const acc = palette.accent;
  const lBg = palette.lightBg;

  styleEl.textContent = `
    :root, html {
      font-family: ${fontConfig.cssFamily} !important;
      --color-primary: ${p} !important;
      --color-primary-dark: ${primaryDark} !important;
      --color-primary-light: ${lBg} !important;
      --color-brand-primary: ${p} !important;
      --color-brand-accent: ${acc} !important;
      --color-brand-glow: ${palette.glow} !important;
      --color-brand-light-bg: ${lBg} !important;
      --color-brand-dark-bg: ${palette.darkBg} !important;
      --color-whatsapp-emerald: ${acc} !important;
      --glow-whatsapp: 0 4px 14px 0 color-mix(in srgb, ${p} 25%, transparent) !important;
      --color-emerald-50: ${lBg} !important;
      --color-emerald-100: color-mix(in srgb, ${p} 15%, transparent) !important;
      --color-emerald-200: color-mix(in srgb, ${p} 25%, transparent) !important;
      --color-emerald-300: ${acc} !important;
      --color-emerald-400: ${acc} !important;
      --color-emerald-500: ${p} !important;
      --color-emerald-600: ${p} !important;
      --color-emerald-700: ${primaryDark} !important;
      --color-emerald-800: ${primaryDark} !important;
      --color-emerald-900: ${primaryDark} !important;
      --color-emerald-950: color-mix(in srgb, ${primaryDark} 30%, #0B0F19) !important;
      --color-teal-50: ${lBg} !important;
      --color-teal-950: color-mix(in srgb, ${primaryDark} 30%, #0B0F19) !important;
    }

    .dark, html.dark {
      --color-primary-light: color-mix(in srgb, ${p} 20%, transparent) !important;
      --color-brand-light-bg: color-mix(in srgb, ${p} 18%, #111827) !important;
      --color-emerald-50: color-mix(in srgb, ${p} 16%, #111827) !important;
      --color-emerald-950: color-mix(in srgb, ${p} 22%, #0B0F19) !important;
      --color-teal-50: color-mix(in srgb, ${p} 16%, #111827) !important;
      --color-teal-950: color-mix(in srgb, ${p} 22%, #0B0F19) !important;
    }

    body, button, input, select, textarea { font-family: ${fontConfig.cssFamily} !important; }

    /* 1. خلفيات الهوية الأساسية والأزرار */
    .bg-\\[\\#128C7E\\], [class~="bg-[#128C7E]"], .bg-emerald-600, .bg-emerald-500, .wasell-btn-primary, [class~="wasell-btn-primary"] {
      background-color: ${p} !important;
    }
    .hover\\:bg-\\[\\#128C7E\\]:hover, [class~="hover:bg-[#128C7E]"]:hover, .hover\\:bg-emerald-600:hover, [class~="hover:bg-emerald-600"]:hover {
      background-color: ${p} !important;
    }
    .bg-\\[\\#075E54\\], [class~="bg-[#075E54]"], .hover\\:bg-\\[\\#075E54\\]:hover, [class~="hover:bg-[#075E54]"]:hover {
      background-color: ${primaryDark} !important;
    }

    /* 2. الخلفيات الفاتحة والشفافيات */
    .bg-\\[\\#E7F6F2\\], [class~="bg-[#E7F6F2]"], .bg-emerald-50, [class~="bg-emerald-50"], .bg-teal-50, [class~="bg-teal-50"] {
      background-color: ${lBg} !important;
    }
    .hover\\:bg-emerald-100:hover, [class~="hover:bg-emerald-100"]:hover, .hover\\:bg-emerald-50:hover, [class~="hover:bg-emerald-50"]:hover {
      background-color: color-mix(in srgb, ${p} 14%, transparent) !important;
    }
    .bg-\\[\\#128C7E\\]\\/5, [class~="bg-[#128C7E]/5"] { background-color: color-mix(in srgb, ${p} 5%, transparent) !important; }
    .bg-\\[\\#128C7E\\]\\/10, [class~="bg-[#128C7E]/10"], [class~="hover:bg-[#128C7E]/10"]:hover { background-color: color-mix(in srgb, ${p} 10%, transparent) !important; }
    .bg-\\[\\#128C7E\\]\\/15, [class~="bg-[#128C7E]/15"] { background-color: color-mix(in srgb, ${p} 15%, transparent) !important; }
    .bg-\\[\\#128C7E\\]\\/20, [class~="bg-[#128C7E]/20"], .bg-\\[\\#128C7E\\]\\/25, [class~="bg-[#128C7E]/25"], .bg-\\[\\#128C7E\\]\\/70 {
      background-color: color-mix(in srgb, ${p} 20%, transparent) !important;
    }

    /* 3. شفافيات الوضع الليلي */
    .dark .bg-\\[\\#E7F6F2\\], .dark [class~="bg-[#E7F6F2]"], .dark [class~="dark:bg-[#E7F6F2]"],
    .dark [class~="dark:bg-[#128C7E]/15"], .dark [class~="dark:bg-[#128C7E]/20"],
    .dark [class~="dark:bg-[#075E54]/20"], .dark [class~="dark:bg-teal-950/40"],
    .dark [class*="dark:bg-emerald-950"], .dark [class*="dark:bg-emerald-900"] {
      background-color: color-mix(in srgb, ${p} 20%, #111827) !important;
    }

    /* 4. ألوان النصوص والروابط والأيقونات */
    .text-\\[\\#128C7E\\], [class~="text-[#128C7E]"], .text-emerald-600, .text-emerald-500, [class~="text-emerald-600"], [class~="text-emerald-500"] {
      color: ${p} !important;
    }
    .text-\\[\\#075E54\\], [class~="text-[#075E54]"], .text-emerald-700, .text-emerald-800, .text-emerald-900 {
      color: ${primaryDark} !important;
    }
    .dark [class*="dark:text-emerald"], .dark [class*="dark:text-teal"], .text-emerald-300, .text-emerald-400 {
      color: ${acc} !important;
    }
    .hover\\:text-\\[\\#128C7E\\]:hover, [class~="hover:text-[#128C7E]"]:hover, .dark [class*="dark:hover:text-emerald"]:hover {
      color: ${p} !important;
    }

    /* 5. الحدود والفواصل */
    .border-\\[\\#128C7E\\], [class~="border-[#128C7E]"], .border-emerald-500, .border-emerald-600 {
      border-color: ${p} !important;
    }
    [class*="border-[#128C7E]/"], [class*="border-emerald-200"], [class*="border-emerald-300"], [class*="border-teal"] {
      border-color: color-mix(in srgb, ${p} 25%, transparent) !important;
    }
    .dark [class*="dark:border-emerald"], .dark [class*="dark:border-teal"] {
      border-color: color-mix(in srgb, ${p} 35%, transparent) !important;
    }

    /* 6. التدرجات والظلال وحلقات التركيز */
    .from-\\[\\#128C7E\\], [class~="from-[#128C7E]"] { --tw-gradient-from: ${p} !important; }
    .to-\\[\\#075E54\\], [class~="to-[#075E54]"], .to-\\[\\#0E7A6E\\], [class~="to-[#0E7A6E]"], .to-\\[\\#0D6D61\\], [class~="to-[#0D6D61]"] {
      --tw-gradient-to: ${primaryDark} !important;
    }
    [class*="shadow-[#128C7E]"] {
      --tw-shadow-color: color-mix(in srgb, ${p} 25%, transparent) !important;
      box-shadow: 0 4px 14px 0 color-mix(in srgb, ${p} 25%, transparent) !important;
    }
    [class*="ring-[#128C7E]"], [class*="focus:ring-[#128C7E]"]:focus {
      --tw-ring-color: color-mix(in srgb, ${p} 30%, transparent) !important;
    }
    [class*="focus:border-[#128C7E]"]:focus { border-color: ${p} !important; }
    ::selection { background-color: ${p} !important; color: #ffffff !important; }
    ::-webkit-scrollbar-thumb { background: color-mix(in srgb, ${p} 35%, transparent) !important; }
    ::-webkit-scrollbar-thumb:hover { background: ${p} !important; }
  `;
}
