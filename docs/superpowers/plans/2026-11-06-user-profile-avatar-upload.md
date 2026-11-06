# خطة تنفيذ ميزة إضافة الصورة الشخصية في الملف الشخصي (User Profile Avatar)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** تمكين المستخدم (المدير والموظفين) من رفع وتحديث وحذف صورتهم الشخصية (Avatar) محلياً داخل الملف الشخصي، مع ضغطها تلقائياً وعرضها في القائمة العلوية وكافة بطاقات الحساب.

**Architecture:** 
- مكوّن مساعد `avatar-helper.ts` لمعالجة وضغط الصورة عبر HTML5 Canvas إلى أبعاد مربعة (256×256) بصيغة Base64 خفيفة وسريعة.
- مكوّن واجهة مخصص `AvatarPicker.tsx` يعرض المعاينة المباشرة وزر رفع وحذف الصورة بأيقونات أنيقة وتفاعلية.
- تحديث معالج IPC في Electron `team.handler.ts` لتحديث عمود `avatar` في جدول `users` وإرجاع بيانات المستخدم المحدثة إلى `useAuthStore`.
- تحديث `UserProfileMenu.tsx` في الترويسة لعرض الصورة الشخصية بدلاً من الأحرف الأولى فور اختيارها.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide React, Better-SQLite3, Electron IPC.

**Spec:** PRD.md, DESIGN.md

## Global Constraints
- الحفاظ الصارم على معيار نظافة وتقسيم الكود (`< 120` سطراً لكل ملف).
- معالجة وتخزين محلي 100% بدون أي اعتماد على سيرفرات خارجية لرفع الصور (Local First & Privacy).
- دعم صيغ الصور الشائعة: PNG, JPG, JPEG, WEBP.
- الحفاظ على الأحرف الأولى (Initials) كبديل جمالي عند عدم وجود صورة أو عند حذفها.

## Review Focus
1. **حجم الصورة وجودتها:** ضغط الصورة تلقائياً لتكون خفيفة (< 100KB) لمنع تضخم قاعدة البيانات.
2. **استجابة فورية:** تحديث حالة `useAuthStore` ليظهر الـ Avatar فوراً في الترويسة وفي القائمة دون الحاجة لإعادة تشغيل التطبيق.
3. **إمكانية الحذف:** توفير زر إزالة الصورة والرجوع إلى الرمز الافتراضي بسهولة.
4. **أمان الإدخال:** رفض الملفات غير الصورية وإظهار تنبيه لطيف إذا كان الملف غير صالح.

---

### Task 1: أداة معالجة وضغط الصور `avatar-helper.ts`

**Files:**
- Create: `src/renderer/src/features/auth/utils/avatar-helper.ts`

- [ ] **Step 1: إنشاء دالة قراءة وضغط الصورة وتحويلها إلى Base64**
  - قراءة ملف الصورة عبر `FileReader`.
  - تحجيم الصورة إلى أبعاد أقصاها `256x256` مع الحفاظ على النسبة المئوية والتوسيط بواسطة `canvas.getContext('2d')`.
  - تصدير الصورة بصيغة `image/webp` أو `image/jpeg` بجودة 0.85 لضمان جودة عالية وحجم خفيف جداً (< 60KB).

- [ ] **Step 2: التحقق من أن حجم الملف أقل من 120 سطراً**

---

### Task 2: معالج الـ IPC في Electron لتحديث الـ Avatar

**Files:**
- Modify: `src/main/ipc/handlers/team.handler.ts`

- [ ] **Step 1: تحديث معالج `AUTH_UPDATE_PROFILE` لدعم `avatar` وحذفه**
  - عند تمرير `avatar` كـ `string` أو `null`، يتم تحديث قيمة عمود `avatar` في جدول `users`.
  - إرجاع كائن المستخدم المحدث مع الصلاحيات parsed permissions.

- [ ] **Step 2: التحقق من التجميع وعدم تجاوز 120 سطراً**

---

### Task 3: مكوّن منتقي الصورة الشخصية `AvatarPicker.tsx`

**Files:**
- Create: `src/renderer/src/features/auth/components/AvatarPicker.tsx`

- [ ] **Step 1: بناء مكوّن المعاينة والرفع**
  - عرض دائرة الأفاتار بحجم مناسب مع حواف متوهجة.
  - زر كاميرا/رفع لفتح نافذة اختيار الملف من الجهاز (`input type="file" accept="image/*"`).
  - زر إزالة الصورة عند توفرها.
  - مؤشر تحميل أثناء الضغط والمعالجة.

- [ ] **Step 2: التحقق من حجم الملف أقل من 120 سطراً**

---

### Task 4: دمج اختيار الصورة في تبويب الملف الشخصي وبطاقة الإعدادات

**Files:**
- Modify: `src/renderer/src/features/auth/components/ProfileSettingsTab.tsx`
- Modify: `src/renderer/src/features/settings/components/account/UserProfileCard.tsx`

- [ ] **Step 1: ربط `AvatarPicker` في `ProfileSettingsTab.tsx`**
  - إضافة حالة `avatar` وإرسالها عند الضغط على حفظ التعديلات عبر `updateProfile({ name, phone, avatar })`.
- [ ] **Step 2: ربط `AvatarPicker` في `UserProfileCard.tsx`**
  - تمكين المستخدم والمدير من تعديل الصورة مباشرة من داخل الإعدادات أيضاً.
- [ ] **Step 3: التحقق من قيود الأسطر (< 120 سطر لكل ملف)**

---

### Task 5: عرض الصورة الشخصية في الترويسة وقائمة الحساب

**Files:**
- Modify: `src/renderer/src/features/auth/components/UserProfileMenu.tsx`

- [ ] **Step 1: تحديث زر القائمة المنسدلة في الترويسة**
  - فحص `currentUser.avatar`: إذا كان موجوداً، يتم عرض `img` دائرية احترافية، وإذا لم يكن موجوداً يتم الإبقاء على الحرفين الأولين كبديل.
- [ ] **Step 2: تحديث بطاقة التفاصيل داخل القائمة المنسدلة**
  - عرض الصورة الشخصية بجانب الاسم والبريد الإلكتروني.

---

### Task 6: التحقق والتجربة الميدانية

- [ ] **Step 1: فحص التجميع الشامل `npm run build`**
- [ ] **Step 2: التحقق من حفظ واسترجاع الصورة في قاعدة بيانات SQLite**
- [ ] **Step 3: رفع التعديلات إلى فرع `main` على GitHub**

