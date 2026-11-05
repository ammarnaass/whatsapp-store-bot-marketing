# Analytics & Conversation Intelligence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade Analytics & Conversation Intelligence System for WaSell with real SQLite aggregations, intent classification, customer sentiment, agent quality metrics, sales conversion funnel, peak hours heatmap, smart actionable recommendations, and real data export.

**Architecture:** A layered modular architecture: backend SQLite analytical queries with date range filtering in `analytics.repository.ts`, exposed via IPC channels in `analytics.handler.ts` and `preload/contracts.ts`, consumed on the frontend via `analytics.service.ts` and `useAnalytics.ts` hook, rendering into responsive bento-grid widgets strictly under 120 lines per file per `skills/feature-modular-structure/SKILL.md`.

**Tech Stack:** TypeScript, Electron IPC, better-sqlite3, React 19, Lucide React, Tailwind CSS 4.

**Spec:** PRD v0.3 & Design Document approved in conversation history.

---

## Global Constraints
- Target platform: Electron desktop app (Linux & Windows).
- Modular design: Every file must strictly stay under 150 lines (target < 120 lines).
- Type safety: Strict TypeScript interfaces across backend IPC, preload, and frontend.
- Zero mock data in production: All calculations run on SQLite tables (`conversations`, `messages`, `orders`, `agent_runs`, `agent_reviews`) with graceful empty states and mathematical fallbacks.
- Performance: Analytical queries must be fast and indexed; no heavy memory leaks or long-running blocking loops.

## Review Focus
1. Empty database behavior: When no orders or messages exist, dashboard must display zeros and clean empty states without `NaN` or crashes.
2. Period date filtering: Ensure 'today', '7d', '30d', and 'quarter' correctly filter timestamps in UTC/Local SQLite `datetime()`.
3. Division by zero safety: Funnel and automation percentage calculations must guard against zero denominators.
4. Offline / Fallback resilience: If running in web dev mode without Electron IPC, `clean-fallbacks.ts` and `analytics.service.ts` must provide realistic derived demo metrics without throwing unhandled exceptions.
5. Export formatting: CSV export must properly handle UTF-8 Arabic text encoding (BOM `\uFEFF`) and comma escaping.

---

### Task 1: Analytical IPC & SQLite Repository Backend

**Files:**
- Create: `src/main/database/analytics.repository.ts`
- Modify: `src/shared/ipc-channels.ts`
- Modify: `src/main/ipc/handlers/analytics.handler.ts`
- Modify: `src/preload/contracts.ts`
- Modify: `src/preload/index.ts`
- Modify: `src/renderer/src/api/fallbacks/clean-fallbacks.ts`

- [ ] **Step 1:** Define analytics IPC channels in `src/shared/ipc-channels.ts` (`ANALYTICS_GET_SUMMARY`, `ANALYTICS_GET_FUNNEL`, `ANALYTICS_GET_INTELLIGENCE`, `ANALYTICS_GET_PEAK_HOURS`, `ANALYTICS_GET_INSIGHTS`).
- [ ] **Step 2:** Create `src/main/database/analytics.repository.ts` implementing optimized SQL queries for metrics, funnel stages, intent distribution, sentiment scoring, agent latency, and peak hours.
- [ ] **Step 3:** Update `src/main/ipc/handlers/analytics.handler.ts` to register the new handlers with parameter validation (`period`).
- [ ] **Step 4:** Update `src/preload/contracts.ts` and `src/preload/index.ts` to expose `window.electronAPI.analytics` methods.
- [ ] **Step 5:** Update `src/renderer/src/api/fallbacks/clean-fallbacks.ts` with fallback definitions for non-Electron contexts.
- [ ] **Step 6:** Verify compilation with `npm run build:main`.

---

### Task 2: Frontend Types, Service, and useAnalytics Hook

**Files:**
- Modify: `src/renderer/src/features/analytics/types/analytics.types.ts`
- Create: `src/renderer/src/features/analytics/services/analytics.service.ts`
- Create: `src/renderer/src/features/analytics/hooks/useAnalytics.ts`
- Create: `src/renderer/src/features/analytics/utils/analytics-export.utils.ts`

- [ ] **Step 1:** Expand `analytics.types.ts` with full type definitions (`AnalyticsSummaryKpis`, `FunnelStepItem`, `IntentDistributionItem`, `SentimentMetric`, `AgentQualityMetrics`, `PeakHourItem`, `ActionableInsightItem`).
- [ ] **Step 2:** Create `analytics.service.ts` to bridge IPC calls and provide store-based fallbacks.
- [ ] **Step 3:** Create `useAnalytics.ts` custom hook to manage active period, auto-refresh, loading states, and summary computations.
- [ ] **Step 4:** Create `analytics-export.utils.ts` implementing UTF-8 BOM CSV generation and executive report formatting.
- [ ] **Step 5:** Verify with type checks and build test.

---

### Task 3: Header Controls, Period Filtering & Real CSV Export

**Files:**
- Modify: `src/renderer/src/features/analytics/components/AnalyticsHeader.tsx`

- [ ] **Step 1:** Update `AnalyticsHeader.tsx` to bind to `useAnalytics` period state ('today' | '7d' | '30d' | 'quarter').
- [ ] **Step 2:** Wire the comparison toggle (`comparePrevious`) and refresh trigger.
- [ ] **Step 3:** Connect the export button to `exportAnalyticsToCsv` generating a real downloadable CSV file.
- [ ] **Step 4:** Verify line count is strictly under 120 lines.

---

### Task 4: Dynamic KPI Cards & Conversational Funnel Card

**Files:**
- Modify: `src/renderer/src/features/analytics/components/AnalyticsKpiCards.tsx`
- Modify: `src/renderer/src/features/analytics/components/FunnelConversionCard.tsx`

- [ ] **Step 1:** Refactor `AnalyticsKpiCards.tsx` to display dynamic data: Revenue, Total Orders, Conversion Rate, Automation Rate %, AI Avg Latency, and Estimated Cost.
- [ ] **Step 2:** Add growth badges showing period-over-period percentage differences.
- [ ] **Step 3:** Refactor `FunnelConversionCard.tsx` to receive dynamic 5-stage funnel data with animated proportional bars and drop-off rates.
- [ ] **Step 4:** Verify line count is strictly under 120 lines for both files.

---

### Task 5: Conversation Intelligence & Sentiment Analysis Card

**Files:**
- Create: `src/renderer/src/features/analytics/components/ConversationIntelligenceCard.tsx`
- Delete/Replace: `src/renderer/src/features/analytics/components/IntentAnalysisCard.tsx`

- [ ] **Step 1:** Create `ConversationIntelligenceCard.tsx` rendering:
  - Intent breakdown bars with count and percentage (Pricing, Specs, Shipping, Complaints, Human Handover).
  - Customer sentiment distribution gauge (Positive, Neutral, Urgent/Negative).
  - AI Agent quality metrics (Average Confidence Score, Human Review Rating %, Escalation Rate).
- [ ] **Step 2:** Replace `IntentAnalysisCard.tsx` with this comprehensive intelligence card.
- [ ] **Step 3:** Verify line count is strictly under 120 lines.

---

### Task 6: Peak Hours Activity Heatmap & Smart Actionable Insights

**Files:**
- Create: `src/renderer/src/features/analytics/components/PeakHoursHeatmapCard.tsx`
- Create: `src/renderer/src/features/analytics/components/SmartActionableInsights.tsx`

- [ ] **Step 1:** Create `PeakHoursHeatmapCard.tsx` visualizing 24-hour interaction volume and identifying prime sales conversion windows.
- [ ] **Step 2:** Create `SmartActionableInsights.tsx` displaying actionable recommendations generated from live analytics (e.g. out-of-stock product interest, suggested campaign sending times, repeat buyer retention tips).
- [ ] **Step 3:** Verify line count is strictly under 120 lines for both files.

---

### Task 7: AnalyticsPage Bento Layout Integration & Index Exports

**Files:**
- Modify: `src/renderer/src/features/analytics/pages/AnalyticsPage.tsx`
- Modify: `src/renderer/src/features/analytics/index.ts`

- [ ] **Step 1:** Update `AnalyticsPage.tsx` with a cohesive, responsive bento grid combining Header, KPIs, Funnel, Intelligence, Peak Hours, and Smart Insights.
- [ ] **Step 2:** Ensure graceful loading skeletons and toast notifications for export and refresh.
- [ ] **Step 3:** Update `src/renderer/src/features/analytics/index.ts` to export all components, hooks, and types.
- [ ] **Step 4:** Verify line count is strictly under 120 lines.

---

### Task 8: Quality Audit, Clean Compilation & GitHub Commit

**Files:**
- All touched files

- [ ] **Step 1:** Run line count audit (`wc -l`) across all created and modified files (< 120 lines).
- [ ] **Step 2:** Run `npm run build:renderer && npm run build:main` to ensure clean compilation.
- [ ] **Step 3:** Commit changes: `feat(analytics): add full analytics and conversation intelligence system`.
- [ ] **Step 4:** Push commit to GitHub `origin/main`.

