import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { OpenWAManager } from '../../services/openwa-manager.service';

export function registerCustomersHandlers(db: Database.Database, openwa?: OpenWAManager): void {
  // سرد بيانات العملاء
  ipcMain.handle(IPC_CHANNELS.CUSTOMERS_LIST, async () => {
    const contacts = db.prepare(`
      SELECT c.*,
             count(o.id) as orders_count,
             coalesce(sum(o.total), 0) as total_spend,
             max(o.created_at) as last_active
      FROM contacts c
      LEFT JOIN orders o ON c.id = o.contact_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all() as any[];

    return contacts.map((c) => ({
      id: c.id,
      name: c.name || 'عميل واتساب',
      phone: c.phone,
      city: (() => {
        try {
          return JSON.parse(c.address_json || '{}').city || 'الجزائر';
        } catch {
          return 'الجزائر';
        }
      })(),
      avatar: c.avatar || '',
      notes: c.notes || '',
      segment: c.tags && c.tags.includes('VIP') ? 'vip' : 'all',
      segmentLabel: c.tags && c.tags.includes('VIP') ? 'عميل VIP' : 'نشط على واتساب',
      tags: (() => {
        try {
          return JSON.parse(c.tags || '[]');
        } catch {
          return [];
        }
      })(),
      totalSpend: c.total_spend || 0,
      ordersCount: c.orders_count || 0,
      lastActive: c.last_active || c.created_at || 'الآن',
      aiSummary: c.memory_summary || 'تواصل نشط عبر واتساب',
      buyingPropensity: 85,
    }));
  });

  // جلب الملف الشامل للعميل المحدد مع سجل طلباته الحقيقية وصورته
  ipcMain.handle(IPC_CHANNELS.CUSTOMERS_GET, async (_event, { phone, contactId }) => {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    let contact: any = null;

    // 1. البحث برقم الهاتف إن توفر
    if (cleanPhone) {
      contact = db.prepare(`
        SELECT * FROM contacts WHERE phone = ? OR phone LIKE ?
      `).get(cleanPhone, `%${cleanPhone}%`) as any;
    }

    // 2. البحث بمعرف جهة الاتصال أو معرف المحادثة
    if (!contact && contactId) {
      contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(contactId) as any;

      if (!contact && contactId.startsWith('conv_')) {
        const conv = db.prepare('SELECT contact_id FROM conversations WHERE id = ?').get(contactId) as any;
        if (conv?.contact_id) {
          contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(conv.contact_id) as any;
        }
      }
    }

    if (!contact && cleanPhone) {
      // إنشاء جهة الاتصال إن لم تكن مسجلة بعد
      const newId = `cnt_${cleanPhone}`;
      db.prepare(`
        INSERT INTO contacts (id, phone, name, source)
        VALUES (?, ?, ?, 'WHATSAPP')
        ON CONFLICT(phone) DO NOTHING
      `).run(newId, cleanPhone, cleanPhone);
      contact = db.prepare('SELECT * FROM contacts WHERE phone = ?').get(cleanPhone) as any;
    }

    if (!contact) return null;

    // محاولة جلب الصورة الرمزية الحقيقية من واتساب إن لم تكن مخزنة
    if (openwa && (!contact.avatar || contact.avatar.includes('unsplash'))) {
      try {
        const livePic = await openwa.getContactProfilePicture(contact.phone);
        if (livePic) {
          db.prepare('UPDATE contacts SET avatar = ? WHERE id = ?').run(livePic, contact.id);
          contact.avatar = livePic;
        }
      } catch {
        // صامت
      }
    }

    // جلب الاسم الحقيقي من واتساب إن كان مجرد رقم
    if (openwa && (!contact.name || contact.name === contact.phone || contact.name.includes('عميل واتساب'))) {
      try {
        const liveContact = await openwa.getContactDetails(contact.phone);
        if (liveContact && liveContact.name) {
          db.prepare('UPDATE contacts SET name = ? WHERE id = ?').run(liveContact.name, contact.id);
          contact.name = liveContact.name;
        }
      } catch {
        // صامت
      }
    }

    // جلب الطلبات الفعلية الخاصة بهذا العميل
    const orders = db.prepare(`
      SELECT * FROM orders WHERE contact_id = ? ORDER BY created_at DESC
    `).all(contact.id) as any[];

    const ordersWithItems = orders.map((o) => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
      return { ...o, items };
    });

    const totalSpend = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const tags = (() => {
      try {
        return JSON.parse(contact.tags || '[]');
      } catch {
        return [];
      }
    })();

    return {
      id: contact.id,
      name: contact.name || contact.phone,
      phone: contact.phone,
      avatar: contact.avatar || '',
      notes: contact.notes || '',
      tags,
      isVip: tags.includes('VIP'),
      memorySummary: contact.memory_summary || '',
      address: (() => {
        try {
          return JSON.parse(contact.address_json || '{}');
        } catch {
          return {};
        }
      })(),
      orders: ordersWithItems,
      ordersCount: orders.length,
      totalSpend,
      createdAt: contact.created_at,
    };
  });

  // تحديث ملاحظات الموظفين الخاصة بالعميل
  ipcMain.handle(IPC_CHANNELS.CUSTOMERS_UPDATE_NOTES, async (_event, { contactId, notes }) => {
    db.prepare('UPDATE contacts SET notes = ? WHERE id = ? OR phone = ?').run(notes || '', contactId, contactId);
    return { success: true };
  });

  // تحديث وسوم العميل
  ipcMain.handle(IPC_CHANNELS.CUSTOMERS_UPDATE_TAGS, async (_event, { contactId, tags }) => {
    const tagsJson = JSON.stringify(tags || []);
    db.prepare('UPDATE contacts SET tags = ? WHERE id = ? OR phone = ?').run(tagsJson, contactId, contactId);
    return { success: true };
  });
}
