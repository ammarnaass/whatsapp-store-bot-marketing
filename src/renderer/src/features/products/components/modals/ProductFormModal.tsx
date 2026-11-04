import React from 'react';
import { X, Check, Package, DollarSign, Truck, Boxes, Image } from 'lucide-react';
import { ProductFormData } from '../../types/products.types';
import { useProductForm, ProductFormTab } from '../../hooks/useProductForm';
import { ProductBasicSection } from '../forms/ProductBasicSection';
import { ProductPricingSection } from '../forms/ProductPricingSection';
import { ProductShippingSection } from '../forms/ProductShippingSection';
import { ProductInventorySection } from '../forms/ProductInventorySection';
import { ProductMediaSection } from '../forms/ProductMediaSection';

interface ProductFormModalProps {
  isOpen: boolean;
  initialData?: Partial<ProductFormData> | null;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
}) => {
  const {
    formData,
    updateField,
    profitAnalysis,
    activeTab,
    setActiveTab,
    errors,
    validate,
    reset,
  } = useProductForm(initialData);

  if (!isOpen) return null;

  const isEditing = Boolean(formData.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    reset();
    onClose();
  };

  const tabs: { id: ProductFormTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'basic', label: 'البيانات العامة', icon: Package },
    { id: 'pricing', label: 'الأسعار والأرباح', icon: DollarSign },
    { id: 'shipping', label: 'الشحن والأبعاد', icon: Truck },
    { id: 'inventory', label: 'المخزون', icon: Boxes },
    { id: 'media', label: 'الوسائط وواتساب', icon: Image },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-[#1F293D] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 dark:border-[#1F293D]">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isEditing ? `تعديل المنتج (${formData.name || 'بدون اسم'})` : 'إضافة منتج جديد وحساب هوامش الربح'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              إدارة الأسعار والتكلفة والشحن والربحية وتوافق كتالوج واتساب
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-100 dark:border-[#1F293D] bg-slate-50/50 dark:bg-slate-900/40 overflow-x-auto scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition border-b-2 shrink-0 ${
                  isActive
                    ? 'border-[#128C7E] text-[#128C7E] bg-white dark:bg-[#111827]'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'basic' && <ProductBasicSection formData={formData} errors={errors} onChange={updateField} />}
          {activeTab === 'pricing' && <ProductPricingSection formData={formData} profitAnalysis={profitAnalysis} errors={errors} onChange={updateField} />}
          {activeTab === 'shipping' && <ProductShippingSection formData={formData} profitAnalysis={profitAnalysis} onChange={updateField} />}
          {activeTab === 'inventory' && <ProductInventorySection formData={formData} errors={errors} onChange={updateField} />}
          {activeTab === 'media' && <ProductMediaSection formData={formData} onChange={updateField} />}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#1F293D] mt-6">
            <div className="text-xs text-slate-400 font-mono">
              هامش الربح المتوقع: <span className="font-bold text-emerald-600">+{profitAnalysis.marginPercent}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#128C7E] hover:bg-[#075E54] shadow-md shadow-[#128C7E]/20 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'حفظ التعديلات' : 'إضافة المنتج للكتالوج'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

