import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { WhatsAppCloudClient } from '../../services/whatsapp-cloud-client';

export function registerChannelsHandlers(db: Database.Database): void {
  const client = WhatsAppCloudClient.getInstance();

  ipcMain.handle(IPC_CHANNELS.CHANNELS_GET_CONFIG, async () => {
    const row = db.prepare("SELECT * FROM whatsapp_cloud_config WHERE id = 'default'").get() as any;
    return {
      phoneNumberId: row?.phone_number_id || '',
      wbaid: row?.wbaid || '',
      accessToken: row?.access_token || '',
      verifyToken: row?.verify_token || 'wasell_webhook_token_2026',
      webhookUrl: row?.webhook_url || 'http://127.0.0.1:3005/webhook/whatsapp',
      activeProvider: row?.active_provider || 'openwa_gateway',
      isActive: Boolean(row?.is_active),
    };
  });

  ipcMain.handle(IPC_CHANNELS.CHANNELS_SAVE_CONFIG, async (_event, config: any) => {
    db.prepare(`
      INSERT INTO whatsapp_cloud_config (id, phone_number_id, wbaid, access_token, verify_token, webhook_url, is_active, updated_at)
      VALUES ('default', ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        phone_number_id = excluded.phone_number_id,
        wbaid = excluded.wbaid,
        access_token = excluded.access_token,
        verify_token = excluded.verify_token,
        webhook_url = excluded.webhook_url,
        is_active = excluded.is_active,
        updated_at = CURRENT_TIMESTAMP
    `).run(
      config.phoneNumberId || '',
      config.wbaid || '',
      config.accessToken || '',
      config.verifyToken || 'wasell_webhook_token_2026',
      config.webhookUrl || 'http://127.0.0.1:3005/webhook/whatsapp',
      config.isActive ? 1 : 0
    );
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.CHANNELS_SET_ACTIVE_PROVIDER, async (_event, provider: string) => {
    db.prepare("UPDATE whatsapp_cloud_config SET active_provider = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 'default'")
      .run(provider);
    return { success: true, activeProvider: provider };
  });

  ipcMain.handle(IPC_CHANNELS.CHANNELS_TEST_CLOUD_API, async (_event, { phoneNumberId, accessToken }) => {
    return client.testConnection(phoneNumberId, accessToken);
  });

  ipcMain.handle(IPC_CHANNELS.CHANNELS_TEST_WEBHOOK, async () => {
    try {
      const res = await fetch('http://127.0.0.1:3005/webhook/status');
      const data = await res.json();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.CHANNELS_GET_WEBHOOK_LOGS, async () => {
    const rows = db.prepare('SELECT id, event_type, processed, created_at, payload_json FROM inbound_events_queue ORDER BY created_at DESC LIMIT 25').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      timestamp: r.created_at,
      event: r.event_type,
      status: r.processed ? 'success' : 'pending',
      payloadSnippet: (r.payload_json || '').slice(0, 100),
    }));
  });
}

