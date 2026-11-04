import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { OpenWAManager } from '../../services/openwa-manager.service';

export function registerOrdersHandlers(db: Database.Database, openwa: OpenWAManager): void {
  // سرد الطلبات
  ipcMain.handle(IPC_CHANNELS.ORDERS_LIST, async () => {
    const orders = db.prepare(`
      SELECT o.*, c.name as contact_name, c.phone as contact_phone
      FROM orders o JOIN contacts c ON o.contact_id = c.id
      ORDER BY o.created_at DESC
    `).all() as any[];

    return orders.map((o) => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
      const shipment = db.prepare('SELECT * FROM shipments WHERE order_id = ?').get(o.id);
      return { ...o, contact: { id: o.contact_id, name: o.contact_name, phone: o.contact_phone }, items, shipment };
    });
  });

  // تفاصيل طلب محدد
  ipcMain.handle(IPC_CHANNELS.ORDERS_GET_DETAILS, async (_event, { orderId }) => {
    const order = db.prepare(`
      SELECT o.*, c.name as contact_name, c.phone as contact_phone, c.notes as contact_notes
      FROM orders o JOIN contacts c ON o.contact_id = c.id WHERE o.id = ?
    `).get(orderId) as any;
    if (!order) return null;

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
    const shipment = db.prepare('SELECT * FROM shipments WHERE order_id = ?').get(orderId);
    return { ...order, contact: { id: order.contact_id, name: order.contact_name, phone: order.contact_phone, notes: order.contact_notes }, items, shipment };
  });

  // تحديث حالة الطلب
  ipcMain.handle(IPC_CHANNELS.ORDERS_UPDATE_STATUS, async (_event, { orderId, status, trackingNo, trackingUrl }) => {
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);

    if (trackingNo) {
      db.prepare(`
        INSERT INTO shipments (id, order_id, address_json, carrier, tracking_no, tracking_url, status)
        VALUES (?, ?, '{}', 'شركة الشحن', ?, ?, 'SHIPPED')
        ON CONFLICT(id) DO UPDATE SET tracking_no = ?, tracking_url = ?
      `).run(`ship_${orderId}`, orderId, trackingNo, trackingUrl || '', trackingNo, trackingUrl || '');
    }

    const orderInfo = db.prepare('SELECT o.id, o.total, c.phone FROM orders o JOIN contacts c ON o.contact_id = c.id WHERE o.id = ?').get(orderId) as any;
    if (orderInfo && orderInfo.phone) {
      const map: Record<string, string> = {
        CONFIRMED: 'تم تأكيد طلبك بنجاح وجارٍ تجهيزه للبدء في الشحن.',
        PREPARING: 'طلبك الآن قيد التجهيز والتغليف بعناية.',
        SHIPPED: `تم تسليم شحنتك لشركة التوصيل! رقم التتبع: ${trackingNo || 'مرفق لاحقاً'}`,
        DELIVERED: 'تم تسليم طلبك بنجاح! يسعدنا دائماً خدمتك.',
        CANCELLED: 'تم إلغاء الطلب بناء على طلبك أو لتعذر تأكيده.',
      };
      const msg = map[status] || `تم تحديث حالة طلبك إلى: ${status}`;
      await openwa.sendTextMessage(orderInfo.phone, `إشعار بخصوص طلبك #${orderId}:\n${msg}`);
    }
    return { success: true };
  });

  // إلغاء الطلب واسترجاع المخزون
  ipcMain.handle(IPC_CHANNELS.ORDERS_CANCEL, async (_event, { orderId, reason }) => {
    const cancelTx = db.transaction(() => {
      db.prepare('UPDATE orders SET status = "CANCELLED" WHERE id = ?').run(orderId);
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId) as any[];
      for (const item of items) {
        if (item.variant_id) {
          const v = db.prepare('SELECT stock_qty FROM variants WHERE id = ?').get(item.variant_id) as any;
          if (v) {
            const before = v.stock_qty;
            const after = before + item.qty;
            db.prepare('UPDATE variants SET stock_qty = ? WHERE id = ?').run(after, item.variant_id);
            db.prepare(`
              INSERT INTO inventory_logs (id, variant_id, change_qty, quantity_before, quantity_after, reason, order_id, created_by)
              VALUES (?, ?, ?, ?, ?, 'ORDER_CANCELLED', ?, 'admin')
            `).run(`log_${Date.now()}_${item.id}`, item.variant_id, item.qty, before, after, orderId);
          }
        }
      }
    });
    cancelTx();
    return { success: true };
  });

  // إنشاء طلب يدوي وخصم المخزون
  ipcMain.handle(IPC_CHANNELS.ORDERS_CREATE_MANUAL, async (_event, data) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const createTx = db.transaction(() => {
      let contact = db.prepare('SELECT id FROM contacts WHERE phone = ?').get(data.customerPhone) as any;
      let contactId = contact?.id;
      if (!contactId) {
        contactId = `cnt_${Date.now()}`;
        db.prepare('INSERT INTO contacts (id, phone, name, source) VALUES (?, ?, ?, "WHATSAPP")').run(contactId, data.customerPhone, data.customerName);
      }

      const total = Number(data.price) || 0;
      db.prepare(`
        INSERT INTO orders (id, contact_id, source, status, payment_method, payment_status, subtotal, shipping_fee, total, notes)
        VALUES (?, ?, 'human', 'CONFIRMED', 'PAYMENT_LINK', 'PAID', ?, 0, ?, ?)
      `).run(orderId, contactId, total, total, data.notes || '');

      db.prepare(`
        INSERT INTO order_items (id, order_id, product_name, variant_desc, qty, unit_price)
        VALUES (?, ?, ?, 'طلب يدوي', 1, ?)
      `).run(`item_${Date.now()}`, orderId, data.productTitle, total);
    });

    createTx();
    return { success: true, id: orderId };
  });
}
