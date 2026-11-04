---
name: WaSell Design System
colors:
  surface: '#ffffff'
  surface-dim: '#f6f7f9'
  surface-bright: '#ffffff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f7f9'
  surface-container: '#eef1f5'
  surface-container-high: '#e5e9f0'
  surface-container-highest: '#dce2ec'
  on-surface: '#1f2937'
  on-surface-variant: '#4b5563'
  inverse-surface: '#1f2937'
  inverse-on-surface: '#f9fafb'
  outline: '#9ca3af'
  outline-variant: '#d1d5db'
  surface-tint: '#128c7e'
  primary: '#128c7e'
  on-primary: '#ffffff'
  primary-container: '#e7f6f2'
  on-primary-container: '#075e54'
  inverse-primary: '#25d366'
  secondary: '#075e54'
  on-secondary: '#ffffff'
  secondary-container: '#d1fae5'
  on-secondary-container: '#064e3b'
  tertiary: '#7c3aed'
  on-tertiary: '#ffffff'
  tertiary-container: '#ede9fe'
  on-tertiary-container: '#5b21b6'
  error: '#ef4444'
  on-error: '#ffffff'
  error-container: '#fee2e2'
  on-error-container: '#991b1b'
  background: '#f6f7f9'
  on-background: '#1f2937'
  surface-variant: '#f3f4f6'
typography:
  headline-xl:
    fontFamily: Cairo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Cairo
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Cairo
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Cairo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Cairo
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Cairo
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Cairo
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Cairo
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Cairo
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 0.75rem
  xl: 1rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

Design system for desktop app called "WaSell" (WhatsApp store + AI sales agent).
- **Language**: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- **Style**: Clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px / 0.75rem), subtle elevation shadows.
- **Colors**:
  - Primary WhatsApp-inspired green (`#128C7E`)
  - Dark green (`#075E54`) for sidebar accents and headers
  - Soft mint (`#E7F6F2`) for active selections and highlights
  - Neutral canvas background (`#F6F7F9`)
  - Pure white cards (`#FFFFFF`)
  - Typography text (`#1F2937`)
  - **AI Signature Accent**: Violet (`#7C3AED`) with soft violet container (`#EDE9FE`) strictly indicating AI automated actions, traces, and suggestions.
  - Semantic: Success green (`#10B981`), warning amber (`#F59E0B`), danger red (`#EF4444`), info blue (`#3B82F6`).
- **Typography**: Arabic-first font (Cairo or IBM Plex Sans Arabic), crisp hierarchy, 14px base body.
- **Components**:
  - Right-side persistent navigation rail (RTL) with icon + label + active indicators.
  - Top bar containing WhatsApp connection status badge (Connected/Disconnected/Scanning), quick store switcher, and high-visibility Emergency Pause button for AI agent.
  - High-density data tables with status chips and multi-criteria filters.
  - Live preview cards simulating WhatsApp chat interactions.
- **Target Dimensions**: Desktop Electron window 1440x900.
