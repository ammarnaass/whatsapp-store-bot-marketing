export function mapProductRow(p: any, variants: any[] = []) {
  if (!p) return null;
  return {
    ...p,
    media: JSON.parse(p.media || '[]'),
    tags: JSON.parse(p.tags || '[]'),
    active: Boolean(p.active),
    is_featured: Boolean(p.is_featured),
    is_tax_inclusive: Boolean(p.is_tax_inclusive ?? 1),
    allow_backorders: Boolean(p.allow_backorders),
    variants: variants.map((v) => ({ ...v, options: JSON.parse(v.options_json || '{}') })),
  };
}

