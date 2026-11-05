import { ipcMain, BrowserWindow } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { TelegramBotService } from '../../services/telegram/telegram-bot.service';
import { TelegramMessageAdapter } from '../../services/telegram/telegram-message-adapter';

let messageAdapter: TelegramMessageAdapter | null = null;

export function registerTelegramHandlers(mainWindow: BrowserWindow, db: Database.Database): void {
  const botService = TelegramBotService.getInstance();
  if (!messageAdapter) {
    messageAdapter = new TelegramMessageAdapter(db, mainWindow);
  }

  // 1. جلب إعدادات تليغرام الحالية
  ipcMain.handle(IPC_CHANNELS.TELEGRAM_GET_CONFIG, async () => {
    const row = db.prepare('SELECT * FROM telegram_config WHERE id = ?').get('default') as any;
    if (!row) return null;
    return {
      ...row,
      is_active: Boolean(row.is_active),
      auto_reply: Boolean(row.auto_reply),
      webhook_mode: Boolean(row.webhook_mode),
    };
  });

  // 2. حفظ الإعدادات وتحديث التوكن
  ipcMain.handle(IPC_CHANNELS.TELEGRAM_SAVE_CONFIG, async (_event, data) => {
    db.prepare(`
      UPDATE telegram_config SET
        bot_token = ?, bot_username = ?, bot_first_name = ?,
        auto_reply = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 'default'
    `).run(
      data.bot_token?.trim() || null,
      data.bot_username?.trim() || null,
      data.bot_first_name?.trim() || null,
      data.auto_reply ? 1 : 0,
      data.is_active ? 1 : 0
    );
    return { success: true };
  });

  // 3. فحص التوكن المباشر
  ipcMain.handle(IPC_CHANNELS.TELEGRAM_TEST_TOKEN, async (_event, { token }: { token: string }) => {
    return botService.testToken(token);
  });

  // 4. بدء تشغيل البوت والاستقصاء الفوري
  ipcMain.handle(IPC_CHANNELS.TELEGRAM_START, async (_event, { token }: { token?: string }) => {
    let effectiveToken = token?.trim();
    if (!effectiveToken) {
      const cfg = db.prepare('SELECT bot_token FROM telegram_config WHERE id = ?').get('default') as any;
      effectiveToken = cfg?.bot_token;
    }
    if (!effectiveToken) return { success: false, error: 'لم يتم إدخال رمز البوت (Token)' };

    const res = await botService.startPolling(effectiveToken);
    if (res.success) {
      const info = botService.getStatus().botInfo;
      db.prepare(`
        UPDATE telegram_config SET
          is_active = 1, bot_username = ?, bot_first_name = ?, last_sync_at = CURRENT_TIMESTAMP
        WHERE id = 'default'
      `).run(info?.username || null, info?.first_name || null);
    }
    return res;
  });

  // 5. إيقاف البوت
  ipcMain.handle(IPC_CHANNELS.TELEGRAM_STOP, async () => {
    botService.stopPolling();
    db.prepare('UPDATE telegram_config SET is_active = 0 WHERE id = \'default\'').run();
    return { success: true };
  });

  // 6. استعلام الحالة اللحظية للبوت
  ipcMain.handle(IPC_CHANNELS.TELEGRAM_GET_STATUS, async () => {
    const status = botService.getStatus();
    const row = db.prepare('SELECT last_sync_at FROM telegram_config WHERE id = ?').get('default') as any;
    return {
      ...status,
      lastSyncAt: row?.last_sync_at || null,
    };
  });

  // 7. إرسال رسالة يدوية أو تجريبية
  ipcMain.handle(IPC_CHANNELS.TELEGRAM_SEND_MESSAGE, async (_event, { chatId, text, parseMode }) => {
    return botService.sendMessage(chatId, text, parseMode);
  });
}
