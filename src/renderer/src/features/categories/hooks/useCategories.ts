import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryFormData } from '../types/category.types';
import { categoriesService } from '../services/categories.service';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoriesService.fetchCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err?.message || 'تعذر تحميل قائمة الفئات');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const saveCategory = useCallback(async (formData: CategoryFormData): Promise<boolean> => {
    if (!formData.name.trim()) return false;
    let res: { success: boolean };
    if (formData.id) {
      res = await categoriesService.updateCategory(formData as CategoryFormData & { id: string });
    } else {
      res = await categoriesService.createCategory(formData);
    }
    if (res.success) {
      await loadCategories();
      return true;
    }
    return false;
  }, [loadCategories]);

  const removeCategory = useCallback(async (id: string, reassignToId?: string): Promise<boolean> => {
    const res = await categoriesService.deleteCategory(id, reassignToId);
    if (res.success) {
      await loadCategories();
      return true;
    }
    return false;
  }, [loadCategories]);

  const reorder = useCallback(async (newOrderIds: string[]): Promise<boolean> => {
    // التحديث الفوري المحلي لتجربة مستخدم سلسة (Optimistic update)
    setCategories((prev) => {
      const map = new Map(prev.map((c) => [c.id, c]));
      return newOrderIds.map((id) => map.get(id)).filter(Boolean) as Category[];
    });
    const res = await categoriesService.reorderCategories(newOrderIds);
    if (!res.success) {
      await loadCategories();
      return false;
    }
    return true;
  }, [loadCategories]);

  return {
    categories,
    isLoading,
    error,
    refreshCategories: loadCategories,
    saveCategory,
    removeCategory,
    reorder,
  };
}
