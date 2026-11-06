import http from 'http';
import crypto from 'crypto';
import { AppDatabase } from '../database/db';
import { AIAgentEngine } from '../agent/agent-engine';
import { OpenWAManager } from './openwa-manager.service';
import { EventEmitter } from 'events';
import { MetaWebhookParser } from './meta-webhook-parser';
import { WhatsAppCloudClient } from './whatsapp-cloud-client';

export class WebhookServerService extends EventEmitter {
  private static instance: WebhookServerService;
  private server: http.Server | null = null;
  private db = AppDatabase.getInstance().db;
  private port = 3005;

  // طابور تجميع الرسائل المتتالية (Debounce Queue)
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private pendingMessages: Map<string, string[]> = new Map();

  private constructor() {
    super();
  }

  public static getInstance(): WebhookServerService {
    if (!WebhookServerService.instance) {
      WebhookServerService.instance = new WebhookServerService();
    }
    return WebhookServerService.instance;
  }

  public start(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        // فحص الأمان لمفتاح API إذا تم تعيينه
        const apiKeyHeader = req.headers['x-api-key'];
        const configuredSecret = process.env.WEBHOOK_SECRET;
        if (configuredSecret && apiKeyHeader !== configuredSecret) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized webhook request' }));
          return;
        }

        if (req.method === 'POST' && req.url === '/webhook/openwa') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              // 1. فحص توقيع HMAC عند توفر السر
              const signatureHeader = (req.headers['x-hub-signature-256'] || req.headers['x-openwa-signature'] || '') as string;
              if (configuredSecret && signatureHeader) {
                const computed = crypto.createHmac('sha256', configuredSecret).update(body).digest('hex');
                const cleanExpected = signatureHeader.replace(/^sha256=/, '');
                if (!crypto.timingSafeEqual(Buffer.from(computed, 'utf-8'), Buffer.from(cleanExpected, 'utf-8'))) {
                  res.writeHead(403, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Invalid HMAC signature' }));
                  return;
                }
              }

              const payload = JSON.parse(body || '{}');

              // 2. تسجيل فوري في طابور الأحداث الواردة (Inbound Queue)
              const eventId = `in_ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
              try {
                this.db.prepare(`
                  INSERT INTO inbound_events_queue (id, event_type, payload_json)
                  VALUES (?, ?, ?)
                `).run(eventId, payload.event || payload.type || 'message', body);
              } catch (qErr) {
                console.warn('[WebhookServer] Notice logging to inbound queue:', qErr);
              }

              // 3. استجابة سريعة 200 لتفادي مهلة الـ Webhook
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ received: true, eventId }));

              // 4. معالجة غير متزامنة للحدث
              setImmediate(async () => {
                try {
                  await this.handleWebhookPayload(payload);
                  this.db.prepare('UPDATE inbound_events_queue SET processed = 1 WHERE id = ?').run(eventId);
                } catch (procErr: any) {
                  console.error(`[WebhookServer] Error processing queued event ${eventId}:`, procErr);
                }
              });
            } catch (err: any) {
              console.error('[WebhookServer] Error processing webhook payload:', err);
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else if (req.method === 'POST' && req.url === '/webhook/payment-success') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const result = await this.handlePaymentSuccessWebhook(payload);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result));
            } catch (err: any) {
              console.error('[WebhookServer] Error processing payment webhook:', err);
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else if (req.method === 'GET' && req.url?.startsWith('/webhook/whatsapp')) {
          const parsedUrl = new URL(req.url, `http://127.0.0.1:${this.port}`);
          const mode = parsedUrl.searchParams.get('hub.mode');
          const token = parsedUrl.searchParams.get('hub.verify_token');
          const challenge = parsedUrl.searchParams.get('hub.challenge');

          let configuredToken = 'wasell_webhook_token_2026';
          try {
            const row = this.db.prepare("SELECT verify_token FROM whatsapp_cloud_config WHERE id = 'default'").get() as any;
            if (row?.verify_token) configuredToken = row.verify_token;
          } catch {}

          if (mode === 'subscribe' && token === configuredToken && challenge) {
            console.log('[WebhookServer] Meta Webhook verified successfully!');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(challenge);
          } else {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Verification token mismatch' }));
          }
        } else if (req.method === 'POST' && req.url === '/webhook/whatsapp') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const eventId = `meta_ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
              try {
                this.db.prepare('INSERT INTO inbound_events_queue (id, event_type, payload_json) VALUES (?, ?, ?)')
                  .run(eventId, 'meta_whatsapp', body);
              } catch {}

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 'success', eventId }));

              setImmediate(async () => {
                try {
                  await this.handleMetaWebhookPayload(payload);
                  this.db.prepare('UPDATE inbound_events_queue SET processed = 1 WHERE id = ?').run(eventId);
                } catch (procErr) {
                  console.error('[WebhookServer] Error processing Meta webhook:', procErr);
                }
              });
            } catch (err: any) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else if (req.method === 'GET' && (req.url === '/webhook/status' || req.url === '/status')) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'online',
            port: this.port,
            endpoints: ['/webhook/openwa', '/webhook/whatsapp', '/webhook/payment-success', '/webhook/status'],
          }));
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('WaSell Multi-Channel Webhook Receiver Active (127.0.0.1)');
        }
      });

      const tryListen = (portToTry: number) => {
        this.server.listen(portToTry, '127.0.0.1', () => {
          this.port = portToTry;
          console.log(`[WebhookServer] Listening for webhooks on http://127.0.0.1:${this.port}`);
          resolve(this.port);
        });
      };

      this.server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE' && this.port < 3020) {
          console.warn(`[WebhookServer] Port ${this.port} is busy, retrying on ${this.port + 1}...`);
          this.port++;
          tryListen(this.port);
        } else {
          console.error('[WebhookServer] Failed to bind port:', err);
          reject(err);
        }
      });

      tryListen(this.port);
    });
  }

  /**
   * معالجة إشعارات السداد الناجح والتسليم التلقائي للتراخيص الرقمية عبر واتساب
   */
  private async handlePaymentSuccessWebhook(payload: any): Promise<{ success: boolean; deliveredKeys: number }> {
    const orderId = payload.orderId || payload.order_id;
    if (!orderId) {
      throw new Error('Order ID is required in payment webhook payload');
    }

    const order = this.db.prepare(`
      SELECT o.*, c.phone as customer_phone, c.name as customer_name
      FROM orders o
      JOIN contacts c ON o.contact_id = c.id
      WHERE o.id = ?
    `).get(orderId) as any;

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // 1. تحديث حالة السداد
    this.db.prepare(`
      UPDATE orders SET payment_status = 'PAID', status = 'CONFIRMED' WHERE id = ?
    `).run(orderId);

    console.log(`[WebhookServer] Payment confirmed for order ${orderId}. Checking digital assets...`);

    // 2. فحص الأصناف الرقمية في الطلب
    const items = this.db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId) as any[];
    let deliveredKeys = 0;

    for (const item of items) {
      const variant = item.variant_id
        ? (this.db.prepare('SELECT product_id FROM variants WHERE id = ?').get(item.variant_id) as any)
        : null;

      const productId = variant?.product_id;
      if (productId) {
        const prod = this.db.prepare('SELECT type, name FROM products WHERE id = ?').get(productId) as any;
        if (prod && prod.type === 'digital') {
          // صرف مفتاح ترخيص متاح
          const availableKey = this.db.prepare(`
            SELECT id, key_code FROM license_keys WHERE product_id = ? AND status = 'available' LIMIT 1
          `).get(productId) as any;

          if (availableKey) {
            this.db.prepare(`
              UPDATE license_keys SET status = 'sold', order_id = ?, sold_at = CURRENT_TIMESTAMP WHERE id = ?
            `).run(orderId, availableKey.id);

            deliveredKeys++;
            console.log(`[WebhookServer] Claimed license key ${availableKey.key_code} for order ${orderId}`);

            // إرسال رسالة واتساب للعميل بالمفتاح فوراً
            const deliveryMessage = `🎉 تم تأكيد سداد طلبك #${orderId} بنجاح!\n\n🔑 مفتاح الترخيص الرقمي لـ (${prod.name}):\n${availableKey.key_code}\n\nشكراً لثقتك بنا!`;
            await OpenWAManager.getInstance().sendTextMessage(order.customer_phone, deliveryMessage);

            const conv = this.db.prepare('SELECT id FROM conversations WHERE contact_id = ? LIMIT 1').get(order.contact_id) as any;
            if (conv) {
              this.db.prepare(`
                INSERT INTO messages (id, conversation_id, direction, type, body, status)
                VALUES (?, ?, 'OUTBOUND', 'text', ?, 'SENT')
              `).run(`key_deliv_${Date.now()}`, conv.id, deliveryMessage);
            }
          } else {
            console.warn(`[WebhookServer] Out of stock for digital license keys for product ${productId}!`);
          }
        }
      }
    }

    return { success: true, deliveredKeys };
  }

  /**
   * معالجة أحداث OpenWA الواردة
   */
  private async handleWebhookPayload(payload: any): Promise<void> {
    // 1. حدث رسالة واردة أو صادرة
    const isMessageEvent = payload.event === 'message' || 
                           payload.event === 'message.received' || 
                           payload.event === 'message.sent' ||
                           payload.type === 'chat' || 
                           payload.body || 
                           payload.data;

    if (isMessageEvent) {
      const msgData = payload.data || payload;
      const rawFrom = msgData.from || msgData.sender?.id || msgData.chatId || '';
      const rawTo = msgData.to || '';
      const isFromMe = Boolean(msgData.fromMe);

      // تحديد الشات والطرف الآخر وترجمة معرفات @lid إلى أرقام هواتف فعلية
      const targetChatId = isFromMe ? (rawTo || msgData.chatId || '') : (rawFrom || msgData.chatId || '');
      const phone = OpenWAManager.getInstance().resolveChatIdToPhone(targetChatId);
      const body = msgData.body || msgData.text || '';

      if (!phone || !body) return;

      console.log(`[WebhookServer] ${isFromMe ? 'Outbound' : 'Inbound'} message for ${phone}: "${body}"`);

      const pushName = msgData.contact?.pushName || payload.sender?.pushname || payload.notifyName || `عميل واتساب (${phone.slice(-4)})`;

      // 1. التحقق من وجود جهة الاتصال أو إنشائها وتحديث الاسم
      const contactId = `cnt_${phone}`;
      this.db.prepare(`
        INSERT INTO contacts (id, phone, name, source)
        VALUES (?, ?, ?, 'WHATSAPP')
        ON CONFLICT(phone) DO UPDATE SET name = coalesce(nullif(excluded.name, ''), contacts.name)
      `).run(contactId, phone, pushName);

      const contact = this.db.prepare('SELECT id FROM contacts WHERE phone = ?').get(phone) as any;
      const actualContactId = contact ? contact.id : contactId;

      // 2. التحقق من وجود المحادثة أو إنشائها (باستخدام session_id = 'wasell-main-store')
      const convId = `conv_${phone}`;
      this.db.prepare(`
        INSERT INTO conversations (id, session_id, contact_id, handler, state, last_message_at, unread_count)
        VALUES (?, 'wasell-main-store', ?, 'agent', 'open', CURRENT_TIMESTAMP, 0)
        ON CONFLICT(id) DO UPDATE SET last_message_at = CURRENT_TIMESTAMP
      `).run(convId, actualContactId);

      // 3. حفظ الرسالة في جدول messages
      const msgId = msgData.id || msgData.waMessageId || payload.id || `msg_${Date.now()}`;
      const direction = isFromMe ? 'OUTBOUND' : 'INBOUND';
      const status = isFromMe ? 'SENT' : 'DELIVERED';

      this.db.prepare(`
        INSERT INTO messages (id, conversation_id, direction, type, body, status, ts)
        VALUES (?, ?, ?, 'text', ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET status = excluded.status
      `).run(msgId, convId, direction, body, status);

      // 4. تحديث آخر رسالة والعداد غير المقروء إن كانت واردة
      if (!isFromMe) {
        this.db.prepare(`
          UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP, unread_count = unread_count + 1 WHERE id = ?
        `).run(convId);
      }

      // 5. بث الحدث للواجهة الرسومية فورياً!
      this.emit('new-message', {
        id: msgId,
        conversationId: convId,
        phone,
        body,
        direction,
      });

      console.log(`[WebhookServer] Persisted & Emitted ${direction} message for ${phone} ("${body}")`);

      // إذا كانت الرسالة من أنفسنا، لا داعي لإطلاق رد الوكيل
      if (isFromMe) return;

      const session = this.db.prepare("SELECT agent_mode FROM sessions WHERE id = 'wasell-main-store' LIMIT 1").get() as any;
      if (session?.agent_mode === 'DISABLED') {
        console.log(`[WebhookServer] Agent mode is DISABLED across the store. Skipping auto-reply for ${phone}.`);
        return;
      }

      const conv = this.db.prepare('SELECT id, handler, state FROM conversations WHERE id = ?').get(convId) as any;
      // إذا كانت المحادثة تحت تصرف موظف بشري (human)، لا يتدخل الوكيل إطلاقاً
      if (conv?.handler === 'human') {
        console.log(`[WebhookServer] Conversation ${convId} is assigned to HUMAN. Agent will not respond.`);
        return;
      }

      // تجميع الرسائل المتتالية (Debounce 3.5 ثوانٍ)
      this.enqueueForAgentResponse(phone, convId, body);
    }
  }

  /**
   * معالجة حزم الـ Webhook الواردة رسمياً من Meta WhatsApp Cloud API
   */
  private async handleMetaWebhookPayload(payload: any): Promise<void> {
    const parsed = MetaWebhookParser.parse(payload);
    if (!parsed || !parsed.isMessage) return;

    const phone = parsed.phone;
    const pushName = parsed.name || `عميل واتساب (${phone.slice(-4)})`;
    const body = parsed.body;
    const msgId = parsed.messageId;

    if (!phone || !body) return;

    console.log(`[WebhookServer] Meta Inbound message from ${phone} (${pushName}): "${body}"`);

    // 1. جهة الاتصال
    const contactId = `cnt_${phone}`;
    this.db.prepare(`
      INSERT INTO contacts (id, phone, name, source)
      VALUES (?, ?, ?, 'WHATSAPP_CLOUD')
      ON CONFLICT(phone) DO UPDATE SET name = coalesce(nullif(excluded.name, ''), contacts.name)
    `).run(contactId, phone, pushName);

    const contact = this.db.prepare('SELECT id FROM contacts WHERE phone = ?').get(phone) as any;
    const actualContactId = contact ? contact.id : contactId;

    // 2. المحادثة
    const convId = `conv_${phone}`;
    this.db.prepare(`
      INSERT INTO conversations (id, session_id, contact_id, handler, state, last_message_at, unread_count)
      VALUES (?, 'wasell-cloud-store', ?, 'agent', 'open', CURRENT_TIMESTAMP, 0)
      ON CONFLICT(id) DO UPDATE SET last_message_at = CURRENT_TIMESTAMP
    `).run(convId, actualContactId);

    // 3. الرسالة
    this.db.prepare(`
      INSERT INTO messages (id, conversation_id, direction, type, body, status, ts)
      VALUES (?, ?, 'INBOUND', 'text', ?, 'DELIVERED', CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET status = excluded.status
    `).run(msgId, convId, body);

    this.db.prepare('UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP, unread_count = unread_count + 1 WHERE id = ?').run(convId);

    // 4. بث الحدث للواجهة فورياً
    this.emit('new-message', {
      id: msgId,
      conversationId: convId,
      phone,
      body,
      direction: 'INBOUND',
      channel: 'whatsapp_cloud',
    });

    const session = this.db.prepare("SELECT agent_mode FROM sessions WHERE id = 'wasell-main-store' LIMIT 1").get() as any;
    if (session?.agent_mode === 'DISABLED') {
      console.log(`[WebhookServer] Agent mode is DISABLED across the store. Skipping auto-reply for ${phone}.`);
      return;
    }

    const conv = this.db.prepare('SELECT id, handler, state FROM conversations WHERE id = ?').get(convId) as any;
    if (conv?.handler !== 'human') {
      this.enqueueForAgentResponse(phone, convId, body);
    }
  }

  /**
   * تجميع الرسائل المتتالية من العميل خلال نافذة قصيرة ثم الرد عليها معاً
   */
  private enqueueForAgentResponse(phone: string, conversationId: string, messageText: string) {
    const existing = this.pendingMessages.get(phone) || [];
    existing.push(messageText);
    this.pendingMessages.set(phone, existing);

    // إلغاء المؤقت السابق
    const existingTimer = this.debounceTimers.get(phone);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // تعيين مؤقت جديد (3.5 ثانية)
    const timer = setTimeout(async () => {
      const messagesToProcess = this.pendingMessages.get(phone) || [];
      this.pendingMessages.delete(phone);
      this.debounceTimers.delete(phone);

      const combinedText = messagesToProcess.join(' \n ');
      console.log(`[WebhookServer] Processing aggregated message for ${phone}: "${combinedText}"`);

      // تفعيل مؤشر "يكتب الآن..." (Composing)
      await OpenWAManager.getInstance().setChatState(phone, 'composing');

      // جلب سجل المحادثة السابق (آخر 10 رسائل) لتوفير السياق التراكمي الكامل للوكيل
      const recentMessages = this.db.prepare(`
        SELECT direction, body FROM messages 
        WHERE conversation_id = ? 
        ORDER BY ts DESC LIMIT 10
      `).all(conversationId) as any[];

      const history = recentMessages.reverse().map((m: any) => ({
        role: m.direction === 'INBOUND' ? ('user' as const) : ('assistant' as const),
        text: m.body || '',
      }));

      // استدعاء وكيل الذكاء الاصطناعي مع التاريخ والسياق
      const result = await AIAgentEngine.getInstance().processMessage({
        conversationId,
        contactPhone: phone,
        messageText: combinedText,
        history,
      });

      // تأخير زمني بشري عشوائي خفيف (1.5 إلى 3 ثوانٍ) قبل الإرسال الفعلي
      const humanDelay = 1500 + Math.floor(Math.random() * 1500);
      setTimeout(async () => {
        // إرسال الرد للعميل حسب المحرك النشط (OpenWA أو Meta Cloud API)
        const cloudRow = this.db.prepare("SELECT active_provider, phone_number_id, access_token FROM whatsapp_cloud_config WHERE id = 'default'").get() as any;
        if (cloudRow?.active_provider === 'meta_cloud' && cloudRow?.phone_number_id && cloudRow?.access_token) {
          await WhatsAppCloudClient.getInstance().sendTextMessage(cloudRow.phone_number_id, cloudRow.access_token, phone, result.replyText);
        } else {
          await OpenWAManager.getInstance().setChatState(phone, 'paused').catch(() => {});
          await OpenWAManager.getInstance().sendTextMessage(phone, result.replyText);
        }

        // حفظ الرسالة الصادرة في قاعدة البيانات
        const outMsgId = `out_${Date.now()}`;
        this.db.prepare(`
          INSERT INTO messages (id, conversation_id, direction, type, body, status)
          VALUES (?, ?, 'OUTBOUND', 'text', ?, 'SENT')
        `).run(outMsgId, conversationId, result.replyText);

        // إذا تم تفعيل التحويل لموظف
        if (result.handoffTriggered) {
          this.db.prepare(`
            UPDATE conversations SET handler = 'human', state = 'waiting_human' WHERE id = ?
          `).run(conversationId);
          console.log(`[WebhookServer] Conversation ${conversationId} transferred to HUMAN.`);
        }

        // بث الرسالة الصادرة للواجهة الرسومية
        this.emit('new-message', {
          id: outMsgId,
          conversationId,
          phone,
          body: result.replyText,
          direction: 'OUTBOUND',
        });
      }, humanDelay);
    }, 3500);

    this.debounceTimers.set(phone, timer);
  }

  public stop() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}
