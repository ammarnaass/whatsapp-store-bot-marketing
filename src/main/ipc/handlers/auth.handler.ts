import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { hashPassword, verifyPassword } from '../../auth/auth-crypto';

export function registerAuthHandlers(db: Database.Database): void {
  // 1. تسجيل الدخول
  ipcMain.handle(IPC_CHANNELS.AUTH_LOGIN, async (_event, { email, password }) => {
    if (!email || !password) {
      return { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE lower(email) = ?').get(cleanEmail) as any;

    if (!user) {
      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }
    if (user.status === 'suspended') {
      return { success: false, error: 'هذا الحساب معلق مؤقتاً، يرجى التواصل مع إدارة المتجر' };
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    db.prepare("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?").run(user.id);

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
    };
    return { success: true, user: safeUser };
  });

  // 2. إنشاء حساب تاجر جديد
  ipcMain.handle(IPC_CHANNELS.AUTH_REGISTER, async (_event, { email, name, password, phone }) => {
    if (!email || !name || !password) {
      return { success: false, error: 'يرجى استيفاء الحقول الإلزامية: الاسم، البريد، وكلمة المرور' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(cleanEmail);
    if (existing) {
      return { success: false, error: 'هذا البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول' };
    }

    const { hash, salt } = hashPassword(password);
    const userId = `usr_${Date.now()}`;
    const userCount = (db.prepare('SELECT count(*) as count FROM users').get() as any)?.count || 0;
    const role = userCount === 0 ? 'owner' : 'admin';

    db.prepare(`
      INSERT INTO users (id, email, name, password_hash, salt, role, phone, status, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP)
    `).run(userId, cleanEmail, name.trim(), hash, salt, role, phone?.trim() || null);

    const safeUser = { id: userId, email: cleanEmail, name: name.trim(), role, phone, status: 'active' };
    return { success: true, user: safeUser };
  });

  // 3. جلب المستخدم الحالي
  ipcMain.handle(IPC_CHANNELS.AUTH_GET_CURRENT_USER, async (_event, { userId } = {}) => {
    let user: any;
    if (userId) {
      user = db.prepare('SELECT id, email, name, role, phone, avatar, status FROM users WHERE id = ?').get(userId);
    } else {
      user = db.prepare('SELECT id, email, name, role, phone, avatar, status FROM users ORDER BY created_at ASC LIMIT 1').get();
    }
    return user || null;
  });

  // 4. تعديل الملف الشخصي
  ipcMain.handle(IPC_CHANNELS.AUTH_UPDATE_PROFILE, async (_event, { userId, name, phone, avatar }) => {
    db.prepare(`
      UPDATE users SET name = coalesce(?, name), phone = coalesce(?, phone), avatar = coalesce(?, avatar), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name?.trim() || null, phone?.trim() || null, avatar || null, userId);

    const updated = db.prepare('SELECT id, email, name, role, phone, avatar, status FROM users WHERE id = ?').get(userId);
    return { success: true, user: updated };
  });

  // 5. تغيير كلمة المرور
  ipcMain.handle(IPC_CHANNELS.AUTH_CHANGE_PASSWORD, async (_event, { userId, oldPassword, newPassword }) => {
    const user = db.prepare('SELECT password_hash, salt FROM users WHERE id = ?').get(userId) as any;
    if (!user) return { success: false, error: 'المستخدم غير موجود' };

    const isValid = verifyPassword(oldPassword, user.password_hash, user.salt);
    if (!isValid) return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };

    const { hash, salt } = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hash, salt, userId);
    return { success: true };
  });

  // 6. قائمة أعضاء الفريق
  ipcMain.handle(IPC_CHANNELS.AUTH_LIST_USERS, async () => {
    return db.prepare('SELECT id, email, name, role, phone, avatar, status, last_login_at, created_at FROM users ORDER BY created_at ASC').all();
  });

  // 7. إضافة عضو جديد للفريق
  ipcMain.handle(IPC_CHANNELS.AUTH_CREATE_USER, async (_event, { email, name, password, role, phone }) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(cleanEmail);
    if (existing) return { success: false, error: 'البريد الإلكتروني مسجل مسبقاً' };

    const { hash, salt } = hashPassword(password);
    const userId = `usr_${Date.now()}`;
    db.prepare(`
      INSERT INTO users (id, email, name, password_hash, salt, role, phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
    `).run(userId, cleanEmail, name.trim(), hash, salt, role || 'sales', phone?.trim() || null);

    return { success: true, id: userId };
  });

  // 8. حذف مستخدم
  ipcMain.handle(IPC_CHANNELS.AUTH_DELETE_USER, async (_event, { userId }) => {
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId) as any;
    if (user?.role === 'owner') {
      const ownersCount = (db.prepare("SELECT count(*) as count FROM users WHERE role = 'owner'").get() as any)?.count || 0;
      if (ownersCount <= 1) return { success: false, error: 'لا يمكن حذف مالك المتجر الوحيد' };
    }
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    return { success: true };
  });
}

