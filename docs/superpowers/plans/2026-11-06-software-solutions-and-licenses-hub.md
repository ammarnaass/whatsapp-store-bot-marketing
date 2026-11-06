# خطة تنفيذ قسم البرمجيات والتراخيص الرقمية (Software & Licenses Hub)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** إنشاء قسم مخصص في القائمة الجانبية لإدارة وبيع حلول البرمجيات وتراخيصها (مثل برامج نقاط البيع والمحلات، وبرامج تسيير الروضات والمدارس)، مع إدارة الإصدارات، روابط التحميل، صور البرنامج وشاشات التفعيل، وربطها التلقائي بمفاتيح التراخيص والرد الذكي عبر وكيل الذكاء الاصطناعي وبوتات تليغرام وواتساب.

**Architecture:** بنية معيارية متعددة الطبقات تربط جدول `software_items` بجدول المنتجات `products` و `variants` وخزنة المفاتيح `license_keys` في SQLite. توفر قنوات IPC متكاملة، ونظام واجهات مستخدم مخصص في React مع بطاقات KPI، ومعارض صور التفعيل، وإدارة المفاتيح، مع الالتزام الصارم بحد `< 120 lines/file`.

**Tech Stack:** Electron (Main/Preload), React 18, TypeScript, Tailwind CSS, Lucide React, Better-SQLite3, Google Gemini AI Engine.

---

## Global Constraints
1. **Line Count Limit:** جميع الملفات المعدلة أو المنشأة حديثاً يجب ألا تتجاوز إطلاقاً **120 سطراً لكل ملف** (`< 120 lines/file`).
2. **Data Consistency:** كل برنامج يضاف كـ Software Item يُنشئ تلقائياً سجلاً مطابقاً في `products` بنوع `digital`، وسجلاً في `variants` لضمان التكامل مع المخزون وسلة المشتريات ومحرك الفواتير والوكيل الذكي.
3. **Security & Key Protection:** مفاتيح التفعيل المتاحة تُخزن وتُدار في خزنة `license_keys` ولا تُسلّم للعميل إلا بعد اكتمال الطلب والدفع، مع حماية أمنية من التسريب المسبق.
4. **UI Design System:** واجهة المستخدم تلتزم بنظام تصميم WaSell Design System مع دعم الوضعين الليلي والنهاري (Dark/Light Mode) واللغة العربية الكاملة (RTL).
5. **No Regressions:** الحفاظ التام على عمل بقية الأقسام (المنتجات، المخزون، الطلبات، وبوابة تليغرام).

---

## File Structure & Responsibilities

| File Path | Role / Responsibility | Target Lines |
| :--- | :--- | :--- |
| `src/main/database/db.ts` | ترحيل جدول `software_items` وتعبئة بيانات أولية لبرامج نقاط البيع والروضات | Preserved edits |
| `src/shared/types.ts` | تعريف واجهات `SoftwareItem`, `SoftwareLicenseType`, `SoftwareWithInventory` | Preserved edits |
| `src/shared/ipc-channels.ts` | ثوابت قنوات IPC لإدارة البرمجيات والتراخيص | Preserved edits |
| `src/preload/contracts.ts` | عقود TypeScript لـ Preload API لقسم البرمجيات | Preserved edits |
| `src/preload/index.ts` | جسر قنوات الـ IPC للفرونت إند | Preserved edits |
| `src/renderer/src/api/fallbacks/clean-fallbacks.ts` | بيئة وهمية (Mock Fallback) للتطوير والاختبار | Preserved edits |
| `src/renderer/src/api-bridge.ts` | كائن `api.software` في الفرونت إند | Preserved edits |
| `src/main/ipc/handlers/software.handler.ts` | معالجات IPC لإدارة البرامج والمفاتيح وتحديث المتغيرات | < 115 lines |
| `src/renderer/src/features/software/types/software.types.ts` | أنواع الواجهة والحالات لقسم البرمجيات | < 80 lines |
| `src/renderer/src/features/software/services/software.service.ts` | خدمة استدعاء الـ IPC للبرمجيات | < 90 lines |
| `src/renderer/src/features/software/hooks/useSoftware.ts` | Hook تفاعلي لإدارة البرمجيات والتراخيص والفلترة والـ Modals | < 110 lines |
| `src/renderer/src/features/software/components/SoftwareHeader.tsx` | شريط العناوين والبحث وزر إضافة برنامج جديد | < 80 lines |
| `src/renderer/src/features/software/components/SoftwareKpiCards.tsx` | بطاقات الإحصائيات (إجمالي البرامج، التراخيص المتاحة، المباعة، الأرباح) | < 90 lines |
| `src/renderer/src/features/software/components/SoftwareCard.tsx` | بطاقة البرنامج الفردية مع الأسعار والروابط والمفاتيح المتاحة | < 115 lines |
| `src/renderer/src/features/software/components/SoftwareGrid.tsx` | شبكة استعراض البطاقات وفلاتر التصنيف | < 85 lines |
| `src/renderer/src/features/software/components/SoftwareActivationModal.tsx` | نافذة استعراض صور البرنامج وشاشات وشرح مكان التفعيل | < 110 lines |
| `src/renderer/src/features/software/components/SoftwareKeysVaultModal.tsx` | نافذة فحص وإضافة وشحن مفاتيح التفعيل الرقمية | < 110 lines |
| `src/renderer/src/features/software/components/SoftwareFormModal.tsx` | نموذج إضافة/تعديل البرنامج وروابط التحميل وصور التفعيل | < 115 lines |
| `src/renderer/src/features/software/pages/SoftwarePage.tsx` | الصفحة الرئيسية المستقلة لقسم البرمجيات والتراخيص | < 110 lines |
| `src/renderer/src/components/layout/sidebar/types.ts` | إضافة تبويب `software` لـ `TabType` | Preserved edits |
| `src/renderer/src/components/layout/sidebar/nav-items.ts` | إضافة عنصر "البرمجيات والتراخيص" في القائمة الجانبية | Preserved edits |
| `src/renderer/src/App.tsx` | توجيه التبويب لعرض صفحة `<SoftwarePage />` | Preserved edits |

---

## Tasks Breakdown

### Task 1: Database Schema & Migration for Software Items
- [x] في `src/main/database/db.ts`:
  - إضافة إنشاء جدول `software_items`:
    - `id` (TEXT PRIMARY KEY `soft_...`)
    - `product_id` (TEXT REFERENCES products(id) ON DELETE CASCADE)
    - `software_name` (TEXT NOT NULL)
    - `version` (TEXT)
    - `category` (TEXT)
    - `website_url` (TEXT)
    - `download_url` (TEXT)
    - `license_type` (TEXT DEFAULT 'lifetime')
    - `price` (REAL DEFAULT 0)
    - `compare_at_price` (REAL DEFAULT 0)
    - `currency` (TEXT DEFAULT 'SAR')
    - `cover_image` (TEXT)
    - `screenshots` (TEXT JSON array)
    - `activation_guide_images` (TEXT JSON array)
    - `activation_instructions` (TEXT)
    - `system_requirements` (TEXT)
    - `demo_url` (TEXT)
    - `support_contact` (TEXT)
    - `is_active` (INTEGER DEFAULT 1)
    - `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
  - ترحيل البيانات الأولية (Seed Data) لعينات عملية:
    1. **برنامج تسيير نقاط البيع والمحلات (POS Pro Cashier v3.4)**.
    2. **برنامج تسيير الروضات والمدارس الخاصة (RawdaCare Manager v2.1)**.
    3. **برنامج إدارة المخازن والمستودعات (StockMaster Enterprise v4.0)**.
- [x] التحقق من إنشاء الجدول وتعبئة البيانات عبر فحص SQLite.

### Task 2: Shared Types, IPC Channels & Preload Bridge
- [x] في `src/shared/types.ts`:
  - تعريف واجهات:
    - `SoftwareLicenseType = 'lifetime' | 'yearly' | 'monthly' | 'trial'`
    - `SoftwareItem` (معرف البرنامج، المعرف بالمنتجات، الاسم، الإصدار، الروابط، الأسعار، الصور، صور خطوات التفعيل، الدليل)
    - `SoftwareWithInventory` (بيانات البرنامج مدمجة مع رصيد المفاتيح المتوفرة والمباعة)
- [x] في `src/shared/ipc-channels.ts`:
  - إضافة قنوات:
    - `SOFTWARE_LIST: 'software:list'`
    - `SOFTWARE_GET: 'software:get'`
    - `SOFTWARE_CREATE: 'software:create'`
    - `SOFTWARE_UPDATE: 'software:update'`
    - `SOFTWARE_DELETE: 'software:delete'`
    - `SOFTWARE_ADD_KEYS: 'software:add-keys'`
    - `SOFTWARE_GET_KEYS: 'software:get-keys'`
- [x] في `src/preload/contracts.ts` و `src/preload/index.ts`:
  - تعريف وتمرير كائن `software` عبر `electronAPI`.
- [x] في `src/renderer/src/api/fallbacks/clean-fallbacks.ts`:
  - إضافة الدوال الافتراضية مع بيانات تجريبية متكاملة.
- [x] في `src/renderer/src/api-bridge.ts`:
  - ربط كائن `api.software`.

### Task 3: Backend IPC Handlers & Business Logic
- [x] إنشاء `src/main/ipc/handlers/software.handler.ts` (< 115 lines):
  - `SOFTWARE_LIST`: استعلام يدمج `software_items` مع `products` و `variants`، مع حساب المفاتيح المتاحة (`status = 'available'`) والمباعة (`status = 'sold'`) من `license_keys`.
  - `SOFTWARE_GET`: جلب برنامج محدد مع فك ترميز الـ JSON للصور وصور التفعيل.
  - `SOFTWARE_CREATE`: معاملة ذرية (Transaction):
    1. إنشاء سجل في `products` (`type = 'digital'`).
    2. إنشاء سجل في `variants` (السعر والمخزون).
    3. إنشاء سجل في `software_items` (الإصدار، الموقع، التحميل، صور التفعيل).
  - `SOFTWARE_UPDATE`: تحديث المتغيرات وبيانات البرنامج.
  - `SOFTWARE_DELETE`: حذف البرنامج والمنتج المرتبط به ومفاتيحه.
  - `SOFTWARE_ADD_KEYS`: استدعاء إضافة المفاتيح وتحديث كمية الـ variant تلقائياً.
- [x] تسجيل المعالج في `src/main/index.ts`.

### Task 4: AI Agent Knowledge & Bot Integration
- [x] في `src/main/agent/tools/executor.ts`:
  - دعم التعرف على برامج الكاشير والروضات والمحلات عند استعلام العميل.
  - تزويد الرد بمعلومات الإصدار ورابط التحميل وسعر التفعيل وصور التفعيل عند الطلب.
- [x] في `src/main/services/telegram/telegram-message-adapter.ts`:
  - دعم فلترة وإظهار البرمجيات والتراخيص الرقمية تلقائياً عند طلب العميل.

### Task 5: Frontend Service & Reactive Hook
- [x] إنشاء `src/renderer/src/features/software/types/software.types.ts` (< 80 lines).
- [x] إنشاء `src/renderer/src/features/software/services/software.service.ts` (< 90 lines).
- [x] إنشاء `src/renderer/src/features/software/hooks/useSoftware.ts` (< 110 lines):
  - إدارة حالة القائمة، الفلترة حسب التصنيف والبحث، مؤشرات KPI.
  - حالات فتح/إغلاق Modals: (شاشات التفعيل `activationModal`، مفاتيح التراخيص `keysModal`، نموذج الإضافة والتعديل `formModal`).

### Task 6: Frontend UI Presentation Components
- [x] إنشاء `src/renderer/src/features/software/components/SoftwareHeader.tsx` (< 80 lines):
  - العنوان الرئيسي، شريط البحث، وزر "إضافة برنامج وتفعيل جديد".
- [x] إنشاء `src/renderer/src/features/software/components/SoftwareKpiCards.tsx` (< 90 lines):
  - 4 بطاقات إحصائية: إجمالي الحلول البرمجية، التراخيص المتاحة فوراً، التفعيلات المباعة، إجمالي العائدات.
- [x] إنشاء `src/renderer/src/features/software/components/SoftwareCard.tsx` (< 115 lines):
  - عرض صورة البرنامج، الاسم، الإصدار، السعر، شارة توفر المفاتيح (أخضر للمتوفر / أحمر للنافد).
  - أزرار سريعة: زيارة الموقع، رابط التحميل، استعراض دليل التفعيل، إدارة المفاتيح، وتعديل.
- [x] إنشاء `src/renderer/src/features/software/components/SoftwareGrid.tsx` (< 85 lines):
  - شريط أزرار تبديل التصنيف (الكل، نقاط بيع ومحلات، روضات ومدارس، محاسبة ومخازن).
  - شبكة العرض الشبكية التجاوبية Responsive Grid.

### Task 7: Interactive Modals & Main Page
- [x] إنشاء `src/renderer/src/features/software/components/SoftwareActivationModal.tsx` (< 110 lines):
  - معرض صور واجهة البرنامج.
  - معرض صور **مكان إدخال كود التفعيل** مع شرح الخطوات للعميل خطوة بخطوة.
  - أزرار تحميل ملف التثبيت المباشر وزيارة الموقع.
- [x] إنشاء `src/renderer/src/features/software/components/SoftwareKeysVaultModal.tsx` (< 110 lines):
  - استعراض مفاتيح التفعيل المتاحة والمباعة للبرنامج.
  - حقل لإضافة ولصق حزمة مفاتيح تفعيل جديدة بضغطة زر وتحديث المخزون فورياً.
- [x] إنشاء `src/renderer/src/features/software/components/SoftwareFormModal.tsx` (< 115 lines):
  - نموذج إدخال: الاسم، الإصدار، التصنيف، السعر، رابط الموقع، رابط التحميل، صورة الغلاف، روابط صور شاشات العمل، روابط صور مكان إدخال التفعيل، وشرح طريقة التفعيل.
- [x] إنشاء `src/renderer/src/features/software/pages/SoftwarePage.tsx` (< 110 lines):
  - دمج الـ Header, KpiCards, Grid, ومكونات الـ Modals بسلاسة وتناسق.

### Task 8: Sidebar Navigation & App Routing Integration
- [x] في `src/renderer/src/components/layout/sidebar/types.ts`:
  - إضافة `'software'` إلى `TabType`.
- [x] في `src/renderer/src/components/layout/sidebar/nav-items.ts`:
  - إضافة عنصر "البرمجيات والتراخيص" تحت مجموعة العمليات والكتالوج بأيقونة `AppWindow` وبألوان أنيقة.
- [x] في `src/renderer/src/App.tsx`:
  - ربط التبويب `{currentTab === 'software' && <SoftwarePage />}`.

### Task 9: Verification, Build & Testing
- [x] التحقق من حدود الأسطر لجميع الملفات عبر أمر `wc -l` والتأكد من بقائها بدقة دون 120 سطراً.
- [x] تشغيل `npm run build` للتأكد من خلو المشروع من أي أخطاء ترجمة برمجية.
- [x] التحقق من عمل إضافة برنامج، توليد مفاتيح، استعراض صور التفعيل، والرد التلقائي في البوت.
- [ ] حفظ التغييرات وعمل commit و push إلى `origin/main`.

