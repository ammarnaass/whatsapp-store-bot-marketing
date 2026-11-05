import { useCallback } from 'react';
import { useDataStore, CatalogProduct } from '../../data-management';
import { ProductFormData } from '../types/products.types';
import { api } from '../../../api-bridge';

export function useProductMutation(showToast: (msg: string) => void) {
  const products = useDataStore((s) => s.products);
  const setProducts = useDataStore((s) => s.setProducts);

  const handleCreateProduct = useCallback((formData: ProductFormData) => {
    if (!formData.name.trim()) return;
    const sku = formData.sku?.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProd: CatalogProduct = {
      id: `p_${Date.now()}`,
      name: formData.name,
      sku,
      category: formData.category,
      type: formData.type,
      price: formData.price,
      stock: formData.stock,
      image: formData.media?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      aiRecommended: true,
      salesCount: 0,
      conversionRate: 0,
      description: formData.description || 'منتج أصلي متاح للشحن الفوري عبر متجر واتساب.',
    };

    api.catalog.createProduct({
      name: formData.name,
      type: formData.type,
      description: formData.description,
      category: formData.category,
      category_id: formData.category_id,
      price: formData.price,
      stock: formData.stock,
      cost_price: formData.cost_price,
      compare_at_price: formData.compare_at_price,
      barcode: formData.barcode,
      sku,
      brand: formData.brand,
      weight: formData.weight,
      length: formData.length,
      width: formData.width,
      height: formData.height,
      shipping_type: formData.shipping_type,
      shipping_fee: formData.shipping_fee,
      low_stock_threshold: formData.low_stock_threshold,
      tax_rate: formData.tax_rate,
      is_tax_inclusive: formData.is_tax_inclusive,
      tags: formData.tags,
      whatsapp_short_desc: formData.whatsapp_short_desc,
      is_featured: formData.is_featured,
      allow_backorders: formData.allow_backorders,
    }).catch(console.error);

    setProducts([newProd, ...products]);
    showToast('تمت إضافة المنتج بنجاح وتفعيله مع كامل بيانات التكلفة والشحن');
  }, [products, setProducts, showToast]);

  const handleUpdateProduct = useCallback((formData: ProductFormData) => {
    if (!formData.id) return;
    api.catalog.updateProduct?.({
      ...formData,
    }).catch(console.error);

    setProducts((prev) =>
      prev.map((p) => (p.id === formData.id ? { ...p, ...formData, price: formData.price, stock: formData.stock } : p))
    );
    showToast(`تم تحديث بيانات وأرباح المنتج (${formData.name}) بنجاح`);
  }, [setProducts, showToast]);

  const handleDeleteProduct = useCallback((id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المنتج (${name}) نهائياً؟`)) return;
    api.catalog.deleteProduct?.({ id }).catch(console.error);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`تم حذف المنتج (${name}) بنجاح`);
  }, [setProducts, showToast]);

  const handleToggleAi = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.aiRecommended;
          api.catalog.toggleAi?.({ id, active: next }).catch(console.error);
          showToast(next ? `تم تفعيل اقتراح (${p.name}) بالذكاء الاصطناعي` : `تم تعطيل اقتراح (${p.name}) آلياً`);
          return { ...p, aiRecommended: next };
        }
        return p;
      })
    );
  }, [setProducts, showToast]);

  return { handleCreateProduct, handleUpdateProduct, handleDeleteProduct, handleToggleAi };
}
