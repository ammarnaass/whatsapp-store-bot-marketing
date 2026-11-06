import { api } from '../../../api';

export interface WhatsAppCloudConfig {
  phoneNumberId: string;
  wbaid: string;
  accessToken: string;
  verifyToken: string;
  webhookUrl: string;
  activeProvider: 'openwa_gateway' | 'meta_cloud';
  isActive: boolean;
}

export class ChannelsService {
  public static async getConfig(): Promise<WhatsAppCloudConfig> {
    try {
      return await api.channels.getConfig();
    } catch {
      return {
        phoneNumberId: '',
        wbaid: '',
        accessToken: '',
        verifyToken: 'wasell_webhook_token_2026',
        webhookUrl: 'http://127.0.0.1:3005/webhook/whatsapp',
        activeProvider: 'openwa_gateway',
        isActive: false,
      };
    }
  }

  public static async saveConfig(config: Partial<WhatsAppCloudConfig>): Promise<{ success: boolean; error?: string }> {
    try {
      return await api.channels.saveConfig(config);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public static async setActiveProvider(provider: 'openwa_gateway' | 'meta_cloud'): Promise<{ success: boolean }> {
    try {
      return await api.channels.setActiveProvider(provider);
    } catch (err: any) {
      return { success: false };
    }
  }

  public static async testCloudApi(
    phoneNumberId: string,
    accessToken: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      return await api.channels.testCloudApi({ phoneNumberId, accessToken });
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public static async testWebhook(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      return await api.channels.testWebhook();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public static async getWebhookLogs(): Promise<any[]> {
    try {
      return await api.channels.getWebhookLogs();
    } catch {
      return [];
    }
  }
}

