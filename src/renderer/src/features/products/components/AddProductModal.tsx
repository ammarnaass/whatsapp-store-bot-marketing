import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { NewProductFormData } from '../types/products.types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewProductFormData) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<NewProductFormData>({
    name: '',
    price: 250,
    category: 'عطور وباقات',
    type: 'physical',
    stock: 20,
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      price: 250,
      category: 'عطور وباقات',
      type: 'physical',
      stock: 20,
      description: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-[#1F293D] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F293D]">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            إضافة منتج جديد لكتالوج واتساب
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-bold">
          <div>
            <label className="text-slate-700 dark:text-slate-300 block mb-1">اسم المنتج</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: عطر خشب الصندل النادر"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">السعر (ر.س)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20"
              />
            </div>
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">المخزون المتاح</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">التصنيف</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20"
              >
                <option value="عطور وباقات">عطور وباقات</option>
                <option value="إلكترونيات وساعات">إلكترونيات وساعات</option>
                <option value="منتجات رقمية وتراخيص">منتجات رقمية وتراخيص</option>
              </select>
            </div>
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">نوع المنتج</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'physical' | 'digital' })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20"
              >
                <option value="physical">فيزيائي (شحن وتوصيل)</option>
                <option value="digital">رقمي (مفتاح تسليم فوري)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 block mb-1">وصف المنتج للوكيل</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="أدخل مميزات المنتج ومواصفاته لكي يشرحها الوكيل للعملاء..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#128C7E]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة المنتج وتفعيله</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
