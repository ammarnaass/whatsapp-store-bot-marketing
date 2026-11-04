import { EventEmitter } from 'events';
import http from 'http';
import { AppDatabase } from '../database/db';
import { SessionStatus } from '../../shared/types';
import {
  WhatsAppChannel,
  SendOpts,
  SendResult,
  MediaInput,
  ChannelEvent,
} from './whatsapp-channel.interface';
import { OpenWASupervisor } from './openwa.supervisor';

export class OpenWAAdapter extends EventEmitter implements WhatsAppChannel {
  private db = AppDatabase.getInstance().db;
  public readonly host: string;
  public readonly port: number;
  public readonly apiKey: string;
  public readonly defaultSessionId: string;
  private supervisor: OpenWASupervisor;
  private eventHandlers: Array<(e: ChannelEvent) => void> = [];

  constructor(options?: { host?: string; port?: number; apiKey?: string; defaultSessionId?: string }) {
    super();
    this.host = options?.host || '127.0.0.1';
    this.port = options?.port || 2785;
    this.apiKey = options?.apiKey || 'wasell_secure_openwa_key_2026';
    this.defaultSessionId = options?.defaultSessionId || 'wasell_main_store';

    this.supervisor = new OpenWASupervisor({
      host: this.host,
      port: this.port,
      apiKey: this.apiKey,
    });

    this.supervisor.on('health', (h) => {
      if (!h.healthy) {
        this.emitChannelEvent({
          type: 'session.status',
          sessionId: this.defaultSessionId,
          timestamp: new Date().toISOString(),
          data: { status: 'DISCONNECTED', error: 'Gateway ping failed' },
        });
      }
    });

    this.supervisor.on('circuit-tripped', (data) => {
      this.emitChannelEvent({
        type: 'session.status',
        sessionId: this.defaultSessionId,
        timestamp: new Date().toISOString(),
        data: { status: 'FAILED', ...data },
      });
    });

    // تشغيل المشرف
    this.supervisor.start().catch((err) => console.error('[OpenWAAdapter] Supervisor start error:', err));
  }

  private request(path: string, method: string = 'GET', bodyData?: any, timeoutMs: number = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const payload = bodyData ? JSON.stringify(bodyData) : null;
      const headers: Record<string, string | number> = {
        'Accept': 'application/json',
        'X-API-Key': this.apiKey,
      };

      if (payload) {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = Buffer.byteLength(payload);
      }

      const req = http.request(
        {
          hostname: this.host,
          port: this.port,
          path,
          method,
          headers,
          timeout: timeoutMs,
        },
        (res) => {
          let rawData = '';
          res.on('data', (chunk) => {
            rawData += chunk;
          });
          res.on('end', () => {
            try {
              const parsed = rawData ? JSON.parse(rawData) : {};
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                resolve(parsed);
              } else {
                reject(new Error(parsed.message || `HTTP ${res.statusCode}`));
              }
            } catch {
              resolve(rawData);
            }
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Connection timeout on ${path}`));
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (payload) req.write(payload);
      req.end();
    });
  }

  public async startSession(sessionId: string = this.defaultSessionId): Promise<void> {
    try {
      await this.request('/api/sessions', 'POST', { name: sessionId });
      await this.request(`/api/sessions/${sessionId}/start`, 'POST');
    } catch (err: any) {
      console.warn(`[OpenWAAdapter] Start session notice: ${err.message}`);
    }
  }

  public async getQr(sessionId: string = this.defaultSessionId): Promise<string> {
    try {
      const res = await this.request(`/api/sessions/${sessionId}/qr`, 'GET', null, 3000);
      const qrDataUrl = res.qr || res.data || (typeof res === 'string' ? res : '');
      if (qrDataUrl) {
        this.emitChannelEvent({
          type: 'session.qr',
          sessionId,
          timestamp: new Date().toISOString(),
          data: { qrCodeDataUrl: qrDataUrl },
        });
      }
      return qrDataUrl;
    } catch {
      return '';
    }
  }

  public async getStatus(sessionId: string = this.defaultSessionId): Promise<SessionStatus> {
    if (this.supervisor.getCircuitState() === 'OPEN') {
      return 'FAILED';
    }

    try {
      const res = await this.request(`/api/sessions/${sessionId}/status`, 'GET', null, 3000);
      const statusRaw = String(res.status || res.state || '').toUpperCase();
      let status: SessionStatus = 'DISCONNECTED';

      if (['WORKING', 'CONNECTED', 'READY', 'AUTHENTICATED'].includes(statusRaw)) {
        status = 'CONNECTED';
      } else if (['SCAN_QR', 'QR_READY', 'QR'].includes(statusRaw)) {
        status = 'SCAN_QR';
      } else if (['STARTING', 'INITIALIZING'].includes(statusRaw)) {
        status = 'STARTING';
      }

      return status;
    } catch {
      return 'DISCONNECTED';
    }
  }

  public async sendText(
    session: string = this.defaultSessionId,
    chatId: string,
    text: string,
    opts?: SendOpts
  ): Promise<SendResult> {
    const cleanChatId = chatId.includes('@c.us') || chatId.includes('@g.us')
      ? chatId
      : `${chatId.replace(/\+/g, '').trim()}@c.us`;

    const queueId = `out_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const idempotencyKey = opts?.idempotencyKey || queueId;

    // 1. تسجيل مسبق في طابور SQLite الدائم لمنع فقدان الرسائل
    try {
      this.db.prepare(`
        INSERT INTO outbound_queue (id, session_id, chat_id, type, payload_json, status, idempotency_key)
        VALUES (?, ?, ?, 'text', ?, 'pending', ?)
      `).run(queueId, session, cleanChatId, JSON.stringify({ text }), idempotencyKey);
    } catch (err: any) {
      if (String(err).includes('UNIQUE constraint failed')) {
        console.warn(`[OpenWAAdapter] Duplicate message ignored by idempotency key: ${idempotencyKey}`);
        return { success: true, messageId: queueId, status: 'DELIVERED' };
      }
    }

    // 2. التحقق من حالة قاطع الدائرة
    if (this.supervisor.getCircuitState() === 'OPEN') {
      const errorMsg = 'قاطع الدائرة مفعل: بوابة واتساب غير مستقرة حالياً، تم تعليق الإرسال في الطابور';
      this.db.prepare(`
        UPDATE outbound_queue SET status = 'failed', last_error = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(errorMsg, queueId);
      return { success: false, messageId: queueId, status: 'FAILED', error: errorMsg };
    }

    // 3. تأخير الإرسال وفق Pacing إن طُلب
    if (opts?.delayMs && opts.delayMs > 0) {
      await new Promise((r) => setTimeout(r, opts.delayMs));
    }

    // 4. تنفيذ الطلب الفعلي عبر REST API
    try {
      const res = await this.request(
        `/api/sessions/${session}/messages/send-text`,
        'POST',
        { chatId: cleanChatId, text },
        6000
      );

      const messageId = res.messageId || res.id || queueId;

      this.db.prepare(`
        UPDATE outbound_queue SET status = 'sent', updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(queueId);

      this.emitChannelEvent({
        type: 'message.status',
        sessionId: session,
        timestamp: new Date().toISOString(),
        data: { messageId, status: 'SENT', chatId: cleanChatId },
      });

      return { success: true, messageId, status: 'SENT' };
    } catch (err: any) {
      console.warn(`[OpenWAAdapter] Dispatch failed to ${cleanChatId}: ${err.message}`);

      this.db.prepare(`
        UPDATE outbound_queue SET status = 'failed', last_error = ?, attempts = attempts + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(err.message, queueId);

      return { success: false, messageId: queueId, status: 'FAILED', error: err.message };
    }
  }

  public async sendMedia(
    session: string = this.defaultSessionId,
    chatId: string,
    media: MediaInput,
    opts?: SendOpts
  ): Promise<SendResult> {
    const cleanChatId = chatId.includes('@c.us') ? chatId : `${chatId.replace(/\+/g, '').trim()}@c.us`;
    try {
      const res = await this.request(`/api/sessions/${session}/messages/send-media`, 'POST', {
        chatId: cleanChatId,
        mediaUrl: media.url,
        caption: media.caption || '',
      });
      return { success: true, messageId: res.messageId || `media_${Date.now()}`, status: 'SENT' };
    } catch (err: any) {
      return { success: false, status: 'FAILED', error: err.message };
    }
  }

  public onEvent(handler: (e: ChannelEvent) => void): void {
    this.eventHandlers.push(handler);
  }

  public emitChannelEvent(event: ChannelEvent): void {
    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch (err) {
        console.error('[OpenWAAdapter] Event handler error:', err);
      }
    }
    this.emit(event.type, event.data);
  }
}

