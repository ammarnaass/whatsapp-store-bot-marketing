# Telegram Bot Gateway Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-dependency, native Long Polling Telegram Bot Gateway allowing store merchants to connect their Telegram bot (@BotFather token), receive and send customer chats, and run the automated AI store agent across Telegram and WhatsApp simultaneously.

**Architecture:** Native Node.js fetch long-polling loop inside Electron main process (`TelegramBotService`), message adapter routing updates to unified SQLite conversations and `AIAgentEngine`, with modular React frontend controls under `features/telegram/` and `features/channels/`.

**Tech Stack:** Electron Main, Better-SQLite3, Node.js Native Fetch API, Telegram Bot HTTP API, React 19, TypeScript, Tailwind CSS, WaSell Design System.

**Spec:** Multi-channel Telegram bot integration for Wasell platform (Arabic RTL, local desktop execution).

## Global Constraints
- Every source code file must strictly remain under 150 lines (aim for < 120 lines) per `skills/feature-modular-structure/SKILL.md`.
- Zero external npm packages for Telegram (use native fetch against `api.telegram.org` to keep the app ultra-fast and lightweight).
- Full Arabic RTL UI with dark mode support and Wasell design tokens (`#128C7E`, `#0088cc` for Telegram).
- Safe token storage and graceful error handling on invalid tokens or network disconnects.

## Review Focus
1. **Invalid or revoked Bot Token:** Must validate via `getMe` before starting polling and surface clean Arabic error messages.
2. **Network timeout during long polling:** Polling loop must handle aborted/timeout requests gracefully without unhandled promise rejections.
3. **Infinite reply loops:** Inbound message parser must ignore messages sent from bot accounts or matching bot username.
4. **Offset synchronization:** The `offset` parameter must increment as `update_id + 1` immediately to prevent repeated duplicate processing.
5. **AI Message formatting:** Telegram messages support MarkdownV2/HTML; plain text formatting fallback must be enforced to avoid `400 Bad Request`.

---

### Task 1: Database Schema & IPC Channels
**Files:**
- Modify: `src/main/database/schema.sql`
- Modify: `src/main/database/db.ts`
- Modify: `src/shared/ipc-channels.ts`
- Modify: `src/shared/types.ts`

**Steps:**
- [ ] Add `telegram_config` table definition in `schema.sql` (columns: `id`, `bot_token`, `bot_username`, `bot_first_name`, `is_active`, `auto_reply`, `last_sync_at`, timestamps).
- [ ] Initialize `telegram_config` table in `src/main/database/db.ts` with safe migration and default seed record.
- [ ] Add IPC channel constants in `src/shared/ipc-channels.ts`:
  - `TELEGRAM_GET_CONFIG`, `TELEGRAM_SAVE_CONFIG`, `TELEGRAM_TEST_TOKEN`, `TELEGRAM_START`, `TELEGRAM_STOP`, `TELEGRAM_STATUS`, `TELEGRAM_SEND_MESSAGE`, `TELEGRAM_MESSAGE_RECEIVED_EVENT`.
- [ ] Define shared TypeScript interfaces in `src/shared/types.ts`: `TelegramConfig`, `TelegramBotInfo`, `TelegramSendOptions`.
- [ ] Verify database schema and types compile cleanly.

---

### Task 2: Core Telegram Bot Service (Main Process)
**Files:**
- Create: `src/main/services/telegram/telegram-bot.service.ts` (< 140 lines)
- Create: `src/main/services/telegram/telegram-message-adapter.ts` (< 120 lines)

**Steps:**
- [ ] Implement `TelegramBotService` in `src/main/services/telegram/telegram-bot.service.ts`:
  - `testToken(token)`: calls `https://api.telegram.org/bot<TOKEN>/getMe`.
  - `startPolling()`: starts recursive `getUpdates` with `timeout=25` and AbortController.
  - `stopPolling()`: safely aborts active requests and updates running state.
  - `sendMessage(chatId, text, options)`: posts to `/sendMessage` with clean text fallback.
- [ ] Implement `TelegramMessageAdapter` in `src/main/services/telegram/telegram-message-adapter.ts`:
  - Parses raw Telegram `Update` into Wasell `Contact`, `Conversation`, and `Message`.
  - Saves inbound message to SQLite database with `channel: 'telegram'`.
  - Dispatches message to `AIAgentEngine` when `auto_reply` is enabled.
  - Sends AI response back to customer's Telegram chat via `TelegramBotService`.
- [ ] Add unit test / verification script to ensure service handles empty updates and network reconnects.

---

### Task 3: IPC Handler & Preload Contract
**Files:**
- Create: `src/main/ipc/handlers/telegram.handler.ts` (< 115 lines)
- Modify: `src/main/ipc/registry.ts`
- Modify: `src/preload/contracts.ts`
- Modify: `src/preload/index.ts`
- Modify: `src/renderer/src/api/fallbacks/clean-fallbacks.ts`

**Steps:**
- [ ] Create `telegram.handler.ts` to wire all `IPC_CHANNELS.TELEGRAM_*` handlers to `TelegramBotService` and database.
- [ ] Register `registerTelegramHandlers(mainWindow, db)` inside `src/main/ipc/registry.ts`.
- [ ] Add `telegram` namespace to `IElectronAPI` in `src/preload/contracts.ts`.
- [ ] Expose `telegram` methods in `src/preload/index.ts`.
- [ ] Provide clean fallback mock in `src/renderer/src/api/fallbacks/clean-fallbacks.ts`.
- [ ] Verify build with `npm run build:main`.

---

### Task 4: Renderer Telegram Feature Layer
**Files:**
- Create: `src/renderer/src/features/telegram/types/telegram.types.ts` (< 35 lines)
- Create: `src/renderer/src/features/telegram/constants/telegram.constants.ts` (< 40 lines)
- Create: `src/renderer/src/features/telegram/services/telegram.service.ts` (< 70 lines)
- Create: `src/renderer/src/features/telegram/hooks/useTelegramBot.ts` (< 95 lines)
- Create: `src/renderer/src/features/telegram/index.ts` (< 20 lines)

**Steps:**
- [ ] Create types, constants, and service calling `window.electronAPI.telegram`.
- [ ] Create `useTelegramBot` hook managing:
  - Config loading and saving.
  - Token testing (`isTestingToken`, `testResult`).
  - Active toggle and polling state (`isPolling`, `startBot`, `stopBot`).
  - Sending test messages.
- [ ] Export public API through `index.ts`.

---

### Task 5: UI Components & Channels Page Integration
**Files:**
- Create: `src/renderer/src/features/telegram/components/TelegramStatusBadge.tsx` (< 50 lines)
- Create: `src/renderer/src/features/telegram/components/TelegramBotCard.tsx` (< 130 lines)
- Create: `src/renderer/src/features/telegram/components/TelegramTestMessageModal.tsx` (< 95 lines)
- Modify: `src/renderer/src/features/channels/components/ChannelsSubTabs.tsx`
- Modify: `src/renderer/src/features/channels/components/SupportChannelsCard.tsx`
- Modify: `src/renderer/src/features/channels/pages/ChannelsPage.tsx`

**Steps:**
- [ ] Build `TelegramStatusBadge.tsx`: live badge showing `متصل (Online)`, `متوقف (Stopped)`, or `خطأ بالتوكن`.
- [ ] Build `TelegramBotCard.tsx`: token input field, `@BotFather` guide links, test token button, auto-reply toggle, and live statistics.
- [ ] Build `TelegramTestMessageModal.tsx`: modal to send a test message to a Telegram Chat ID or username.
- [ ] Update `ChannelsSubTabs.tsx` to include `telegram` subtab with blue Telegram badge.
- [ ] Update `SupportChannelsCard.tsx` to feature the Telegram Bot Gateway alongside WhatsApp & SMS.
- [ ] Integrate into `ChannelsPage.tsx` so clicking the Telegram tab renders `TelegramBotCard`.

---

### Task 6: Verification, End-to-End Test & GitHub Commit
**Files:**
- All touched files

**Steps:**
- [ ] Run file line count audit (`wc -l`) to confirm every single file is strictly < 150 lines.
- [ ] Run `node scripts/build-css.mjs && npm run build` to verify clean compilation.
- [ ] Verify Telegram updates in dev environment without unhandled errors.
- [ ] Commit with message `feat(channels): add telegram bot gateway with long polling and ai auto-reply`.
- [ ] Push clean changes to `origin/main`.

