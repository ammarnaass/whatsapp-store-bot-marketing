# نظام المصادقة وإدارة الجلسات والتسجيل وتأمين الدخول (Auth & User Sessions Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a secure, production-grade authentication, registration, login, and multi-device session management system for Wasell platform, eliminating unauthenticated auto-login, implementing cryptographic session tokens, and providing full session audit and revoke controls.

**Architecture:** SQLite-backed `user_sessions` table with cryptographic session tokens, managed by `SessionManagerService` in Electron Main, exposed via IPC to Zustand `useAuthStore` with strict app-startup session resolution, and modular RTL Arabic UI under `features/auth/`.

**Tech Stack:** Electron Main, Node.js Crypto (PBKDF2 & UUID tokens), Better-SQLite3, React 19, TypeScript, Zustand, Tailwind CSS, WaSell Design System.

**Spec:** Multi-user secure merchant login & session management for Wasell desktop app.

## Global Constraints
- Every source code file must strictly remain under 150 lines (aim for < 120 lines) per `skills/feature-modular-structure/SKILL.md`.
- No automatic owner login bypass when opening the app without an authenticated, active session.
- If zero users exist in the database, seamlessly guide the merchant to the "Initial Owner Setup" screen.
- Full Arabic RTL UI with dark mode support and Wasell design tokens (`#128C7E`, `#075E54`).
- Passwords must be hashed using PBKDF2 with unique salts, and session tokens must use cryptographically secure random bytes.

## Review Focus
1. **Fresh App Launch without Session:** Must present `AuthScreen` (Login/Register) and never leak dashboard data before login.
2. **First-time Setup:** When SQLite database has 0 users, UI must automatically display the Owner Registration form.
3. **Remember Me Behavior:** If checked, session persists for 30 days; if unchecked, session token is ephemeral (session storage/in-memory).
4. **Session Invalidation:** Explicit logout or revoking a session in the database must immediately bounce the user back to the login screen.
5. **Suspended Account:** A user marked as `status: 'suspended'` must be rejected immediately during login or session validation.

---

### Task 1: Database Schema & Session Models
**Files:**
- Modify: `src/main/database/schema.sql`
- Modify: `src/main/database/db.ts`
- Modify: `src/shared/ipc-channels.ts`
- Modify: `src/shared/types.ts`
- Modify: `src/renderer/src/features/auth/types/auth.types.ts`

**Steps:**
- [ ] Add `user_sessions` table definition in `schema.sql`:
  `id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id) ON DELETE CASCADE, session_token TEXT UNIQUE NOT NULL, device_name TEXT, ip_address TEXT, expires_at DATETIME NOT NULL, is_active INTEGER DEFAULT 1, last_active_at DATETIME, created_at DATETIME`.
- [ ] Initialize `user_sessions` in `src/main/database/db.ts` and apply to live database file.
- [ ] Add IPC channel constants in `src/shared/ipc-channels.ts`:
  `AUTH_VALIDATE_SESSION`, `AUTH_LOGOUT`, `AUTH_LIST_SESSIONS`, `AUTH_REVOKE_SESSION`, `AUTH_REVOKE_ALL_SESSIONS`, `AUTH_CHECK_HAS_USERS`.
- [ ] Define shared TypeScript interfaces: `UserSession`, `AuthSessionValidationResult`, `LoginOptions`.
- [ ] Verify types and schema compile cleanly.

---

### Task 2: Core Session Manager Service & IPC Handlers (Main Process)
**Files:**
- Create: `src/main/auth/session-manager.service.ts` (< 115 lines)
- Modify: `src/main/ipc/handlers/auth.handler.ts` (< 130 lines)

**Steps:**
- [ ] Implement `SessionManagerService` in `src/main/auth/session-manager.service.ts`:
  - `createSession(userId, rememberMe, deviceName)`: generates 32-byte hex token, sets expiration (30 days or 24 hours), stores in `user_sessions`.
  - `validateSession(sessionToken)`: checks token exists, `is_active = 1`, not expired, updates `last_active_at`, and returns sanitized `User`.
  - `revokeSession(sessionToken)`: sets `is_active = 0`.
  - `revokeAllUserSessions(userId, keepCurrentToken?)`: revokes all other sessions for the user.
  - `listUserSessions(userId)`: returns all sessions with relative last active time.
- [ ] Refactor `src/main/ipc/handlers/auth.handler.ts`:
  - Remove auto-login fallback when `userId` is omitted.
  - Return `sessionToken` alongside `user` upon successful login and registration.
  - Wire `AUTH_VALIDATE_SESSION`, `AUTH_LOGOUT`, `AUTH_LIST_SESSIONS`, and `AUTH_CHECK_HAS_USERS`.
- [ ] Test password verification and token generation.

---

### Task 3: Preload Contracts & Fallback API
**Files:**
- Modify: `src/preload/contracts.ts`
- Modify: `src/preload/index.ts`
- Modify: `src/renderer/src/api/fallbacks/clean-fallbacks.ts`

**Steps:**
- [ ] Update `IElectronAPI.auth` in `contracts.ts` with `validateSession`, `logout`, `listSessions`, `revokeSession`, `checkHasUsers`.
- [ ] Expose the new methods through `ipcRenderer.invoke` in `src/preload/index.ts`.
- [ ] Update `cleanFallbackApi.auth` in `clean-fallbacks.ts`.
- [ ] Verify compilation with `npm run build:main`.

---

### Task 4: Store & Session Persistence Layer (Renderer)
**Files:**
- Create: `src/renderer/src/features/auth/hooks/useUserSessions.ts` (< 85 lines)
- Modify: `src/renderer/src/features/auth/store/useAuthStore.ts` (< 120 lines)

**Steps:**
- [ ] Refactor `useAuthStore.ts`:
  - `initAuth()`: calls `checkHasUsers()`. If false -> sets `isFirstTimeSetup = true`, `isAuthenticated = false`.
  - Reads stored `session_token` from `localStorage` (or memory).
  - Calls `api.auth.validateSession({ sessionToken })`. If valid -> sets `currentUser`, `isAuthenticated = true`. If invalid -> clears token and sets `isAuthenticated = false`.
  - `login(email, password, rememberMe)`: saves `session_token` if `rememberMe = true`.
  - `logout()`: calls `api.auth.logout({ sessionToken })`, clears storage, and resets store state.
- [ ] Implement `useUserSessions.ts` for listing active devices and revoking sessions.

---

### Task 5: UI Components & Active Sessions Management
**Files:**
- Create: `src/renderer/src/features/auth/components/ActiveSessionsTab.tsx` (< 110 lines)
- Modify: `src/renderer/src/features/auth/components/LoginForm.tsx` (< 120 lines)
- Modify: `src/renderer/src/features/auth/components/RegisterForm.tsx` (< 135 lines)
- Modify: `src/renderer/src/features/auth/components/AuthScreen.tsx` (< 100 lines)
- Modify: `src/renderer/src/features/auth/components/AccountManagementModal.tsx` (< 115 lines)

**Steps:**
- [ ] Update `LoginForm.tsx`: add "تذكرني على هذا الجهاز (Remember Me)" checkbox, disable automatic bypass, show clean error alerts.
- [ ] Update `RegisterForm.tsx`: add store name field, validate password confirmation, show loading spinner.
- [ ] Update `AuthScreen.tsx`: automatically show "إنشاء متجر جديد" if `isFirstTimeSetup` is true, otherwise show "تسجيل الدخول".
- [ ] Build `ActiveSessionsTab.tsx`: display active devices (OS, device name, current session badge, last active time, revoke button).
- [ ] Integrate `ActiveSessionsTab` into `AccountManagementModal.tsx`.

---

### Task 6: Verification, End-to-End Audit & GitHub Commit
**Files:**
- All touched files

**Steps:**
- [ ] Run file line count audit (`wc -l`) to confirm every single file is strictly < 150 lines.
- [ ] Run `node scripts/build-css.mjs && npm run build` to verify clean compilation.
- [ ] Verify login flow, remember me, logout, and first-time registration without errors.
- [ ] Commit with message `feat(auth): add secure user sessions, remember-me, and login/registration system`.
- [ ] Push to `origin/main`.

