# Design System Master File - WaSell (واسل)
# منصة المتجر والرد على العملاء والتسويق عبر واتساب والذكاء الاصطناعي

> **LOGIC:** When building or updating a specific page/feature, first check `design-system/wasell/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** WaSell (واسل)  
**Type:** Electron Desktop App (1440x900 viewport target)  
**Layout:** Full RTL first (Right-to-Left, sidebar on the RIGHT)  
**Category:** E-commerce, WhatsApp Store, AI Agent & CRM SaaS  
**Last Updated:** 2026-11-03  

---

## 1. Global Color Palette

| Role | Hex / Token | Dark Mode Equivalent | CSS Variable | Purpose |
|------|-------------|----------------------|--------------|---------|
| **Primary Brand** | `#128C7E` | `#128C7E` | `--color-primary` | WhatsApp teal green, main action color |
| **Primary Dark** | `#075E54` | `#075E54` | `--color-primary-dark` | Deep WhatsApp green for hover/headers |
| **Primary Light / Mint** | `#E7F6F2` | `rgba(18, 140, 126, 0.18)` | `--color-primary-light` | Soft highlights, badge backgrounds |
| **Emerald Accent** | `#25D366` | `#25D366` | `--color-whatsapp-emerald` | Live indicators, verified checkmarks |
| **AI Signature Primary** | `#7C3AED` | `#8B5CF6` | `--color-ai-primary` | Violet accent for all AI actions/badges |
| **AI Signature Light** | `#EDE9FE` | `rgba(124, 58, 237, 0.18)` | `--color-ai-light` | AI badge bg, suggestion highlights |
| **Background** | `#F6F7F9` | `#0B0F19` | `--color-bg` | Main application background |
| **Card / Surface** | `#FFFFFF` | `#111827` | `--color-card` | Data cards, tables, modals |
| **Sidebar Surface** | `#FFFFFF` | `#0E1526` | `--color-sidebar` | Right-side navigation rail |
| **Border Subtle** | `#E2E8F0` | `#1F293D` | `--color-border` | Dividers, card borders, tab borders |
| **Border Strong** | `#CBD5E1` | `#334155` | `--color-border-strong` | Active input borders, highlighted tabs |
| **Text Primary** | `#0F172A` | `#F8FAFC` | `--color-text` | Headings, primary content (WCAG AAA) |
| **Text Secondary** | `#475569` | `#CBD5E1` | `--color-text-secondary` | Labels, table cells (WCAG AA) |
| **Text Muted** | `#64748B` | `#94A3B8` | `--color-text-muted` | Hints, timestamps, disabled items |
| **Success** | `#059669` | `#10B981` | `--color-success` | Paid orders, connected status |
| **Warning** | `#D97706` | `#F59E0B` | `--color-warning` | Pending handoffs, low stock |
| **Destructive / Danger** | `#DC2626` | `#EF4444` | `--color-destructive` | Emergency stop, cancelled orders, delete |
| **Info** | `#2563EB` | `#3B82F6` | `--color-info` | System notices, info badges |

---

## 2. Typography & Arabic Rhythm

- **Primary Font:** `'Cairo', system-ui, -apple-system, sans-serif`
- **Secondary Arabic Font:** `'IBM Plex Sans Arabic', sans-serif`
- **Numbers / Metrics / Currency / Code:** `'Inter', font-mono, tabular-nums`

### Scale
- **Display / H1:** 24px - 28px | `font-bold` (700) | `leading-tight`
- **Section / H2:** 18px - 20px | `font-bold` (700) | `leading-snug`
- **Card Title / H3:** 15px - 16px | `font-semibold` (600) | `leading-normal`
- **Body Text:** 13px - 14px | `font-normal` (400) or `font-medium` (500) | `leading-relaxed`
- **Caption / Meta:** 12px | `font-medium` (500) | `leading-normal`
- **Micro Badge:** 11px | `font-bold` (700) | `leading-none` (never use smaller than 11px in Arabic)

---

## 3. Shadows & Elevation System

```css
/* Elevation 1: Flat surfaces, subtle separation */
--shadow-elevation-1: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04);

/* Elevation 2: Interactive cards, lift on hover */
--shadow-elevation-2: 0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04);

/* Elevation 3: Dropdowns, tooltips, popovers */
--shadow-elevation-3: 0 12px 28px -6px rgba(15, 23, 42, 0.10), 0 4px 8px -4px rgba(15, 23, 42, 0.05);

/* Elevation 4: Modals, dialogs, overlays */
--shadow-elevation-4: 0 24px 48px -12px rgba(15, 23, 42, 0.18), 0 8px 16px -8px rgba(15, 23, 42, 0.08);

/* Brand Glows */
--glow-whatsapp: 0 4px 14px 0 rgba(18, 140, 126, 0.22);
--glow-ai: 0 4px 14px 0 rgba(124, 58, 237, 0.25);
--glow-danger: 0 4px 14px 0 rgba(220, 38, 38, 0.22);
```

---

## 4. Component Sizing Standards

- **Buttons:**
  - `sm`: `h-8 px-2.5 text-xs rounded-xl` (Quick actions in tables)
  - `md`: `h-9.5 px-3.5 text-sm rounded-xl` (Standard actions, filter buttons)
  - `lg`: `h-11 px-5 text-base rounded-xl` (Primary modal submit, CTA)
- **Inputs & Selects:**
  - `sm`: `h-8 px-2.5 text-xs rounded-xl`
  - `md`: `h-9.5 px-3 text-sm rounded-xl` (Matching button heights)
  - `lg`: `h-11 px-4 text-base rounded-xl`
- **Badges / Pills:**
  - `sm`: `h-5 px-2 text-[10px] font-bold rounded-full`
  - `md`: `h-6 px-2.5 text-xs font-bold rounded-full`
- **Cards & Modals:**
  - Card Border Radius: `rounded-2xl` (16px) or `rounded-xl` (12px)
  - Modal Border Radius: `rounded-2xl` (16px)
  - Modal Scrim: `bg-slate-900/60 backdrop-blur-sm`

---

## 5. Anti-Patterns & Quality Rules

1. ❌ **No emojis as icons** — Always use Lucide or Material Symbols vector icons.
2. ❌ **No micro-text < 11px in Arabic** — Cairo and Arabic scripts become illegible below 11px.
3. ❌ **No layout-shifting hover effects** — Use color, border, and elevation transitions; avoid sudden size shifts.
4. ❌ **No unlabelled AI actions** — Any action, draft, or reply produced by AI MUST carry the `#7C3AED` violet badge or border.
5. ❌ **No missing `cursor-pointer`** on clickable elements.
6. ❌ **Always provide visible focus rings** (`focus:ring-2 focus:ring-[#128C7E]/20 focus:outline-none`).
7. ❌ **Respect RTL orientation** — Icons indicating direction (chevrons, back/forward arrows) must follow the Arabic RTL flow.
