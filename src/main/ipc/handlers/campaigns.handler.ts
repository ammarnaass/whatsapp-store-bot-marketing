import { ipcMain, BrowserWindow } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { OpenWAManager } from '../../services/openwa-manager.service';

const runningCampaigns = new Set<string>();

export function registerCampaignsHandlers(db: Database.Database, openwa?: OpenWAManager, mainWindow?: BrowserWindow): void {
  // 1. سرد الحملات التسويقية مع إحصائيات الإرسال والمستلمين
  ipcMain.handle(IPC_CHANNELS.CAMPAIGNS_LIST, async () => {
    return db.prepare(`
      SELECT c.*,
             count(r.id) as recipients_count,
             sum(CASE WHEN r.status = 'SENT' OR r.status = 'DELIVERED' THEN 1 ELSE 0 END) as sent_count,
             sum(CASE WHEN r.status = 'DELIVERED' THEN 1 ELSE 0 END) as delivered_count,
             sum(CASE WHEN r.status = 'FAILED' THEN 1 ELSE 0 END) as failed_count
      FROM campaigns c
      LEFT JOIN campaign_recipients r ON c.id = r.campaign_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all();
  });

  // 2. تقدير حجم الجمهور المستهدف وفق الفلاتر
  ipcMain.handle(IPC_CHANNELS.CAMPAIGNS_ESTIMATE_AUDIENCE, async (_, filter?: { tags?: string[]; city?: string; minOrders?: number }) => {
    const contacts = getEligibleContacts(db, filter);
    return { count: contacts.length };
  });

  // 3. إنشاء حملة تسويقية جديدة وتوليد مستلميها
  ipcMain.handle(IPC_CHANNELS.CAMPAIGNS_CREATE, async (_, payload: {
    name: string;
    template: string;
    media_path?: string;
    min_delay_sec?: number;
    max_delay_sec?: number;
    daily_limit?: number;
    audience_filter?: any;
  }) => {
    const campaignId = `camp_${Date.now()}`;
    const minDelay = payload.min_delay_sec || 20;
    const maxDelay = payload.max_delay_sec || 45;
    const dailyLimit = payload.daily_limit || 200;
    const filterJson = JSON.stringify(payload.audience_filter || {});

    db.prepare(`
      INSERT INTO campaigns (id, name, template, media_path, status, min_delay_sec, max_delay_sec, daily_limit, audience_filter)
      VALUES (?, ?, ?, ?, 'DRAFT', ?, ?, ?, ?)
    `).run(campaignId, payload.name, payload.template, payload.media_path || null, minDelay, maxDelay, dailyLimit, filterJson);

    // إضافة المستلمين المؤهلين
    const contacts = getEligibleContacts(db, payload.audience_filter);
    const insertRec = db.prepare(`
      INSERT INTO campaign_recipients (id, campaign_id, contact_id, phone, name, status)
      VALUES (?, ?, ?, ?, ?, 'PENDING')
    `);

    const insertMany = db.transaction((list: typeof contacts) => {
      for (const c of list) {
        insertRec.run(`rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, campaignId, c.id, c.phone, c.name || 'عميل المتجر');
      }
    });
    insertMany(contacts);

    return { success: true, campaignId, recipientsCount: contacts.length };
  });

  // 4. التحكم بحالة الحملة (بدء، إيقاف مؤقت، إلغاء)
  ipcMain.handle(IPC_CHANNELS.CAMPAIGNS_CONTROL, async (_, { id, action }: { id: string; action: 'START' | 'PAUSE' | 'CANCEL' }) => {
    const nextStatus = action === 'START' ? 'RUNNING' : action === 'PAUSE' ? 'PAUSED' : 'CANCELLED';
    db.prepare('UPDATE campaigns SET status = ? WHERE id = ?').run(nextStatus, id);

    if (action === 'START') {
      runningCampaigns.add(id);
      dispatchCampaignInBackground(db, id, openwa, mainWindow);
    } else {
      runningCampaigns.delete(id);
    }

    return { success: true, status: nextStatus };
  });

  // 5. حذف الحملة
  ipcMain.handle(IPC_CHANNELS.CAMPAIGNS_DELETE, async (_, id: string) => {
    runningCampaigns.delete(id);
    db.prepare('DELETE FROM campaign_recipients WHERE campaign_id = ?').run(id);
    db.prepare('DELETE FROM campaigns WHERE id = ?').run(id);
    return { success: true };
  });

  // 6. جلب مستلمي حملة معينة
  ipcMain.handle(IPC_CHANNELS.CAMPAIGNS_GET_RECIPIENTS, async (_, campaignId: string) => {
    return db.prepare('SELECT * FROM campaign_recipients WHERE campaign_id = ? ORDER BY sent_at DESC, id ASC').all(campaignId);
  });
}

function getEligibleContacts(db: Database.Database, filter?: any): Array<{ id: string; phone: string; name: string }> {
  let query = "SELECT id, phone, name FROM contacts WHERE opted_out = 0 AND phone NOT IN (SELECT phone FROM blocklist)";
  const params: any[] = [];

  if (filter?.city) {
    query += " AND address_json LIKE ?";
    params.push(`%${filter.city}%`);
  }
  return db.prepare(query).all(...params) as any[];
}

async function dispatchCampaignInBackground(db: Database.Database, campaignId: string, openwa?: OpenWAManager, mainWindow?: BrowserWindow) {
  const camp: any = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(campaignId);
  if (!camp) return;

  const pendingRecipients = db.prepare("SELECT * FROM campaign_recipients WHERE campaign_id = ? AND status = 'PENDING'").all(campaignId) as any[];

  for (const rec of pendingRecipients) {
    if (!runningCampaigns.has(campaignId)) break;

    // استبدال المتغيرات في القالب
    const text = (camp.template || '')
      .replace(/\{الاسم\}|\{name\}/gi, rec.name || 'عميلنا العزيز')
      .replace(/\{رقم_الطلب\}|\{order_id\}/gi, 'ORD-' + Math.floor(1000 + Math.random() * 9000));

    let isSuccess = true;
    let errMsg: string | undefined;

    if (openwa) {
      try {
        const res = await openwa.sendMessage({ to: rec.phone, text });
        isSuccess = res.success;
        if (!isSuccess) errMsg = res.error;
      } catch (e: any) {
        isSuccess = false;
        errMsg = e.message;
      }
    }

    db.prepare(`
      UPDATE campaign_recipients
      SET status = ?, sent_at = CURRENT_TIMESTAMP, error_message = ?
      WHERE id = ?
    `).run(isSuccess ? 'SENT' : 'FAILED', errMsg || null, rec.id);

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(IPC_CHANNELS.CAMPAIGNS_PROGRESS_EVENT, { campaignId, recipientId: rec.id, status: isSuccess ? 'SENT' : 'FAILED' });
    }

    // تأخير آمن بين الرسائل
    const delay = (camp.min_delay_sec || 2) * 1000;
    await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 3000)));
  }

  // إذا تم إرسال كافة الرسائل
  const remaining = db.prepare("SELECT count(*) as cnt FROM campaign_recipients WHERE campaign_id = ? AND status = 'PENDING'").get(campaignId) as any;
  if (remaining?.cnt === 0 && runningCampaigns.has(campaignId)) {
    db.prepare("UPDATE campaigns SET status = 'COMPLETED' WHERE id = ?").run(campaignId);
    runningCampaigns.delete(campaignId);
  }
}
