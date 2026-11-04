import { ipcMain, BrowserWindow, safeStorage } from 'electron';
import { IPC_CHANNELS } from '../../shared/ipc-channels';
import { AppDatabase } from '../database/db';
import { OpenWAManager } from '../services/openwa-manager.service';
import { AIAgentEngine } from '../agent/agent-engine';
import { WebhookServerService } from '../services/webhook-server.service';

export function registerIpcHandlers(mainWindow: BrowserWindow): void {
  const db = AppDatabase.getInstance().db;
  const openwa = OpenWAManager.getInstance();
  const agent = AIAgentEngine.getInstance();
  const webhook = WebhookServerService.getInstance();

  // بث أحداث OpenWA إلى الواجهة
  openwa.on('qr', (data) => {
    mainWindow.webContents.send(IPC_CHANNELS.SESSION_QR_EVENT, data);
  });
  openwa.on('status-changed', (data) => {
    mainWindow.webContents.send(IPC_CHANNELS.SESSION_STATUS_CHANGED, data);
  });

  // بث رسائل Webhook الجديدة إلى الواجهة
  webhook.on('new-message', (data) => {
    mainWindow.webContents.send(IPC_CHANNELS.CHAT_MESSAGE_RECEIVED_EVENT, data);
  });

  // ==========================================
  // 1. قنوات الجلسات والاتصال بواتساب (Session)
  // ==========================================
  ipcMain.handle(IPC_CHANNELS.SESSION_GET_STATUS, async () => {
    return await openwa.getStatus();
  });

  ipcMain.handle(IPC_CHANNELS.SESSION_START, async (_event, { sessionName }) => {
    return await openwa.startSession(sessionName || 'default');
  });

  ipcMain.handle(IPC_CHANNELS.SESSION_LOGOUT, async () => {
    return await openwa.logout();
  });

  ipcMain.handle(IPC_CHANNELS.SESSION_SIMULATE_PAIR, async (_event, { phone }) => {
    return await openwa.simulatePair(phone || '966501234567');
  });

  // ==========================================
  // 2. قنوات الكتالوج والمنتجات (Catalog)
  // ==========================================
  ipcMain.handle(IPC_CHANNELS.CATALOG_LIST_PRODUCTS, async () => {
    const products = db.prepare(`
      SELECT p.*, count(v.id) as variants_count, min(v.price) as min_price, max(v.price) as max_price
      FROM products p
      LEFT JOIN variants v ON p.id = v.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all() as any[];

    return products.map((p) => {
      const variants = db.prepare('SELECT * FROM variants WHERE product_id = ?').all(p.id) as any[];
      return {
        ...p,
        media: JSON.parse(p.media || '[]'),
        active: Boolean(p.active),
        variants: variants.map((v) => ({
          ...v,
          options: JSON.parse(v.options_json || '{}'),
        })),
      };
    });
  });

  ipcMain.handle(IPC_CHANNELS.CATALOG_CREATE_PRODUCT, async (_event, data) => {
    const id = `prod_${Date.now()}`;
    const createProductTx = db.transaction(() => {
      db.prepare(`
        INSERT INTO products (id, name, type, description, media, category, active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, data.name, data.type, data.description || '', JSON.stringify(data.media || []), data.category || '', 1);

      if (data.variants && data.variants.length > 0) {
        const insertVar = db.prepare(`
          INSERT INTO variants (id, product_id, sku, options_json, price, currency, stock_qty)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        for (const v of data.variants) {
          insertVar.run(
            `var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            id,
            v.sku,
            JSON.stringify(v.options || {}),
            v.price,
            v.currency || 'USD',
            v.stock_qty || 0
          );
        }
      }
    });

    createProductTx();
    return { success: true, id };
  });

  ipcMain.handle(IPC_CHANNELS.CATALOG_IMPORT_KEYS, async (_event, { productId, keys }) => {
    const insertKey = db.prepare(`
      INSERT INTO license_keys (id, product_id, key_code, status)
      VALUES (?, ?, ?, 'available')
    `);
    let count = 0;
    for (const key of keys) {
      if (key.trim()) {
        insertKey.run(`key_${Date.now()}_${count}`, productId, key.trim());
        count++;
      }
    }
    return { inserted: count };
  });

  // ==========================================
  // 3. قنوات صندوق الوارد والمحادثات (Inbox)
  // ==========================================
  ipcMain.handle(IPC_CHANNELS.CHAT_LIST_CONVERSATIONS, async () => {
    const rows = db.prepare(`
      SELECT c.*, cnt.name as contact_name, cnt.phone as contact_phone, cnt.memory_summary,
             (SELECT body FROM messages WHERE conversation_id = c.id ORDER BY ts DESC LIMIT 1) as last_message_body
      FROM conversations c
      JOIN contacts cnt ON c.contact_id = cnt.id
      ORDER BY c.last_message_at DESC
    `).all() as any[];

    return rows.map((r) => ({
      ...r,
      contact: {
        id: r.contact_id,
        name: r.contact_name,
        phone: r.contact_phone,
        memory_summary: r.memory_summary,
      },
    }));
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_GET_MESSAGES, async (_event, { conversationId }) => {
    return db.prepare(`
      SELECT * FROM messages WHERE conversation_id = ? ORDER BY ts ASC
    `).all(conversationId);
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_SEND_MESSAGE, async (_event, { conversationId, phone, body }) => {
    const isSent = await openwa.sendTextMessage(phone, body);

    const msgId = `out_${Date.now()}`;
    const status = isSent ? 'SENT' : 'FAILED';
    db.prepare(`
      INSERT INTO messages (id, conversation_id, direction, type, body, status)
      VALUES (?, ?, 'OUTBOUND', 'text', ?, ?)
    `).run(msgId, conversationId, body, status);

    db.prepare(`
      UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(conversationId);

    return { success: isSent, id: msgId, status };
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_TAKEOVER, async (_event, { conversationId }) => {
    db.prepare(`
      UPDATE conversations SET handler = 'human', state = 'waiting_human' WHERE id = ?
    `).run(conversationId);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_RETURN_TO_AGENT, async (_event, { conversationId }) => {
    db.prepare(`
      UPDATE conversations SET handler = 'agent', state = 'open' WHERE id = ?
    `).run(conversationId);
    return { success: true };
  });

  // ==========================================
  // 4. قنوات الطلبات (Orders)
  // ==========================================
  ipcMain.handle(IPC_CHANNELS.ORDERS_LIST, async () => {
    const orders = db.prepare(`
      SELECT o.*, c.name as contact_name, c.phone as contact_phone
      FROM orders o
      JOIN contacts c ON o.contact_id = c.id
      ORDER BY o.created_at DESC
    `).all() as any[];

    return orders.map((o) => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
      return {
        ...o,
        contact: { id: o.contact_id, name: o.contact_name, phone: o.contact_phone },
        items,
      };
    });
  });

  ipcMain.handle(IPC_CHANNELS.ORDERS_UPDATE_STATUS, async (_event, { orderId, status, trackingNo, trackingUrl }) => {
    db.prepare(`
      UPDATE orders SET status = ? WHERE id = ?
    `).run(status, orderId);

    if (trackingNo) {
      db.prepare(`
        INSERT INTO shipments (id, order_id, address_json, carrier, tracking_no, tracking_url, status)
        VALUES (?, ?, '{}', 'شركة الشحن', ?, ?, 'SHIPPED')
        ON CONFLICT(id) DO UPDATE SET tracking_no = ?, tracking_url = ?
      `).run(`ship_${orderId}`, orderId, trackingNo, trackingUrl || '', trackingNo, trackingUrl || '');
    }

    // إشعار تلقائي للعميل عبر واتساب عند تغيير الحالة
    const orderInfo = db.prepare(`
      SELECT o.id, o.total, c.phone
      FROM orders o JOIN contacts c ON o.contact_id = c.id WHERE o.id = ?
    `).get(orderId) as any;

    if (orderInfo) {
      let statusArabic = status;
      if (status === 'CONFIRMED') statusArabic = 'تم تأكيد طلبك وجارٍ تجهيزه';
      if (status === 'SHIPPED') statusArabic = `تم شحن طلبك برقم تتبع: ${trackingNo || ''}`;
      if (status === 'DELIVERED') statusArabic = 'تم تسليم طلبك بنجاح، نتمنى لك تجربة ممتعة!';

      await openwa.sendTextMessage(orderInfo.phone, `إشعار بخصوص طلبك #${orderId}:\n${statusArabic}`);
    }

    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.ORDERS_CREATE_MANUAL, async (_event, data) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const createTx = db.transaction(() => {
      let contact = db.prepare('SELECT id FROM contacts WHERE phone = ?').get(data.customerPhone) as any;
      let contactId = contact?.id;
      if (!contactId) {
        contactId = `cnt_${Date.now()}`;
        db.prepare(`
          INSERT INTO contacts (id, phone, name, source)
          VALUES (?, ?, ?, 'WHATSAPP')
        `).run(contactId, data.customerPhone, data.customerName);
      }

      db.prepare(`
        INSERT INTO orders (id, contact_id, source, status, payment_method, payment_status, subtotal, shipping_fee, total, notes)
        VALUES (?, ?, 'human', 'CONFIRMED', 'PAYMENT_LINK', 'PAID', ?, 0, ?, ?)
      `).run(orderId, contactId, data.price, data.price, data.notes || '');

      db.prepare(`
        INSERT INTO order_items (id, order_id, product_name, variant_desc, qty, unit_price)
        VALUES (?, ?, ?, 'طلب يدوي', 1, ?)
      `).run(`item_${Date.now()}`, orderId, data.productTitle, data.price);
    });

    createTx();
    return { success: true, id: orderId };
  });

  // ==========================================
  // 5. قنوات وكيل الذكاء الاصطناعي (AI Agent & Sandbox)
  // ==========================================
  ipcMain.handle(IPC_CHANNELS.AGENT_GET_CONFIG, async () => {
    const row = db.prepare('SELECT * FROM agent_config WHERE id = ?').get('default') as any;
    if (row && row.api_key && row.api_key.startsWith('enc:')) {
      try {
        if (safeStorage.isEncryptionAvailable()) {
          const encBuf = Buffer.from(row.api_key.slice(4), 'base64');
          row.api_key = safeStorage.decryptString(encBuf);
        }
      } catch (err) {
        console.warn('[IPC] Failed to decrypt API key via safeStorage:', err);
      }
    }
    return row;
  });

  ipcMain.handle(IPC_CHANNELS.AGENT_UPDATE_CONFIG, async (_event, config) => {
    let storedApiKey = config.api_key || '';
    if (storedApiKey && !storedApiKey.startsWith('enc:')) {
      try {
        if (safeStorage.isEncryptionAvailable()) {
          const enc = safeStorage.encryptString(storedApiKey);
          storedApiKey = `enc:${enc.toString('base64')}`;
        }
      } catch (err) {
        console.warn('[IPC] safeStorage encryption unavailable, storing plaintext fallback:', err);
      }
    }

    db.prepare(`
      UPDATE agent_config SET
        persona_name = ?,
        tone = ?,
        system_instructions = ?,
        max_discount_percent = ?,
        max_order_amount_auto = ?,
        daily_cost_limit = ?,
        model_name = ?,
        api_key = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 'default'
    `).run(
      config.persona_name,
      config.tone,
      config.system_instructions,
      config.max_discount_percent,
      config.max_order_amount_auto,
      config.daily_cost_limit,
      config.model_name,
      storedApiKey
    );
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.AGENT_EMERGENCY_STOP, async () => {
    db.prepare(`UPDATE sessions SET agent_mode = 'DISABLED'`).run();
    db.prepare(`UPDATE conversations SET handler = 'human', state = 'waiting_human' WHERE handler = 'agent'`).run();
    console.warn('[IPC] EMERGENCY STOP TRIGGERED: Agent disabled across all sessions.');
    return { stopped: true };
  });

  ipcMain.handle(IPC_CHANNELS.AGENT_SANDBOX_TEST, async (_event, { prompt }) => {
    return await agent.processMessage({
      conversationId: 'sandbox_test_conv',
      contactPhone: '+966500000000',
      messageText: prompt,
    });
  });

  ipcMain.handle(IPC_CHANNELS.AGENT_LIST_RUNS, async () => {
    return db.prepare(`
      SELECT * FROM agent_runs ORDER BY ts DESC LIMIT 50
    `).all();
  });

  // ==========================================
  // 6. قنوات بنك المعرفة (Knowledge Base)
  // ==========================================
  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_LIST, async () => {
    return db.prepare('SELECT * FROM knowledge_items ORDER BY updated_at DESC').all();
  });

  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_CREATE, async (_event, item) => {
    const id = `kb_${Date.now()}`;
    db.prepare(`
      INSERT INTO knowledge_items (id, title, category, content, source)
      VALUES (?, ?, ?, ?, 'OWNER_INPUT')
    `).run(id, item.title, item.category || 'general', item.content);
    return { success: true, id };
  });

  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_DELETE, async (_event, { id }) => {
    db.prepare('DELETE FROM knowledge_items WHERE id = ?').run(id);
    return { success: true };
  });

  // ==========================================
  // 7. قنوات الحملات التسويقية (Campaigns)
  // ==========================================
  ipcMain.handle(IPC_CHANNELS.CAMPAIGNS_LIST, async () => {
    const campaigns = db.prepare(`
      SELECT c.*, count(r.id) as recipients_count,
             sum(CASE WHEN r.status = 'SENT' THEN 1 ELSE 0 END) as sent_count,
             sum(CASE WHEN r.status = 'DELIVERED' THEN 1 ELSE 0 END) as delivered_count
      FROM campaigns c
      LEFT JOIN campaign_recipients r ON c.id = r.campaign_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all();
    return campaigns;
  });

  // ==========================================
  // 8. قنوات العملاء وإدارة العلاقات (CRM / Customers)
  // ==========================================
  ipcMain.handle(IPC_CHANNELS.CUSTOMERS_LIST, async () => {
    const contacts = db.prepare(`
      SELECT c.*,
             count(o.id) as orders_count,
             coalesce(sum(o.total), 0) as total_spend,
             max(o.created_at) as last_active
      FROM contacts c
      LEFT JOIN orders o ON c.id = o.contact_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all() as any[];

    return contacts.map((c) => ({
      id: c.id,
      name: c.name || 'عميل واتساب',
      phone: c.phone,
      city: (() => {
        try {
          return JSON.parse(c.address_json || '{}').city || 'الرياض';
        } catch {
          return 'الرياض';
        }
      })(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      segment: (c.tags && c.tags.includes('VIP')) ? 'vip' : 'all',
      segmentLabel: (c.tags && c.tags.includes('VIP')) ? 'عميل VIP' : 'نشط على واتساب',
      tags: (() => {
        try {
          return JSON.parse(c.tags || '[]');
        } catch {
          return [];
        }
      })(),
      totalSpend: c.total_spend || 0,
      ordersCount: c.orders_count || 0,
      lastActive: c.last_active || c.created_at || 'الآن',
      aiSummary: c.memory_summary || 'تواصل نشط عبر واتساب',
      buyingPropensity: 85,
    }));
  });

  // ==========================================
  // 9. مؤشرات لوحة التحكم (KPIs)
  // ==========================================
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
