import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

export function registerCollectionsHandlers(db: Database.Database): void {
  // 1. سرد المجموعات مع أعداد المنتجات المرتبطة
  ipcMain.handle(IPC_CHANNELS.COLLECTIONS_LIST, async () => {
    return db.prepare(`
      SELECT c.*, COUNT(pc.product_id) AS products_count
      FROM collections c
      LEFT JOIN product_collections pc ON pc.collection_id = c.id
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.created_at ASC
    `).all().map((c: any) => ({
      ...c,
      active: Boolean(c.active),
      is_smart: Boolean(c.is_smart),
      products_count: Number(c.products_count || 0),
    }));
  });

  // 2. جلب تفاصيل مجموعة واحدة مع قائمة معرفات منتجاتها
  ipcMain.handle(IPC_CHANNELS.COLLECTIONS_GET, async (_event, { id }) => {
    const col = db.prepare('SELECT * FROM collections WHERE id = ?').get(id) as any;
    if (!col) return null;
    const prodRows = db.prepare('SELECT product_id FROM product_collections WHERE collection_id = ?').all(id) as any[];
    return {
      ...col,
      active: Boolean(col.active),
      is_smart: Boolean(col.is_smart),
      product_ids: prodRows.map((r) => r.product_id),
    };
  });

  // 3. إنشاء مجموعة جديدة
  ipcMain.handle(IPC_CHANNELS.COLLECTIONS_CREATE, async (_event, data) => {
    const id = `col_${Date.now()}`;
    const slug = (data.slug?.trim() || `collection-${Date.now()}`).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const maxOrderRow = db.prepare('SELECT MAX(sort_order) as maxOrder FROM collections').get() as any;
    const sortOrder = Number(data.sort_order ?? (maxOrderRow?.maxOrder ? maxOrderRow.maxOrder + 1 : 1));

    const tx = db.transaction(() => {
      db.prepare(`
        INSERT INTO collections (id, name, slug, description, banner_url, icon, color, is_smart, rules_json, sort_order, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, data.name.trim(), slug, data.description?.trim() || null, data.banner_url || null,
        data.icon || 'Sparkles', data.color || '#7C3AED', data.is_smart ? 1 : 0,
        data.rules_json || '{}', sortOrder, data.active !== false ? 1 : 0
      );

      if (Array.isArray(data.product_ids) && data.product_ids.length > 0) {
        const stmt = db.prepare('INSERT OR IGNORE INTO product_collections (product_id, collection_id) VALUES (?, ?)');
        for (const pId of data.product_ids) {
          stmt.run(pId, id);
        }
      }
    });

    tx();
    return { success: true, id };
  });

  // 4. تعديل بيانات المجموعة ومنتجاتها
  ipcMain.handle(IPC_CHANNELS.COLLECTIONS_UPDATE, async (_event, data) => {
    const slug = (data.slug?.trim() || `collection-${Date.now()}`).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const tx = db.transaction(() => {
      db.prepare(`
        UPDATE collections SET
          name = ?, slug = ?, description = ?, banner_url = ?, icon = ?, color = ?,
          is_smart = ?, rules_json = ?, sort_order = ?, active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        data.name.trim(), slug, data.description?.trim() || null, data.banner_url || null,
        data.icon || 'Sparkles', data.color || '#7C3AED', data.is_smart ? 1 : 0,
        data.rules_json || '{}', Number(data.sort_order ?? 0), data.active !== false ? 1 : 0, data.id
      );

      if (Array.isArray(data.product_ids)) {
        db.prepare('DELETE FROM product_collections WHERE collection_id = ?').run(data.id);
        const stmt = db.prepare('INSERT OR IGNORE INTO product_collections (product_id, collection_id) VALUES (?, ?)');
        for (const pId of data.product_ids) {
          stmt.run(pId, data.id);
        }
      }
    });

    tx();
    return { success: true };
  });

  // 5. حذف مجموعة
  ipcMain.handle(IPC_CHANNELS.COLLECTIONS_DELETE, async (_event, { id }) => {
    const tx = db.transaction(() => {
      db.prepare('DELETE FROM product_collections WHERE collection_id = ?').run(id);
      db.prepare('DELETE FROM collections WHERE id = ?').run(id);
    });
    tx();
    return { success: true };
  });

  // 6. تعيين منتجات لمجموعة
  ipcMain.handle(IPC_CHANNELS.COLLECTIONS_ASSIGN_PRODUCTS, async (_event, { collectionId, productIds }: { collectionId: string; productIds: string[] }) => {
    const tx = db.transaction(() => {
      db.prepare('DELETE FROM product_collections WHERE collection_id = ?').run(collectionId);
      const stmt = db.prepare('INSERT OR IGNORE INTO product_collections (product_id, collection_id) VALUES (?, ?)');
      for (const pId of productIds) {
        stmt.run(pId, collectionId);
      }
    });
    tx();
    return { success: true };
  });

  // 7. جلب منتجات تابعة لمجموعة معينة
  ipcMain.handle(IPC_CHANNELS.COLLECTIONS_GET_PRODUCTS, async (_event, { collectionId }) => {
    const products = db.prepare(`
      SELECT p.*, pc.added_at as collection_added_at
      FROM products p
      INNER JOIN product_collections pc ON pc.product_id = p.id
      WHERE pc.collection_id = ?
      ORDER BY pc.added_at DESC
    `).all(collectionId) as any[];

    return products.map((p) => ({
      ...p,
      active: Boolean(p.active),
      media: p.media_json ? JSON.parse(p.media_json) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
    }));
  });
}

