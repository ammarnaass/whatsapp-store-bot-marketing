# دليل التصميم عبر Google Stitch

أداة Stitch من Google Labs تولّد واجهات من وصف نصي أو صورة أو رسم يدوي، وتصدّر الكود أو تنقل التصميم إلى Figma للتنقيح. هي أداة تصميم واجهات فقط، وأفضل استخدام لها: توليد الشاشات بسرعة ثم تنقيحها. المصدر: stitch.google.com

**ملاحظة:** الأوصاف (Prompts) أدناه بالإنجليزية لأن الأداة تعطي نتائج أدق بها، مع تعليمات RTL والعربية صريحة. إن أعطتك نتائج أفضل بالعربية فجرّب ترجمة النص الداخلي فقط.

---

## 1. طريقة العمل المقترحة

1. اختر **Web / Desktop** كنوع التصميم (التطبيق سطح مكتب عبر Electron).
2. ابدأ بـ **نظام التصميم** (القسم 2): الصقه كأول وصف أو احفظه كملف DESIGN.md إن كانت نسختك تدعمه، وكرّره في بداية كل وصف شاشة جديدة لتبقى الشاشات متناسقة.
3. ولّد **الشاشة الرئيسية أولاً** (Dashboard)، وعدّلها حتى يعجبك الشكل، ثم ولّد الباقي بنفس الأسلوب.
4. أعطِ **وصفاً واحداً لكل شاشة**، وعدّل بتعليمات قصيرة متتابعة (غيّر لون، انقل عنصراً) بدل إعادة التوليد الكاملة.
5. صدّر إلى Figma للتنقيح الدقيق، وصدّر الكود كمرجع للمطوّر (وليس كنسخة نهائية جاهزة للإنتاج).
6. اربط كل شاشة بأرقام المتطلبات (FR-xx) في وثيقة PRD v0.3 عند التسليم للمطوّر.

---

## 2. نظام التصميم (الصقه في بداية كل وصف)

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.
```

---

## 3. الشاشات المطلوبة وأوصافها

### الشاشة 1: أول تشغيل ومعالج الإعداد
**المتطلبات:** FR-1، FR-63

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: first-run setup wizard, 5 steps with a progress indicator on top: (1) Welcome, (2) Connect WhatsApp by scanning a QR code (show a large QR placeholder, connection status, and a "scan from phone" instruction list), (3) Add your first products (import CSV or add manually), (4) Set up the AI agent (persona name, tone, discount limit), (5) Test in sandbox. Show step 2 as the active screen. Friendly Arabic microcopy. Primary button "التالي", secondary "رجوع".
```

### الشاشة 2: لوحة التحكم الرئيسية
**المتطلبات:** FR-73

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: main dashboard. Top KPI cards: today's sales, new orders, conversations handled by AI vs human (percentage), pending handoffs. Below: sales line chart for 30 days, "orders by status" donut, "top products" list, "latest AI activity" feed with violet accent, and an alerts panel (low stock, license keys running out, session disconnected). A prominent emergency "Pause AI agent" button in the top bar.
```

### الشاشة 3: صندوق الوارد المشترك
**المتطلبات:** FR-29 إلى FR-32

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: shared inbox in a 3-column layout. Right: conversation list with search, filters (All, AI, Waiting for human, Closed), each item shows avatar, name, last message, time, and a small handler badge (Flow / AI violet / Human). Center: WhatsApp-style chat thread with message bubbles, an AI-sent label on AI messages, quick-reply chips, an input box with attach and templates buttons, and a mode switch "AI / Suggest only / Human". Left: customer card with phone, tags, order history, notes, and a conversation summary written by the AI.
```

### الشاشة 4: كتالوج المنتجات
**المتطلبات:** FR-1 إلى FR-4

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: products catalog page. Top: tabs "All / Physical / Digital", search, category filter, "Add product" button. A grid/table toggle. Each product card shows image, name, type badge (physical/digital), price, stock count or "keys available", status toggle. Include a low-stock warning on one item.
```

### الشاشة 5: إضافة/تعديل منتج فيزيائي
**المتطلبات:** FR-2، FR-5، FR-6

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: product editor for a PHYSICAL product. Sections: basic info (name, description, category, images drag-and-drop), variants table (color, size, SKU, price, stock), shipping (weight), availability toggles (allow pre-order when out of stock), and a live WhatsApp card preview on the left showing how the product appears in chat.
```

### الشاشة 6: إضافة/تعديل منتج رقمي
**المتطلبات:** FR-14 إلى FR-18

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: product editor for a DIGITAL product (software). Sections: basic info, license plans table (lifetime / subscription / trial with price and duration), files and versions upload, license keys inventory panel (available, sold, revoked counts with an "Import keys" button), delivery message template preview, activation limit setting.
```

### الشاشة 7: إدارة الطلبات
**المتطلبات:** FR-9، FR-22

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: orders management. Filters by status and type (physical/digital/mixed), orders table with order number, customer, source badge (AI / Flow / Human), total, payment status, order status. A kanban toggle with columns: New, Confirmed, Preparing, Shipped, Delivered. Bulk action bar for changing status and printing packing slips.
```

### الشاشة 8: تفاصيل الطلب
**المتطلبات:** FR-7 إلى FR-13، FR-20

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: order detail page. Header with order number and status stepper (New to Delivered). Cards: items, customer and delivery address, payment (method, status, receipt image with Approve/Reject buttons), shipping (carrier, tracking number input, "send tracking to customer on WhatsApp" button), activity timeline including AI actions, internal notes, and buttons for invoice PDF, return/exchange.
```

### الشاشة 9: مخزون المفاتيح والتسليم الرقمي
**المتطلبات:** FR-15، FR-16

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: license keys inventory. Summary cards (available, sold, revoked), table of keys with masked values, product, status, linked order, and reveal/copy actions with permission lock icon. Import CSV dialog, low-stock alert threshold setting.
```

### الشاشة 10: مُنشئ التدفقات (Flow Builder)
**المتطلبات:** FR-23 إلى FR-28

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: visual chatbot flow builder with a node canvas. Left palette of nodes: Message, Question, Condition, Action, Hand off to human, Hand off to AI. A sample flow connected by lines: Welcome message, main menu with 4 options, products branch, order tracking branch. Right panel shows properties of the selected node. Top bar has Save, Test, Publish.
```

### الشاشة 11: إعدادات وكيل الذكاء الاصطناعي
**المتطلبات:** FR-42 إلى FR-47، FR-50 إلى FR-58

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: AI agent settings with violet accent. Tabs: Persona, Knowledge, Limits, Handoff rules, Provider and cost. Show the Limits tab: operating mode selector (Autonomous / Semi-autonomous / Suggest only / Off) as large selectable cards, max discount slider (percent), max order amount without review, rules "never refund automatically", list of handoff triggers with toggles (angry customer, asks for human, legal topics, low confidence), and a red emergency stop switch.
```

### الشاشة 12: قاعدة معرفة الوكيل
**المتطلبات:** FR-44، FR-47

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: AI knowledge base. Left list of sources (Catalog auto-synced, Shipping policy, Return policy, FAQ, Custom notes) with sync status. Main area editor for the selected source with rich text. Right panel "Questions the AI couldn't answer" with a button to add an answer to knowledge.
```

### الشاشة 13: ساحة الاختبار (Sandbox)
**المتطلبات:** FR-69، FR-70

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: AI sandbox. Left: simulated WhatsApp chat where the user plays the customer. Right: "agent trace" panel showing each step: understood intent, tools called (search_catalog, check_stock, create_draft_order) with results, confidence score, and the final answer. Bottom: saved test scenarios list with pass/fail badges and a "Run all tests" button.
```

### الشاشة 14: مراجعة قرارات الوكيل
**المتطلبات:** FR-67، FR-68، FR-71

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: AI review log. Table of AI conversations with customer, outcome (sale, handoff, no result), confidence, cost, and rating. Selecting a row opens a side drawer with the full conversation, tools used, and controls "Mark good / Mark bad / Correct this reply" with an option "Add to knowledge". Top KPIs: closure rate, handoff rate, average response time, AI sales value.
```

### الشاشة 15: التسويق: قائمة الحملات
**المتطلبات:** FR-35، FR-40

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: marketing campaigns list. Cards/table with campaign name, segment, schedule, status (draft, scheduled, running, paused, done), progress bar, delivery/read/reply rates. "New campaign" button and a warning banner about daily sending limits and consent.
```

### الشاشة 16: إنشاء حملة
**المتطلبات:** FR-34 إلى FR-39

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: campaign creator wizard. Steps: Audience (segment picker with rules builder and recipient count), Message (editor with variables like {الاسم}, media attach, A/B variant tabs, live WhatsApp preview), Schedule (date/time, random delay slider, daily limit per number), Review. Show the Message step. Include a note that recipients can reply "إيقاف" to unsubscribe.
```

### الشاشة 17: جهات الاتصال والشرائح
**المتطلبات:** FR-33، FR-34

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: contacts and segments. Table with name, phone, tags, last order, opt-in status. Top: import CSV, add segment. Right side panel for segment rules builder (bought physical product, no purchase in 30 days, abandoned cart) with live count. Block list tab.
```

### الشاشة 18: بطاقة العميل
**المتطلبات:** FR-72

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: customer profile. Header with avatar, name, phone, tags, opt-in status. Tabs: Overview (lifetime value, orders count, AI-written summary), Conversations, Orders, Notes. Quick action buttons: send message, create order, add to segment.
```

### الشاشة 19: التقارير
**المتطلبات:** FR-73

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: reports. Date range picker, tabs: Sales, Products, Campaigns, AI agent. Show Sales tab: revenue chart, breakdown physical vs digital, source breakdown (AI vs Flow vs Human), top customers table, export button.
```

### الشاشة 20: الإعدادات العامة
**المتطلبات:** FR-74 إلى FR-76

```
Design system for a desktop app called "WaSell" (WhatsApp store + AI sales agent).
- Language: Arabic first, full RTL layout (sidebar on the RIGHT), with English as secondary. Use real Arabic text, not lorem ipsum.
- Style: clean, modern, calm, professional SaaS dashboard. Generous spacing, soft rounded corners (12px), subtle shadows.
- Colors: primary WhatsApp-inspired green (#128C7E), dark green (#075E54) for sidebar accents, soft mint (#E7F6F2) for highlights, neutral gray background (#F6F7F9), white cards, text #1F2937. Semantic: success green, warning amber, danger red, info blue. AI-related elements use a distinct violet (#7C3AED) accent so the user can always tell what the AI did.
- Typography: Arabic-friendly font (Cairo or IBM Plex Sans Arabic), clear hierarchy, 14px body.
- Components: right-side navigation rail with icons + labels, top bar with session status chip (connected/disconnected), cards, data tables with filters, status badges, tabs, modals, toasts.
- Support light and dark mode.
- Desktop window 1440x900.

Screen: general settings. Tabs: WhatsApp sessions (list of numbers with status, proxy, per-number AI mode), Shipping zones and fees, Payment methods, Users and roles, Backup and restore (with encryption toggle), Updates. Show the WhatsApp sessions tab.
```

---

## 4. نقاط تصميم مهمة يجب أن تظهر في كل الشاشات

- **تمييز نشاط الذكاء الاصطناعي:** اللون البنفسجي وشارة «AI» على كل رسالة أو إجراء أو طلب أنشأه الوكيل.
- **زر الإيقاف الطارئ للوكيل** ظاهر دائماً في الشريط العلوي.
- **حالة الاتصال بواتساب** ظاهرة دائماً (متصل، منقطع، يحتاج مسحاً).
- **تحذيرات الحماية من الحظر** في صفحات الحملات (حدود يومية، موافقة العميل).
- **إخفاء الأسرار:** مفاتيح التراخيص ومفتاح مزوّد النموذج مخفية افتراضياً.
- **حالات الفراغ والتحميل والخطأ** لكل جدول وقائمة.
- **اتجاه RTL:** القائمة الجانبية يميناً، والأيقونات المتجهة تُعكس، والأرقام والعملات تُراجَع.

## 5. التسليم للمطوّر

1. صدّر الشاشات النهائية من Stitch إلى Figma، وجمّع الألوان والخطوط كمتغيرات (Design Tokens).
2. استخدم كود Stitch المُصدَّر كمرجع للتخطيط، ثم أعد بناء المكوّنات في React داخل Electron بمكتبة مكوّنات (مثل Tailwind + مكوّنات shadcn) مع دعم RTL من البداية.
3. اربط كل شاشة بأرقام المتطلبات المذكورة أعلاه.
4. اختبر الشاشات الأربع الحرجة أولاً مع مستخدم حقيقي: صندوق الوارد، تفاصيل الطلب، إعدادات الوكيل، وإنشاء الحملة.
