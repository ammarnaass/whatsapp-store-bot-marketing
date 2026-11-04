# خطة الربط الفني والتكامل: OpenWA Swagger API مع صفحة قنوات الربط والواتساب
## OpenWA Swagger API Integration Plan (Port 2785)

> **رابط الوثائق الحية:** `http://localhost:2785/api/docs#/`  
> **الإصدار التقني:** 2.0 (معتمد للإنتاج) | **محرك الربط:** Baileys Multi-Device Engine  
> **البوابة المحلية:** `http://127.0.0.1:2785` | **خادم استقبال Webhook:** `http://127.0.0.1:3005`  
> **مفتاح المصادقة:** ترويسة `X-API-Key` مشفرة ومحفوظة تلقائياً في `OpenWA/data/.api-key`  
> **وضع التشغيل المعتمد:** تشغيل تلقائي كعملية Daemon مدمجة مع البرنامج

---

## 1. الهدف ونطاق العمل (Objective & Scope)

ربط وتكامل بوابة **OpenWA** المحلية وواجهتها الموثقة عبر **Swagger UI** (`http://localhost:2785/api/docs#/`) مع:
1. **التشغيل التلقائي الصامت للبوابة (Integrated Background Daemon):** إقلاع خادم OpenWA تلقائياً على المنفذ 2785 فور فتح التطبيق دون حاجة لأي تدخل يدوي، مع إيقافه الآمن عند إغلاق التطبيق.
2. **صفحة قنوات الربط (`ChannelsPage.tsx`):** لمراقبة حالة الاتصال، مسح رمز QR، إدارة الجلسات الحية، واستعراض وثائق الـ 163 مساراً برمجياً مع إمكانية الفحص الصحي اللحظي (Ping Latency).
3. **محرك واتساب في النواة (`OpenWAManager.service.ts`):** لأتمتة إطلاق البوابة كعملية فرعية (Subprocess Daemon)، وتوجيه أوامر الإرسال والاستقبال وجلب أكواد الاقتران مع التعافي التلقائي (Auto-Recovery).
4. **خادم خطافات الويب المحلي (`WebhookServerService`):** لالتقاط الرسائل الواردة وتأكيد التسليم وتمريرها لوكيل الذكاء الاصطناعي (Gemini AI).
5. **جسر Electron IPC الآمن:** إتاحة استدعاء الروابط الخارجية مباشرة في المتصفح الافتراضي للنظام عبر `setWindowOpenHandler`.

---

## 2. المعمارية التقنية وتدفق البيانات (System Architecture)

```mermaid
flowchart TD
    subgraph UI ["واجهة المستخدم (React 19 / Vite)"]
        CP["صفحة قنوات الربط (ChannelsPage.tsx)"]
        OWCard["بطاقة بوابة OpenWA (OpenWACard.tsx)"]
        SWCard["بطاقة وثائق Swagger (SwaggerDocsCard.tsx)"]
        QRModal["نافذة مسح الرمز (OpenWAQrModal.tsx)"]
    end

    subgraph Main ["Electron Main Process (Node.js 22)"]
        Boot["إقلاع تلقائي عند فتح التطبيق (app.whenReady)"]
        IPC["جسر قنوات IPC الآمن (registry.ts)"]
        Mgr["مدير البوابة (OpenWAManager.service.ts)"]
        WH["خادم الويب هوك المحلي (Fastify :3005)"]
        DB[("قاعدة البيانات المحلية (SQLite / WAL)")]
        Agent["محرك وكيل الذكاء (Gemini Agent)"]
    end

    subgraph OpenWA ["بوابة OpenWA المستضافة ذاتياً (:2785)"]
        Docs["Swagger UI Docs (/api/docs#/)"]
        CoreAPI["NestJS REST Gateway"]
        Engine["Baileys Engine (WebSocket Protocol)"]
        SessionStore[("ملفات الجلسة والتشفير (./data/sessions)")]
    end

    subgraph MetaNet ["شبكة واتساب السحابية"]
        WANet["WhatsApp Multi-Device Servers"]
    end

    %% Startup Flow
    Boot -->|1. إظهار النافذة فوراً| UI
    Boot -->|2. إطلاق البوابة في الخلفية| Mgr
    Mgr -->|تشغيل dist/main.js| CoreAPI

    %% UI to Main
    CP -->|عرض الحالة| OWCard
    CP -->|استعراض المسارات والفحص| SWCard
    OWCard -->|طلب مسح QR| QRModal
    QRModal <-->|IPC: session:start / qr-event| IPC
    IPC <-->|أوامر واستعلامات| Mgr
    SWCard -.->|فتح الرابط في المتصفح الافتراضي| Docs

    %% Main to OpenWA
    Mgr -->|REST + X-API-Key :2785| CoreAPI
    Docs -.->|توثيق حي ومباشر| SWCard
    CoreAPI --> Engine
    Engine <--> SessionStore
    Engine <-->|بروتوكول Multi-Device| WANet

    %% Inbound Webhook Flow
    WANet -->|أحداث واردة| Engine
    Engine -->|Webhooks HTTP POST| WH
    WH -->|فحص توقيع HMAC| WH
    WH -->|حفظ الرسالة| DB
    WH -->|تجميع الرسائل المتتالية (3.5s)| Agent
    Agent -->|رد الوكيل الذكي| Mgr
```

---

## 3. جدول مطابقة مسارات OpenWA Swagger API المعتمدة

| الفئة | المسار في Swagger | الطريقة | الوظيفة في تطبيق WaSell |
|---|---|---|---|
| **الفحص الصحي** | `/api/health` | `GET` | فحص استجابة البوابة وسرعة الاستجابة اللحظية (Ping Latency). |
| **الجلسات** | `/api/sessions` | `GET` | الاستعلام عن كافة الجلسات المسجلة واستعادة الجلسة السابقة. |
| **الجلسات** | `/api/sessions` | `POST` | إنشاء جلسة جديدة باسم `wasell-main-store`. |
| **التشغيل** | `/api/sessions/{id}/start` | `POST` | بدء تشغيل اتصال الجلسة مع شبكة واتساب. |
| **الاقتران** | `/api/sessions/{id}/qr` | `GET` | جلب كود الاستجابة السريعة كـ Base64 Data URL لعرضه بالنافذة. |
| **الاقتران البديل** | `/api/sessions/{id}/pairing-code` | `POST` | توليد كود اقتران من 8 خانات للربط برقم الجوال مباشرة بدون مسح كاميرا. |
| **الحالة** | `/api/sessions/{id}` | `GET` | التحقق من حالة الاتصال وتفاصيل رقم الهاتف المقترن. |
| **المراسلة** | `/api/sessions/{id}/messages/send-text` | `POST` | إرسال رسائل الدردشة، روابط الدفع، وردود الوكيل الذكي. |
| **الوسائط** | `/api/sessions/{id}/messages/send-image` | `POST` | إرسال صور المنتجات، الكتالوج، والفواتير الرقمية للعميل. |
| **المؤشرات** | `/api/sessions/{id}/chats/typing` | `POST` | تفعيل مؤشر "يكتب الآن..." (`composing` / `paused`) أثناء تفكير الوكيل. |
| **التواجد** | `/api/sessions/{id}/presence` | `PUT` | ضبط الظهور العام للمتجر (متصل / غير متصل). |
| **الخطافات** | `/api/sessions/{id}/webhooks` | `POST` | تسجيل رابط `http://127.0.0.1:3005/webhook/openwa` للأحداث الحية. |
| **تسجيل الخروج**| `/api/sessions/{id}/logout` | `POST` | فك اقتران الرقم من تطبيق واتساب بأمان. |

---

## 4. إعدادات الإقلاع التلقائي وإدارة العمليات المنجزة

1. **إقلاع غير معطل (Non-blocking Boot):** يتم فتح واجهة المستخدم فوراً عبر `createWindow()`، بينما تعمل بوابة OpenWA في الخلفية في توازي كامل.
2. **استهلاك تدفقات المخرجات (Stream Draining):** تم تفريغ وتصفية `stdout` و `stderr` لمنع امتلاء مخزن الأنابيب (Linux Pipe Buffer 64KB) وضمان عدم تجمد البوابة.
3. **التعافي التلقائي (Auto-Recovery):** في حال توقف غير متوقع لخادم OpenWA، يقوم التطبيق بمحاولة إعادة الإطلاق تلقائياً بعد 3 ثوانٍ.
4. **الإيقاف النظيف (Graceful Shutdown):** عند إغلاق البرنامج، يتم إرسال إشارة `SIGTERM` مع مهلة 3 ثوانٍ قبل `SIGKILL` لإغلاق اتصالات قاعدة البيانات ومنع تلف جلسة واتساب.
