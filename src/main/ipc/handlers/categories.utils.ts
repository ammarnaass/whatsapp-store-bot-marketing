import Database from 'better-sqlite3';

/**
 * تنظيف وتوليد الرمز التعريفي (Slug) مع دعم الحروف العربية والإنجليزية والأرقام
 * وفحص عدم التكرار لضمان الامتثال لقيد UNIQUE في قاعدة البيانات
 */
export function sanitizeCategorySlug(
  db: Database.Database,
  rawSlug: string | undefined,
  name: string,
  excludeId?: string
): string {
  let slug = (rawSlug?.trim() || name.trim())
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) {
    slug = `category-${Date.now()}`;
  }

  const query = excludeId
    ? 'SELECT id FROM categories WHERE slug = ? AND id != ?'
    : 'SELECT id FROM categories WHERE slug = ?';
  const existing = excludeId
    ? db.prepare(query).get(slug, excludeId)
    : db.prepare(query).get(slug);

  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  return slug;
}
