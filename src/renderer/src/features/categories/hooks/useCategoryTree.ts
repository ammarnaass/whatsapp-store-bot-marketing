import { useMemo } from 'react';
import { Category, CategoryNode } from '../types/category.types';

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const nodeMap = new Map<string, CategoryNode>();
  
  // 1. إنشاء العقد
  categories.forEach((cat) => {
    nodeMap.set(cat.id, {
      ...cat,
      children: [],
      level: 0,
    });
  });

  const roots: CategoryNode[] = [];

  // 2. الربط الهرمي بين الأب والأبناء
  categories.forEach((cat) => {
    const node = nodeMap.get(cat.id);
    if (!node) return;

    if (cat.parent_id && nodeMap.has(cat.parent_id)) {
      const parent = nodeMap.get(cat.parent_id)!;
      node.level = (parent.level || 0) + 1;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // فرز العقد بحسب sort_order
  const sortNodes = (nodes: CategoryNode[]) => {
    nodes.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);

  return roots;
}

/**
 * جلب جميع المعرفات الفرعية التابعة لفئة معينة (للفلترة الشاملة)
 */
export function getDescendantCategoryIds(categoryId: string, categories: Category[]): string[] {
  const result: string[] = [categoryId];
  const children = categories.filter((c) => c.parent_id === categoryId);
  for (const child of children) {
    result.push(...getDescendantCategoryIds(child.id, categories));
  }
  return result;
}

/**
 * جلب مسار الأجداد لفئة معينة (Breadcrumb path)
 */
export function getCategoryBreadcrumbPath(categoryId: string, categories: Category[]): Category[] {
  const path: Category[] = [];
  let current: Category | undefined = categories.find((c) => c.id === categoryId);

  while (current) {
    path.unshift(current);
    if (!current.parent_id) break;
    current = categories.find((c) => c.id === current!.parent_id);
  }

  return path;
}

export function useCategoryTree(categories: Category[]) {
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  return {
    tree,
    getDescendants: (id: string) => getDescendantCategoryIds(id, categories),
    getBreadcrumbs: (id: string) => getCategoryBreadcrumbPath(id, categories),
  };
}
