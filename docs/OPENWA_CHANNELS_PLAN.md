# خطة قنوات الربط الفني: واتساب مع OpenWA

**الإصدار:** 1.1 (معتمد ومحدّث بعد تجربة الجدوى P0) | **التاريخ:** 4 نوفمبر 2026 | **ترتبط بـ:** PRD v0.3 & تقرير P0 Spike

**مصدر المعلومات التقنية:** تم التحقق المباشر من الكود المصدري الرسمي لـ OpenWA v0.27.1 (`openapi.json` و `src/modules/webhook` و `.env.minimal`). تم حسم كافة النقاط الموسومة سابقاً بـ «يُتحقق».

---

## 1. الهدف

تحديد **كل القنوات التقنية** التي يتواصل بها تطبيقنا (Electron) مع واتساب عبر OpenWA، ودور كل قناة، وكيفية تأمينها وجعلها موثوقة، مع تصميم طبقة تجريد تسمح لاحقاً بإضافة قناة رسمية (WhatsApp Cloud API) دون إعادة كتابة التطبيق.

---

## 2. ما يوفره OpenWA فعلياً (محسوم من الكود المصدري)

| العنصر | التفاصيل المحسومة | المرجع المصدري |
|---|---|---|
| **المحركان** | `whatsapp-web.js` (الافتراضي، متصفح Chromium حقيقي، مخاطر حظر أقل، ذاكرة 300–500 ميغابايت لكل جلسة) و`baileys` (بروتوكول مباشر، مخاطر حظر أعلى، ذاكرة 30–80 ميغابايت). يُختار بمتغير `ENGINE_TYPE`. | `.env.minimal` |
| **واجهة REST** | على `http://localhost:2785/api` (البادئة العامة `/api` مفعّلة)، مصادقة بترويسة `X-API-Key`، وتوثيق Swagger على `/api/docs`. | `src/config/app-validation.ts` |
| **الجلسات** | `POST /api/sessions` للإنشاء، `POST /api/sessions/{id}/start` للتشغيل، `GET /api/sessions/{id}/qr` لرمز QR. | `src/modules/session` |
| **الإرسال** | `POST /api/sessions/{id}/messages/send-text` بحقلي `chatId` (`<phone>@c.us`) و`text`، ويدعم أيضاً الوسائط والتفاعلات والتعديل والإرسال الجماعي. | `src/modules/chat` |
| **Webhooks** | `POST /api/sessions/{id}/webhooks` بحقول `url` و`events` و`secret` (توقيع HMAC) ومرشحات ذكية اختيارية (sender, chatId, body, type, isGroup, fromMe, hasMedia). | `src/modules/webhook` |
| **أحداث Webhook** | **26 حدثاً رسمياً معتمداً** (مفصلة في القسم 5.2 أدناه). | `src/modules/webhook/dto/webhook.dto.ts` |
| **ترويسة التوقيع** | `X-OpenWA-Signature` بتوقيع `HMAC-SHA256` بالصيغة `sha256=${hash}` على الـ body الخام المتسلسل. | `src/modules/webhook/utils/deliver-once.ts` |
| **حماية SSRF** | `WEBHOOK_SSRF_PROTECT=true` يمنع افتراضياً الإرسال لـ 127.0.0.1؛ **يجب إلزامياً** ضبط `WEBHOOK_SSRF_PROTECT=false` أو `SSRF_ALLOWED_HOSTS=127.0.0.1,localhost`. | `.env.example` |
| **استعادة الجلسة** | مدعومة تلقائياً بدون مسح QR جديد بفضل `AUTO_START_SESSIONS=true`. | `src/config/feature-flags.ts` |
| **الفحص الصحي** | `GET /api/health` عامة وسريعة، و `GET /api/health/ready` لفحص جاهزية قاعدة البيانات. | `src/modules/health` |
| **WebSocket** | مسار `/events` يبثّ الأحداث مباشرة مع حصر بالمحادثات المأذونة. | `src/modules/events` |
| **MCP** | `POST /mcp` عند `MCP_ENABLED=true`: 25 أداة قراءة فقط افتراضياً، و51 أداة كاملة عند `MCP_READONLY=false`. | `src/core/mcp` |
| **الإضافات** | «Integration Fabric»: إضافات معزولة رسمية (Chatwoot وTypebot) من مستودع OpenWA-plugins، وعُقد n8n المجتمعية. | `src/core/plugins` |
| **مفاتيح API** | أدوار admin وoperator وviewer، مع تقييد بجلسات (`allowedSessions`) وبمحادثات (`allowedChats`). | `src/modules/auth` |
| **التحكم بالإرسال** | `SEND_PACING_ENABLED=true`، تسخين الأرقام، محاكاة الكتابة `SIMULATE_TYPING`، وتأخير الرسائل. | `src/core/pacing` |
| **البنية التحتية** | Node.js 22 LTS، NestJS 11، قاعدة بيانات SQLite داخل `SESSION_DATA_PATH`، وميديا محلية في `STORAGE_LOCAL_PATH`. | `package.json` |

---

## 2.1 قرار معتمد: OpenWA قناة وحيدة ومدمجة

- OpenWA يُدمج داخل التطبيق ويعمل معه كعملية فرعية يديرها Electron Main، وهو **قناة واتساب الوحيدة** في النسخة الأولى (MVP).
- القناة الرسمية (Cloud API) مؤجلة. نُبقي واجهة `WhatsAppChannel` صغيرة وحيادية ليسهل إضافة محوّل ثانٍ لاحقاً.
- بما أنه لا يوجد مسار رسمي احتياطي في الإصدار الأول، فإن **سياسة الإرسال الآمن (القسم 9) إلزامية من اليوم الأول**: تباطؤ الإرسال، تسخين الأرقام، فترات استراحة، ورقم مخصص للتطبيق.
- المحرك الافتراضي: `whatsapp-web.js` لأمان الحساب، مع خيار `baileys` للأجهزة الاقتصادية.

---

## 3. خريطة قنوات الربط

| # | القناة | الاتجاه | الاستخدام عندنا | الأولوية |
|---|---|---|---|---|
| C1 | REST API | تطبيقنا ← OpenWA | إنشاء الجلسات، QR، إرسال الرسائل والوسائط، قراءة الحالة | أساسية (MVP) |
| C2 | Webhooks | OpenWA ← تطبيقنا | استقبال الرسائل والحالات وتحديثات التسليم الموقعة | أساسية (MVP) |
| C3 | WebSocket `/events` | OpenWA ← تطبيقنا | قناة مكملة للأحداث الحية، ومراقبة حالة الجلسة في الواجهة | ثانوية |
| C4 | MCP `/mcp` | وكيل AI ← OpenWA | أدوات قراءة للوكيل (سياق المحادثة) بمفتاح مقيَّد | اختيارية (مؤجلة) |
| C5 | الإضافات (Integration Fabric) | داخل OpenWA | Chatwoot وTypebot عند الحاجة لصندوق وارد خارجي | اختيارية |
| C6 | n8n | OpenWA ↔ n8n | أتمتة خارجية للمستخدمين المتقدمين | مستقبلية |
| C7 | قناة رسمية (Cloud API) | تطبيقنا ↔ Meta | **مؤجلة** (قرار 3 نوفمبر 2026)؛ لا يُبنى محوّلها في النسخة الأولى | مؤجلة |
| C8 | قناة داخلية (IPC) | الواجهة ↔ Electron Main | أوامر المستخدم وعرض الأحداث دون كشف المفاتيح للواجهة | أساسية |

**القرار:** نعتمد **C1 + C2** كقناتين أساسيتين، و**C3** للمراقبة الحية، و**C8** للتواصل الآمن مع واجهة React عبر `contextBridge`.

---

## 4. المعمارية المعتمدة

```
┌────────────────── Electron ──────────────────┐
│ Renderer (React 19 + Tailwind v4)             │
│      │ IPC (contextBridge / safeStorage)      │
│      ▼                                        │
│ Main process                                  │
│  ├─ Business layer (متجر / بوت / حملات)       │
│  ├─ Agent service (وكيل AI: Gemini)           │
│  ├─ Channel Gateway  ◄── واجهة موحدة          │
│  │     └─ OpenWAAdapter (C1 + C2 + C3)        │
│  ├─ Webhook receiver (127.0.0.1:3005)         │
│  ├─ Outbound queue (SQLite محلي)              │
│  └─ OpenWA supervisor (ChildProcess Manager)  │
└───────────────────────┬──────────────────────┘
                        │ HTTP / Webhooks على 127.0.0.1
                        ▼
    OpenWA Gateway (NestJS 11 على Port 2785)
    ├── Engine: whatsapp-web.js (أو Baileys)
    ├── Storage: userData/openwa/openwa.sqlite
    └── Sessions: userData/openwa/sessions/
```

### 4.1 طبقة التجريد (Channel Gateway)

```ts
interface WhatsAppChannel {
  startSession(id: string): Promise<void>;
  getQr(id: string): Promise<string>;
  getStatus(id: string): Promise<SessionStatus>;
  sendText(session: string, chatId: string, text: string, opts?: SendOpts): Promise<SendResult>;
  sendMedia(session: string, chatId: string, media: MediaInput, opts?: SendOpts): Promise<SendResult>;
  onEvent(handler: (e: ChannelEvent) => void): void;
}
```

### 4.2 تشغيل OpenWA داخل Electron (محسوم في P0)

1. **العملية الفرعية:** تُطلق عبر `child_process.spawn` باستخدام ملف Node.js 22 LTS مستقل.
2. **المتغيرات البيئية الإلزامية المشغلة:**
   ```env
   PORT=2785
   NODE_ENV=production
   DATABASE_TYPE=sqlite
   DATABASE_NAME=<userData>/openwa/openwa.sqlite
   SESSION_DATA_PATH=<userData>/openwa/sessions
   STORAGE_LOCAL_PATH=<userData>/openwa/media
   AUTO_START_SESSIONS=true
   WEBHOOK_SSRF_PROTECT=false
   SEND_PACING_ENABLED=true
   PUPPETEER_HEADLESS=true
   PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage,--disable-gpu
   SHUTDOWN_DELAY_MS=0
   ```
3. **قاعدتا بيانات منفصلتان تماماً:**
   - قاعدة OpenWA: تدير الجلسات والمصادقة والـ outbox وسجلات التسليم الداخلية.
   - قاعدة تطبيق WaSell: تدير المنتجات والطلبات والعملاء ومحادثات الوكيل وسجل الرسائل.

---

## 5. تصميم القنوات الأساسية

### 5.1 القناة C1: REST API (الأوامر الصادرة)
- **المصادقة:** ترويسة `X-API-Key` بمفتاح Admin محفوظ في `safeStorage` بنظام التشغيل.
- **الطابور الصادر الموثوق (Outbound Queue):** كل رسالة تُسجل في جدول `outbound_queue` قبل طلب OpenWA لمنع الضياع، مع حقل `idempotency_key` لمنع التكرار.
- **التحكم بمعدل التدفق (Pacing):** تفعيل محاكاة الكتابة البشرية (`SIMULATE_TYPING`)، مع تأخير متدرج بين الرسائل.

### 5.2 القناة C2: Webhooks (الأحداث الواردة والموقعة)
- **مستقبل محلي:** خادم Fastify خفيف على `http://127.0.0.1:3005/webhook/openwa`.
- **التحقق من توقيع HMAC:**
  ```ts
  function verifyOpenWASignature(body: string, receivedSignature: string, secret: string): boolean {
    const expected = `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`;
    return crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expected));
  }
  ```
- **القائمة الكاملة للأحداث الـ 26:**
  - **رسائل:** `message.received`، `message.sent`، `message.ack`، `message.receipt`، `message.failed`، `message.revoked`، `message.reaction`، `message.edited`.
  - **حالات وقصص:** `status.received`.
  - **جلسات:** `session.status`، `session.qr`، `session.authenticated`، `session.disconnected`، `session.reconnect_loop`، `session.restriction`.
  - **تواجد ومجموعات ومكالمات:** `presence.update`، `event.response`، `poll.vote`، `group.join`، `group.leave`، `group.update`، `group.join_request`، `call.received`، `call.accepted`، `call.rejected`، `call.missed`.

### 5.3 القناة C3: WebSocket `/events`
- مراقبة لحظية لنبض الاتصال وكود الـ QR، دون الاعتماد عليه لتخزين الرسائل (الـ Webhook هو المصدر المعتمد للحقيقة).

---

## 6. الأمان والموثوقية

1. **انعدام التعرض الخارجي:** كافة القنوات محصورة على `127.0.0.1` بدون فتح أي منافذ للشبكة الخارجية.
2. **عزل الواجهة (Renderer Sandbox):** معالجة كافة العمليات الحساسة والمفاتيح في Main process، وتبادل البيانات عبر IPC آمن.
3. **مشرف العمليات الذكي (OpenWASupervisor):** قاطع الدائرة (Circuit Breaker) يعيد تشغيل العملية الفرعية حتى 5 مرات مع تأخير أسي، ويوقف الطابور ويخطر المستخدم عند الفشل المتكرر.
4. **استعادة الجلسة:** لا يحتاج المستخدم لمسح كود QR عند إعادة فتح التطبيق بفضل استمرارية `SESSION_DATA_PATH` وتفعيل `AUTO_START_SESSIONS=true`.

---

## 7. سياسة الإرسال الآمن وتفادي الحظر

1. **رقم مخصص:** حظر استخدام الرقم الشخصي الأساسي للأتمتة؛ استخدام رقم مخصص للمتجر.
2. **تسخين الرقم (Warmup):** بدء المحادثات بمعدل منخفض (أقل من 20 محادثة يومياً في الأسبوع الأول).
3. **أولوية الردود الواردة:** التفاعل مع العملاء الذين بادروا بالتواصل يتمتع بأعلى موثوقية لدى خوارزميات واتساب.
4. **محاكاة السلوك البشري:** تأخير عشوائي بين 2 إلى 5 ثوانٍ، وتفعيل مؤشر "يكتب الآن..." (Presence Composing).

---

## 8. حسم الأسئلة الستة لمرحلة P0 (مخرجات التجربة)

### س1: ما القائمة الكاملة لأحداث الـ Webhook وصيغة حمولة كل حدث؟
**الجواب:** 26 حدثاً موثقاً ومستخرجاً من `src/modules/webhook/dto/webhook.dto.ts`. الحمولة تحتوي دائماً على:
`{ event, sessionId, timestamp, idempotencyKey, deliveryId, data }`.

### س2: ما اسم ترويسة توقيع HMAC وخوارزميته وصيغة الحقل الزمني؟
**الجواب:**
- **الترويسة:** `X-OpenWA-Signature`.
- **الخوارزمية:** `HMAC-SHA256` بالصيغة `sha256=<hex_digest>` على كامل نص الـ body.
- **الحقل الزمني:** `payload.timestamp` في جسم الحدث، مع ترويسة `X-OpenWA-Idempotency-Key` لمنع هجمات الإعادة.

### س3: هل يمكن تشغيل OpenWA بـ Node مستقل داخل حزمة Electron على الأنظمة الثلاثة بلا مشاكل؟
**الجواب:** نعم. تم اعتماد تشغيل Node.js 22 LTS كعملية فرعية مستقلة (`child_process.spawn`) وتمرير ملفات المكتبات الأصلية (مثل SQLite) لكل نظام في مرحلة الـ Packaging، مما يعزل التطبيق تماماً عن بيئة جهاز المستخدم.

### س4: أي خيار أنسب لـ Chromium: شحنه مع التطبيق أم تنزيله عند أول تشغيل؟
**الجواب:**
- **الافتراضي الموصى به:** الاعتماد على محرك `baileys` أولاً لصفر حجم إضافي وذاكرة منخفضة (30–80 ميغابايت).
- **عند اختيار whatsapp-web.js:** يتم فحص وجود متصفح Chrome/Edge المثبت محلياً على جهاز المستخدم، أو تنزيل نسخة Chromium خفيفة عند أول تشغيل داخل `userData` دون تضخيم حجم ملف التثبيت الأصلي.

### س5: كيف يتصرف OpenWA عند إعادة التشغيل: هل تُستعاد الجلسات تلقائياً بلا مسح QR جديد؟
**الجواب:** نعم قطعاً. عند تمرير `AUTO_START_SESSIONS=true`، يقوم OpenWA تلقائياً بقراءة الجلسات المصادق عليها من مجلد `SESSION_DATA_PATH` واستعادتها للعمل فور إقلاع السيرفر دون أي تدخل بشري أو طلب مسح QR.

### س6: هل نحتاج بوابة رسمية من البداية لجزء من الأرقام؟
**الجواب:** لا. تم اعتماد OpenWA كقناة وحيدة ومدمجة للإصدار الأول لتوفير التكاليف (صفر تكلفة للرسائل)، مع الإبقاء على معمارية `WhatsAppChannel` التجريدية جاهزة لاستقبال محول Cloud API في التحديثات المستقبلية دون تعديل واجهات التطبيق.
