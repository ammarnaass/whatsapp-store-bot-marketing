import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import Database from 'better-sqlite3';
import { OpenWAHttpClient } from './openwa-client';
import { OpenWAResolver } from './openwa-resolver';

export class OpenWAReconciler {
  private client: OpenWAHttpClient;
  private db: Database.Database;
  private resolver: OpenWAResolver;
  private emitter: EventEmitter;
  private getOpenWaDir: () => string;
  private ensureGatewayRunning: () => Promise<boolean>;
  private ensureSessionUuid: () => Promise<string>;
  private defaultSessionId: string;

  private reconcilerTimer: NodeJS.Timeout | null = null;
  private isReconciling = false;

  constructor(options: {
    client: OpenWAHttpClient;
    db: Database.Database;
    resolver: OpenWAResolver;
    emitter: EventEmitter;
    getOpenWaDir: () => string;
    ensureGatewayRunning: () => Promise<boolean>;
    ensureSessionUuid: () => Promise<string>;
    defaultSessionId: string;
  }) {
    this.client = options.client;
    this.db = options.db;
    this.resolver = options.resolver;
    this.emitter = options.emitter;
    this.getOpenWaDir = options.getOpenWaDir;
    this.ensureGatewayRunning = options.ensureGatewayRunning;
    this.ensureSessionUuid = options.ensureSessionUuid;
    this.defaultSessionId = options.defaultSessionId;
  }

  public startReconciler(): void {
    if (this.reconcilerTimer) return;
    console.log('[OpenWA] Starting background real-time message reconciler (2.5s loop)...');
    this.reconcilerTimer = setInterval(() => {
      this.reconcileLatestMessages().catch(() => {});
    }, 2500);
  }

  public stopReconciler(): void {
    if (this.reconcilerTimer) {
      clearInterval(this.reconcilerTimer);
      this.reconcilerTimer = null;
    }
  }

  public async reconcileLatestMessages(): Promise<number> {
    if (this.isReconciling) return 0;
    this.isReconciling = true;

    try {
      const openwaDir = this.getOpenWaDir();
      const openwaSqlitePath = path.join(openwaDir, 'data/openwa.sqlite');
      if (!fs.existsSync(openwaSqlitePath)) return 0;

      const owaDb = new Database(openwaSqlitePath, { readonly: true, fileMustExist: true });
      const recentOwaMessages = owaDb.prepare(`
        SELECT * FROM messages ORDER BY timestamp DESC LIMIT 15
      `).all() as any[];
      owaDb.close();

      if (!recentOwaMessages || recentOwaMessages.length === 0) return 0;

      const checkStmt = this.db.prepare('SELECT 1 FROM messages WHERE id = ?');
      let newCount = 0;

      for (const m of recentOwaMessages) {
        if (!m.id) continue;
        const exists = checkStmt.get(m.id);
        if (!exists) {
          const targetChatId = m.chatId || m.to || m.from;
          const phone = this.resolver.resolveChatIdToPhone(targetChatId);
          if (!phone) continue;

          const contactId = `cnt_${phone}`;
          const contactName = m.chatName || (targetChatId.includes('@lid') ? `عميل واتساب (${phone.slice(-4)})` : phone);
          this.db.prepare(`
            INSERT INTO contacts (id, phone, name, source)
            VALUES (?, ?, ?, 'WHATSAPP')
            ON CONFLICT(phone) DO UPDATE SET name = coalesce(nullif(excluded.name, ''), contacts.name)
          `).run(contactId, phone, contactName);

          const convId = `conv_${phone}`;
          const msgDate = m.timestamp
            ? new Date(m.timestamp * 1000).toISOString().replace('T', ' ').replace(/\..*/, '')
            : new Date().toISOString().replace('T', ' ').replace(/\..*/, '');

          this.db.prepare(`
            INSERT INTO conversations (id, session_id, contact_id, handler, state, last_message_at, unread_count)
            VALUES (?, 'wasell-main-store', ?, 'agent', 'open', ?, 0)
            ON CONFLICT(id) DO UPDATE SET last_message_at = excluded.last_message_at
          `).run(convId, contactId, msgDate);

          const direction = m.direction === 'incoming' ? 'INBOUND' : 'OUTBOUND';
          const status = m.status ? m.status.toUpperCase() : 'SENT';

          this.db.prepare(`
            INSERT INTO messages (id, conversation_id, direction, type, body, status, ts)
            VALUES (?, ?, ?, 'text', ?, ?, ?)
            ON CONFLICT(id) DO NOTHING
          `).run(m.id, convId, direction, m.body || '', status, msgDate);

          this.emitter.emit('new-message', {
            id: m.id,
            conversationId: convId,
            phone,
            body: m.body || '',
            direction,
          });

          newCount++;
          console.log(`[FastReconciler] Auto-reconciled instant message for ${phone}: "${m.body}"`);
        }
      }

      return newCount;
    } catch {
      return 0;
    } finally {
      this.isReconciling = false;
    }
  }

  public async syncChatsFromGateway(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      await this.ensureGatewayRunning();
      const uuid = await this.ensureSessionUuid();

      let remoteChats: any[] = [];
      try {
        const res = await this.client.request(`/api/sessions/${uuid}/chats?limit=100`, 'GET', undefined, 10000);
        if (Array.isArray(res)) {
          remoteChats = res;
        }
      } catch (err: any) {
        console.warn(`[OpenWA] Note fetching chats via REST: ${err.message}`);
      }

      const openwaDir = this.getOpenWaDir();
      const openwaSqlitePath = path.join(openwaDir, 'data/openwa.sqlite');
      let owaMessages: any[] = [];

      if (fs.existsSync(openwaSqlitePath)) {
        try {
          const owaDb = new Database(openwaSqlitePath, { readonly: true, fileMustExist: true });
          owaMessages = owaDb.prepare('SELECT * FROM messages ORDER BY timestamp ASC').all();
          owaDb.close();
        } catch (dbErr: any) {
          console.warn(`[OpenWA] Note reading openwa.sqlite: ${dbErr.message}`);
        }
      }

      let syncedCount = 0;
      const contactStmt = this.db.prepare(`
        INSERT INTO contacts (id, phone, name, source)
        VALUES (?, ?, ?, 'WHATSAPP')
        ON CONFLICT(phone) DO UPDATE SET name = coalesce(excluded.name, contacts.name)
      `);
      const getContactStmt = this.db.prepare('SELECT id FROM contacts WHERE phone = ?');
      const convStmt = this.db.prepare(`
        INSERT INTO conversations (id, session_id, contact_id, handler, state, last_message_at, unread_count)
        VALUES (?, ?, ?, 'agent', 'open', ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          last_message_at = excluded.last_message_at,
          unread_count = excluded.unread_count
      `);
      const msgStmt = this.db.prepare(`
        INSERT OR IGNORE INTO messages (id, conversation_id, direction, type, body, status, ts)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const syncTx = this.db.transaction(() => {
        for (const chat of remoteChats) {
          const chatId = chat.id;
          const phone = this.resolver.resolveChatIdToPhone(chatId);
          if (!phone) continue;

          const contactId = `cnt_${phone}`;
          const contactName = chat.name || (chatId.includes('@lid') ? `عميل واتساب (${phone.slice(-4)})` : phone);
          contactStmt.run(contactId, phone, contactName);

          const contact = getContactStmt.get(phone) as any;
          const actualContactId = contact ? contact.id : contactId;
          const convId = `conv_${phone}`;

          const lastMsgDate = chat.timestamp
            ? new Date(chat.timestamp * 1000).toISOString().replace('T', ' ').replace(/\..*/, '')
            : new Date().toISOString().replace('T', ' ').replace(/\..*/, '');

          convStmt.run(convId, this.defaultSessionId, actualContactId, lastMsgDate, chat.unreadCount || 0);
          syncedCount++;
        }

        for (const m of owaMessages) {
          const targetChatId = m.chatId || m.to || m.from;
          const phone = this.resolver.resolveChatIdToPhone(targetChatId);
          if (!phone) continue;

          const contactId = `cnt_${phone}`;
          const contactName = m.chatName || (targetChatId.includes('@lid') ? `عميل واتساب (${phone.slice(-4)})` : phone);
          contactStmt.run(contactId, phone, contactName);

          const contact = getContactStmt.get(phone) as any;
          const actualContactId = contact ? contact.id : contactId;
          const convId = `conv_${phone}`;

          const msgDate = m.timestamp
            ? new Date(m.timestamp * 1000).toISOString().replace('T', ' ').replace(/\..*/, '')
            : new Date().toISOString().replace('T', ' ').replace(/\..*/, '');

          convStmt.run(convId, this.defaultSessionId, actualContactId, msgDate, 0);

          const direction = m.direction === 'incoming' ? 'INBOUND' : 'OUTBOUND';
          const status = m.status ? m.status.toUpperCase() : 'SENT';

          msgStmt.run(m.id, convId, direction, m.type || 'text', m.body || '', status, msgDate);
        }
      });

      syncTx();

      console.log(`[OpenWA] Successfully synced ${syncedCount} conversations and ${owaMessages.length} messages from WhatsApp!`);
      return { success: true, count: syncedCount || owaMessages.length };
    } catch (err: any) {
      console.error('[OpenWA] syncChatsFromGateway error:', err);
      return { success: false, count: 0, error: err.message };
    }
  }
}

