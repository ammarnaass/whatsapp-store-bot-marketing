# استوديو الهوية البصري التفاعلي وتخصيص السمات (Interactive Custom Theme Studio Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive Custom Theme Studio allowing merchants to define custom brand Hex colors (Primary, Accent, Glow, Shades), validate WCAG accessibility contrast in real-time, preview live store & WhatsApp chat components, and inject dynamic CSS variables across the entire platform.

**Architecture:** Extended token model (`CustomBrandPalette`) integrated into `useCustomizationStore` and `dom-theme-applicator`, backed by pure color math utilities (`color-converter`, `contrast-validator`) and modular RTL UI components (`CustomThemeBuilder`, `ThemeLivePreviewCard`, `ContrastRatioBadge`).

**Tech Stack:** React 19, TypeScript, Tailwind CSS, WaSell Design System, WCAG Luminance Math, DOM CSS Variables Injection.

**Spec:** Approach 1 - Interactive Visual Theme Studio for WaSell.

## Global Constraints
- Every source code file must strictly remain under 150 lines (aim for < 120 lines) per `skills/feature-modular-structure/SKILL.md`.
- No hardcoded styles that bypass CSS variables; must preserve dynamic Tailwind mappings (`var(--color-brand-primary)`).
- Full Arabic RTL UI with dark and light mode support and WaSell design aesthetics.
- Real-time WCAG 2.1 AA/AAA contrast calculation (minimum 4.5:1 for regular text, 3:1 for large text/badges).
- Instant fallback to default `#128C7E` when an invalid hex string is entered.

## Review Focus
1. **Invalid/Malformed Hex Input:** Entering partial or invalid hex (e.g. `#12`, `xyz`) must not crash the app; sanitizer must fall back gracefully.
2. **Low Contrast Warning:** If a merchant selects a very light primary color (e.g. `#FFFF00`), UI must clearly warn about low contrast on white text/backgrounds.
3. **Dark Mode Adaptation:** The custom theme must automatically adjust dark shades and glow opacity when switching between light and dark modes.
4. **App Restart Persistence:** Selected custom hex values must persist across app reloads and system restarts via local storage / settings.
5. **Tailwind Recompilation:** `scripts/build-css.mjs` and `npm run build` must compile cleanly with all new component classes and tokens.

---

### Task 1: Design Tokens & Customization Types Expansion
**Files:**
- Modify: `src/renderer/src/design-system/types/tokens.types.ts`
- Modify: `src/renderer/src/features/customization/types/customization.types.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface CustomBrandPalette {
    primary: string;
    accent: string;
    glow?: string;
    dark?: string;
    lightBg?: string;
    darkBg?: string;
  }
  export interface ContrastRating {
    ratio: number;
    level: 'AAA' | 'AA' | 'FAIL';
    isAccessible: boolean;
  }
  export interface PaletteContrastCheck {
    primaryOnWhite: ContrastRating;
    primaryOnDark: ContrastRating;
    accentOnDark: ContrastRating;
    overallAccessible: boolean;
  }
  ```
  And updates `AccentColor` and `BrandPaletteId` to include `'custom'`.

**Steps:**
- [ ] Add `CustomBrandPalette`, `ContrastRating`, and `PaletteContrastCheck` to `tokens.types.ts`.
- [ ] Add `customPalette?: CustomBrandPalette` to `CustomizationSettings` in `customization.types.ts`.
- [ ] Allow `'custom'` as a valid `AccentColor` and `BrandPaletteId`.
- [ ] Verify types compile without errors.

---

### Task 2: Pure Color Math, Auto-Shading & WCAG Contrast Validator
**Files:**
- Create: `src/renderer/src/design-system/utils/color-converter.utils.ts` (< 110 lines)
- Create: `src/renderer/src/design-system/utils/contrast-validator.utils.ts` (< 100 lines)

**Interfaces:**
- Produces:
  ```ts
  // color-converter.utils.ts
  export function isValidHex(hex: string): boolean;
  export function normalizeHex(hex: string, fallback?: string): string;
  export function hexToRgb(hex: string): { r: number; g: number; b: number } | null;
  export function adjustBrightness(hex: string, percent: number): string;
  export function generateGlowColor(hex: string, opacity?: number): string;
  export function generateLightBackground(hex: string): string;

  // contrast-validator.utils.ts
  export function calculateLuminance(r: number, g: number, b: number): number;
  export function getContrastRatio(hex1: string, hex2: string): number;
  export function evaluatePaletteContrast(primaryHex: string, accentHex: string): PaletteContrastCheck;
  ```

**Steps:**
- [ ] Implement `color-converter.utils.ts` with robust hex normalization, RGB conversion, lightness shifting, and rgba glow generation.
- [ ] Implement `contrast-validator.utils.ts` with standard W3C relative luminance and contrast formula $(L1 + 0.05) / (L2 + 0.05)$.
- [ ] Write unit assertion tests in a scratch verification script to verify correct ratios (e.g. `#000000` vs `#FFFFFF` is `21:1`).
- [ ] Commit color math utilities.

---

### Task 3: DOM Applicator & Store State Integration
**Files:**
- Modify: `src/renderer/src/features/customization/utils/dom-theme-applicator.ts` (< 120 lines)
- Modify: `src/renderer/src/features/customization/store/useCustomizationStore.ts` (< 120 lines)
- Modify: `src/renderer/src/features/customization/constants/customization.constants.ts`

**Steps:**
- [ ] Update `dom-theme-applicator.ts` to check if `settings.accentColor === 'custom'`:
  - Extract `settings.customPalette` (or compute auto-derived dark/light shades via `adjustBrightness`).
  - Set root CSS variables: `--color-primary`, `--color-primary-dark`, `--color-brand-primary`, `--color-brand-accent`, `--color-brand-glow`, `--color-brand-light-bg`.
- [ ] Update `useCustomizationStore.ts`:
  - Add `setCustomPalette: (palette: CustomBrandPalette) => void`.
  - Persist `customPalette` in `localStorage` under `wasell_custom_palette_v1`.
- [ ] Verify dynamic style application in the browser DOM.

---

### Task 4: Interactive Theme Studio UI Components
**Files:**
- Create: `src/renderer/src/design-system/components/ContrastRatioBadge.tsx` (< 85 lines)
- Create: `src/renderer/src/design-system/components/ThemeLivePreviewCard.tsx` (< 110 lines)
- Create: `src/renderer/src/design-system/components/CustomThemeBuilder.tsx` (< 125 lines)
- Modify: `src/renderer/src/design-system/components/ColorPaletteSection.tsx` (< 120 lines)
- Modify: `src/renderer/src/design-system/index.ts`

**Steps:**
- [ ] Build `ContrastRatioBadge.tsx`: renders accessibility pill with contrast ratio ($X.X:1$) and tooltip explaining AA/AAA compliance.
- [ ] Build `ThemeLivePreviewCard.tsx`: interactive miniature preview containing:
  - Header badge with primary color.
  - Primary button with glow effect.
  - Simulated WhatsApp customer message bubble with timestamp and double-check marks.
- [ ] Build `CustomThemeBuilder.tsx`:
  - Native color pickers linked to Hex input fields for Primary (`#128C7E`) and Accent (`#25D366`).
  - Auto-generate Dark Shade and Glow buttons.
  - Quick-preset inspiration swatches (e.g., "أزرق تجاري فاخر", "ذهبي ملكي", "بنفسجي رقمي").
  - "تطبيق وحفظ الهوية" button.
- [ ] Upgrade `ColorPaletteSection.tsx`:
  - Add segmented control at the top: "القوالب الجاهزة (6 Presets)" vs "استوديو الهوية المخصصة (Custom Theme Studio)".
  - Seamlessly display `CustomThemeBuilder` and live preview.

---

### Task 5: Integration in Appearance Settings & Accent Color Picker
**Files:**
- Modify: `src/renderer/src/features/customization/components/AccentColorPicker.tsx` (< 110 lines)
- Modify: `src/renderer/src/features/customization/components/AppearanceSettingsSection.tsx` (< 130 lines)

**Steps:**
- [ ] Add "لون مخصص (Custom)" option to `AccentColorPicker.tsx` with a palette icon that indicates custom mode is active.
- [ ] Update `AppearanceSettingsSection.tsx` with direct link or drawer toggle to open the Theme Studio.
- [ ] Verify seamless state synchronization between Quick Appearance Modal and Design System Modal.

---

### Task 6: Verification, Tailwind Compilation & Git Push
**Files:**
- All touched files

**Steps:**
- [ ] Verify file line counts (`wc -l`) to confirm every single file is strictly < 150 lines.
- [ ] Rebuild Tailwind CSS and application: `node scripts/build-css.mjs && npm run build`.
- [ ] Test live preview interactions and color changes in both Light and Dark modes.
- [ ] Commit with message `feat(theme): add interactive custom theme studio and design system tokens refresh`.
- [ ] Push to `origin/main`.

