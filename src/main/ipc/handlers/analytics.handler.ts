import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

export function registerAnalyticsHandlers(db: Database.Database): void {
  // حساب مؤشرات الأداء الحيوية للوحة التحكم
  ipcMain.handle(IPC_CHANNELS.ANALYTICS_GET_KPIS, async () => {
    const totalRevRow = db.prepare('SELECT sum(total) as rev, count(*) as cnt FROM orders').get() as any;
    const agentOrdersRow = db.prepare("SELECT count(*) as cnt FROM orders WHERE source = 'agent'").get() as any;
    const activeConvs = db.prepare("SELECT count(*) as cnt FROM conversations WHERE state = 'open'").get() as any;
    const waitingHuman = db.prepare("SELECT count(*) as cnt FROM conversations WHERE state = 'waiting_human'").get() as any;
    const lowStock = db.prepare('SELECT count(*) as cnt FROM variants WHERE stock_qty <= 5').get() as any;

    const totalRev = totalRevRow?.rev || 0;
    const totalOrders = totalRevRow?.cnt || 0;
    const agentOrders = agentOrdersRow?.cnt || 0;
    const agentPct = totalOrders > 0 ? Math.round((agentOrders / totalOrders) * 100) : 0;

    return {
      totalRevenue: totalRev,
      totalOrders,
      agentHandledOrders: agentOrders,
      agentHandledPercentage: agentPct,
      activeConversations: activeConvs?.cnt || 0,
      waitingHumanCount: waitingHuman?.cnt || 0,
      campaignsActive: 1,
      lowStockItemsCount: lowStock?.cnt || 0,
    };
  });
}

