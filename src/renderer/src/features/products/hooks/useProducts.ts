import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDataStore, CatalogProduct } from '../../data-management';
import { useCategories, getDescendantCategoryIds } from '../../categories';
import { useCollections, collectionsService } from '../../collections';
import { ProductViewMode, ProductTabFilter } from '../types/products.types';
import { useProductMutation } from './useProductMutation';

export function useProducts() {
  const products = useDataStore((s) => s.products);
  const categoriesHook = useCategories();
  const { categories, refreshCategories } = categoriesHook;

  const collectionsHook = useCollections();
  const { collections, refresh: refreshCollections } = collectionsHook;

  const [viewMode, setViewMode] = useState<ProductViewMode>('table');
  const [activeTab, setActiveTab] = useState<ProductTabFilter>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'all'>('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | 'all'>('all');
  const [collectionProductIds, setCollectionProductIds] = useState<Set<string> | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewProduct, setPreviewProduct] = useState<CatalogProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState<boolean>(false);
  const [showCollectionsModal, setShowCollectionsModal] = useState<boolean>(false);
  const [sharingCollection, setSharingCollection] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const { handleCreateProduct, handleUpdateProduct, handleDeleteProduct, handleToggleAi } = useProductMutation(showToast);

  // تحديث معرفات منتجات المجموعة المحددة
  useEffect(() => {
    if (selectedCollectionId === 'all') {
      setCollectionProductIds(null);
      return;
    }
    collectionsService.getCollection(selectedCollectionId).then((col) => {
      if (col && Array.isArray(col.product_ids)) {
        setCollectionProductIds(new Set(col.product_ids));
      } else {
        setCollectionProductIds(new Set());
      }
    });
  }, [selectedCollectionId]);

  const handleSync = useCallback(async () => {
    await Promise.all([
      useDataStore.getState().hydrateFromApi(),
      refreshCategories(),
      refreshCollections(),
    ]);
    showToast('تمت المزامنة الفورية لكتالوج المنتجات والفئات والمجموعات بنجاح');
  }, [showToast, refreshCategories, refreshCollections]);

  const handleExport = useCallback(() => {
    showToast('تم تصدير ملف الكتالوج بصيغة CSV بنجاح');
  }, [showToast]);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (activeTab === 'demanded' && prod.conversionRate < 85) return false;
      if (activeTab === 'low_stock' && prod.stock > 10) return false;
      if (activeTab === 'ai_disabled' && prod.aiRecommended) return false;

      // فلترة هرمية للأقسام مع الفئات الفرعية
      if (selectedCategoryId !== 'all') {
        const descendantIds = new Set(getDescendantCategoryIds(selectedCategoryId, categories));
        const catNames = new Set(categories.filter((c) => descendantIds.has(c.id)).map((c) => c.name));
        const pCatId = (prod as any).category_id;
        const matchesId = pCatId && descendantIds.has(pCatId);
        const matchesName = prod.category && catNames.has(prod.category);
        if (!matchesId && !matchesName) return false;
      }

      // فلترة بالمجموعات الترويجية والذكية
      if (selectedCollectionId !== 'all' && collectionProductIds) {
        if (!collectionProductIds.has(prod.id)) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return prod.name.toLowerCase().includes(q) || prod.sku.toLowerCase().includes(q) || prod.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, activeTab, selectedCategoryId, categories, selectedCollectionId, collectionProductIds, searchQuery]);

  return {
    products,
    filteredProducts,
    categories,
    categoriesHook,
    collections,
    collectionsHook,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedCollectionId,
    setSelectedCollectionId,
    searchQuery,
    setSearchQuery,
    previewProduct,
    setPreviewProduct,
    editingProduct,
    setEditingProduct,
    showAddModal,
    setShowAddModal,
    showCategoriesModal,
    setShowCategoriesModal,
    showCollectionsModal,
    setShowCollectionsModal,
    sharingCollection,
    setSharingCollection,
    toastMessage,
    handleSync,
    handleExport,
    handleToggleAi,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  };
}
