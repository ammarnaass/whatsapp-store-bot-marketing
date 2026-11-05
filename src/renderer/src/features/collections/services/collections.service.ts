import { Collection, CollectionFormData, Product } from '../types/collection.types';

export const collectionsService = {
  async listCollections(): Promise<Collection[]> {
    if (!window.electronAPI?.collections?.list) return [];
    return window.electronAPI.collections.list();
  },

  async getCollection(id: string): Promise<(Collection & { product_ids: string[] }) | null> {
    if (!window.electronAPI?.collections?.get) return null;
    return window.electronAPI.collections.get({ id });
  },

  async createCollection(data: CollectionFormData): Promise<{ success: boolean; id: string }> {
    if (!window.electronAPI?.collections?.create) {
      throw new Error('قناة إنشاء المجموعات غير متاحة');
    }
    return window.electronAPI.collections.create(data);
  },

  async updateCollection(data: Partial<Collection> & { id: string; product_ids?: string[] }): Promise<{ success: boolean }> {
    if (!window.electronAPI?.collections?.update) {
      throw new Error('قناة تحديث المجموعات غير متاحة');
    }
    return window.electronAPI.collections.update(data);
  },

  async deleteCollection(id: string): Promise<{ success: boolean }> {
    if (!window.electronAPI?.collections?.delete) {
      throw new Error('قناة حذف المجموعات غير متاحة');
    }
    return window.electronAPI.collections.delete({ id });
  },

  async assignProducts(collectionId: string, productIds: string[]): Promise<{ success: boolean }> {
    if (!window.electronAPI?.collections?.assignProducts) {
      throw new Error('قناة تعيين المنتجات غير متاحة');
    }
    return window.electronAPI.collections.assignProducts({ collectionId, productIds });
  },

  async getProducts(collectionId: string): Promise<Product[]> {
    if (!window.electronAPI?.collections?.getProducts) return [];
    return window.electronAPI.collections.getProducts({ collectionId });
  },
};

