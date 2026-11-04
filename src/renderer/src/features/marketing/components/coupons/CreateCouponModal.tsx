import React from 'react';
import { X, Tag } from 'lucide-react';
import { CreateCouponFormData } from '../../types/marketing.types';
import { useCreateCouponForm } from '../../hooks/useCreateCouponForm';

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCouponFormData) => Promise<{ success: boolean; error?: string }>;
}

export const CreateCouponModal: React.FC<CreateCouponModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const form = useCreateCouponForm(onSubmit, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-[#1F293D]">
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-pink-500" />
            إنشاء كود خصم ترويجي جديد
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">رمز الكوبون (Code)</label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => form.setCode(e.target.value.toUpperCase())}
              placeholder="مثال: SUMMER25 أو VIP10"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono uppercase font-black text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">نوع الخصم</label>
              <select
                value={form.discountType}
                onChange={(e) => form.setDiscountType(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
              >
                <option value="PERCENTAGE">نسبة مئوية (%)</option>
                <option value="FIXED">مبلغ ثابت (ر.س)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                {form.discountType === 'PERCENTAGE' ? 'النسبة (%)' : 'المبلغ (ر.س)'}
              </label>
              <input
                type="number"
                min="1"
                max={form.discountType === 'PERCENTAGE' ? 100 : 10000}
                required
                value={form.discountValue}
                onChange={(e) => form.setDiscountValue(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">الحد الأدنى للطلب</label>
              <input
                type="number"
                min="0"
                value={form.minOrderAmount}
                onChange={(e) => form.setMinOrderAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">أقصى مرات استخدام</label>
              <input
                type="number"
                min="1"
                value={form.maxUses}
                onChange={(e) => form.setMaxUses(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">تاريخ الانتهاء (اختياري)</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => form.setExpiresAt(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1F293D]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={form.isSubmitting}
              className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-40"
            >
              {form.isSubmitting ? 'جارٍ الحفظ...' : 'حفظ الكوبون'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
