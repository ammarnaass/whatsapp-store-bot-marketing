import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

export class OpenWAResolver {
  private lidMapCache: Map<string, string> = new Map();
  private getOpenWaDir: () => string;

  constructor(getOpenWaDir: () => string) {
    this.getOpenWaDir = getOpenWaDir;
  }

  /**
   * ترجمة معرف الشات (chatId) سواء كان LID أو رقم هاتف عادي إلى رقم هاتف نظيف
   */
  public resolveChatIdToPhone(chatId: string): string {
    if (!chatId) return '';
    const clean = chatId.trim();
    if (clean.includes('@lid')) {
      const lid = clean.replace(/@lid.*/, '');
      if (this.lidMapCache.has(lid)) {
        return this.lidMapCache.get(lid)!;
      }
      const openwaDir = this.getOpenWaDir();
      const openwaSqlitePath = path.join(openwaDir, 'data/openwa.sqlite');
      try {
        if (fs.existsSync(openwaSqlitePath)) {
          const owaDb = new Database(openwaSqlitePath, { readonly: true });
          const rows = owaDb.prepare('SELECT lid, phone FROM lid_mappings').all() as any[];
          owaDb.close();
          for (const r of rows) {
            if (r.lid && r.phone) {
              this.lidMapCache.set(String(r.lid), String(r.phone).trim());
            }
          }
          if (this.lidMapCache.has(lid)) {
            return this.lidMapCache.get(lid)!;
          }
        }
      } catch {
        // صامت
      }
      return lid;
    }
    return clean.replace(/@.*/, '').replace(/\+/g, '').trim();
  }
}

