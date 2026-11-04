import { SendMessageOptions } from './openwa-types';
import { OpenWAHttpClient } from './openwa-client';

export class OpenWAMessaging {
  private client: OpenWAHttpClient;
  private ensureSessionUuid: () => Promise<string>;

  constructor(client: OpenWAHttpClient, ensureSessionUuid: () => Promise<string>) {
    this.client = client;
    this.ensureSessionUuid = ensureSessionUuid;
  }

  public async sendMessage(options: SendMessageOptions): Promise<{ success: boolean; messageId: string; error?: string }> {
    const success = await this.sendTextMessage(options.to, options.text);
    return {
      success,
      messageId: `msg_openwa_${Date.now()}`,
      error: success ? undefined : 'فشل الإرسال عبر بوابة OpenWA',
    };
  }

  public async sendTextMessage(phone: string, text: string): Promise<boolean> {
    const cleanPhone = phone.includes('@') ? phone.trim() : `${phone.replace(/\+/g, '').trim()}@c.us`;
    try {
      const uuid = await this.ensureSessionUuid();
      await this.client.request(`/api/sessions/${uuid}/messages/send-text`, 'POST', {
        chatId: cleanPhone,
        text,
      }, 5000);
      return true;
    } catch (err: any) {
      console.warn(`[OpenWA] Gateway dispatch failed to ${cleanPhone}: ${err.message}`);
      return false;
    }
  }

  public async setTypingIndicator(to: string, isTyping: boolean): Promise<void> {
    await this.setChatState(to, isTyping ? 'composing' : 'paused');
  }

  public async setChatState(phone: string, state: 'composing' | 'paused'): Promise<void> {
    const cleanPhone = phone.includes('@') ? phone.trim() : `${phone.replace(/\+/g, '').trim()}@c.us`;
    try {
      const uuid = await this.ensureSessionUuid();
      await this.client.request(`/api/sessions/${uuid}/chats/presence`, 'POST', {
        chatId: cleanPhone,
        presence: state,
      }, 2000);
    } catch {
      // صامت
    }
  }
}

