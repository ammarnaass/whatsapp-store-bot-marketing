import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { hashPassword, verifyPassword } from '../../auth/auth-crypto';
import { SessionManagerService } from '../../auth/session-manager.service';
import { registerTeamHandlers } from './team.handler';

export function registerAuthHandlers(db: Database.Database): void {
  const sessionManager = new SessionManagerService(db);
  registerTeamHandlers(db);

  // 1. تسجيل الدخول
  ipcMain.handle(IPC_CHANNELS.AUTH_LOGIN, async (_event, { email, password, rememberMe, deviceName }) => {
    if (!email || !password) return { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' };
    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE lower(email) = ?').get(cleanEmail) as any;
    if (!user) return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    if (user.status === 'suspended') return { success: false, error: 'هذا الحساب معلق مؤقتاً، يرجى مراجعة إدارة المتجر' };

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };

    db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
    const session = sessionManager.createSession(user.id, rememberMe !== false, deviceName);

    let permissions = ['*'];
    try {
      if (user.permissions) permissions = JSON.parse(user.permissions);
      else if (user.role !== 'owner') permissions = ['inbox', 'catalog', 'orders'];
    } catch {
      permissions = user.role === 'owner' ? ['*'] : ['inbox'];
    }

    const safeUser = {
      id: user.id, email: user.email, name: user.name, role: user.role,
      permissions, phone: user.phone, avatar: user.avatar, status: user.status,
    };
    return { success: true, user: safeUser, sessionToken: session.sessionToken };
  });

  // 2. إنشاء حساب المدير الأول وقفل التسجيل الخارجي
  ipcMain.handle(IPC_CHANNELS.AUTH_REGISTER, async (_event, { email, name, password, phone, deviceName, storeName }) => {
    if (!email || !name || !password) return { success: false, error: 'يرجى استيفاء الحقول الإلزامية' };
    const cleanEmail = email.trim().toLowerCase();
    const userCount = (db.prepare('SELECT count(*) as count FROM users').get() as any)?.count || 0;

    if (userCount > 0) {
      return { success: false, error: 'تم إغلاق التسجيل الخارجي المباشر. يرجى مراجعة مدير المتجر لإنشاء حساب فرعي لك.' };
    }

    const { hash, salt } = hashPassword(password);
    const userId = `usr_owner_${Date.now()}`;
    const role = 'owner';
    const permissions = JSON.stringify(['*']);

    db.prepare(`
      INSERT INTO users (id, email, name, password_hash, salt, role, permissions, phone, status, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP)
    `).run(userId, cleanEmail, name.trim(), hash, salt, role, permissions, phone?.trim() || null);

    if (storeName?.trim()) {
      try {
        const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('store_identity') as any;
        const current = row ? JSON.parse(row.value) : {};
        current.storeNameAr = storeName.trim();
        db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
          .run('store_identity', JSON.stringify(current));
      } catch (e) {
        console.error('[AuthHandler] Error saving store name:', e);
      }
    }

    const session = sessionManager.createSession(userId, true, deviceName);
    const safeUser = { id: userId, email: cleanEmail, name: name.trim(), role, permissions: ['*'], phone, status: 'active' };
    return { success: true, user: safeUser, sessionToken: session.sessionToken };
  });

  // 3. التحقق من صلاحية الجلسة
  ipcMain.handle(IPC_CHANNELS.AUTH_VALIDATE_SESSION, async (_event, { sessionToken }) => {
    return sessionManager.validateSession(sessionToken);
  });

  // 4. تسجيل الخروج وإلغاء الجلسة
  ipcMain.handle(IPC_CHANNELS.AUTH_LOGOUT, async (_event, { sessionToken }) => {
    if (sessionToken) sessionManager.revokeSession(sessionToken);
    return { success: true };
  });

  // 5. فحص وجود مستخدمين مسجلين (لتحديد التهيئة الأولية)
  ipcMain.handle(IPC_CHANNELS.AUTH_CHECK_HAS_USERS, async () => {
    return sessionManager.checkHasUsers();
  });

  // 6. قائمة الجلسات النشطة للمستخدم
  ipcMain.handle(IPC_CHANNELS.AUTH_LIST_SESSIONS, async (_event, { userId, currentToken }) => {
    return sessionManager.listUserSessions(userId, currentToken);
  });

  // 7. إلغاء جلسة محددة
  ipcMain.handle(IPC_CHANNELS.AUTH_REVOKE_SESSION, async (_event, { sessionToken }) => {
    return { success: sessionManager.revokeSession(sessionToken) };
  });

  // 8. إلغاء كافة الجلسات الأخرى
  ipcMain.handle(IPC_CHANNELS.AUTH_REVOKE_ALL_SESSIONS, async (_event, { userId, keepCurrentToken }) => {
    return { success: sessionManager.revokeAllUserSessions(userId, keepCurrentToken) };
  });

  // 9. جلب المستخدم الحالي
  ipcMain.handle(IPC_CHANNELS.AUTH_GET_CURRENT_USER, async (_event, { userId } = {}) => {
    if (!userId) return null;
    return db.prepare('SELECT id, email, name, role, permissions, phone, avatar, status FROM users WHERE id = ?').get(userId) || null;
  });
}
