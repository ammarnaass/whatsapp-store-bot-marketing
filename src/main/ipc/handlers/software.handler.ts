import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

const mapSoft = (r: any) => (!r ? null : {
  ...r,
  is_active: Boolean(r.is_active),
  screenshots: JSON.parse(r.screenshots || '[]'),
  activation_guide_images: JSON.parse(r.activation_guide_images || '[]'),
});

export function registerSoftwareHandlers(db: Database.Database): void {
  // 1. استعراض قائمة البرمجيات والتراخيص
  ipcMain.handle(IPC_CHANNELS.SOFTWARE_LIST, async (_e, params?: { category?: string; query?: string }) => {
    let sql = `
      SELECT s.*, p.name as product_name, p.active as product_active, v.sku,
        (SELECT count(*) FROM license_keys k WHERE k.product_id = s.product_id AND k.status = 'available') as availableKeysCount,
        (SELECT count(*) FROM license_keys k WHERE k.product_id = s.product_id AND k.status = 'sold') as soldKeysCount
      FROM software_items s LEFT JOIN products p ON s.product_id = p.id LEFT JOIN variants v ON s.product_id = v.product_id
      WHERE 1=1
    `;
    const args: any[] = [];
    if (params?.category && params.category !== 'all') { sql += ' AND s.category = ?'; args.push(params.category); }
    if (params?.query) {
      sql += ' AND (s.software_name LIKE ? OR s.version LIKE ? OR s.category LIKE ?)';
      const q = `%${params.query}%`; args.push(q, q, q);
    }
    sql += ' ORDER BY s.created_at DESC';
    return (db.prepare(sql).all(...args) as any[]).map(mapSoft);
  });

  // 2. جلب تفاصيل برنامج محدد
  ipcMain.handle(IPC_CHANNELS.SOFTWARE_GET, async (_e, { id }: { id: string }) => {
    return mapSoft(db.prepare(`
      SELECT s.*, p.name as product_name, p.active as product_active, v.sku,
        (SELECT count(*) FROM license_keys k WHERE k.product_id = s.product_id AND k.status = 'available') as availableKeysCount,
        (SELECT count(*) FROM license_keys k WHERE k.product_id = s.product_id AND k.status = 'sold') as soldKeysCount
      FROM software_items s LEFT JOIN products p ON s.product_id = p.id LEFT JOIN variants v ON s.product_id = v.product_id WHERE s.id = ?
    `).get(id));
  });

  // 3. إضافة برنامج جديد مع المتغيرات والمفاتيح
  ipcMain.handle(IPC_CHANNELS.SOFTWARE_CREATE, async (_e, data: any) => {
    const softId = `soft_${Date.now()}`;
    const prodId = `prod_${softId}`;
    const initialKeys: string[] = (data.initialKeys || []).filter((k: string) => k?.trim());

    db.transaction(() => {
      db.prepare(`INSERT INTO products (id, name, type, description, media, category, category_id, active, cost_price, compare_at_price, tags, is_featured) VALUES (?, ?, 'digital', ?, ?, 'برمجيات وتراخيص', 'cat_digital', 1, ?, ?, ?, 1)`)
        .run(prodId, data.software_name, data.activation_instructions || '', JSON.stringify([data.cover_image || '']), data.cost_price || 0, data.compare_at_price || 0, JSON.stringify([data.category || 'برمجيات']));
      db.prepare(`INSERT INTO variants (id, product_id, sku, options_json, price, currency, stock_qty) VALUES (?, ?, ?, '{}', ?, ?, ?)`)
        .run(`var_${softId}`, prodId, `SKU-SW-${Math.floor(1000 + Math.random() * 9000)}`, data.price || 0, data.currency || 'SAR', initialKeys.length);
      db.prepare(`
        INSERT INTO software_items (id, product_id, software_name, version, category, website_url, download_url, license_type, price, compare_at_price, currency, cover_image, screenshots, activation_guide_images, activation_instructions, system_requirements, demo_url, support_contact, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `).run(softId, prodId, data.software_name, data.version || 'v1.0.0', data.category || 'عام', data.website_url || '', data.download_url || '', data.license_type || 'lifetime', data.price || 0, data.compare_at_price || 0, data.currency || 'SAR', data.cover_image || '', JSON.stringify(data.screenshots || []), JSON.stringify(data.activation_guide_images || []), data.activation_instructions || '', data.system_requirements || '', data.demo_url || '', data.support_contact || '');
      const insKey = db.prepare("INSERT INTO license_keys (id, product_id, key_code, status) VALUES (?, ?, ?, 'available')");
      initialKeys.forEach((key, idx) => insKey.run(`key_${softId}_${idx}`, prodId, key.trim()));
    })();
    return { success: true, id: softId };
  });

  // 4. تعديل بيانات البرنامج
  ipcMain.handle(IPC_CHANNELS.SOFTWARE_UPDATE, async (_e, { id, data }: { id: string; data: any }) => {
    db.prepare(`
      UPDATE software_items SET
        software_name = COALESCE(?, software_name), version = COALESCE(?, version), category = COALESCE(?, category),
        website_url = COALESCE(?, website_url), download_url = COALESCE(?, download_url), license_type = COALESCE(?, license_type),
        price = COALESCE(?, price), compare_at_price = COALESCE(?, compare_at_price), cover_image = COALESCE(?, cover_image),
        screenshots = COALESCE(?, screenshots), activation_guide_images = COALESCE(?, activation_guide_images),
        activation_instructions = COALESCE(?, activation_instructions), system_requirements = COALESCE(?, system_requirements),
        demo_url = COALESCE(?, demo_url), support_contact = COALESCE(?, support_contact), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(data.software_name, data.version, data.category, data.website_url, data.download_url, data.license_type, data.price, data.compare_at_price, data.cover_image, data.screenshots ? JSON.stringify(data.screenshots) : null, data.activation_guide_images ? JSON.stringify(data.activation_guide_images) : null, data.activation_instructions, data.system_requirements, data.demo_url, data.support_contact, id);
    return { success: true };
  });

  // 5. حذف البرنامج
  ipcMain.handle(IPC_CHANNELS.SOFTWARE_DELETE, async (_e, { id }: { id: string }) => {
    const row = db.prepare('SELECT product_id FROM software_items WHERE id = ?').get(id) as any;
    db.prepare('DELETE FROM software_items WHERE id = ?').run(id);
    if (row?.product_id) {
      db.prepare('DELETE FROM products WHERE id = ?').run(row.product_id);
      db.prepare('DELETE FROM variants WHERE product_id = ?').run(row.product_id);
      db.prepare('DELETE FROM license_keys WHERE product_id = ?').run(row.product_id);
    }
    return { success: true };
  });

  // 6. إضافة مفاتيح تفعيل
  ipcMain.handle(IPC_CHANNELS.SOFTWARE_ADD_KEYS, async (_e, { softwareId, keys }: { softwareId: string; keys: string[] }) => {
    const row = db.prepare('SELECT product_id FROM software_items WHERE id = ?').get(softwareId) as any;
    if (!row?.product_id) return { success: false, count: 0, error: 'البرنامج غير موجود' };
    const valid = keys.map((k) => k.trim()).filter(Boolean);
    const ins = db.prepare("INSERT INTO license_keys (id, product_id, key_code, status) VALUES (?, ?, ?, 'available')");
    db.transaction(() => {
      valid.forEach((k, i) => ins.run(`key_${Date.now()}_${i}`, row.product_id, k));
      db.prepare('UPDATE variants SET stock_qty = stock_qty + ? WHERE product_id = ?').run(valid.length, row.product_id);
    })();
    return { success: true, count: valid.length };
  });

  // 7. جلب مفاتيح تفعيل البرنامج
  ipcMain.handle(IPC_CHANNELS.SOFTWARE_GET_KEYS, async (_e, { softwareId }: { softwareId: string }) => {
    const row = db.prepare('SELECT product_id FROM software_items WHERE id = ?').get(softwareId) as any;
    if (!row?.product_id) return [];
    return db.prepare('SELECT * FROM license_keys WHERE product_id = ? ORDER BY status ASC, id DESC').all(row.product_id);
  });
}
