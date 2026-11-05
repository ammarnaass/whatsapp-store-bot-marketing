import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

export function registerCategoriesHandlers(db: Database.Database): void {
  // 1. سرد الفئات مع أعداد المنتجات المرتبطة
  ipcMain.handle(IPC_CHANNELS.CATEGORIES_LIST, async () => {
    return db.prepare(`
      SELECT c.*, COUNT(p.id) AS products_count
      FROM categories c
      LEFT JOIN products p ON (p.category_id = c.id OR p.category = c.name)
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.created_at ASC
    `).all().map((c: any) => ({
      ...c,
      active: Boolean(c.active),
      products_count: Number(c.products_count || 0),
    }));
  });

  // 2. جلب فئة واحدة
  ipcMain.handle(IPC_CHANNELS.CATEGORIES_GET, async (_event, { id }) => {
    const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as any;
    if (!cat) return null;
    return { ...cat, active: Boolean(cat.active) };
  });

  // 3. إنشاء فئة جديدة
  ipcMain.handle(IPC_CHANNELS.CATEGORIES_CREATE, async (_event, data) => {
    const id = `cat_${Date.now()}`;
    const slug = (data.slug?.trim() || `category-${Date.now()}`).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const maxOrderRow = db.prepare('SELECT MAX(sort_order) as maxOrder FROM categories').get() as any;
    const sortOrder = Number(data.sort_order ?? (maxOrderRow?.maxOrder ? maxOrderRow.maxOrder + 1 : 1));

    db.prepare(`
      INSERT INTO categories (id, name, slug, description, icon, color, parent_id, sort_order, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.name.trim(),
      slug,
      data.description?.trim() || null,
      data.icon || 'Folder',
      data.color || '#128C7E',
      data.parent_id || null,
      sortOrder,
      data.active !== false ? 1 : 0
    );

    return { success: true, id };
  });

  // 4. تعديل بيانات الفئة
  ipcMain.handle(IPC_CHANNELS.CATEGORIES_UPDATE, async (_event, data) => {
    const slug = (data.slug?.trim() || `category-${Date.now()}`).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const existing = db.prepare('SELECT name FROM categories WHERE id = ?').get(data.id) as any;

    const tx = db.transaction(() => {
      db.prepare(`
        UPDATE categories SET
          name = ?, slug = ?, description = ?, icon = ?, color = ?,
          parent_id = ?, sort_order = ?, active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        data.name.trim(),
        slug,
        data.description?.trim() || null,
        data.icon || 'Folder',
        data.color || '#128C7E',
        data.parent_id || null,
        Number(data.sort_order ?? 0),
        data.active !== false ? 1 : 0,
        data.id
      );

      // إذا تغيّر اسم الفئة، حدّث اسم الفئة بالمنتجات المرتبطة
      if (existing && existing.name !== data.name.trim()) {
        db.prepare('UPDATE products SET category = ? WHERE category_id = ?').run(data.name.trim(), data.id);
      }
    });

    tx();
    return { success: true };
  });

  // 5. حذف فئة مع معالجة المنتجات المرتبطة
  ipcMain.handle(IPC_CHANNELS.CATEGORIES_DELETE, async (_event, { id, reassignToId }) => {
    const tx = db.transaction(() => {
      if (reassignToId && reassignToId !== id) {
        const targetCat = db.prepare('SELECT name FROM categories WHERE id = ?').get(reassignToId) as any;
        db.prepare('UPDATE products SET category_id = ?, category = ? WHERE category_id = ? OR category = (SELECT name FROM categories WHERE id = ?)')
          .run(reassignToId, targetCat?.name || '', id, id);
      } else {
        db.prepare('UPDATE products SET category_id = NULL WHERE category_id = ?').run(id);
      }
      db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    });

    tx();
    return { success: true };
  });

  // 6. إعادة ترتيب الفئات
  ipcMain.handle(IPC_CHANNELS.CATEGORIES_REORDER, async (_event, { ids }: { ids: string[] }) => {
    const tx = db.transaction(() => {
      const stmt = db.prepare('UPDATE categories SET sort_order = ? WHERE id = ?');
      ids.forEach((id, index) => {
        stmt.run(index + 1, id);
      });
    });
    tx();
    return { success: true };
  });
}
