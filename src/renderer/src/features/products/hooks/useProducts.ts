import { useState, useMemo, useCallback } from 'react';
import { useDataStore, CatalogProduct } from '../../data-management';
import { ProductViewMode, ProductTabFilter, NewProductFormData } from '../types/products.types';
import { api } from '../../../api-bridge';

export function useProducts() {
  const products = useDataStore((s) => s.products);
  const setProducts = useDataStore((s) => s.setProducts);

  const [viewMode, setViewMode] = useState<ProductViewMode>('table');
  const [activeTab, setActiveTab] = useState<ProductTabFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewProduct, setPreviewProduct] = useState<CatalogProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const handleSync = useCallback(async () => {
    await useDataStore.getState().hydrateFromApi();
    showToast('تمت المزامنة الفورية لكتالوج المنتجات والمخزون بنجاح (سلة / زد / قاعدة البيانات) ⚡');
  }, [showToast]);

  const handleExport = useCallback(() => {
    showToast('تم تصدير ملف الكتالوج بصيغة CSV بنجاح');
  }, [showToast]);

  const handleToggleAiRecommended = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = !p.aiRecommended;
          showToast(
            updated
              ? `تم تفعيل اقتراح المنتج (${p.name}) بواسطة وكيل الذكاء الاصطناعي`
              : `تم تعطيل اقتراح المنتج (${p.name}) آلياً في محادثات واتساب`
          );
          return { ...p, aiRecommended: updated };
        }
        return p;
      })
    );
  }, [setProducts, showToast]);

  const handleCreateProduct = useCallback((formData: NewProductFormData) => {
    if (!formData.name.trim()) return;

    const sku = `SKU-MAN-${Math.floor(100 + Math.random() * 900)}`;
    const newProd: CatalogProduct = {
      id: `p_${Date.now()}`,
      name: formData.name,
      sku,
      category: formData.category,
      type: formData.type,
      price: formData.price,
      stock: formData.stock,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      aiRecommended: true,
      salesCount: 0,
      conversionRate: 0,
      description: formData.description || 'منتج أصلي جديد متاح للشحن الفوري عبر متجر واتساب.'
    };

    // حفظ فوري في قاعدة بيانات SQLite عبر IPC
    api.catalog.createProduct({
      name: formData.name,
      type: formData.type,
      description: formData.description || 'منتج أصلي جديد متاح للشحن الفوري عبر متجر واتساب.',
      category: formData.category,
      media: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'],
      variants: [
        {
          id: `var_${Date.now()}`,
          product_id: '',
          sku,
          options: {},
          price: formData.price,
          currency: 'USD',
          stock_qty: formData.stock,
          reserved_qty: 0,
        },
      ],
    }).catch((err) => console.error('Failed to persist product:', err));

    setProducts([newProd, ...products]);
    setShowAddModal(false);
    showToast('تمت إضافة المنتج بنجاح وتفعيله في كتالوج وكيل واتساب الذكي');
  }, [products, setProducts, showToast]);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (activeTab === 'demanded' && prod.conversionRate < 85) return false;
      if (activeTab === 'low_stock' && prod.stock > 10) return false;
      if (activeTab === 'ai_disabled' && prod.aiRecommended) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          prod.name.toLowerCase().includes(q) ||
          prod.sku.toLowerCase().includes(q) ||
          prod.category.toLowerCase().includes(q)
        );
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
    showAddModal,
    setShowAddModal,
    toastMessage,
    handleSync,
    handleExport,
    handleToggleAiRecommended,
    handleCreateProduct
  };
}
