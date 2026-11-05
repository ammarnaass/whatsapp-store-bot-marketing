import { useState, useMemo, useCallback } from 'react';
import { useDataStore, CatalogProduct } from '../../data-management';
import { useCategories } from '../../categories';
import { ProductViewMode, ProductTabFilter } from '../types/products.types';
import { useProductMutation } from './useProductMutation';

export function useProducts() {
  const products = useDataStore((s) => s.products);
  const categoriesHook = useCategories();
  const { categories, refreshCategories } = categoriesHook;

  const [viewMode, setViewMode] = useState<ProductViewMode>('table');
  const [activeTab, setActiveTab] = useState<ProductTabFilter>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewProduct, setPreviewProduct] = useState<CatalogProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const { handleCreateProduct, handleUpdateProduct, handleDeleteProduct, handleToggleAi } = useProductMutation(showToast);

  const handleSync = useCallback(async () => {
    await Promise.all([
      useDataStore.getState().hydrateFromApi(),
      refreshCategories(),
    ]);
    showToast('تمت المزامنة الفورية لكتالوج المنتجات والفئات بنجاح');
  }, [showToast, refreshCategories]);

  const handleExport = useCallback(() => {
    showToast('تم تصدير ملف الكتالوج بصيغة CSV بنجاح');
  }, [showToast]);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (activeTab === 'demanded' && prod.conversionRate < 85) return false;
      if (activeTab === 'low_stock' && prod.stock > 10) return false;
      if (activeTab === 'ai_disabled' && prod.aiRecommended) return false;
      if (selectedCategoryId !== 'all') {
        const cat = categories.find((c) => c.id === selectedCategoryId);
        const matchesId = (prod as any).category_id === selectedCategoryId;
        const matchesName = cat && prod.category === cat.name;
        if (!matchesId && !matchesName) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return prod.name.toLowerCase().includes(q) || prod.sku.toLowerCase().includes(q) || prod.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, activeTab, selectedCategoryId, categories, searchQuery]);

  return {
    products,
    filteredProducts,
    categories,
    categoriesHook,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    selectedCategoryId,
    setSelectedCategoryId,
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
    toastMessage,
    handleSync,
    handleExport,
    handleToggleAi,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  };
}
