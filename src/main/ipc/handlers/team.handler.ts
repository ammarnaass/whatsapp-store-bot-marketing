import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { hashPassword, verifyPassword } from '../../auth/auth-crypto';

export function registerTeamHandlers(db: Database.Database): void {
  // 1. تعديل الملف الشخصي
  ipcMain.handle(IPC_CHANNELS.AUTH_UPDATE_PROFILE, async (_event, { userId, name, phone, avatar }) => {
    db.prepare(`
      UPDATE users SET name = coalesce(?, name), phone = coalesce(?, phone), avatar = coalesce(?, avatar), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name?.trim() || null, phone?.trim() || null, avatar || null, userId);
    return { success: true, user: db.prepare('SELECT id, email, name, role, permissions, phone, avatar, status FROM users WHERE id = ?').get(userId) };
  });

  // 2. تغيير كلمة المرور الذاتية للمستخدم
  ipcMain.handle(IPC_CHANNELS.AUTH_CHANGE_PASSWORD, async (_event, { userId, oldPassword, newPassword }) => {
    const user = db.prepare('SELECT password_hash, salt FROM users WHERE id = ?').get(userId) as any;
    if (!user) return { success: false, error: 'المستخدم غير موجود' };
    if (!verifyPassword(oldPassword, user.password_hash, user.salt)) {
      return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
    }
    const { hash, salt } = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hash, salt, userId);
    return { success: true };
  });

  // 3. قائمة أعضاء الفريق والحسابات الفرعية
  ipcMain.handle(IPC_CHANNELS.AUTH_LIST_USERS, async () => {
    const rows = db.prepare('SELECT id, email, name, role, permissions, phone, avatar, status, created_by, last_login_at, created_at FROM users ORDER BY created_at ASC').all() as any[];
    return rows.map((u) => {
      let permissions = ['*'];
      try {
        if (u.permissions) permissions = JSON.parse(u.permissions);
        else if (u.role !== 'owner') permissions = ['inbox', 'catalog', 'orders'];
      } catch {
        permissions = u.role === 'owner' ? ['*'] : ['inbox'];
      }
      return { ...u, permissions };
    });
  });

  // 4. إنشاء حساب فرعي جديد لموظف
  ipcMain.handle(IPC_CHANNELS.AUTH_CREATE_USER, async (_event, { email, name, password, role, permissions, phone, creatorId }) => {
    if (!email || !name || !password) return { success: false, error: 'يرجى إدخال الاسم والبريد وكلمة المرور' };
    const cleanEmail = email.trim().toLowerCase();
    if (db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(cleanEmail)) {
      return { success: false, error: 'البريد الإلكتروني مسجل مسبقاً' };
    }
    const { hash, salt } = hashPassword(password);
    const userId = `usr_staff_${Date.now()}`;
    const permString = JSON.stringify(permissions && permissions.length > 0 ? permissions : ['inbox', 'catalog', 'orders']);
    db.prepare(`
      INSERT INTO users (id, email, name, password_hash, salt, role, permissions, phone, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
    `).run(userId, cleanEmail, name.trim(), hash, salt, role || 'sales', permString, phone?.trim() || null, creatorId || null);
    return { success: true, id: userId };
  });

  // 5. تعديل بيانات وصلاحيات حساب فرعي
  ipcMain.handle(IPC_CHANNELS.AUTH_UPDATE_USER, async (_event, { userId, name, role, permissions, phone, status }) => {
    if (!userId) return { success: false, error: 'معرف المستخدم غير محدد' };
    const permString = permissions ? JSON.stringify(permissions) : undefined;
    db.prepare(`
      UPDATE users SET
        name = coalesce(?, name), role = coalesce(?, role), permissions = coalesce(?, permissions),
        phone = coalesce(?, phone), status = coalesce(?, status), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name?.trim() || null, role || null, permString || null, phone?.trim() || null, status || null, userId);
    return { success: true };
  });

  // 6. تعليق أو تفعيل حساب فرعي
  ipcMain.handle(IPC_CHANNELS.AUTH_TOGGLE_USER_STATUS, async (_event, { userId, status }) => {
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId) as any;
    if (!user) return { success: false, error: 'المستخدم غير موجود' };
    if (user.role === 'owner' && status === 'suspended') {
      return { success: false, error: 'لا يمكن تعليق حساب مالك المتجر الرئيسي' };
    }
    db.prepare('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, userId);
    if (status === 'suspended') {
      db.prepare('UPDATE user_sessions SET is_active = 0 WHERE user_id = ?').run(userId);
    }
    return { success: true, status };
  });

  // 7. إعادة تعيين كلمة مرور موظف بواسطة المدير
  ipcMain.handle(IPC_CHANNELS.AUTH_ADMIN_RESET_PASSWORD, async (_event, { userId, newPassword }) => {
    if (!userId || !newPassword || newPassword.length < 6) {
      return { success: false, error: 'كلمة المرور يجب أن لا تقل عن 6 خانات' };
    }
    const { hash, salt } = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hash, salt, userId);
    db.prepare('UPDATE user_sessions SET is_active = 0 WHERE user_id = ?').run(userId);
    return { success: true };
  });

  // 8. حذف حساب فرعي
  ipcMain.handle(IPC_CHANNELS.AUTH_DELETE_USER, async (_event, { userId }) => {
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId) as any;
    if (!user) return { success: false, error: 'المستخدم غير موجود' };
    if (user.role === 'owner') {
      const owners = (db.prepare("SELECT count(*) as count FROM users WHERE role = 'owner'").get() as any)?.count || 0;
      if (owners <= 1) return { success: false, error: 'لا يمكن حذف مالك المتجر الوحيد' };
    }
    db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    return { success: true };
  });
}
