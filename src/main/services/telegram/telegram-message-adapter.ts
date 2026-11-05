import { BrowserWindow } from 'electron';
import Database from 'better-sqlite3';
import { TelegramBotService } from './telegram-bot.service';
import { AIAgentEngine } from '../../agent/agent-engine';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

export class TelegramMessageAdapter {
  constructor(private db: Database.Database, private mainWindow?: BrowserWindow) {
    const bot = TelegramBotService.getInstance();
    bot.on('update', (update: any) => this.handleUpdate(update));
  }

  private async handleUpdate(update: any): Promise<void> {
    const msg = update.message;
    if (!msg || !msg.text || msg.from?.is_bot) return;

    const bot = TelegramBotService.getInstance();
    const botInfo = bot.getStatus().botInfo;
    if (botInfo && msg.from?.username && msg.from.username === botInfo.username) return;

    const contactId = `tg_${msg.from.id}`;
    const name = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(' ') || msg.from.username || 'عميل تليغرام';
    const conversationId = `conv_tg_${msg.chat.id}`;
    const messageId = `msg_tg_${msg.message_id}_${Date.now()}`;
    const nowIso = new Date().toISOString();

    const tx = this.db.transaction(() => {
      this.db.prepare(`
        INSERT INTO contacts (id, phone, name, source, tags, created_at)
        VALUES (?, ?, ?, 'telegram', '["تليغرام"]', CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET name = excluded.name
      `).run(contactId, contactId, name);

      this.db.prepare(`
        INSERT INTO conversations (id, session_id, contact_id, handler, state, unread_count, last_message_at, last_message_body, created_at)
        VALUES (?, 'telegram_bot', ?, 'agent', 'open', 1, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET last_message_at = CURRENT_TIMESTAMP, last_message_body = excluded.last_message_body
      `).run(conversationId, contactId, msg.text);

      this.db.prepare(`
        INSERT INTO messages (id, conversation_id, direction, type, body, status, ts)
        VALUES (?, ?, 'INBOUND', 'text', ?, 'READ', ?)
      `).run(messageId, conversationId, msg.text, nowIso);
    });
    tx();

    this.broadcastMessage({ id: messageId, conversationId, direction: 'INBOUND', type: 'text', body: msg.text, status: 'READ', ts: nowIso, channel: 'telegram' });

    // الرد الآلي عبر وكيل المتجر الذكي إذا كان مفعّلاً
    const config = this.db.prepare('SELECT auto_reply FROM telegram_config WHERE id = ?').get('default') as any;
    if (config?.auto_reply) {
      this.handleAiAutoReply(conversationId, contactId, msg.chat.id, msg.text);
    }
  }

  private async handleAiAutoReply(conversationId: string, contactPhone: string, chatId: number, text: string): Promise<void> {
    try {
      const agent = AIAgentEngine.getInstance();
      const output = await agent.processInboundMessage({ conversationId, contactPhone, messageText: text });
      if (output?.replyText) {
        const bot = TelegramBotService.getInstance();
        const sendRes = await bot.sendMessage(chatId, output.replyText);
        if (sendRes.success) {
          const outId = `msg_tg_out_${Date.now()}`;
          const nowIso = new Date().toISOString();
          this.db.prepare(`
            INSERT INTO messages (id, conversation_id, direction, type, body, status, ts)
            VALUES (?, ?, 'OUTBOUND', 'text', ?, 'SENT', ?)
          `).run(outId, conversationId, output.replyText, nowIso);

          this.broadcastMessage({ id: outId, conversationId, direction: 'OUTBOUND', type: 'text', body: output.replyText, status: 'SENT', ts: nowIso, channel: 'telegram' });
        }
      }
    } catch (err) {
      console.error('[TelegramMessageAdapter] AI Auto-reply error:', err);
    }
  }

  private broadcastMessage(payload: any): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(IPC_CHANNELS.CHAT_MESSAGE_RECEIVED_EVENT, payload);
      this.mainWindow.webContents.send(IPC_CHANNELS.TELEGRAM_MESSAGE_RECEIVED_EVENT, payload);
    }
  }
}

