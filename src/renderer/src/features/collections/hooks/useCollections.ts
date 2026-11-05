import { useState, useEffect, useCallback } from 'react';
import { Collection, CollectionFormData } from '../types/collection.types';
import { collectionsService } from '../services/collections.service';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await collectionsService.listCollections();
      setCollections(data);
    } catch (err: any) {
      console.error('[useCollections] Failed to fetch:', err);
      setError(err?.message || 'فشل تحميل المجموعات الترويجية');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const createCollection = useCallback(async (data: CollectionFormData): Promise<boolean> => {
    try {
      const res = await collectionsService.createCollection(data);
      if (res.success) {
        await fetchCollections();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('[useCollections] Failed to create:', err);
      setError(err?.message || 'فشل إنشاء المجموعة');
      return false;
    }
  }, [fetchCollections]);

  const updateCollection = useCallback(async (data: Partial<Collection> & { id: string; product_ids?: string[] }): Promise<boolean> => {
    try {
      const res = await collectionsService.updateCollection(data);
      if (res.success) {
        await fetchCollections();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('[useCollections] Failed to update:', err);
      setError(err?.message || 'فشل تعديل المجموعة');
      return false;
    }
  }, [fetchCollections]);

  const deleteCollection = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await collectionsService.deleteCollection(id);
      if (res.success) {
        await fetchCollections();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('[useCollections] Failed to delete:', err);
      setError(err?.message || 'فشل حذف المجموعة');
      return false;
    }
  }, [fetchCollections]);

  const assignProducts = useCallback(async (collectionId: string, productIds: string[]): Promise<boolean> => {
    try {
      const res = await collectionsService.assignProducts(collectionId, productIds);
      if (res.success) {
        await fetchCollections();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('[useCollections] Failed to assign products:', err);
      return false;
    }
  }, [fetchCollections]);

  return {
    collections,
    isLoading,
    error,
    refresh: fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    assignProducts,
  };
}
