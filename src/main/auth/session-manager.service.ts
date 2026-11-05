import crypto from 'crypto';
import os from 'os';
import Database from 'better-sqlite3';
import { User, UserSession, AuthSessionValidationResult } from '../../shared/types';

export class SessionManagerService {
  constructor(private db: Database.Database) {}

  public createSession(
    userId: string,
    rememberMe = true,
    deviceName?: string,
    ipAddress?: string
  ): { sessionToken: string; expiresAt: string } {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionId = `ses_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const durationDays = rememberMe ? 30 : 1;
    const expiresDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    const expiresAt = expiresDate.toISOString();
    const finalDeviceName = deviceName || `${os.type()} (${os.hostname()})`;

    this.db.prepare(`
      INSERT INTO user_sessions (id, user_id, session_token, device_name, ip_address, expires_at, is_active, last_active_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
    `).run(sessionId, userId, sessionToken, finalDeviceName, ipAddress || '127.0.0.1', expiresAt);

    return { sessionToken, expiresAt };
  }

  public validateSession(sessionToken: string): AuthSessionValidationResult {
    if (!sessionToken || typeof sessionToken !== 'string') {
      return { valid: false, error: 'رمز الجلسة غير متوفر' };
    }

    const row = this.db.prepare(`
      SELECT s.id as session_id, s.expires_at, s.is_active,
             u.id, u.email, u.name, u.role, u.phone, u.avatar, u.status
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ?
    `).get(sessionToken) as any;

    if (!row || !row.is_active) {
      return { valid: false, error: 'انتهت صلاحية الجلسة أو تم تسجيل الخروج' };
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      this.revokeSession(sessionToken);
      return { valid: false, error: 'انتهت مدة صلاحية الجلسة، يرجى إعادة تسجيل الدخول' };
    }

    if (row.status === 'suspended') {
      return { valid: false, error: 'هذا الحساب معلق مؤقتاً' };
    }

    this.db.prepare('UPDATE user_sessions SET last_active_at = CURRENT_TIMESTAMP WHERE session_token = ?').run(sessionToken);

    const safeUser: User = {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      phone: row.phone,
      avatar: row.avatar,
      status: row.status,
    };

    return { valid: true, user: safeUser, sessionToken };
  }

  public revokeSession(sessionToken: string): boolean {
    const res = this.db.prepare('UPDATE user_sessions SET is_active = 0 WHERE session_token = ?').run(sessionToken);
    return res.changes > 0;
  }

  public revokeAllUserSessions(userId: string, keepToken?: string): boolean {
    const res = keepToken
      ? this.db.prepare('UPDATE user_sessions SET is_active = 0 WHERE user_id = ? AND session_token != ?').run(userId, keepToken)
      : this.db.prepare('UPDATE user_sessions SET is_active = 0 WHERE user_id = ?').run(userId);
    return res.changes > 0;
  }

  public listUserSessions(userId: string, currentToken?: string): UserSession[] {
    const rows = this.db.prepare(`
      SELECT id, user_id, session_token, device_name, ip_address, expires_at, is_active, last_active_at, created_at
      FROM user_sessions
      WHERE user_id = ? AND is_active = 1 AND datetime(expires_at) > datetime('now')
      ORDER BY last_active_at DESC
    `).all(userId) as any[];

    return rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      sessionToken: r.session_token,
      deviceName: r.device_name || 'جهاز غير معروف',
      ipAddress: r.ip_address,
      expiresAt: r.expires_at,
      isActive: Boolean(r.is_active),
      lastActiveAt: r.last_active_at,
      createdAt: r.created_at,
      isCurrent: r.session_token === currentToken,
    }));
  }

  public checkHasUsers(): { hasUsers: boolean; count: number } {
    const res = this.db.prepare('SELECT count(*) as count FROM users').get() as any;
    const count = Number(res?.count || 0);
    return { hasUsers: count > 0, count };
  }
}
