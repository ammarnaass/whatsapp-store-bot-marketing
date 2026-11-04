import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

export function registerKnowledgeHandlers(db: Database.Database): void {
  // سرد عناصر بنك المعرفة
  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_LIST, async () => {
    return db.prepare('SELECT * FROM knowledge_items ORDER BY updated_at DESC').all();
  });

  // إضافة عنصر معرفي جديد
  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_CREATE, async (_event, item) => {
    const id = `kb_${Date.now()}`;
    db.prepare(`
      INSERT INTO knowledge_items (id, title, category, content, source)
      VALUES (?, ?, ?, ?, 'OWNER_INPUT')
    `).run(id, item.title, item.category || 'general', item.content);
    return { success: true, id };
  });

  // حذف عنصر معرفي
  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_DELETE, async (_event, { id }) => {
    db.prepare('DELETE FROM knowledge_items WHERE id = ?').run(id);
    return { success: true };
  });
}

