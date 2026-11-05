import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

export function registerKnowledgeHandlers(db: Database.Database): void {
  // 1. سرد مصادر وعناصر المعرفة
  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_LIST, async (_e, f?: { category?: string; source_type?: string; search?: string }) => {
    let sql = 'SELECT * FROM knowledge_items WHERE 1=1';
    const params: any[] = [];
    if (f?.category && f.category !== 'all') { sql += ' AND category = ?'; params.push(f.category); }
    if (f?.source_type && f.source_type !== 'all') { sql += ' AND source_type = ?'; params.push(f.source_type); }
    if (f?.search?.trim()) {
      sql += ' AND (title LIKE ? OR content LIKE ? OR summary LIKE ?)';
      const q = `%${f.search.trim()}%`;
      params.push(q, q, q);
    }
    sql += ' ORDER BY priority DESC, updated_at DESC';
    return db.prepare(sql).all(...params).map((r: any) => ({
      ...r,
      active: Boolean(r.active),
      tokens_count: Number(r.tokens_count || Math.ceil((r.content?.length || 0) / 3.5)),
      hit_count: Number(r.hit_count || 0),
      priority: Number(r.priority || 3),
    }));
  });

  // 2. جلب عنصر واحد
  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_GET, async (_e, { id }) => {
    const row = db.prepare('SELECT * FROM knowledge_items WHERE id = ?').get(id) as any;
    return row ? { ...row, active: Boolean(row.active) } : null;
  });

  // 3. إنشاء مصدر معرفة
  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_CREATE, async (_e, item) => {
    const id = `kb_${Date.now()}`;
    const tokens = Math.ceil(((item.content || '').length + (item.title || '').length) / 3.5);
    db.prepare(`
      INSERT INTO knowledge_items (id, title, category, source_type, content, summary, source_url, file_path, tokens_count, priority, active, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, item.title.trim(), item.category || 'general', item.source_type || 'text_faq',
      item.content.trim(), item.summary?.trim() || null, item.source_url?.trim() || null,
      item.file_path?.trim() || null, tokens, Number(item.priority || 3), item.active !== false ? 1 : 0, item.source || 'OWNER_INPUT'
    );
    return { success: true, id };
  });

  // 4. تعديل مصدر معرفة
  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_UPDATE, async (_e, item) => {
    const tokens = Math.ceil(((item.content || '').length + (item.title || '').length) / 3.5);
    db.prepare(`
      UPDATE knowledge_items SET
        title = ?, category = ?, source_type = ?, content = ?, summary = ?,
        source_url = ?, file_path = ?, tokens_count = ?, priority = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      item.title.trim(), item.category || 'general', item.source_type || 'text_faq',
      item.content.trim(), item.summary?.trim() || null, item.source_url?.trim() || null,
      item.file_path?.trim() || null, tokens, Number(item.priority || 3), item.active !== false ? 1 : 0, item.id
    );
    return { success: true };
  });

  // 5. حذف وتفعيل
  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_DELETE, async (_e, { id }) => {
    db.prepare('DELETE FROM knowledge_items WHERE id = ?').run(id);
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_TOGGLE_ACTIVE, async (_e, { id, active }) => {
    db.prepare('UPDATE knowledge_items SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(active ? 1 : 0, id);
    return { success: true };
  });

  // 6. الإحصائيات
  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_GET_STATS, async () => {
    const items = db.prepare('SELECT category, tokens_count, hit_count, active FROM knowledge_items').all() as any[];
    const byCategory: Record<string, number> = {};
    let totalTokens = 0, totalHits = 0, activeItems = 0;
    for (const it of items) {
      if (it.active) activeItems++;
      totalTokens += Number(it.tokens_count || 0);
      totalHits += Number(it.hit_count || 0);
      byCategory[it.category] = (byCategory[it.category] || 0) + 1;
    }
    return { totalItems: items.length, activeItems, totalTokens, totalHits, byCategory };
  });

  // 7. محاكي استرجاع المعرفة
  ipcMain.handle(IPC_CHANNELS.KNOWLEDGE_TEST_RETRIEVAL, async (_e, { query }: { query: string }) => {
    if (!query?.trim()) return { query: '', matchedItems: [], suggestedAnswer: '' };
    const activeItems = db.prepare('SELECT * FROM knowledge_items WHERE active = 1 ORDER BY priority DESC').all() as any[];
    const tokens = query.toLowerCase().trim().split(/\s+/).filter((t) => t.length > 2);

    const scored = activeItems.map((item) => {
      let score = 0;
      for (const t of tokens) {
        if (item.title.toLowerCase().includes(t)) score += 35;
        if ((item.summary || '').toLowerCase().includes(t)) score += 20;
        if (item.content.toLowerCase().includes(t)) score += 15;
      }
      score += (item.priority || 3) * 5;
      return { item: { ...item, active: true }, score: Math.min(100, score) };
    }).filter((s) => s.score > 25).sort((a, b) => b.score - a.score).slice(0, 3);

    const top = scored[0]?.item;
    const suggestedAnswer = top
      ? `استناداً إلى وثيقة (${top.title}): ${top.summary || top.content.slice(0, 180)}...`
      : 'لم يتم العثور على وثيقة مطابقة بدقة كافية. سيجيب الوكيل وفق سياق المحادثة.';
    return { query, matchedItems: scored, suggestedAnswer };
  });
}
