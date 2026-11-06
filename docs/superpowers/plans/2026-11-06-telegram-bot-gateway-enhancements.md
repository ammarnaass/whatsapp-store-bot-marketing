# Telegram Bot Gateway Enhancements (API Token Lifecycle & Catalog Display Options) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Overview
This plan enhances the Telegram Bot Gateway (`TelegramBotService`, `TelegramMessageAdapter`, `TelegramBotCard`) by providing:
1. **Explicit API Token Management**: Dedicated "Save Token" and "Delete/Clear Token" actions with secure storage, confirmation dialogs, and instant daemon stop.
2. **Customizable Catalog & Product Display Options**: Toggles and options for automatically displaying products on `/start` or `/catalog`, adjusting product display limit (4, 8, 12, 16), filtering by category (All, Digital Cards & Subs, Electronics & Phones), custom welcome message, and interactive inline buttons.
3. **Strict Line Count Constraint**: Every new or touched file must strictly adhere to `< 120 lines/file`.

---

## File Structure & Responsibilities

| File Path | Role / Responsibility | Target Lines |
| :--- | :--- | :--- |
| `src/shared/types.ts` | Extended `TelegramConfig` interface with catalog toggles & options | Preserved (< 120 lines edits) |
| `src/shared/ipc-channels.ts` | IPC channel constant `TELEGRAM_DELETE_TOKEN` | Preserved (< 120 lines edits) |
| `src/main/database/db.ts` | SQLite schema migrations for `telegram_config` columns | Preserved (< 120 lines edits) |
| `src/preload/contracts.ts` | Preload types for `deleteToken` and extended config | Preserved (< 120 lines edits) |
| `src/preload/index.ts` | Preload bridge for `deleteToken` | Preserved (< 120 lines edits) |
| `src/renderer/src/api/fallbacks/clean-fallbacks.ts` | Fallback mock implementation for development | Preserved (< 120 lines edits) |
| `src/main/ipc/handlers/telegram.handler.ts` | Handlers for `TELEGRAM_SAVE_CONFIG` and `TELEGRAM_DELETE_TOKEN` | < 120 lines |
| `src/main/services/telegram/telegram-message-adapter.ts` | Dynamic catalog generator obeying toggles, categories & limit | < 120 lines |
| `src/renderer/src/features/telegram/services/telegram.service.ts` | Frontend service exposing `deleteToken` | < 80 lines |
| `src/renderer/src/features/telegram/hooks/useTelegramBot.ts` | Reactive state for token lifecycle, catalog options & save/delete | < 120 lines |
| `src/renderer/src/features/telegram/components/TelegramBotCatalogSettings.tsx` | Modular UI component for Telegram catalog & welcome preferences | < 100 lines |
| `src/renderer/src/features/telegram/components/TelegramBotCard.tsx` | Refactored card with Save Token, Delete Token, and sub-settings | < 115 lines |

---

## Tasks

### Task 1: Database Migration & Shared Types
- [x] In `src/shared/types.ts`, extend `TelegramConfig` with:
  - `show_catalog?: boolean;`
  - `catalog_limit?: number;`
  - `catalog_category_filter?: string;`
  - `welcome_message?: string;`
  - `show_quick_buttons?: boolean;`
- [x] In `src/shared/ipc-channels.ts`, add `TELEGRAM_DELETE_TOKEN: 'telegram:delete-token'`.
- [x] In `src/main/database/db.ts`, add schema migrations:
  - Add columns `show_catalog` (INTEGER DEFAULT 1), `catalog_limit` (INTEGER DEFAULT 8), `catalog_category_filter` (TEXT DEFAULT 'all'), `welcome_message` (TEXT DEFAULT NULL), `show_quick_buttons` (INTEGER DEFAULT 1) to `telegram_config`.
- [x] Verify migration in SQLite using `better-sqlite3` script.

### Task 2: IPC Backend Handlers & Bridge
- [x] In `src/main/ipc/handlers/telegram.handler.ts`:
  - Handle `IPC_CHANNELS.TELEGRAM_DELETE_TOKEN`: stop polling, set `bot_token = NULL`, `bot_username = NULL`, `bot_first_name = NULL`, `is_active = 0`, `last_sync_at = NULL` in `telegram_config`.
  - Update `TELEGRAM_SAVE_CONFIG` to persist `show_catalog`, `catalog_limit`, `catalog_category_filter`, `welcome_message`, `show_quick_buttons`.
  - Ensure `telegram.handler.ts` stays `< 120 lines`.
- [x] In `src/preload/contracts.ts` and `src/preload/index.ts`:
  - Add `deleteToken: () => Promise<{ success: boolean }>`.
- [x] In `src/renderer/src/api/fallbacks/clean-fallbacks.ts`:
  - Add `deleteToken: async () => ({ success: true })`.
- [x] In `src/renderer/src/features/telegram/services/telegram.service.ts`:
  - Add `deleteToken(): Promise<{ success: boolean }>`.

### Task 3: Dynamic Catalog & Response Generation in Adapter
- [x] In `src/main/services/telegram/telegram-message-adapter.ts`:
  - Query config row on message: inspect `show_catalog`, `catalog_limit`, `catalog_category_filter`, `welcome_message`, `show_quick_buttons`.
  - If `show_catalog === 0`: do not send product list on `/start` or `/catalog`; instead send custom welcome message or guidance.
  - If `show_catalog === 1`: apply `catalog_category_filter` (if not 'all') and apply `catalog_limit` (default 8).
  - Include quick buttons only if `show_quick_buttons === 1`.
  - Preserve file length `< 120 lines`.

### Task 4: Frontend State & Catalog Settings Component
- [x] In `src/renderer/src/features/telegram/hooks/useTelegramBot.ts`:
  - Add state for `showCatalog`, `catalogLimit`, `catalogCategoryFilter`, `welcomeMessage`, `showQuickButtons`.
  - Add `saveToken()` handler to persist token and settings with toast feedback.
  - Add `deleteToken()` handler with user confirmation (`confirm`) to wipe token and reset form.
  - Keep file `< 120 lines`.
- [x] Create `src/renderer/src/features/telegram/components/TelegramBotCatalogSettings.tsx`:
  - Toggle for "عرض كتالوج المنتجات تلقائياً" (`showCatalog`).
  - Dropdown / selector for "عدد المنتجات بالكتالوج" (4, 8, 12, 16).
  - Dropdown for "تصنيف المنتجات المعروضة" (الكل، إلكترونيات وأجهزة، بطاقات واشتراكات).
  - Toggle for "أزرار التفاعل السريع (Inline Buttons)" (`showQuickButtons`).
  - Textarea / input for "رسالة الترحيب المخصصة" (`welcomeMessage`).
  - Keep file `< 100 lines`.
- [x] Update `src/renderer/src/features/telegram/components/TelegramBotCard.tsx`:
  - Add explicit "حفظ الرمز" (Save Token) button and "حذف الرمز" (Delete Token with Trash icon).
  - Embed `TelegramBotCatalogSettings` with collapsible accordion or clean section.
  - Keep file `< 115 lines`.

### Task 5: Compilation, Verification & Live Testing
- [x] Run `npm run build` to verify clean TypeScript compilation of main, preload, and renderer.
- [x] Verify line counts of all modified files (`< 120 lines`).
- [x] Test deleting and saving token in SQLite and UI.
- [x] Test toggling catalog display and changing limit/category in Telegram bot.
- [ ] Commit changes and push to `origin/main`.

