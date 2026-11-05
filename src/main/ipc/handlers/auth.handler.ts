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

    db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
    const session = sessionManager.createSession(user.id, rememberMe !== false, deviceName);

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
    };
    return { success: true, user: safeUser, sessionToken: session.sessionToken };
  });

  // 2. إنشاء حساب تاجر جديد
  ipcMain.handle(IPC_CHANNELS.AUTH_REGISTER, async (_event, { email, name, password, phone, deviceName }) => {
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

    const session = sessionManager.createSession(userId, true, deviceName);
    const safeUser = { id: userId, email: cleanEmail, name: name.trim(), role, phone, status: 'active' };
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
    const success = sessionManager.revokeSession(sessionToken);
    return { success };
  });

  // 8. إلغاء كافة الجلسات الأخرى
  ipcMain.handle(IPC_CHANNELS.AUTH_REVOKE_ALL_SESSIONS, async (_event, { userId, keepCurrentToken }) => {
    const success = sessionManager.revokeAllUserSessions(userId, keepCurrentToken);
    return { success };
  });

  // 9. جلب المستخدم الحالي بواسطة المعرف الصريح فقط (دون تجاوز تلقائي)
  ipcMain.handle(IPC_CHANNELS.AUTH_GET_CURRENT_USER, async (_event, { userId } = {}) => {
    if (!userId) return null;
    return db.prepare('SELECT id, email, name, role, phone, avatar, status FROM users WHERE id = ?').get(userId) || null;
  });
}
