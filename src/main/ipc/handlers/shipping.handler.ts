import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { OpenWAManager } from '../../services/openwa-manager.service';
import { registerShippingMethodsHandlers } from './shipping-methods.handler';

export function registerShippingHandlers(db: Database.Database, openwa: OpenWAManager): void {
  // تسجيل معالجات مناطق وطرق الشحن والتسعير
  registerShippingMethodsHandlers(db);

  // 1. سرد الشحنات مع تفاصيل الطلب والعميل
  ipcMain.handle(IPC_CHANNELS.SHIPPING_LIST_SHIPMENTS, async () => {
    const list = db.prepare(`
      SELECT s.*, o.id as order_number, o.total, o.payment_method, c.name as customer_name, c.phone as customer_phone
      FROM shipments s
      LEFT JOIN orders o ON s.order_id = o.id
      LEFT JOIN contacts c ON o.contact_id = c.id
      ORDER BY s.id DESC
    `).all() as any[];

    return list.map((s) => {
      let address: any = {};
      try { address = JSON.parse(s.address_json || '{}'); } catch {}
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(s.order_id);
      return { ...s, address, items };
    });
  });

  // 2. إصدار بوليصة شحن جديدة لطلب
  ipcMain.handle(IPC_CHANNELS.SHIPPING_CREATE_SHIPMENT, async (_event, data) => {
    const id = `ship_${Date.now()}`;
    const carrier = data.carrier || 'SMSA Express';
    const prefix = carrier.includes('SMSA') ? 'SMSA' : carrier.includes('Aramex') ? 'ARMX' : 'SPL';
    const trackingNo = data.trackingNo || `${prefix}-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const trackingUrl = data.trackingUrl || `https://track.wasell.store/${trackingNo}`;

    const createTx = db.transaction(() => {
      db.prepare(`
        INSERT INTO shipments (id, order_id, address_json, carrier, tracking_no, tracking_url, status, shipped_at)
        VALUES (?, ?, ?, ?, ?, ?, 'IN_TRANSIT', CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET carrier = ?, tracking_no = ?, tracking_url = ?, status = 'IN_TRANSIT'
      `).run(id, data.orderId, JSON.stringify(data.address || {}), carrier, trackingNo, trackingUrl, carrier, trackingNo, trackingUrl);

      db.prepare('UPDATE orders SET status = "SHIPPED" WHERE id = ?').run(data.orderId);
    });

    createTx();

    if (data.customerPhone) {
      const msg = `أهلاً بك! تم إصدار بوليصة الشحن لطلبك #${data.orderId} عبر (${carrier}).\n📦 رقم التتبع: ${trackingNo}\n🔗 رابط التتبع المباشر: ${trackingUrl}`;
      openwa.sendTextMessage(data.customerPhone, msg).catch(console.error);
    }

    return { success: true, id, trackingNo, trackingUrl };
  });

  // 3. تحديث حالة الشحنة وإشعار العميل
  ipcMain.handle(IPC_CHANNELS.SHIPPING_UPDATE_STATUS, async (_event, { shipmentId, status }) => {
    const updateTx = db.transaction(() => {
      if (status === 'DELIVERED') {
        db.prepare('UPDATE shipments SET status = ?, delivered_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, shipmentId);
        const ship = db.prepare('SELECT order_id FROM shipments WHERE id = ?').get(shipmentId) as any;
        if (ship?.order_id) {
          db.prepare('UPDATE orders SET status = "DELIVERED" WHERE id = ?').run(ship.order_id);
        }
      } else {
        db.prepare('UPDATE shipments SET status = ? WHERE id = ?').run(status, shipmentId);
      }
    });

    updateTx();

    const info = db.prepare(`
      SELECT s.*, c.phone as customer_phone, o.order_number
      FROM shipments s
      JOIN orders o ON s.order_id = o.id
      JOIN contacts c ON o.contact_id = c.id
      WHERE s.id = ?
    `).get(shipmentId) as any;

    if (info?.customer_phone) {
      const statusMap: Record<string, string> = {
        IN_TRANSIT: 'شحنتك الآن في الطريق مع مندوب التوصيل.',
        OUT_FOR_DELIVERY: 'مندوب الشحن في طريقه إليك لتسليم الطلب اليوم.',
        DELIVERED: 'تم تسليم شحنتك بنجاح! شكراً لتسوقك معنا.',
        RETURNED: 'تعذر تسليم الشحنة وتم تسجيلها كمرتجع.',
      };
      const text = statusMap[status] || `تحديث حالة الشحنة: ${status}`;
      openwa.sendTextMessage(info.customer_phone, `إشعار بخصوص شحنتك (${info.tracking_no}):\n${text}`).catch(console.error);
    }

    return { success: true };
  });
}
