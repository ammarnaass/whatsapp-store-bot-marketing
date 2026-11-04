import { ipcMain, app } from 'electron';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

function getBackupsDir(): string {
  const userData = app ? app.getPath('userData') : process.cwd();
  const dir = path.join(userData, 'backups');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function registerBackupHandlers(db: Database.Database): void {
  // 1. إنشاء نسخة احتياطية فورية لقاعدة البيانات
  ipcMain.handle(IPC_CHANNELS.SETTINGS_CREATE_BACKUP, async () => {
    try {
      const backupsDir = getBackupsDir();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `wasell_db_backup_${timestamp}.db`;
      const targetPath = path.join(backupsDir, filename);

      await db.backup(targetPath);
      const stat = fs.statSync(targetPath);

      return {
        success: true,
        record: {
          id: filename,
          filename,
          sizeBytes: stat.size,
          sizeFormatted: formatBytes(stat.size),
          createdAt: new Date().toISOString(),
          type: 'manual',
        },
      };
    } catch (err: any) {
      console.error('[BackupHandler] Failed to create backup:', err);
      return { success: false, error: err.message };
    }
  });

  // 2. سرد كافة النسخ الاحتياطية المتوفرة
  ipcMain.handle(IPC_CHANNELS.SETTINGS_LIST_BACKUPS, async () => {
    try {
      const backupsDir = getBackupsDir();
      const files = fs.readdirSync(backupsDir).filter((f) => f.endsWith('.db') || f.endsWith('.json'));

      const list = files.map((filename) => {
        const filePath = path.join(backupsDir, filename);
        const stat = fs.statSync(filePath);
        return {
          id: filename,
          filename,
          sizeBytes: stat.size,
          sizeFormatted: formatBytes(stat.size),
          createdAt: stat.mtime.toISOString(),
          type: filename.includes('scheduled') ? 'scheduled' : 'manual',
        };
      });

      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    } catch {
      return [];
    }
  });

  // 3. حذف نسخة احتياطية سابقة
  ipcMain.handle(IPC_CHANNELS.SETTINGS_DELETE_BACKUP, async (_event, { filename }) => {
    try {
      const filePath = path.join(getBackupsDir(), path.basename(filename));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
}

