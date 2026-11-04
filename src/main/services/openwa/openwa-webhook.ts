import { OpenWAHttpClient } from './openwa-client';

export class OpenWAWebhookManager {
  private client: OpenWAHttpClient;
  public readonly targetUrl = 'http://127.0.0.1:3005/webhook/openwa';

  constructor(client: OpenWAHttpClient) {
    this.client = client;
  }

  public async ensureWebhookRegistered(uuid: string): Promise<boolean> {
    try {
      const webhooks = await this.client.request(`/api/sessions/${uuid}/webhooks`, 'GET', undefined, 6000);
      if (Array.isArray(webhooks)) {
        const matching = webhooks.filter((w: any) => w.url === this.targetUrl);
        if (matching.length > 0) {
          for (let i = 1; i < matching.length; i++) {
            await this.client.request(`/api/sessions/${uuid}/webhooks/${matching[i].id}`, 'DELETE', undefined, 3000).catch(() => {});
          }
          return true;
        }
      }

      console.log(`[OpenWA] Registering integrated webhook: Session ${uuid} -> ${this.targetUrl}`);
      await this.client.request(
        `/api/sessions/${uuid}/webhooks`,
        'POST',
        {
          url: this.targetUrl,
          events: ['message.received', 'session.status', 'message.sent', 'message.ack'],
        },
        5000
      );
      console.log('[OpenWA] Integrated webhook successfully connected and active!');
      return true;
    } catch (err: any) {
      console.warn(`[OpenWA] Webhook registration note: ${err.message}`);
      return false;
    }
  }
}

