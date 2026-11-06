import { EventEmitter } from 'events';
import { TelegramBotInfo, TelegramStatusResult } from '../../../shared/types';

export class TelegramBotService extends EventEmitter {
  private static instance: TelegramBotService;
  private token: string = '';
  private isPolling: boolean = false;
  private offset: number = 0;
  private botInfo: TelegramBotInfo | null = null;
  private lastError: string | null = null;
  private abortController: AbortController | null = null;

  public static getInstance(): TelegramBotService {
    if (!TelegramBotService.instance) TelegramBotService.instance = new TelegramBotService();
    return TelegramBotService.instance;
  }

  public async testToken(token: string): Promise<{ success: boolean; botInfo?: TelegramBotInfo; error?: string }> {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token.trim()}/getMe`, { method: 'GET' });
      const data = await res.json() as any;
      return data.ok && data.result ? { success: true, botInfo: data.result } : { success: false, error: data.description || 'رمز البوت غير صالح' };
    } catch (err: any) {
      return { success: false, error: err.message || 'تعذر الاتصال بخوادم تليغرام' };
    }
  }

  public async startPolling(token: string): Promise<{ success: boolean; error?: string }> {
    if (this.isPolling) this.stopPolling();
    const test = await this.testToken(token);
    if (!test.success || !test.botInfo) {
      this.lastError = test.error || 'فشل التحقق من التوكن';
      return { success: false, error: this.lastError };
    }
    this.token = token.trim();
    this.botInfo = test.botInfo;
    this.isPolling = true;
    this.lastError = null;
    this.runPollLoop();
    return { success: true };
  }

  public stopPolling(): void {
    this.isPolling = false;
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  private async runPollLoop(): Promise<void> {
    while (this.isPolling) {
      try {
        this.abortController = new AbortController();
        const url = `https://api.telegram.org/bot${this.token}/getUpdates?offset=${this.offset}&timeout=25`;
        const res = await fetch(url, { signal: this.abortController.signal });
        const data = await res.json() as any;

        if (data.ok && Array.isArray(data.result)) {
          for (const update of data.result) {
            this.offset = Math.max(this.offset, update.update_id + 1);
            this.emit('update', update);
          }
        } else if (!data.ok) {
          this.lastError = data.description || 'خطأ في جلب التحديثات';
          await new Promise((r) => setTimeout(r, 4000));
        }
      } catch (err: any) {
        if (err.name === 'AbortError' || !this.isPolling) break;
        this.lastError = err.message || 'خطأ في شبكة تليغرام';
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }

  public async sendMessage(chatId: string | number, text: string, parseMode?: 'Markdown' | 'HTML', replyMarkup?: any): Promise<{ success: boolean; messageId?: number; error?: string }> {
    if (!this.token) return { success: false, error: 'البوت غير متصل' };
    try {
      const payload: any = { chat_id: chatId, text };
      if (parseMode) payload.parse_mode = parseMode;
      if (replyMarkup) payload.reply_markup = replyMarkup;

      let res = await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let data = await res.json() as any;

      if (!data.ok && parseMode) {
        delete payload.parse_mode;
        res = await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = await res.json() as any;
      }
      return data.ok ? { success: true, messageId: data.result?.message_id } : { success: false, error: data.description || 'فشل إرسال الرسالة' };
    } catch (err: any) {
      return { success: false, error: err.message || 'تعذر الإرسال لتليغرام' };
    }
  }

  public async answerCallbackQuery(id: string, text?: string): Promise<void> {
    if (!this.token || !id) return;
    try {
      await fetch(`https://api.telegram.org/bot${this.token}/answerCallbackQuery`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ callback_query_id: id, text }),
      });
    } catch {}
  }

  public getStatus(): TelegramStatusResult {
    return { isConnected: Boolean(this.token && this.botInfo), isPolling: this.isPolling, botInfo: this.botInfo, error: this.lastError };
  }
}

