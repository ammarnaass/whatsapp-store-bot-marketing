import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

export function registerCouponsHandlers(db: Database.Database): void {
  // 1. سرد كافة الكوبونات
  ipcMain.handle(IPC_CHANNELS.COUPONS_LIST, async () => {
    return db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all();
  });

  // 2. إنشاء كوبون جديد
  ipcMain.handle(IPC_CHANNELS.COUPONS_CREATE, async (_, payload: {
    code: string;
    discount_type: 'PERCENTAGE' | 'FIXED';
    discount_value: number;
    min_order_amount?: number;
    expires_at?: string;
    max_uses?: number;
  }) => {
    const id = `coup_${Date.now()}`;
    const code = payload.code.trim().toUpperCase();
    db.prepare(`
      INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, expires_at, max_uses, times_used, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1)
    `).run(
      id,
      code,
      payload.discount_type,
      payload.discount_value,
      payload.min_order_amount || 0,
      payload.expires_at || null,
      payload.max_uses || 100
    );
    return { success: true, id };
  });

  // 3. تفعيل أو تعطيل الكوبون
  ipcMain.handle(IPC_CHANNELS.COUPONS_TOGGLE, async (_, { id, is_active }: { id: string; is_active: number }) => {
    db.prepare('UPDATE coupons SET is_active = ? WHERE id = ?').run(is_active, id);
    return { success: true };
  });

  // 4. حذف الكوبون
  ipcMain.handle(IPC_CHANNELS.COUPONS_DELETE, async (_, id: string) => {
    db.prepare('DELETE FROM coupons WHERE id = ?').run(id);
    return { success: true };
  });

  // 5. التحقق من صلاحية الكوبون وقيمته
  ipcMain.handle(IPC_CHANNELS.COUPONS_VALIDATE, async (_, { code, order_amount }: { code: string; order_amount: number }) => {
    const coupon: any = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(code.trim().toUpperCase());
    if (!coupon) {
      return { valid: false, message: 'كود الخصم غير موجود أو معطل' };
    }
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { valid: false, message: 'كود الخصم منتهي الصلاحية' };
    }
    if (coupon.times_used >= coupon.max_uses) {
      return { valid: false, message: 'وصل هذا الكود للحد الأقصى من مرات الاستخدام' };
    }
    if (order_amount < (coupon.min_order_amount || 0)) {
      return { valid: false, message: `الحد الأدنى لتطبيق هذا الكوبون هو ${coupon.min_order_amount} ر.س` };
    }

    let discount = 0;
    if (coupon.discount_type === 'PERCENTAGE') {
      discount = (order_amount * coupon.discount_value) / 100;
    } else {
      discount = Math.min(coupon.discount_value, order_amount);
    }

    return { valid: true, discount, coupon };
  });

  // 6. قائمة الحظر والانسحاب
  ipcMain.handle(IPC_CHANNELS.BLOCKLIST_LIST, async () => {
    return db.prepare('SELECT * FROM blocklist ORDER BY added_at DESC').all();
  });

  ipcMain.handle(IPC_CHANNELS.BLOCKLIST_ADD, async (_, { phone, reason }: { phone: string; reason?: string }) => {
    db.prepare('INSERT OR REPLACE INTO blocklist (phone, reason) VALUES (?, ?)').run(phone.trim(), reason || 'MANUAL');
    db.prepare('UPDATE contacts SET opted_out = 1 WHERE phone = ?').run(phone.trim());
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.BLOCKLIST_REMOVE, async (_, phone: string) => {
    db.prepare('DELETE FROM blocklist WHERE phone = ?').run(phone.trim());
    db.prepare('UPDATE contacts SET opted_out = 0 WHERE phone = ?').run(phone.trim());
    return { success: true };
  });
}

