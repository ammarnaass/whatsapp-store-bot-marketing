import { BrowserWindow } from 'electron';
import { AppDatabase } from '../database/db';
import { OpenWAManager } from '../services/openwa-manager.service';
import { AIAgentEngine } from '../agent/agent-engine';
import { WebhookServerService } from '../services/webhook-server.service';

import { registerSessionHandlers } from './handlers/session.handler';
import { registerChatHandlers } from './handlers/chat.handler';
import { registerCatalogHandlers } from './handlers/catalog.handler';
import { registerCategoriesHandlers } from './handlers/categories.handler';
import { registerCollectionsHandlers } from './handlers/collections.handler';
import { registerInventoryHandlers } from './handlers/inventory.handler';
import { registerOrdersHandlers } from './handlers/orders.handler';
import { registerShippingHandlers } from './handlers/shipping.handler';
import { registerAgentHandlers } from './handlers/agent.handler';
import { registerCustomersHandlers } from './handlers/customers.handler';
import { registerKnowledgeHandlers } from './handlers/knowledge.handler';
import { registerCampaignsHandlers } from './handlers/campaigns.handler';
import { registerCouponsHandlers } from './handlers/coupons.handler';
import { registerAnalyticsHandlers } from './handlers/analytics.handler';
import { registerSettingsHandlers } from './handlers/settings.handler';
import { registerBackupHandlers } from './handlers/backup.handler';
import { registerWindowHandlers } from './handlers/window.handler';
import { registerAuthHandlers } from './handlers/auth.handler';
import { registerTelegramHandlers } from './handlers/telegram.handler';
import { registerChannelsHandlers } from './handlers/channels.handler';

/**
 * تسجيل كافة قنوات الـ IPC بشكل معياري ومنظم وفق مبادئ الهيكلية المعيارية
 */
export function registerIpcHandlers(mainWindow: BrowserWindow): void {
  const db = AppDatabase.getInstance().db;
  const openwa = OpenWAManager.getInstance();
  const agent = AIAgentEngine.getInstance();
  const webhook = WebhookServerService.getInstance();

  registerSessionHandlers(mainWindow, openwa);
  registerChatHandlers(mainWindow, db, openwa, webhook);
  registerCatalogHandlers(db);
  registerCategoriesHandlers(db);
  registerCollectionsHandlers(db);
  registerInventoryHandlers(db);
  registerOrdersHandlers(db, openwa);
  registerShippingHandlers(db, openwa);
  registerAgentHandlers(db, agent);
  registerCustomersHandlers(db, openwa);
  registerKnowledgeHandlers(db);
  registerCampaignsHandlers(db, openwa, mainWindow);
  registerCouponsHandlers(db);
  registerAnalyticsHandlers(db);
  registerSettingsHandlers(db);
  registerBackupHandlers(db);
  registerAuthHandlers(db);
  registerTelegramHandlers(mainWindow, db);
  registerChannelsHandlers(db);
  registerWindowHandlers(mainWindow);
}
