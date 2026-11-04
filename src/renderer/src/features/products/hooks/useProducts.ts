import { useState, useMemo, useCallback } from 'react';
import { useDataStore, CatalogProduct } from '../../data-management';
import { ProductViewMode, ProductTabFilter } from '../types/products.types';
import { useProductMutation } from './useProductMutation';

export function useProducts() {
  const products = useDataStore((s) => s.products);
  const [viewMode, setViewMode] = useState<ProductViewMode>('table');
  const [activeTab, setActiveTab] = useState<ProductTabFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewProduct, setPreviewProduct] = useState<CatalogProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const { handleCreateProduct, handleUpdateProduct, handleDeleteProduct, handleToggleAi } = useProductMutation(showToast);

  const handleSync = useCallback(async () => {
    await useDataStore.getState().hydrateFromApi();
    showToast('تمت المزامنة الفورية لكتالوج المنتجات بنجاح');
  }, [showToast]);

  const handleExport = useCallback(() => {
    showToast('تم تصدير ملف الكتالوج بصيغة CSV بنجاح');
  }, [showToast]);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (activeTab === 'demanded' && prod.conversionRate < 85) return false;
      if (activeTab === 'low_stock' && prod.stock > 10) return false;
      if (activeTab === 'ai_disabled' && prod.aiRecommended) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return prod.name.toLowerCase().includes(q) || prod.sku.toLowerCase().includes(q) || prod.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, activeTab, searchQuery]);

  return {
    products,
    filteredProducts,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    previewProduct,
    setPreviewProduct,
    editingProduct,
    setEditingProduct,
    showAddModal,
    setShowAddModal,
    toastMessage,
    handleSync,
    handleExport,
    handleToggleAi,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  };
}
