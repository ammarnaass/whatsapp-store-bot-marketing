import { useState, useMemo, useCallback } from 'react';
import { useDataStore } from '../../data-management';
import { InventoryItem, InventoryTabFilter, StockSummary } from '../types/inventory.types';
import { api } from '../../../api-bridge';

export function useInventory() {
  const products = useDataStore((s) => s.products);
  const setProducts = useDataStore((s) => s.setProducts);

  const [activeTab, setActiveTab] = useState<InventoryTabFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [selectedDigitalProduct, setSelectedDigitalProduct] = useState<InventoryItem | null>(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((p) => (p === msg ? null : p)), 3000);
  }, []);

  const items: InventoryItem[] = useMemo(() => {
    return products.map((p) => {
      const reserved = 0;
      return {
        id: `var_${p.id}`,
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        category: p.category,
        type: p.type,
        price: p.price,
        stockQty: p.stock,
        reservedQty: reserved,
        availableQty: Math.max(0, p.stock - reserved),
        image: p.image,
      };
    });
  }, [products]);

  const summary: StockSummary = useMemo(() => {
    const totalQuantity = items.reduce((acc, i) => acc + i.stockQty, 0);
    const reservedQuantity = items.reduce((acc, i) => acc + i.reservedQty, 0);
    return {
      totalSkus: items.length,
      totalQuantity,
      reservedQuantity,
      availableQuantity: Math.max(0, totalQuantity - reservedQuantity),
      lowStockCount: items.filter((i) => i.stockQty > 0 && i.stockQty <= 5).length,
      outOfStockCount: items.filter((i) => i.stockQty === 0).length,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTab === 'low_stock' && (item.stockQty > 5 || item.stockQty === 0)) return false;
      if (activeTab === 'out_of_stock' && item.stockQty > 0) return false;
      if (activeTab === 'digital' && item.type !== 'digital') return false;
      if (activeTab === 'physical' && item.type !== 'physical') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.productName.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, activeTab, searchQuery]);

  const handleAdjustStock = useCallback(async (variantId: string, changeQty: number, reason: string) => {
    try {
      await api.inventory.adjustStock({ variantId, changeQty, reason, createdBy: 'admin' });
      setProducts((prev) =>
        prev.map((p) => {
          if (`var_${p.id}` === variantId || p.id === variantId) {
            const newStock = Math.max(0, p.stock + changeQty);
            return { ...p, stock: newStock };
          }
          return p;
        })
      );
      showToast('تم تحديث رصيد المخزون وتسجيل حركة التدقيق بنجاح');
      setAdjustingItem(null);
    } catch {
      showToast('فشل تعديل رصيد المخزون');
    }
  }, [setProducts, showToast]);

  return {
    items,
    filteredItems,
    summary,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    adjustingItem,
    setAdjustingItem,
    selectedDigitalProduct,
    setSelectedDigitalProduct,
    showLogsModal,
    setShowLogsModal,
    toastMessage,
    handleAdjustStock,
    showToast,
  };
}

