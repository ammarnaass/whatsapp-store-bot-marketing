import { TelegramConfig, TelegramBotInfo, TelegramStatusResult, TelegramSendOptions } from '../types/telegram.types';

export const telegramService = {
  async getConfig(): Promise<TelegramConfig | null> {
    if (!window.electronAPI?.telegram?.getConfig) return null;
    return window.electronAPI.telegram.getConfig();
  },

  async saveConfig(data: Partial<TelegramConfig>): Promise<{ success: boolean }> {
    if (!window.electronAPI?.telegram?.saveConfig) return { success: false };
    return window.electronAPI.telegram.saveConfig(data);
  },

  async testToken(token: string): Promise<{ success: boolean; botInfo?: TelegramBotInfo; error?: string }> {
    if (!window.electronAPI?.telegram?.testToken) return { success: false, error: 'الخدمة غير متاحة' };
    return window.electronAPI.telegram.testToken(token);
  },

  async start(token?: string): Promise<{ success: boolean; error?: string }> {
    if (!window.electronAPI?.telegram?.start) return { success: false, error: 'الخدمة غير متاحة' };
    return window.electronAPI.telegram.start(token);
  },

  async stop(): Promise<{ success: boolean }> {
    if (!window.electronAPI?.telegram?.stop) return { success: false };
    return window.electronAPI.telegram.stop();
  },

  async getStatus(): Promise<TelegramStatusResult> {
    if (!window.electronAPI?.telegram?.getStatus) {
      return { isConnected: false, isPolling: false };
    }
    return window.electronAPI.telegram.getStatus();
  },

  async sendMessage(options: TelegramSendOptions): Promise<{ success: boolean; messageId?: number; error?: string }> {
    if (!window.electronAPI?.telegram?.sendMessage) return { success: false, error: 'الخدمة غير متاحة' };
    return window.electronAPI.telegram.sendMessage(options);
  },
};

