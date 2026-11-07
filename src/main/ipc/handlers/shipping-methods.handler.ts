import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { calculateShippingRates } from '../../../shared/shipping/calculator';

export function registerShippingMethodsHandlers(db: Database.Database): void {
  ipcMain.handle(IPC_CHANNELS.SHIPPING_LIST_ZONES, async () => {
    const zones = db.prepare(`
      SELECT z.*,
        (SELECT count(*) FROM shipping_methods m WHERE m.zone_id = z.id AND m.is_active = 1) as active_methods_count,
        (SELECT count(*) FROM shipping_methods m WHERE m.zone_id = z.id) as total_methods_count
      FROM shipping_zones z ORDER BY z.rowid DESC
    `).all() as any[];

    return zones.map((z) => {
      let cities: string[] = [], states: string[] = [];
      try { cities = JSON.parse(z.cities_json || '[]'); } catch {}
      try { states = JSON.parse(z.states_json || '[]'); } catch {}
      const methods = db.prepare('SELECT * FROM shipping_methods WHERE zone_id = ? ORDER BY is_active DESC, cost ASC').all(z.id) as any[];
      return {
        ...z,
        cities,
        states,
        scope_type: z.scope_type || 'all_states',
        is_active: Boolean(z.is_active ?? 1),
        methods: methods.map((m) => ({
          ...m,
          desk_cost: m.desk_cost != null ? Number(m.desk_cost) : null,
          delivery_type: m.delivery_type || 'both',
          is_active: Boolean(m.is_active ?? 1),
          cod_available: Boolean(m.cod_available ?? 1),
        })),
      };
    });
  });

  ipcMain.handle(IPC_CHANNELS.SHIPPING_SAVE_ZONE, async (_e, data) => {
    const id = data.id || `zone_${Date.now()}`;
    const countryCode = (data.country_code || 'SA').toUpperCase();
    const countryName = data.country_name || 'المملكة العربية السعودية';
    const scopeType = data.scope_type || 'all_states';
    const statesJson = JSON.stringify(data.states || []);
    const citiesJson = JSON.stringify(data.cities || []);
    const isActive = data.is_active === false ? 0 : 1;

    db.prepare(`
      INSERT INTO shipping_zones (id, name, country_code, country_name, scope_type, states_json, cities_json, fee, free_over, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name, country_code = excluded.country_code, country_name = excluded.country_name,
        scope_type = excluded.scope_type, states_json = excluded.states_json, cities_json = excluded.cities_json,
        fee = excluded.fee, free_over = excluded.free_over, is_active = excluded.is_active
    `).run(id, data.name, countryCode, countryName, scopeType, statesJson, citiesJson, data.fee || 0, data.freeOver ?? null, isActive);

    return { success: true, id };
  });

  ipcMain.handle(IPC_CHANNELS.SHIPPING_DELETE_ZONE, async (_e, { id }) => {
    db.transaction(() => {
      db.prepare('DELETE FROM shipping_methods WHERE zone_id = ?').run(id);
      db.prepare('DELETE FROM shipping_zones WHERE id = ?').run(id);
    })();
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.SHIPPING_LIST_METHODS, async (_e, { zoneId }) => {
    const list = db.prepare('SELECT * FROM shipping_methods WHERE zone_id = ? ORDER BY is_active DESC, cost ASC').all(zoneId) as any[];
    return list.map((m) => ({
      ...m,
      desk_cost: m.desk_cost != null ? Number(m.desk_cost) : null,
      delivery_type: m.delivery_type || 'both',
      is_active: Boolean(m.is_active ?? 1),
      cod_available: Boolean(m.cod_available ?? 1),
    }));
  });

  ipcMain.handle(IPC_CHANNELS.SHIPPING_SAVE_METHOD, async (_e, data) => {
    const id = data.id || `sm_${Date.now()}`;
    db.prepare(`
      INSERT INTO shipping_methods (
        id, zone_id, name, carrier_code, cost, desk_cost, delivery_type, currency, free_over,
        estimated_delivery, cod_available, cod_fee, tracking_url_template, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name, carrier_code = excluded.carrier_code, cost = excluded.cost,
        desk_cost = excluded.desk_cost, delivery_type = excluded.delivery_type, currency = excluded.currency,
        free_over = excluded.free_over, estimated_delivery = excluded.estimated_delivery,
        cod_available = excluded.cod_available, cod_fee = excluded.cod_fee,
        tracking_url_template = excluded.tracking_url_template, is_active = excluded.is_active
    `).run(
      id, data.zone_id, data.name, data.carrier_code || 'custom', data.cost || 0,
      data.desk_cost ?? null, data.delivery_type || 'both', data.currency || 'USD',
      data.free_over ?? null, data.estimated_delivery || '', data.cod_available ? 1 : 0,
      data.cod_fee || 0, data.tracking_url_template || '', data.is_active === false ? 0 : 1
    );
    return { success: true, id };
  });

  ipcMain.handle(IPC_CHANNELS.SHIPPING_DELETE_METHOD, async (_e, { id }) => {
    db.prepare('DELETE FROM shipping_methods WHERE id = ?').run(id);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.SHIPPING_TOGGLE_METHOD, async (_e, { id, is_active }) => {
    db.prepare('UPDATE shipping_methods SET is_active = ? WHERE id = ?').run(is_active ? 1 : 0, id);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.SHIPPING_CALCULATE_RATES, async (_e, input) => {
    const zones = db.prepare('SELECT * FROM shipping_zones WHERE is_active = 1').all() as any[];
    const methods = db.prepare('SELECT * FROM shipping_methods WHERE is_active = 1').all() as any[];
    return calculateShippingRates(zones, methods, input);
  });
}
