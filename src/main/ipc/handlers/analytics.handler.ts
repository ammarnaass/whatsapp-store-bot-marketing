import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { AnalyticsRepository } from '../../database/analytics.repository';

export function registerAnalyticsHandlers(db: Database.Database): void {
  const repo = new AnalyticsRepository(db);

  // حساب مؤشرات الأداء الحيوية القديمة للتوافق مع لوحة التحكم العامة
  ipcMain.handle(IPC_CHANNELS.ANALYTICS_GET_KPIS, async () => {
    const summary = repo.getSummary('30d');
    const waitingHuman = db.prepare("SELECT count(*) as cnt FROM conversations WHERE state = 'waiting_human'").get() as any;
    const lowStock = db.prepare('SELECT count(*) as cnt FROM variants WHERE stock_qty <= 5').get() as any;

    return {
      totalRevenue: summary.revenue,
      totalOrders: summary.totalOrders,
      agentHandledOrders: Math.round(summary.totalOrders * (summary.automationRate / 100)),
      agentHandledPercentage: summary.automationRate,
      activeConversations: summary.activeChats,
      waitingHumanCount: waitingHuman?.cnt || 0,
      campaignsActive: 1,
      lowStockItemsCount: lowStock?.cnt || 0,
    };
  });

  // ملخص التحليلات ومؤشرات النمو
  ipcMain.handle(IPC_CHANNELS.ANALYTICS_GET_SUMMARY, async (_event, period?: string) => {
    return repo.getSummary(period);
  });

  // قمع التحويل البيعي للمحادثات
  ipcMain.handle(IPC_CHANNELS.ANALYTICS_GET_FUNNEL, async (_event, period?: string) => {
    return repo.getFunnel(period);
  });

  // ذكاء المحادثات وتصنيف النوايا والمشاعر
  ipcMain.handle(IPC_CHANNELS.ANALYTICS_GET_INTELLIGENCE, async (_event, period?: string) => {
    return repo.getIntelligence(period);
  });

  // ساعات الذروة وتوزيع النشاط
  ipcMain.handle(IPC_CHANNELS.ANALYTICS_GET_PEAK_HOURS, async () => {
    return repo.getPeakHours();
  });

  // التوصيات الذكية القابلة للتنفيذ
  ipcMain.handle(IPC_CHANNELS.ANALYTICS_GET_INSIGHTS, async () => {
    return repo.getInsights();
  });
}
