import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

export function registerInventoryHandlers(db: Database.Database): void {
  // ملخص مؤشرات المخزون
  ipcMain.handle(IPC_CHANNELS.INVENTORY_GET_STOCK_SUMMARY, async () => {
    const summary = db.prepare(`
      SELECT 
        count(v.id) as total_skus,
        coalesce(sum(v.stock_qty), 0) as total_quantity,
        coalesce(sum(v.reserved_qty), 0) as reserved_quantity,
        count(case when v.stock_qty <= 5 and v.stock_qty > 0 then 1 end) as low_stock_count,
        count(case when v.stock_qty = 0 then 1 end) as out_of_stock_count
      FROM variants v
    `).get() as any;

    return {
      totalSkus: summary.total_skus || 0,
      totalQuantity: summary.total_quantity || 0,
      reservedQuantity: summary.reserved_quantity || 0,
      availableQuantity: (summary.total_quantity || 0) - (summary.reserved_quantity || 0),
      lowStockCount: summary.low_stock_count || 0,
      outOfStockCount: summary.out_of_stock_count || 0,
    };
  });

  // تعديل المخزون مع تسجيل حركة التدقيق
  ipcMain.handle(IPC_CHANNELS.INVENTORY_ADJUST_STOCK, async (_event, { variantId, changeQty, reason, orderId, createdBy }) => {
    const adjustTx = db.transaction(() => {
      const variant = db.prepare('SELECT stock_qty FROM variants WHERE id = ?').get(variantId) as any;
      if (!variant) throw new Error('المتغير المطلوب غير موجود');

      const qtyBefore = variant.stock_qty;
      const qtyAfter = Math.max(0, qtyBefore + changeQty);

      db.prepare('UPDATE variants SET stock_qty = ? WHERE id = ?').run(qtyAfter, variantId);

      db.prepare(`
        INSERT INTO inventory_logs (id, variant_id, change_qty, quantity_before, quantity_after, reason, order_id, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(`log_${Date.now()}`, variantId, changeQty, qtyBefore, qtyAfter, reason || 'MANUAL_ADJUSTMENT', orderId || null, createdBy || 'admin');

      return { success: true, quantityBefore: qtyBefore, quantityAfter: qtyAfter };
    });

    return adjustTx();
  });

  // سجل حركات وتدقيق المخزون
  ipcMain.handle(IPC_CHANNELS.INVENTORY_GET_LOGS, async (_event, params?: { variantId?: string; limit?: number }) => {
    const limit = params?.limit || 50;
    let query = `
      SELECT l.*, v.sku, p.name as product_name
      FROM inventory_logs l
      JOIN variants v ON l.variant_id = v.id
      JOIN products p ON v.product_id = p.id
    `;
    const args: any[] = [];
    if (params?.variantId) {
      query += ' WHERE l.variant_id = ?';
      args.push(params.variantId);
    }
    query += ' ORDER BY l.created_at DESC LIMIT ?';
    args.push(limit);

    return db.prepare(query).all(...args);
  });

  // جلب مفاتيح التراخيص الرقمية
  ipcMain.handle(IPC_CHANNELS.INVENTORY_GET_LICENSE_KEYS, async (_event, { productId }) => {
    return db.prepare(`
      SELECT k.*, p.name as product_name
      FROM license_keys k JOIN products p ON k.product_id = p.id
      WHERE k.product_id = ? ORDER BY k.status ASC, k.id DESC
    `).all(productId);
  });

  // إضافة دفعة مفاتيح تراخيص جديدة
  ipcMain.handle(IPC_CHANNELS.INVENTORY_ADD_LICENSE_KEYS, async (_event, { productId, keys }) => {
    const insertKey = db.prepare('INSERT INTO license_keys (id, product_id, key_code, status) VALUES (?, ?, ?, "available")');
    let count = 0;
    const batchTx = db.transaction(() => {
      for (const k of keys) {
        if (k && k.trim()) {
          insertKey.run(`key_${Date.now()}_${count}`, productId, k.trim());
          count++;
        }
      }
      // زيادة رصيد المخزون في variants للمنتج الرقمي
      db.prepare('UPDATE variants SET stock_qty = stock_qty + ? WHERE product_id = ?').run(count, productId);
    });
    batchTx();
    return { success: true, count };
  });
}

