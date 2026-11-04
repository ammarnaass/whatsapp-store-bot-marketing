import { EventEmitter } from 'events';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { AppDatabase } from '../database/db';
import { SessionStatus, ChannelProviderType } from '../../shared/types';
import { IWhatsAppChannelProvider, SendMessageOptions, ChannelStatusResult } from './channel-provider.interface';

export class OpenWAManager extends EventEmitter implements IWhatsAppChannelProvider {
  private static instance: OpenWAManager;
  private db = AppDatabase.getInstance().db;

  public readonly id: ChannelProviderType = 'openwa_gateway';
  public readonly name = 'بوابة OpenWA المفتوحة (Multi-Device QR)';

  public openwaHost = '127.0.0.1';
  public openwaPort = 2785;
  public apiKey = 'owa_k1_ae432e36acd4d1f24bccbd03e0e132606b163780f12985b96c724d3f3a97bcf9';
  public defaultSessionId = 'wasell-main-store';
  public currentStatus: SessionStatus = 'DISCONNECTED';
  
  private activeSessionUuid: string | null = null;
  private latestQrCode: string = '';
  private pollingTimer: NodeJS.Timeout | null = null;
  private childProcess: ChildProcess | null = null;
  private openwaDir = '/home/ammar/OpenWA';

  private constructor() {
    super();
    this.refreshApiKey();
  }

  public static getInstance(): OpenWAManager {
    if (!OpenWAManager.instance) {
      OpenWAManager.instance = new OpenWAManager();
    }
    return OpenWAManager.instance;
  }

  /**
   * تحديث مفتاح API من ملف .api-key المنشأ بواسطة OpenWA
   */
  public refreshApiKey(): string {
    try {
      const keyPath = path.join(this.openwaDir, 'data/.api-key');
      if (fs.existsSync(keyPath)) {
        const key = fs.readFileSync(keyPath, 'utf-8').trim();
        if (key) {
          this.apiKey = key;
          return key;
        }
      }
    } catch {
      // صامت
    }
    return this.apiKey;
  }

  /**
   * التحقق من تشغيل بوابة OpenWA وإطلاقها كعملية فرعية إن كانت متوقفة
   */
  public async ensureGatewayRunning(): Promise<boolean> {
    this.refreshApiKey();
    try {
      await this.request('/api/health', 'GET', undefined, 1000);
      return true;
    } catch {
      // البوابة غير متصلة، نحاول تشغيلها
    }

    const mainJs = path.join(this.openwaDir, 'dist/main.js');
    if (!fs.existsSync(mainJs)) {
      console.warn(`[OpenWA] main.js not found at ${mainJs}`);
      return false;
    }

    console.log('[OpenWA] Auto-spawning OpenWA background process on Port 2785 with Baileys...');
    this.childProcess = spawn('node', ['dist/main.js'], {
      cwd: this.openwaDir,
      env: {
        ...process.env,
        PORT: String(this.openwaPort),
        DATABASE_TYPE: 'sqlite',
        DATABASE_NAME: './data/openwa.sqlite',
        DATABASE_SYNCHRONIZE: 'true',
        ENGINE_TYPE: 'baileys',
        SESSION_DATA_PATH: './data/sessions',
        STORAGE_TYPE: 'local',
        STORAGE_LOCAL_PATH: './data/media',
        REDIS_ENABLED: 'false',
        QUEUE_ENABLED: 'false',
        CACHE_ENABLED: 'false',
        SEND_PACING_ENABLED: 'true',
        AUTO_START_SESSIONS: 'true',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    this.childProcess.on('exit', (code, signal) => {
      console.warn(`[OpenWA] Process exited with code ${code}, signal: ${signal}`);
      this.childProcess = null;
    });

    // الانتظار حتى تستجيب نقطة الصحة /api/health
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 600));
      try {
        await this.request('/api/health', 'GET', undefined, 800);
        this.refreshApiKey();
        console.log('[OpenWA] Gateway is now UP and responding!');
        return true;
      } catch {
        // مواصلة الانتظار
      }
    }

    return false;
  }

  /**
   * ضمان وجود الجلسة واستخراج المعرف الفريد UUID المطلوب في مسارات OpenWA
   */
  public async ensureSessionUuid(): Promise<string> {
    this.refreshApiKey();
    if (this.activeSessionUuid) {
      return this.activeSessionUuid;
    }

    try {
      const sessions = await this.request('/api/sessions', 'GET', undefined, 3000);
      if (Array.isArray(sessions)) {
        const found = sessions.find((s: any) => s.name === this.defaultSessionId);
        if (found && found.id) {
          this.activeSessionUuid = found.id;
          return found.id;
        }
      }
    } catch {
      // مواصلة المحاولة للإنشاء
    }

    try {
      const created = await this.request('/api/sessions', 'POST', {
        name: this.defaultSessionId,
        webhookUrl: 'http://127.0.0.1:3005/webhook/openwa',
      }, 3000);
      if (created && created.id) {
        this.activeSessionUuid = created.id;
        return created.id;
      }
    } catch (err: any) {
      console.warn('[OpenWA] Session create note:', err.message);
    }

    return this.activeSessionUuid || this.defaultSessionId;
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
      await this.ensureGatewayRunning();
      const uuid = await this.ensureSessionUuid();
      const res = await this.request(`/api/sessions/${uuid}`, 'GET', undefined, 2000);
      const latencyMs = Date.now() - startTime;

      let status: SessionStatus = 'DISCONNECTED';
      if (res && res.status) {
        const s = String(res.status).toLowerCase();
        if (s === 'working' || s === 'connected') status = 'CONNECTED';
        else if (s === 'qr_ready' || s === 'scan_qr') status = 'QR_READY';
        else if (s === 'starting' || s === 'initializing') status = 'STARTING';
      }

      this.currentStatus = status;
      if (res?.phone) {
        this.db.prepare(`
          INSERT INTO sessions (id, name, status, phone)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET status = ?, phone = ?
        `).run(this.defaultSessionId, 'رقم المتجر الرئيسي', status, res.phone, status, res.phone);
      }

      return {
        isConnected: status === 'CONNECTED',
        statusText: status === 'CONNECTED' ? 'متصل وجاهز للاستقبال والإرسال' : status === 'QR_READY' ? 'بانتظار مسح رمز QR' : 'غير متصل',
        phone: res?.phone,
        latencyMs,
        uptimeSeconds: res?.uptime || 0,
        provider: 'openwa_gateway',
      };
    } catch {
      const session = this.db.prepare('SELECT status, phone FROM sessions ORDER BY created_at DESC LIMIT 1').get() as any;
      const dbStatus = session?.status ? (session.status as SessionStatus) : this.currentStatus;
      return {
        isConnected: dbStatus === 'CONNECTED' || dbStatus === 'WORKING',
        statusText: dbStatus === 'CONNECTED' ? 'متصل' : dbStatus === 'QR_READY' ? 'بانتظار مسح رمز QR' : 'بوابة OpenWA غير متصلة حالياً',
        phone: session?.phone,
        latencyMs: undefined,
        provider: 'openwa_gateway',
      };
    }
  }

  /**
   * جلب رمز QR الحقيقي من OpenWA
   */
  public async getQrCode(): Promise<string> {
    try {
      const uuid = await this.ensureSessionUuid();
      const res = await this.request(`/api/sessions/${uuid}/qr`, 'GET', undefined, 3000);
      const qr = res?.qrCode || res?.qr || res?.data;
      if (qr && typeof qr === 'string') {
        this.latestQrCode = qr;
        return qr;
      }
    } catch (err: any) {
      console.warn('[OpenWA] Failed to fetch QR code:', err.message);
    }
    return this.latestQrCode || '';
  }

  /**
   * بدء جلسة واتساب وتوليد رمز الاستجابة السريعة الحقيقي من خوادم واتساب
   */
  public async startSession(sessionName: string = this.defaultSessionId): Promise<{ success: boolean; message: string; qr?: string; isOfflineDemo?: boolean }> {
    console.log(`[OpenWA] Starting real session "${sessionName}" via Baileys engine...`);
    this.currentStatus = 'STARTING';
    this.emit('status-changed', { status: 'STARTING' });

    try {
      await this.ensureGatewayRunning();
      const uuid = await this.ensureSessionUuid();

      // 1. بدء الجلسة في OpenWA
      try {
        await this.request(`/api/sessions/${uuid}/start`, 'POST', undefined, 4000);
      } catch (err: any) {
        console.log('[OpenWA] Session start call note:', err.message);
      }

      // 2. محاولة جلب رمز الـ QR الحقيقي (مع انتظار قصير لتوليد الكود)
      for (let attempt = 1; attempt <= 6; attempt++) {
        await new Promise((r) => setTimeout(r, 1200));
        const realQr = await this.getQrCode();
        if (realQr && realQr.startsWith('data:image/')) {
          this.currentStatus = 'QR_READY';
          this.db.prepare(`
            INSERT INTO sessions (id, name, status)
            VALUES (?, ?, 'QR_READY')
            ON CONFLICT(id) DO UPDATE SET status = 'QR_READY'
          `).run(this.defaultSessionId, 'رقم المتجر الرئيسي');

          this.emit('qr', { qrCodeDataUrl: realQr, isOfflineDemo: false });
          this.emit('status-changed', { status: 'QR_READY' });

          // بدء مؤشر مراقبة نجاح الاقتران
          this.startPairingWatcher(uuid);

          return {
            success: true,
            message: 'تم توليد رمز QR الحقيقي الصالح للاقتران بتطبيق واتساب!',
            qr: realQr,
            isOfflineDemo: false,
          };
        }
      }

      // إذا استغرق التوليد وقتاً أطول، نطلق مراقب الخلفية ونبلغ الواجهة
      this.startPairingWatcher(uuid);
      return {
        success: true,
        message: 'جارٍ توليد رمز QR من خوادم واتساب، سيظهر الرمز خلال لحظات...',
        qr: this.latestQrCode,
        isOfflineDemo: false,
      };
    } catch (err: any) {
      console.warn(`[OpenWA] Gateway start error: ${err.message}.`);
      return {
        success: false,
        message: `تعذر الاتصال ببوابة OpenWA (${err.message})`,
      };
    }
  }

  /**
   * مراقبة حالة الاقتران وتحديث الجلسة عند مسح الرمز من الهاتف
   */
  private startPairingWatcher(uuid: string): void {
    if (this.pollingTimer) clearInterval(this.pollingTimer);

    let checks = 0;
    this.pollingTimer = setInterval(async () => {
      checks++;
      try {
        const session = await this.request(`/api/sessions/${uuid}`, 'GET', undefined, 2000);
        const s = String(session?.status || '').toLowerCase();

        if (s === 'connected' || s === 'working') {
          console.log('[OpenWA] WhatsApp successfully paired and connected!');
          this.currentStatus = 'CONNECTED';
          if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
            this.pollingTimer = null;
          }

          const phone = session.phone || '966500000000';
          this.db.prepare(`
            INSERT INTO sessions (id, name, status, phone)
            VALUES (?, ?, 'CONNECTED', ?)
            ON CONFLICT(id) DO UPDATE SET status = 'CONNECTED', phone = ?
          `).run(this.defaultSessionId, 'رقم المتجر الرئيسي', phone, phone);

          this.emit('status-changed', { status: 'CONNECTED', phone });
          return;
        }

        // إن لم يكن متصلاً، نتحقق من تحديث كود QR
        if (checks % 2 === 0 && s === 'qr_ready') {
          const freshQr = await this.getQrCode();
          if (freshQr && freshQr !== this.latestQrCode) {
            this.latestQrCode = freshQr;
            this.emit('qr', { qrCodeDataUrl: freshQr, isOfflineDemo: false });
          }
        }
      } catch {
        // صامت
      }

      // إيقاف المراقبة بعد دقيقتين إن لم يتم المسح
      if (checks > 60) {
        if (this.pollingTimer) {
          clearInterval(this.pollingTimer);
          this.pollingTimer = null;
        }
      }
    }, 2000);
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
      error: success ? undefined : 'فشل الإرسال عبر بوابة OpenWA',
    };
  }

  /**
   * إرسال رسالة نصية عبر OpenWA REST API
   */
  public async sendTextMessage(phone: string, text: string): Promise<boolean> {
    const cleanPhone = phone.includes('@c.us') ? phone : `${phone.replace(/\+/g, '').trim()}@c.us`;
    try {
      const uuid = await this.ensureSessionUuid();
      await this.request(`/api/sessions/${uuid}/messages/send-text`, 'POST', {
        chatId: cleanPhone,
        text,
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
      const uuid = await this.ensureSessionUuid();
      await this.request(`/api/sessions/${uuid}/chats/presence`, 'POST', {
        chatId: cleanPhone,
        presence: state,
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
      const uuid = await this.ensureSessionUuid();
      await this.request(`/api/sessions/${uuid}`, 'DELETE', undefined, 3000);
    } catch {
      // صامت
    }
    this.currentStatus = 'DISCONNECTED';
    this.activeSessionUuid = null;
    this.latestQrCode = '';
    this.db.prepare('UPDATE sessions SET status = ? WHERE id = ?').run('DISCONNECTED', sessionName);
    this.emit('status-changed', { status: 'DISCONNECTED' });
    return true;
  }

  public async disconnect(): Promise<boolean> {
    return this.logout();
  }
}

