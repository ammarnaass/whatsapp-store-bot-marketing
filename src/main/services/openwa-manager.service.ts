import { EventEmitter } from 'events';
import http from 'http';
import { AppDatabase } from '../database/db';
import { SessionStatus, ChannelProviderType } from '../../shared/types';
import { IWhatsAppChannelProvider, SendMessageOptions, ChannelStatusResult } from './channel-provider.interface';

export class OpenWAManager extends EventEmitter implements IWhatsAppChannelProvider {
  private static instance: OpenWAManager;
  private db = AppDatabase.getInstance().db;

  public readonly id: ChannelProviderType = 'openwa_gateway';
  public readonly name = 'بوابة OpenWA المفتوحة (Multi-Device QR)';

  public openwaHost = '127.0.0.1';
  public openwaPort = 2785; // منفذ OpenWA الافتراضي (rmyndharis/OpenWA)
  public apiKey = 'wasell_secure_openwa_key_2026';
  public defaultSessionId = 'wasell_main_store';
  public currentStatus: SessionStatus = 'DISCONNECTED';
  private latestQrCode: string = '';
  private pollingTimer: NodeJS.Timeout | null = null;

  private constructor() {
    super();
  }

  public static getInstance(): OpenWAManager {
    if (!OpenWAManager.instance) {
      OpenWAManager.instance = new OpenWAManager();
    }
    return OpenWAManager.instance;
  }

  /**
   * دالة مساعدة لتنفيذ طلبات HTTP لـ OpenWA REST API
   */
  private request(path: string, method: string = 'GET', bodyData?: any, timeoutMs: number = 4000): Promise<any> {
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
          hostname: this.openwaHost,
          port: this.openwaPort,
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
        reject(new Error(`OpenWA Gateway connection timeout (${path})`));
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  }

  /**
   * جلب حالة اتصال الجلسة
   */
  public async getStatus(): Promise<ChannelStatusResult> {
    const startTime = Date.now();
    try {
      // محاولة استعلام خادم OpenWA الحي
      const res = await this.request(`/api/sessions/${this.defaultSessionId}`, 'GET', undefined, 2000);
      const latencyMs = Date.now() - startTime;

      let status: SessionStatus = 'DISCONNECTED';
      if (res && res.status) {
        if (res.status === 'WORKING' || res.status === 'CONNECTED') status = 'CONNECTED';
        else if (res.status === 'SCAN_QR') status = 'QR_READY';
        else if (res.status === 'STARTING') status = 'STARTING';
      }

      this.currentStatus = status;
      return {
        isConnected: status === 'CONNECTED',
        statusText: status === 'CONNECTED' ? 'متصل وجاهز للاستقبال والإرسال' : status === 'QR_READY' ? 'بانتظار مسح رمز QR' : 'غير متصل',
        phone: res?.phone,
        latencyMs,
        uptimeSeconds: res?.uptime || 0,
        provider: 'openwa_gateway'
      };
    } catch {
      // في حال عدم استجابة حاوية OpenWA
      const session = this.db.prepare('SELECT status, phone FROM sessions ORDER BY created_at DESC LIMIT 1').get() as any;
      const dbStatus = session?.status ? (session.status as SessionStatus) : this.currentStatus;
      return {
        isConnected: dbStatus === 'CONNECTED' || dbStatus === 'WORKING',
        statusText: dbStatus === 'CONNECTED' ? 'متصل' : dbStatus === 'QR_READY' ? 'بانتظار مسح رمز QR' : 'بوابة OpenWA غير متصلة حالياً',
        phone: session?.phone,
        latencyMs: undefined,
        provider: 'openwa_gateway'
      };
    }
  }

  /**
   * جلب رمز QR الحالي
   */
  public async getQrCode(sessionId: string = this.defaultSessionId): Promise<string> {
    try {
      const res = await this.request(`/api/sessions/${sessionId}/qr`, 'GET', undefined, 2500);
      if (res && (res.qr || res.data)) {
        this.latestQrCode = res.qr || res.data;
        return this.latestQrCode;
      }
    } catch {
      // صامت
    }
    return this.latestQrCode || '';
  }

  /**
   * بدء جلسة واتساب وتوليد رمز الاستجابة السريعة QR
   */
  public async startSession(sessionName: string = this.defaultSessionId): Promise<{ success: boolean; message: string; qr?: string }> {
    console.log(`[OpenWA] Starting session "${sessionName}" via OpenWA Gateway (Port ${this.openwaPort})...`);
    this.currentStatus = 'STARTING';
    this.emit('status-changed', { status: 'STARTING' });

    this.db.prepare(`
      INSERT INTO sessions (id, name, status)
      VALUES (?, ?, 'STARTING')
      ON CONFLICT(id) DO UPDATE SET status = 'STARTING'
    `).run(sessionName, 'رقم المتجر الرئيسي');

    try {
      // 1. تسجيل أو بدء الجلسة في OpenWA
      await this.request('/api/sessions', 'POST', {
        name: sessionName,
        webhookUrl: 'http://127.0.0.1:3005/webhook/openwa'
      }, 3000);

      await this.request(`/api/sessions/${sessionName}/start`, 'POST', undefined, 3000);

      // 2. جلب رمز QR
      const qrData = await this.getQrCode(sessionName);
      if (qrData) {
        this.currentStatus = 'QR_READY';
        this.db.prepare('UPDATE sessions SET status = ? WHERE id = ?').run('QR_READY', sessionName);
        this.emit('qr', { qrCodeDataUrl: qrData });
        this.emit('status-changed', { status: 'QR_READY' });
        return { success: true, message: 'تم إطلاق الجلسة وبانتظار مسح رمز الـ QR', qr: qrData };
      } else {
        throw new Error('لم يتم استلام رمز QR من بوابة OpenWA');
      }
    } catch (err: any) {
      console.warn(`[OpenWA] Gateway connection error: ${err.message}. Providing sandbox QR code.`);
      const sampleQr = this.generateSampleQr();
      this.latestQrCode = sampleQr;
      this.currentStatus = 'QR_READY';
      this.db.prepare('UPDATE sessions SET status = ? WHERE id = ?').run('QR_READY', sessionName);
      this.emit('qr', { qrCodeDataUrl: sampleQr, isOfflineDemo: true });
      this.emit('status-changed', { status: 'QR_READY' });

      return {
        success: true,
        isOfflineDemo: true,
        message: `بوابة OpenWA غير متصلة على المنفذ ${this.openwaPort} (تم تفعيل رمز QR تجريبي للمعاينة)`,
        qr: sampleQr
      };
    }
  }

  /**
   * محاكاة مسح الرمز واقتران رقم واتساب (Sandbox Simulation)
   */
  public async simulatePair(phone: string = '966501234567'): Promise<{ success: boolean; phone: string }> {
    this.currentStatus = 'CONNECTED';
    this.latestQrCode = '';
    this.db.prepare(`
      INSERT INTO sessions (id, name, status, phone)
      VALUES (?, ?, 'CONNECTED', ?)
      ON CONFLICT(id) DO UPDATE SET status = 'CONNECTED', phone = ?
    `).run(this.defaultSessionId, 'رقم المتجر الرئيسي', phone, phone);

    this.emit('status-changed', { status: 'CONNECTED', phone });
    return { success: true, phone };
  }

  /**
   * إرسال رسالة عبر واجهة المزود الموحد
   */
  public async sendMessage(options: SendMessageOptions): Promise<{ success: boolean; messageId: string; error?: string }> {
    const success = await this.sendTextMessage(options.to, options.text);
    return {
      success,
      messageId: `msg_openwa_${Date.now()}`,
      error: success ? undefined : 'فشل الإرسال عبر بوابة OpenWA'
    };
  }

  /**
   * إرسال رسالة نصية عبر OpenWA REST API
   */
  public async sendTextMessage(phone: string, text: string): Promise<boolean> {
    const cleanPhone = phone.includes('@c.us') ? phone : `${phone.replace(/\+/g, '').trim()}@c.us`;
    try {
      await this.request(`/api/sessions/${this.defaultSessionId}/messages/send-text`, 'POST', {
        chatId: cleanPhone,
        text
      }, 5000);
      return true;
    } catch (err: any) {
      console.warn(`[OpenWA] Gateway dispatch failed to ${cleanPhone}: ${err.message}`);
      return false;
    }
  }

  /**
   * تفعيل مؤشر الكتابة "يكتب الآن..." (Presence)
   */
  public async setTypingIndicator(to: string, isTyping: boolean): Promise<void> {
    await this.setChatState(to, isTyping ? 'composing' : 'paused');
  }

  public async setChatState(phone: string, state: 'composing' | 'paused'): Promise<void> {
    const cleanPhone = phone.includes('@c.us') ? phone : `${phone.replace(/\+/g, '').trim()}@c.us`;
    try {
      await this.request(`/api/sessions/${this.defaultSessionId}/chats/presence`, 'POST', {
        chatId: cleanPhone,
        presence: state
      }, 2000);
    } catch {
      // صامت
    }
  }

  /**
   * فصل الجلسة وتسجيل الخروج
   */
  public async logout(sessionName: string = this.defaultSessionId): Promise<boolean> {
    try {
      await this.request(`/api/sessions/${sessionName}`, 'DELETE', undefined, 3000);
    } catch {
      // صامت
    }
    this.currentStatus = 'DISCONNECTED';
    this.db.prepare('UPDATE sessions SET status = ? WHERE id = ?').run('DISCONNECTED', sessionName);
    this.emit('status-changed', { status: 'DISCONNECTED' });
    return true;
  }

  public async disconnect(): Promise<boolean> {
    return this.logout();
  }

  private generateSampleQr(): string {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260"><rect width="260" height="260" fill="%23ffffff"/><rect x="25" y="25" width="70" height="70" fill="%230f172a"/><rect x="35" y="35" width="50" height="50" fill="%23ffffff"/><rect x="45" y="45" width="30" height="30" fill="%230f172a"/><rect x="165" y="25" width="70" height="70" fill="%230f172a"/><rect x="175" y="35" width="50" height="50" fill="%23ffffff"/><rect x="185" y="45" width="30" height="30" fill="%230f172a"/><rect x="25" y="165" width="70" height="70" fill="%230f172a"/><rect x="35" y="175" width="50" height="50" fill="%23ffffff"/><rect x="45" y="185" width="30" height="30" fill="%230f172a"/><circle cx="130" cy="130" r="28" fill="%23128C7E"/><text x="130" y="135" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="%23ffffff">WaSell</text></svg>';
  }
}
