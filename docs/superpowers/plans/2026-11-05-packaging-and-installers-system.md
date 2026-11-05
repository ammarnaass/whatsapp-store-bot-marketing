# نظام تحزيم وتثبيت التطبيق لمنصات Windows و Linux (Packaging & Installer System Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a robust, production-ready packaging and installer generation system for WaSell desktop application targeting Windows (NSIS Installer `.exe` and Portable `.exe`) and Linux (`.AppImage` and `.deb`), complete with native module unpacking (`better-sqlite3`), multi-resolution app icons, production path sanitization, and automated build scripts.

**Architecture:** `electron-builder` orchestration with declarative YAML config (`electron-builder.yml`), Vector-based SVG icon rendering via ImageMagick, unpacked ASAR native binding rules, and sanitized production paths leveraging `app.isPackaged` and `process.resourcesPath`.

**Tech Stack:** Electron 35, electron-builder, ImageMagick (`magick`), Better-SQLite3, NSIS, AppImage, Debian Package, Vite.

**Spec:** Cross-platform packaging system for Windows and Linux.

## Global Constraints
- Every source code file and script must strictly remain under 150 lines (aim for < 120 lines) per `skills/feature-modular-structure/SKILL.md`.
- No hardcoded absolute developer paths (e.g. `/home/ammar/...`) in runtime code.
- Native C++ addons (`better-sqlite3`) must be unpacked from ASAR (`asarUnpack`) to ensure clean loading on target machines without runtime errors.
- Target formats:
  - **Windows:** NSIS Installer (`.exe`) with custom installation directory choice and desktop shortcut + Portable (`.exe`).
  - **Linux:** Universal `.AppImage` (runs on Ubuntu, Fedora, Arch, Debian) + `.deb` package.
- Full RTL and Arabic metadata support in installer dialogs and application shortcuts.

## Review Focus
1. **Native Addon Resolution (`better-sqlite3`):** Packaged app must load `better-sqlite3.node` without `NODE_MODULE_VERSION` or `cannot find module in asar` errors.
2. **Schema & Resource Paths:** `schema.sql` and SQLite database file must correctly resolve to `process.resourcesPath` or `app.getPath('userData')` when `app.isPackaged` is true.
3. **Missing Wine for Cross-Compilation:** Building Windows binaries on Linux without full Wine environment must fail gracefully with clear warnings or be isolated via target-specific scripts (`dist:linux` vs `dist:win`).
4. **App Icons Fidelity:** Icons must render crisp at all sizes (16x16 to 512x512) and embed cleanly into the Windows `.exe` and Linux `.desktop` launcher.
5. **Clean Uninstaller (Windows):** The NSIS uninstaller must cleanly remove shortcuts and application binaries without deleting user merchant data (`userData`).

---

### Task 1: Production Runtime Path Sanitization
**Files:**
- Modify: `src/main/services/openwa/openwa-process.ts` (< 130 lines)
- Modify: `src/main/database/db.ts` (< 140 lines)
- Modify: `src/main/index.ts` (< 140 lines)

**Interfaces:**
- Produces clean runtime path resolution:
  - `getAppResourcePath(relativePath: string): string`
  - `getOpenWaDir(): string` resolves via `process.resourcesPath`, `process.env.OPENWA_DIR`, or dev directory.

**Steps:**
- [ ] Remove hardcoded `/home/ammar/...` paths from `openwa-process.ts`.
- [ ] In `db.ts`, ensure schema loading checks `path.join(process.resourcesPath, 'schema.sql')` when `app.isPackaged` is true before falling back to local files.
- [ ] Ensure `userData` is always used for the SQLite database path in production.
- [ ] Verify TypeScript compiles with `npm run build:main`.

---

### Task 2: Vector App Branding Assets & Multi-Resolution Icons Generation
**Files:**
- Create: `build/icon.svg`
- Create: `scripts/generate-icons.mjs` (< 90 lines)
- Generate: `build/icon.png` (512x512)
- Generate: `build/icon.ico` (256, 128, 64, 48, 32, 16)
- Generate: `build/icons/` (16x16, 32x32, 48x48, 64x64, 128x128, 256x256, 512x512)

**Steps:**
- [ ] Create `build/icon.svg`: modern WaSell brand mark featuring gradient `#128C7E` to `#075E54`, bold stylized 'W', and emerald notification badge.
- [ ] Implement `scripts/generate-icons.mjs` using ImageMagick (`magick`) to render:
  - 512x512 PNG master icon.
  - Multi-layer Windows `.ico` file.
  - Sized PNGs in `build/icons/`.
- [ ] Run `node scripts/generate-icons.mjs` and verify all generated icon files.
- [ ] Commit branding assets.

---

### Task 3: Packaging Engine & Electron-Builder Configuration
**Files:**
- Create: `electron-builder.yml` (< 90 lines)
- Modify: `package.json`

**Steps:**
- [ ] Install `electron-builder` in `devDependencies`.
- [ ] Create `electron-builder.yml` with comprehensive configuration:
  - `appId: store.wasell.app`
  - `productName: WaSell AI Store`
  - `copyright: Copyright © 2026 WaSell`
  - `directories: { output: 'release', buildResources: 'build' }`
  - `files: ['dist/**/*', 'package.json']`
  - `extraResources: [{ from: 'dist/main/schema.sql', to: 'schema.sql' }]`
  - `asarUnpack: ['**/node_modules/better-sqlite3/**']`
  - `linux: { target: ['AppImage', 'deb'], category: 'Office', icon: 'build/icon.png' }`
  - `win: { target: ['nsis', 'portable'], icon: 'build/icon.ico' }`
  - `nsis: { oneClick: false, allowToChangeInstallationDirectory: true, createDesktopShortcut: true, createStartMenuShortcut: true, shortcutName: 'WaSell AI Store', runAfterFinish: true }`
- [ ] Verify configuration syntax and options.

---

### Task 4: Packaging NPM Scripts & Automation
**Files:**
- Modify: `package.json`

**Steps:**
- [ ] Add npm scripts in `package.json`:
  - `"icons": "node scripts/generate-icons.mjs"`
  - `"package:dir": "npm run build && electron-builder --dir"`
  - `"dist:linux": "npm run build && electron-builder --linux AppImage deb"`
  - `"dist:win": "npm run build && electron-builder --win nsis portable"`
  - `"dist": "npm run build && electron-builder --linux AppImage deb --win nsis portable"`
- [ ] Test `npm run package:dir` to verify unpacked binary creation.

---

### Task 5: Packaging Verification & Binary Testing
**Files:**
- `release/` output directory

**Steps:**
- [ ] Run `npm run dist:linux` to produce `.AppImage` and `.deb`.
- [ ] Verify binary permissions (`chmod +x`) and size.
- [ ] Inspect generated release directory contents.
- [ ] Run `npm run dist:win` or verify NSIS config ready for CI/CD / Wine.

---

### Task 6: Final Verification, Line Count Audit & Git Commit
**Files:**
- All touched files

**Steps:**
- [ ] Run line count audit (`wc -l`) on all new/modified files (< 150 lines).
- [ ] Run `node scripts/build-css.mjs && npm run build` to verify clean builds.
- [ ] Commit with message `feat(packaging): add cross-platform packaging and installer system for windows and linux`.
- [ ] Push to `origin/main`.

