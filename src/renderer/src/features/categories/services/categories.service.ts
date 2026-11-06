import { api } from '../../../api-bridge';
import { Category, CategoryFormData } from '../types/category.types';

function getCategoryApi() {
  if (typeof window !== 'undefined') {
    if (window.electronAPI?.categories) return window.electronAPI.categories;
    if ((window as any).api?.categories) return (window as any).api.categories;
  }
  return api?.categories;
}

export const categoriesService = {
  async fetchCategories(): Promise<Category[]> {
    try {
      const catApi = getCategoryApi();
      if (catApi?.listCategories) {
        return await catApi.listCategories();
      }
      return [];
    } catch (err) {
      console.error('[CategoriesService] Failed to fetch categories:', err);
      return [];
    }
  },

  async createCategory(data: CategoryFormData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const catApi = getCategoryApi();
      if (!catApi?.createCategory) {
        console.warn('[CategoriesService] Category API unavailable');
        return { success: false, error: 'واجهة إضافة الفئات غير متاحة حالياً' };
      }
      return await catApi.createCategory(data);
    } catch (err: any) {
      console.error('[CategoriesService] Failed to create category:', err);
      return { success: false, error: err?.message || 'فشل إضافة الفئة' };
    }
  },

  async updateCategory(data: CategoryFormData & { id: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const catApi = getCategoryApi();
      if (!catApi?.updateCategory) return { success: false, error: 'واجهة تحديث الفئات غير متاحة' };
      return await catApi.updateCategory(data);
    } catch (err: any) {
      console.error('[CategoriesService] Failed to update category:', err);
      return { success: false, error: err?.message || 'فشل تحديث الفئة' };
    }
  },

  async deleteCategory(id: string, reassignToId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const catApi = getCategoryApi();
      if (!catApi?.deleteCategory) return { success: false, error: 'واجهة حذف الفئات غير متاحة' };
      return await catApi.deleteCategory({ id, reassignToId });
    } catch (err: any) {
      console.error('[CategoriesService] Failed to delete category:', err);
      return { success: false, error: err?.message || 'فشل حذف الفئة' };
    }
  },

  async reorderCategories(ids: string[]): Promise<{ success: boolean }> {
    try {
      const catApi = getCategoryApi();
      if (!catApi?.reorderCategories) return { success: false };
      return await catApi.reorderCategories(ids);
    } catch (err) {
      console.error('[CategoriesService] Failed to reorder categories:', err);
      return { success: false };
    }
  },
};
