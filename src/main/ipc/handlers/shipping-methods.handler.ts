import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

export function registerShippingMethodsHandlers(db: Database.Database): void {
  // 1. استعراض مناطق ودول الشحن مع أساليب وشركات الشحن
  ipcMain.handle(IPC_CHANNELS.SHIPPING_LIST_ZONES, async () => {
    const zones = db.prepare(`
      SELECT z.*,
        (SELECT count(*) FROM shipping_methods m WHERE m.zone_id = z.id AND m.is_active = 1) as active_methods_count,
        (SELECT count(*) FROM shipping_methods m WHERE m.zone_id = z.id) as total_methods_count
      FROM shipping_zones z ORDER BY z.created_at DESC
    `).all() as any[];

    return zones.map((z) => {
      let cities: string[] = [];
      try { cities = JSON.parse(z.cities_json || '[]'); } catch {}
      const methods = db.prepare('SELECT * FROM shipping_methods WHERE zone_id = ? ORDER BY is_active DESC, cost ASC').all(z.id) as any[];
      return {
        ...z,
        cities,
        is_active: Boolean(z.is_active ?? 1),
        methods: methods.map((m) => ({
          ...m,
          is_active: Boolean(m.is_active ?? 1),
          cod_available: Boolean(m.cod_available ?? 1),
        })),
      };
    });
  });

  // 2. حفظ / تحديث منطقة شحن
  ipcMain.handle(IPC_CHANNELS.SHIPPING_SAVE_ZONE, async (_event, data) => {
    const id = data.id || `zone_${Date.now()}`;
    const countryCode = (data.country_code || 'SA').toUpperCase();
    const countryName = data.country_name || 'المملكة العربية السعودية';
    const citiesJson = JSON.stringify(data.cities || []);
    const isActive = data.is_active === false ? 0 : 1;

    db.prepare(`
      INSERT INTO shipping_zones (id, name, country_code, country_name, cities_json, fee, free_over, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name, country_code = excluded.country_code,
        country_name = excluded.country_name, cities_json = excluded.cities_json,
        fee = excluded.fee, free_over = excluded.free_over, is_active = excluded.is_active
    `).run(id, data.name, countryCode, countryName, citiesJson, data.fee || 0, data.freeOver ?? null, isActive);

    return { success: true, id };
  });

  // 3. حذف منطقة شحن مع كافة شركاتها
  ipcMain.handle(IPC_CHANNELS.SHIPPING_DELETE_ZONE, async (_event, { id }) => {
    db.transaction(() => {
      db.prepare('DELETE FROM shipping_methods WHERE zone_id = ?').run(id);
      db.prepare('DELETE FROM shipping_zones WHERE id = ?').run(id);
    })();
    return { success: true };
  });

  // 4. جلب شركات وطرق الشحن لمنطقة محددة
  ipcMain.handle(IPC_CHANNELS.SHIPPING_LIST_METHODS, async (_event, { zoneId }) => {
    const list = db.prepare('SELECT * FROM shipping_methods WHERE zone_id = ? ORDER BY is_active DESC, cost ASC').all(zoneId) as any[];
    return list.map((m) => ({
      ...m,
      is_active: Boolean(m.is_active ?? 1),
      cod_available: Boolean(m.cod_available ?? 1),
    }));
  });

  // 5. إضافة أو تحديث شركة شحن داخل المنطقة
  ipcMain.handle(IPC_CHANNELS.SHIPPING_SAVE_METHOD, async (_event, data) => {
    const id = data.id || `sm_${Date.now()}`;
    db.prepare(`
      INSERT INTO shipping_methods (
        id, zone_id, name, carrier_code, cost, currency, free_over,
        estimated_delivery, cod_available, cod_fee, tracking_url_template, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name, carrier_code = excluded.carrier_code, cost = excluded.cost,
        currency = excluded.currency, free_over = excluded.free_over, estimated_delivery = excluded.estimated_delivery,
        cod_available = excluded.cod_available, cod_fee = excluded.cod_fee,
        tracking_url_template = excluded.tracking_url_template, is_active = excluded.is_active
    `).run(
      id, data.zone_id, data.name, data.carrier_code || 'custom', data.cost || 0,
      data.currency || 'USD', data.free_over ?? null, data.estimated_delivery || '',
      data.cod_available ? 1 : 0, data.cod_fee || 0, data.tracking_url_template || '',
      data.is_active === false ? 0 : 1
    );
    return { success: true, id };
  });

  // 6. حذف شركة شحن
  ipcMain.handle(IPC_CHANNELS.SHIPPING_DELETE_METHOD, async (_event, { id }) => {
    db.prepare('DELETE FROM shipping_methods WHERE id = ?').run(id);
    return { success: true };
  });

  // 7. تفعيل أو تعطيل شركة شحن
  ipcMain.handle(IPC_CHANNELS.SHIPPING_TOGGLE_METHOD, async (_event, { id, is_active }) => {
    db.prepare('UPDATE shipping_methods SET is_active = ? WHERE id = ?').run(is_active ? 1 : 0, id);
    return { success: true };
  });
}

