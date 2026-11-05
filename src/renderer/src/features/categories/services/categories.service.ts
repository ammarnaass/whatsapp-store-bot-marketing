import { api } from '../../../api-bridge';
import { Category, CategoryFormData } from '../types/category.types';

export const categoriesService = {
  async fetchCategories(): Promise<Category[]> {
    try {
      if (api.categories?.listCategories) {
        return await api.categories.listCategories();
      }
      return [];
    } catch (err) {
      console.error('[CategoriesService] Failed to fetch categories:', err);
      return [];
    }
  },

  async createCategory(data: CategoryFormData): Promise<{ success: boolean; id?: string }> {
    try {
      if (!api.categories?.createCategory) return { success: false };
      return await api.categories.createCategory(data);
    } catch (err) {
      console.error('[CategoriesService] Failed to create category:', err);
      return { success: false };
    }
  },

  async updateCategory(data: CategoryFormData & { id: string }): Promise<{ success: boolean }> {
    try {
      if (!api.categories?.updateCategory) return { success: false };
      return await api.categories.updateCategory(data);
    } catch (err) {
      console.error('[CategoriesService] Failed to update category:', err);
      return { success: false };
    }
  },

  async deleteCategory(id: string, reassignToId?: string): Promise<{ success: boolean }> {
    try {
      if (!api.categories?.deleteCategory) return { success: false };
      return await api.categories.deleteCategory({ id, reassignToId });
    } catch (err) {
      console.error('[CategoriesService] Failed to delete category:', err);
      return { success: false };
    }
  },

  async reorderCategories(ids: string[]): Promise<{ success: boolean }> {
    try {
      if (!api.categories?.reorderCategories) return { success: false };
      return await api.categories.reorderCategories(ids);
    } catch (err) {
      console.error('[CategoriesService] Failed to reorder categories:', err);
      return { success: false };
    }
  },
};
