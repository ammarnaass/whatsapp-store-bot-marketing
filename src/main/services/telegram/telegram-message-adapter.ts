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

  private buildCatalogMessage(): { text: string; keyboard: any } {
    const products = this.db.prepare(`
      SELECT p.name, min(v.price) as min_price, v.currency
      FROM products p LEFT JOIN variants v ON p.id = v.product_id
      WHERE p.active = 1 GROUP BY p.id ORDER BY p.id DESC LIMIT 8
    `).all() as any[];

    let text = `🛍️ **كتالوج ومنتجات متجرنا الرسمية:**\n\n`;
    products.forEach((p, i) => { text += `${i + 1}. **${p.name}**\n   💰 السعر: ${p.min_price} ${p.currency || 'ر.س'}\n\n`; });
    text += `💬 اكتب اسم أي منتج أو استفسار وسأجيبك فوراً!`;

    const keyboard = {
      inline_keyboard: [[{ text: '🛍️ تحديث الكتالوج', callback_data: 'catalog' }]],
    };
    return { text, keyboard };
  }

  private async handleUpdate(update: any): Promise<void> {
    const bot = TelegramBotService.getInstance();
    if (update.callback_query) {
      await bot.answerCallbackQuery(update.callback_query.id);
      const chatId = update.callback_query.message?.chat?.id;
      if (chatId && update.callback_query.data === 'catalog') {
        const { text, keyboard } = this.buildCatalogMessage();
        await bot.sendMessage(chatId, text, 'Markdown', keyboard);
      }
      return;
    }

    const msg = update.message;
    if (!msg || !msg.text || msg.from?.is_bot) return;

    const contactId = `tg_${msg.from.id}`;
    const name = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(' ') || msg.from.username || 'عميل تليغرام';
    const conversationId = `conv_tg_${msg.chat.id}`;
    const messageId = `msg_tg_${msg.message_id}_${Date.now()}`;
    const nowIso = new Date().toISOString();

    this.db.prepare(`
      INSERT INTO contacts (id, phone, name, source, tags, created_at)
      VALUES (?, ?, ?, 'telegram', '["تليغرام"]', CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET name = excluded.name
    `).run(contactId, contactId, name);

    this.db.prepare(`
      INSERT INTO conversations (id, session_id, contact_id, handler, state, unread_count, last_message_at, created_at)
      VALUES (?, 'telegram_bot', ?, 'agent', 'open', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET last_message_at = CURRENT_TIMESTAMP, unread_count = unread_count + 1
    `).run(conversationId, contactId);

    this.db.prepare(`
      INSERT INTO messages (id, conversation_id, direction, type, body, status, ts)
      VALUES (?, ?, 'INBOUND', 'text', ?, 'READ', ?)
    `).run(messageId, conversationId, msg.text, nowIso);

    this.broadcastMessage({ id: messageId, conversationId, direction: 'INBOUND', type: 'text', body: msg.text, status: 'READ', ts: nowIso, channel: 'telegram' });

    const trimmed = msg.text.trim().toLowerCase();
    if (trimmed === '/start' || trimmed === '/catalog' || trimmed === '/products') {
      const { text, keyboard } = this.buildCatalogMessage();
      const sendRes = await bot.sendMessage(msg.chat.id, text, 'Markdown', keyboard);
      if (sendRes.success) this.saveOutbound(conversationId, text);
      return;
    }

    const config = this.db.prepare('SELECT auto_reply FROM telegram_config WHERE id = ?').get('default') as any;
    if (config?.auto_reply) {
      await this.handleAiAutoReply(conversationId, contactId, msg.chat.id, msg.text);
    }
  }

  private async handleAiAutoReply(conversationId: string, contactPhone: string, chatId: number, text: string): Promise<void> {
    try {
      const recent = this.db.prepare(`
        SELECT direction, body FROM messages WHERE conversation_id = ? ORDER BY ts DESC LIMIT 10
      `).all(conversationId) as any[];
      const history = recent.reverse().map((m: any) => ({
        role: m.direction === 'INBOUND' ? ('user' as const) : ('assistant' as const),
        text: m.body || '',
      }));

      const agent = AIAgentEngine.getInstance();
      const output = await agent.processMessage({ conversationId, contactPhone, messageText: text, history });
      if (output?.replyText) {
        const bot = TelegramBotService.getInstance();
        const sendRes = await bot.sendMessage(chatId, output.replyText);
        if (sendRes.success) this.saveOutbound(conversationId, output.replyText);
      }
    } catch (err) {
      console.error('[TelegramMessageAdapter] AI Auto-reply error:', err);
    }
  }

  private saveOutbound(conversationId: string, text: string): void {
    const outId = `msg_tg_out_${Date.now()}`;
    const nowIso = new Date().toISOString();
    this.db.prepare("INSERT INTO messages (id, conversation_id, direction, type, body, status, ts) VALUES (?, ?, 'OUTBOUND', 'text', ?, 'SENT', ?)").run(outId, conversationId, text, nowIso);
    this.broadcastMessage({ id: outId, conversationId, direction: 'OUTBOUND', type: 'text', body: text, status: 'SENT', ts: nowIso, channel: 'telegram' });
  }

  private broadcastMessage(payload: any): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(IPC_CHANNELS.CHAT_MESSAGE_RECEIVED_EVENT, payload);
      this.mainWindow.webContents.send(IPC_CHANNELS.TELEGRAM_MESSAGE_RECEIVED_EVENT, payload);
    }
  }
}
