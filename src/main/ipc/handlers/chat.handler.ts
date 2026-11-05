import { ipcMain, BrowserWindow } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { OpenWAManager } from '../../services/openwa-manager.service';
import { WebhookServerService } from '../../services/webhook-server.service';
import { WhatsAppCloudClient } from '../../services/whatsapp-cloud-client';

export function registerChatHandlers(
  mainWindow: BrowserWindow,
  db: Database.Database,
  openwa: OpenWAManager,
  webhook: WebhookServerService
): void {
  // بث رسائل Webhook الجديدة أو المستدرك السريع إلى الواجهة فورياً
  const forwardNewMessage = (data: any) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(IPC_CHANNELS.CHAT_MESSAGE_RECEIVED_EVENT, data);
    }
  };

  webhook.on('new-message', forwardNewMessage);
  openwa.on('new-message', forwardNewMessage);

  // جلب قائمة المحادثات
  ipcMain.handle(IPC_CHANNELS.CHAT_LIST_CONVERSATIONS, async () => {
    const rows = db.prepare(`
      SELECT c.*, cnt.name as contact_name, cnt.phone as contact_phone, cnt.avatar as contact_avatar,
             cnt.tags as contact_tags, cnt.notes as contact_notes, cnt.memory_summary,
             (SELECT body FROM messages WHERE conversation_id = c.id ORDER BY ts DESC LIMIT 1) as last_message_body
      FROM conversations c
      JOIN contacts cnt ON c.contact_id = cnt.id
      ORDER BY c.last_message_at DESC
    `).all() as any[];

    return rows.map((r) => ({
      ...r,
      contact: {
        id: r.contact_id,
        name: r.contact_name,
        phone: r.contact_phone,
        avatar: r.contact_avatar || '',
        notes: r.contact_notes || '',
        tags: (() => {
          try {
            return JSON.parse(r.contact_tags || '[]');
          } catch {
            return [];
          }
        })(),
        memory_summary: r.memory_summary,
      },
    }));
  });

  // جلب رسائل محادثة محددة
  ipcMain.handle(IPC_CHANNELS.CHAT_GET_MESSAGES, async (_event, { conversationId }) => {
    return db.prepare(`
      SELECT * FROM messages WHERE conversation_id = ? ORDER BY ts ASC
    `).all(conversationId);
  });

  // إرسال رسالة نصية عبر المزود النشط (OpenWA أو Meta Cloud API)
  ipcMain.handle(IPC_CHANNELS.CHAT_SEND_MESSAGE, async (_event, { conversationId, phone, body }) => {
    const cloudRow = db.prepare("SELECT active_provider, phone_number_id, access_token FROM whatsapp_cloud_config WHERE id = 'default'").get() as any;
    let isSent = false;
    if (cloudRow?.active_provider === 'meta_cloud' && cloudRow?.phone_number_id && cloudRow?.access_token) {
      const res = await WhatsAppCloudClient.getInstance().sendTextMessage(cloudRow.phone_number_id, cloudRow.access_token, phone, body);
      isSent = res.success;
    } else {
      isSent = await openwa.sendTextMessage(phone, body);
    }

    const msgId = `out_${Date.now()}`;
    const status = isSent ? 'SENT' : 'FAILED';

    db.prepare(`
      INSERT INTO messages (id, conversation_id, direction, type, body, status)
      VALUES (?, ?, 'OUTBOUND', 'text', ?, ?)
    `).run(msgId, conversationId, body, status);

    db.prepare(`
      UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(conversationId);

    return { success: isSent, id: msgId, status };
  });

  // تحويل المحادثة للتحكم البشري
  ipcMain.handle(IPC_CHANNELS.CHAT_TAKEOVER, async (_event, { conversationId }) => {
    db.prepare(`
      UPDATE conversations SET handler = 'human', state = 'waiting_human' WHERE id = ?
    `).run(conversationId);
    return { success: true };
  });

  // إعادة المحادثة لوكيل الذكاء الاصطناعي
  ipcMain.handle(IPC_CHANNELS.CHAT_RETURN_TO_AGENT, async (_event, { conversationId }) => {
    db.prepare(`
      UPDATE conversations SET handler = 'agent', state = 'open' WHERE id = ?
    `).run(conversationId);
    return { success: true };
  });

  // مزامنة المحادثات من البوابة
  ipcMain.handle(IPC_CHANNELS.CHAT_SYNC_CONVERSATIONS, async () => {
    return await openwa.syncChatsFromGateway();
  });
}

