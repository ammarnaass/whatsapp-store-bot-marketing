import { EventEmitter } from 'events';
import Database from 'better-sqlite3';
import { SessionStatus, ChannelStatusResult } from './openwa-types';
import { OpenWAHttpClient } from './openwa-client';
import { OpenWAWebhookManager } from './openwa-webhook';

export class OpenWASessionManager {
  private client: OpenWAHttpClient;
  private db: Database.Database;
  private emitter: EventEmitter;
  private webhookManager: OpenWAWebhookManager;

  public defaultSessionId: string;
  public activeSessionUuid: string | null = null;
  public currentStatus: SessionStatus = 'DISCONNECTED';
  public latestQrCode: string = '';
  private pollingTimer: NodeJS.Timeout | null = null;

  constructor(client: OpenWAHttpClient, db: Database.Database, emitter: EventEmitter, defaultSessionId: string) {
    this.client = client;
    this.db = db;
    this.emitter = emitter;
    this.defaultSessionId = defaultSessionId;
    this.webhookManager = new OpenWAWebhookManager(client);
  }

  public async ensureWebhookRegistered(uuid: string): Promise<boolean> {
    return this.webhookManager.ensureWebhookRegistered(uuid);
  }

  public async ensureSessionUuid(): Promise<string> {
    if (this.activeSessionUuid) {
      await this.ensureWebhookRegistered(this.activeSessionUuid);
      return this.activeSessionUuid;
    }

    try {
      const sessions = await this.client.request('/api/sessions', 'GET', undefined, 5000);
      if (Array.isArray(sessions)) {
        const found = sessions.find((s: any) => s.name === this.defaultSessionId);
        if (found && found.id) {
          this.activeSessionUuid = found.id;
          await this.ensureWebhookRegistered(found.id);
          return found.id;
        }
      }
    } catch {
      // مواصلة المحاولة
    }

    try {
      const created = await this.client.request('/api/sessions', 'POST', { name: this.defaultSessionId }, 5000);
      if (created && created.id) {
        this.activeSessionUuid = created.id;
        await this.ensureWebhookRegistered(created.id);
        return created.id;
      }
    } catch (err: any) {
      console.warn('[OpenWA] Session create note:', err.message);
    }

    return this.activeSessionUuid || this.defaultSessionId;
  }

  public async getStatus(): Promise<ChannelStatusResult> {
    const startTime = Date.now();
    try {
      const uuid = await this.ensureSessionUuid();
      const res = await this.client.request(`/api/sessions/${uuid}`, 'GET', undefined, 5000);
      const latencyMs = Date.now() - startTime;

      let status: SessionStatus = 'DISCONNECTED';
      if (res && res.status) {
        const s = String(res.status).toLowerCase();
        if (['working', 'connected', 'ready', 'authenticated'].includes(s)) {
          status = 'CONNECTED';
        } else if (['qr_ready', 'scan_qr'].includes(s)) {
          status = 'QR_READY';
        } else if (['starting', 'initializing', 'authenticating'].includes(s)) {
          status = 'STARTING';
        }
      }

      this.currentStatus = status;
      const sessionPhone = res?.phone || null;
      this.db.prepare(`
        INSERT INTO sessions (id, name, status, phone)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET status = ?, phone = coalesce(?, sessions.phone)
      `).run(this.defaultSessionId, 'رقم المتجر الرئيسي', status, sessionPhone, status, sessionPhone);

      return {
        status,
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
        status: dbStatus,
        isConnected: dbStatus === 'CONNECTED' || dbStatus === 'WORKING',
        statusText: dbStatus === 'CONNECTED' ? 'متصل' : dbStatus === 'QR_READY' ? 'بانتظار مسح رمز QR' : 'بوابة OpenWA غير متصلة حالياً',
        phone: session?.phone,
        latencyMs: undefined,
        provider: 'openwa_gateway',
      };
    }
  }

  public async getQrCode(): Promise<string> {
    try {
      const uuid = await this.ensureSessionUuid();
      const session = await this.client.request(`/api/sessions/${uuid}`, 'GET', undefined, 4000);
      const s = String(session?.status || '').toLowerCase();
      if (['ready', 'connected', 'working', 'authenticated'].includes(s)) {
        this.currentStatus = 'CONNECTED';
        const phone = session.phone || '213555220620';
        this.db.prepare(`
          INSERT INTO sessions (id, name, status, phone)
          VALUES (?, ?, 'CONNECTED', ?)
          ON CONFLICT(id) DO UPDATE SET status = 'CONNECTED', phone = ?
        `).run(this.defaultSessionId, 'رقم المتجر الرئيسي', phone, phone);
        this.emitter.emit('status-changed', { status: 'CONNECTED', phone });
        return '';
      }

      const res = await this.client.request(`/api/sessions/${uuid}/qr`, 'GET', undefined, 8000);
      const qr = res?.qrCode || res?.qr || res?.data;
      if (qr && typeof qr === 'string') {
        this.latestQrCode = qr;
        return qr;
      }
    } catch (err: any) {
      if (err.message?.includes('already authenticated') || err.message?.includes('no QR code needed')) {
        console.log('[OpenWA] Session is already authenticated, skipping QR fetch.');
        this.currentStatus = 'CONNECTED';
        const current = await this.getStatus().catch(() => null);
        this.emitter.emit('status-changed', { status: 'CONNECTED', phone: current?.phone });
        return '';
      }
      console.warn('[OpenWA] Failed to fetch QR code:', err.message);
    }
    return this.latestQrCode || '';
  }

  public async startSession(sessionName: string = this.defaultSessionId): Promise<{ success: boolean; message: string; qr?: string; isOfflineDemo?: boolean }> {
    console.log(`[OpenWA] Starting real session "${sessionName}" via Baileys engine...`);
    this.currentStatus = 'STARTING';
    this.emitter.emit('status-changed', { status: 'STARTING' });

    try {
      const uuid = await this.ensureSessionUuid();
      try {
        await this.client.request(`/api/sessions/${uuid}/start`, 'POST', undefined, 8000);
      } catch (err: any) {
        console.log('[OpenWA] Session start call note:', err.message);
      }

      const existingStatus = await this.getStatus();
      if (existingStatus.isConnected) {
        this.emitter.emit('status-changed', { status: 'CONNECTED', phone: existingStatus.phone });
        return {
          success: true,
          message: `جلسة واتساب متصلة ونشطة بالفعل بالرقم (+${existingStatus.phone})!`,
          isOfflineDemo: false,
        };
      }

      for (let attempt = 1; attempt <= 6; attempt++) {
        await new Promise((r) => setTimeout(r, 1200));
        const realQr = await this.getQrCode();
        if (this.currentStatus === 'CONNECTED') {
          const fresh = await this.getStatus();
          return {
            success: true,
            message: `تم التحقق من اقتران رقم واتساب بنجاح (+${fresh.phone})!`,
            isOfflineDemo: false,
          };
        }
        if (realQr && realQr.startsWith('data:image/')) {
          this.currentStatus = 'QR_READY';
          this.db.prepare(`
            INSERT INTO sessions (id, name, status)
            VALUES (?, ?, 'QR_READY')
            ON CONFLICT(id) DO UPDATE SET status = 'QR_READY'
          `).run(this.defaultSessionId, 'رقم المتجر الرئيسي');

          this.emitter.emit('qr', { qrCodeDataUrl: realQr, isOfflineDemo: false });
          this.emitter.emit('status-changed', { status: 'QR_READY' });
          this.startPairingWatcher(uuid);

          return {
            success: true,
            message: 'تم توليد رمز QR الحقيقي الصالح للاقتران بتطبيق واتساب!',
            qr: realQr,
            isOfflineDemo: false,
          };
        }
      }

      this.startPairingWatcher(uuid);
      return {
        success: true,
        message: 'جارٍ توليد رمز QR من خوادم واتساب، سيظهر الرمز خلال لحظات...',
        qr: this.latestQrCode,
        isOfflineDemo: false,
      };
    } catch (err: any) {
      console.warn(`[OpenWA] Gateway start error: ${err.message}.`);
      return { success: false, message: `تعذر الاتصال ببوابة OpenWA (${err.message})` };
    }
  }

  private startPairingWatcher(uuid: string): void {
    if (this.pollingTimer) clearInterval(this.pollingTimer);

    let checks = 0;
    this.pollingTimer = setInterval(async () => {
      checks++;
      try {
        const session = await this.client.request(`/api/sessions/${uuid}`, 'GET', undefined, 4000);
        const s = String(session?.status || '').toLowerCase();

        if (['connected', 'working', 'ready', 'authenticated'].includes(s)) {
          console.log('[OpenWA] WhatsApp successfully paired and connected!');
          this.currentStatus = 'CONNECTED';
          if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
            this.pollingTimer = null;
          }

          const phone = session.phone || '213555220620';
          this.db.prepare(`
            INSERT INTO sessions (id, name, status, phone)
            VALUES (?, ?, 'CONNECTED', ?)
            ON CONFLICT(id) DO UPDATE SET status = 'CONNECTED', phone = ?
          `).run(this.defaultSessionId, 'رقم المتجر الرئيسي', phone, phone);

          this.emitter.emit('status-changed', { status: 'CONNECTED', phone });
          return;
        }

        if (checks % 2 === 0 && s === 'qr_ready') {
          const freshQr = await this.getQrCode();
          if (freshQr && freshQr !== this.latestQrCode) {
            this.latestQrCode = freshQr;
            this.emitter.emit('qr', { qrCodeDataUrl: freshQr, isOfflineDemo: false });
          }
        }
      } catch {
        // صامت
      }

      if (checks > 60) {
        if (this.pollingTimer) {
          clearInterval(this.pollingTimer);
          this.pollingTimer = null;
        }
      }
    }, 2000);
  }

  public async simulatePair(phone: string = '966501234567'): Promise<{ success: boolean; phone: string }> {
    this.currentStatus = 'CONNECTED';
    this.latestQrCode = '';
    this.db.prepare(`
      INSERT INTO sessions (id, name, status, phone)
      VALUES (?, ?, 'CONNECTED', ?)
      ON CONFLICT(id) DO UPDATE SET status = 'CONNECTED', phone = ?
    `).run(this.defaultSessionId, 'رقم المتجر الرئيسي', phone, phone);

    this.emitter.emit('status-changed', { status: 'CONNECTED', phone });
    return { success: true, phone };
  }

  public async getPairingCode(phone: string): Promise<{ success: boolean; code?: string; message?: string }> {
    try {
      const uuid = await this.ensureSessionUuid();
      const cleanPhone = phone.replace(/\D/g, '');
      const res = await this.client.request(`/api/sessions/${uuid}/pairing-code`, 'POST', { phone: cleanPhone }, 6000);
      const code = res?.code || res?.pairingCode || (typeof res === 'string' ? res : '');
      if (code) {
        return { success: true, code, message: 'تم توليد كود الاقتران بنجاح' };
      }
      return { success: false, message: 'تعذر توليد كود الاقتران من خادم OpenWA' };
    } catch (err: any) {
      return { success: false, message: err.message || 'فشل الاتصال بالبوابة' };
    }
  }

  public async getContactProfilePicture(phone: string): Promise<string> {
    try {
      const uuid = await this.ensureSessionUuid();
      const cleanPhone = phone.includes('@') ? phone.trim() : `${phone.replace(/\+/g, '').trim()}@c.us`;
      const res = await this.client.request(`/api/sessions/${uuid}/contacts/${cleanPhone}/profile-picture`, 'GET', undefined, 4000);
      return res?.url || res?.profilePictureUrl || '';
    } catch {
      return '';
    }
  }

  public async getContactDetails(phone: string): Promise<{ name?: string; pushName?: string; number?: string } | null> {
    try {
      const uuid = await this.ensureSessionUuid();
      const cleanPhone = phone.includes('@') ? phone.trim() : `${phone.replace(/\+/g, '').trim()}@c.us`;
      const res = await this.client.request(`/api/sessions/${uuid}/contacts/${cleanPhone}`, 'GET', undefined, 4000);
      return res || null;
    } catch {
      return null;
    }
  }

  public async logout(sessionName: string = this.defaultSessionId): Promise<boolean> {
    try {
      const uuid = await this.ensureSessionUuid();
      await this.client.request(`/api/sessions/${uuid}`, 'DELETE', undefined, 3000);
    } catch {
      // صامت
    }
    this.currentStatus = 'DISCONNECTED';
    this.activeSessionUuid = null;
    this.latestQrCode = '';
    this.db.prepare('UPDATE sessions SET status = ? WHERE id = ?').run('DISCONNECTED', sessionName);
    this.emitter.emit('status-changed', { status: 'DISCONNECTED' });
    return true;
  }

  public stopTimer(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }
}
