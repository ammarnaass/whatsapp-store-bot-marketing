import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { mapProductRow } from './catalog.utils';

export function registerCatalogHandlers(db: Database.Database): void {
  // 1. سرد المنتجات وتفاصيل المتغيرات والأسعار والأرباح والشحن
  ipcMain.handle(IPC_CHANNELS.CATALOG_LIST_PRODUCTS, async () => {
    const products = db.prepare(`
      SELECT p.*, count(v.id) as variants_count, min(v.price) as min_price, max(v.price) as max_price, sum(v.stock_qty) as total_stock
      FROM products p LEFT JOIN variants v ON p.id = v.product_id
      GROUP BY p.id ORDER BY p.created_at DESC
    `).all() as any[];

    return products.map((p) => {
      const variants = db.prepare('SELECT * FROM variants WHERE product_id = ?').all(p.id) as any[];
      return mapProductRow(p, variants);
    });
  });

  // 2. جلب تفاصيل منتج واحد
  ipcMain.handle(IPC_CHANNELS.CATALOG_GET_PRODUCT, async (_event, { id }) => {
    const prod = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    if (!prod) return null;
    const variants = db.prepare('SELECT * FROM variants WHERE product_id = ?').all(id) as any[];
    return mapProductRow(prod, variants);
  });

  // 3. إنشاء منتج جديد مع كامل البيانات المالية واللوجستية
  ipcMain.handle(IPC_CHANNELS.CATALOG_CREATE_PRODUCT, async (_event, data) => {
    const id = `prod_${Date.now()}`;
    const sku = data.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`;
    const createTx = db.transaction(() => {
      db.prepare(`
        INSERT INTO products (
          id, name, type, description, media, category, category_id, active,
          cost_price, compare_at_price, barcode, sku, brand,
          weight, length, width, height, shipping_type, shipping_fee,
          low_stock_threshold, tax_rate, is_tax_inclusive, tags,
          whatsapp_short_desc, is_featured, allow_backorders
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `).run(
        id, data.name, data.type || 'physical', data.description || '', JSON.stringify(data.media || []), data.category || '', data.category_id || null, 1,
        data.cost_price || 0, data.compare_at_price || 0, data.barcode || null, sku, data.brand || null,
        data.weight || 0, data.length || 0, data.width || 0, data.height || 0, data.shipping_type || 'default', data.shipping_fee || 0,
        data.low_stock_threshold || 5, data.tax_rate ?? 15, data.is_tax_inclusive ? 1 : 0, JSON.stringify(data.tags || []),
        data.whatsapp_short_desc || '', data.is_featured ? 1 : 0, data.allow_backorders ? 1 : 0
      );

      const price = Number(data.price ?? 0);
      const stock = Number(data.stock ?? 0);
      db.prepare(`
        INSERT INTO variants (id, product_id, sku, options_json, price, currency, stock_qty)
        VALUES (?, ?, ?, '{}', ?, ?, ?)
      `).run(`var_${Date.now()}`, id, sku, price, data.currency || 'USD', stock);
    });
    createTx();
    return { success: true, id };
  });

  // 4. تعديل بيانات منتج
  ipcMain.handle(IPC_CHANNELS.CATALOG_UPDATE_PRODUCT, async (_event, data) => {
    const updateTx = db.transaction(() => {
      db.prepare(`
        UPDATE products SET
          name = ?, type = ?, description = ?, category = ?, category_id = COALESCE(?, category_id), media = ?,
          cost_price = ?, compare_at_price = ?, barcode = ?, sku = ?, brand = ?,
          weight = ?, length = ?, width = ?, height = ?, shipping_type = ?, shipping_fee = ?,
          low_stock_threshold = ?, tax_rate = ?, is_tax_inclusive = ?, tags = ?,
          whatsapp_short_desc = ?, is_featured = ?, allow_backorders = ?
        WHERE id = ?
      `).run(
        data.name, data.type, data.description || '', data.category || '', data.category_id || null, JSON.stringify(data.media || []),
        data.cost_price || 0, data.compare_at_price || 0, data.barcode || null, data.sku || null, data.brand || null,
        data.weight || 0, data.length || 0, data.width || 0, data.height || 0, data.shipping_type || 'default', data.shipping_fee || 0,
        data.low_stock_threshold || 5, data.tax_rate ?? 15, data.is_tax_inclusive ? 1 : 0, JSON.stringify(data.tags || []),
        data.whatsapp_short_desc || '', data.is_featured ? 1 : 0, data.allow_backorders ? 1 : 0,
        data.id
      );

      if (data.price !== undefined || data.stock !== undefined || data.currency !== undefined) {
        db.prepare(`
          UPDATE variants SET price = COALESCE(?, price), currency = COALESCE(?, currency), stock_qty = COALESCE(?, stock_qty)
          WHERE product_id = ?
        `).run(data.price, data.currency, data.stock, data.id);
      }
    });
    updateTx();
    return { success: true };
  });

  // 5. حذف منتج
  ipcMain.handle(IPC_CHANNELS.CATALOG_DELETE_PRODUCT, async (_event, { id }) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return { success: true };
  });

  // 6. تفعيل أو تعطيل توصية الوكيل بالمنتج
  ipcMain.handle(IPC_CHANNELS.CATALOG_TOGGLE_AI, async (_event, { id, active }) => {
    db.prepare('UPDATE products SET active = ? WHERE id = ?').run(active ? 1 : 0, id);
    return { success: true };
  });

  // 7. استيراد مفاتيح التراخيص
  ipcMain.handle(IPC_CHANNELS.CATALOG_IMPORT_KEYS, async (_event, { productId, keys }) => {
    const insertKey = db.prepare("INSERT INTO license_keys (id, product_id, key_code, status) VALUES (?, ?, ?, 'available')");
    let count = 0;
    for (const key of keys) {
      if (key.trim()) {
        insertKey.run(`key_${Date.now()}_${count}`, productId, key.trim());
        count++;
      }
    }
    return { inserted: count };
  });
}
