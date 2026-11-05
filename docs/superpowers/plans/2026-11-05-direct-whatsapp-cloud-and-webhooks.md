# Full Dual-Engine WhatsApp (OpenWA + Meta Cloud API & Webhooks) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a robust, production-ready Dual-Engine WhatsApp platform for WaSell that seamlessly supports both the local OpenWA QR Gateway and direct official Meta WhatsApp Cloud API (WABA) with live Webhook verification, message reception, Graph API dispatch, and hot provider switching in Channels.

**Architecture:** Create `whatsapp_cloud_config` in SQLite to store Cloud API keys and active provider (`openwa_gateway` | `meta_cloud`), extend `WebhookServerService` with Meta webhook verification (`GET /webhook/whatsapp`) and event parsing (`POST /webhook/whatsapp`), build `WhatsAppCloudClient` for direct Graph API requests, add dynamic provider routing in `chat.handler.ts`, and upgrade the Channels UI cards (`ProviderSelectorCard`, `WabaCredentialsCard`, `WebhookConfigCard`, `LiveWebhookStreamCard`) keeping all files under 120 lines.

**Tech Stack:** TypeScript, Node.js HTTP/crypto, Electron IPC, better-sqlite3, React 19, Lucide React, Meta Graph API v19.0.

**Spec:** PRD v0.3 & Approach 1 approved in conversation history.

---

## Global Constraints
- Target platform: Electron desktop app (Linux & Windows).
- Modular design: Every file must strictly stay under 150 lines (target < 120 lines) per `skills/feature-modular-structure/SKILL.md`.
- Dual-channel coexistence: OpenWA Gateway and Meta Cloud API coexist smoothly; merchants can switch between them with one click without losing contacts or history.
- Real Webhook Verification: Strict implementation of Meta's `hub.mode === 'subscribe'` and `hub.verify_token` handshake, responding with raw text `hub.challenge` (HTTP 200).
- Inbound resilience: Webhook payloads must be stored in `inbound_events_queue` before processing so network spikes or parse edge cases never cause 500 errors to Meta.

## Review Focus
1. Meta Verification Handshake: `GET /webhook/whatsapp` must return raw HTTP 200 with the exact `hub.challenge` string and no JSON quotes.
2. Token security: Tokens stored in SQLite and displayed with masking (`••••••••`) and reveal toggle in UI.
3. Message parsing: `MetaWebhookParser` must handle status updates (`sent`, `delivered`, `read`) gracefully without misinterpreting them as incoming messages.
4. Hot Channel Switching: Outbound messages from Chat Handler, Inbox, and AI Agent route according to `active_provider` (OpenWA or Meta Cloud).
5. Empty / Offline states: If Cloud API is not configured when selected, UI shows clear setup guidance.

---

### Task 1: Database Schema & Migration for WhatsApp Cloud Config

**Files:**
- Modify: `src/main/database/schema.sql`
- Modify: `src/main/database/db.ts`

- [ ] **Step 1:** Add `whatsapp_cloud_config` table definition to `src/main/database/schema.sql` (`id`, `phone_number_id`, `wbaid`, `access_token`, `verify_token`, `webhook_url`, `active_provider`, `is_active`, `updated_at`).
- [ ] **Step 2:** Add automatic table migration in `src/main/database/db.ts` if table does not exist.
- [ ] **Step 3:** Seed default config row with verify token `wasell_webhook_token_2026` and `active_provider = 'openwa_gateway'`.
- [ ] **Step 4:** Verify database schema initialization.

---

### Task 2: Meta Webhook Verification & Event Parser Backend

**Files:**
- Create: `src/main/services/meta-webhook-parser.ts`
- Modify: `src/main/services/webhook-server.service.ts`

- [ ] **Step 1:** Create `src/main/services/meta-webhook-parser.ts` to parse Meta Cloud API payload (`entry[0].changes[0].value.messages`) into normalized `{ from, name, text, messageId, timestamp }`.
- [ ] **Step 2:** Update `src/main/services/webhook-server.service.ts` to handle:
  - `GET /webhook/whatsapp` for Meta `hub.challenge` handshake.
  - `POST /webhook/whatsapp` for incoming messages, persisting to SQLite `messages` and emitting `'new-message'` event.
  - `GET /webhook/status` returning current listener health.
- [ ] **Step 3:** Ensure file line count is strictly under 120 lines.

---

### Task 3: WhatsApp Cloud Client & Graph API Dispatcher

**Files:**
- Create: `src/main/services/whatsapp-cloud-client.ts`

- [ ] **Step 1:** Create `src/main/services/whatsapp-cloud-client.ts` implementing:
  - `testConnection(phoneNumberId, token)` via `https://graph.facebook.com/v19.0/{phoneNumberId}`.
  - `sendTextMessage(phoneNumberId, token, to, text)`.
  - `sendTemplateMessage(phoneNumberId, token, to, templateName, languageCode)`.
- [ ] **Step 2:** Add error handling with localized Arabic error messages.
- [ ] **Step 3:** Verify line count is strictly under 120 lines.

---

### Task 4: Dual-Channel Outbound Routing & IPC Registration

**Files:**
- Modify: `src/shared/ipc-channels.ts`
- Create: `src/main/ipc/handlers/channels.handler.ts`
- Modify: `src/main/ipc/handlers/chat.handler.ts`
- Modify: `src/main/ipc/registry.ts`
- Modify: `src/preload/contracts.ts`
- Modify: `src/preload/index.ts`
- Modify: `src/renderer/src/api/client.ts`
- Modify: `src/renderer/src/api/fallbacks/clean-fallbacks.ts`

- [ ] **Step 1:** Add channels IPC constants in `src/shared/ipc-channels.ts` (`CHANNELS_GET_CONFIG`, `CHANNELS_SAVE_CONFIG`, `CHANNELS_TEST_CLOUD_API`, `CHANNELS_TEST_WEBHOOK`, `CHANNELS_GET_WEBHOOK_LOGS`, `CHANNELS_SET_ACTIVE_PROVIDER`).
- [ ] **Step 2:** Create `src/main/ipc/handlers/channels.handler.ts` linking SQLite config, `WhatsAppCloudClient`, and `WebhookServerService`.
- [ ] **Step 3:** Update `src/main/ipc/handlers/chat.handler.ts` to route outbound messages through either `WhatsAppCloudClient` or `OpenWAManager` based on `active_provider`.
- [ ] **Step 4:** Register in `src/main/ipc/registry.ts`.
- [ ] **Step 5:** Expose in `src/preload/contracts.ts`, `src/preload/index.ts`, `client.ts`, and `clean-fallbacks.ts`.
- [ ] **Step 6:** Verify compilation with `npm run build:main`.

---

### Task 5: Frontend Channels Service & useChannels Hook Upgrade

**Files:**
- Create: `src/renderer/src/features/channels/services/channels.service.ts`
- Modify: `src/renderer/src/features/channels/hooks/useChannels.ts`

- [ ] **Step 1:** Create `channels.service.ts` to execute IPC calls with graceful fallbacks.
- [ ] **Step 2:** Refactor `useChannels.ts` to load initial config from SQLite via IPC, save config permanently, switch active provider, and run test pings.
- [ ] **Step 3:** Ensure `useChannels.ts` line count stays under 120 lines.

---

### Task 6: UI Upgrade: Dual-Engine Architecture & Live Stream

**Files:**
- Modify: `src/renderer/src/features/channels/components/ProviderSelectorCard.tsx`
- Modify: `src/renderer/src/features/channels/components/WabaCredentialsCard.tsx`
- Modify: `src/renderer/src/features/channels/components/WebhookConfigCard.tsx`
- Modify: `src/renderer/src/features/channels/components/LiveWebhookStreamCard.tsx`
- Modify: `src/renderer/src/features/channels/pages/ChannelsPage.tsx`

- [ ] **Step 1:** Upgrade `ProviderSelectorCard.tsx` with live toggle between OpenWA Gateway and Meta Cloud API.
- [ ] **Step 2:** Upgrade `WabaCredentialsCard.tsx` with live Save button, Test Connection button, and Graph API status badge.
- [ ] **Step 3:** Upgrade `WebhookConfigCard.tsx` with `/webhook/whatsapp` endpoint, Verify Token, and test ping button.
- [ ] **Step 4:** Upgrade `LiveWebhookStreamCard.tsx` to stream real inbound webhook records.
- [ ] **Step 5:** Verify all updated component files are strictly under 120 lines.

---

### Task 7: Quality Audit, Clean Compilation & GitHub Commit

**Files:**
- All touched files

- [ ] **Step 1:** Run line count audit (`wc -l`) on all created and modified files (< 120 lines).
- [ ] **Step 2:** Run `npm run build:renderer && npm run build:main` to ensure clean build.
- [ ] **Step 3:** Commit changes: `feat(channels): add dual-engine whatsapp cloud api and meta webhook system`.
- [ ] **Step 4:** Push to GitHub `origin/main`.
