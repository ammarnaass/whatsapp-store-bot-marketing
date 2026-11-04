import React from 'react';
import { Tag, Plus } from 'lucide-react';
import { Coupon } from '../../types/marketing.types';
import { CouponCard } from '../coupons/CouponCard';

interface CouponsTabProps {
  coupons: Coupon[];
  isLoading: boolean;
  onToggle: (id: string, currentStatus: number | boolean) => void;
  onDelete: (id: string) => void;
  onOpenCreate: () => void;
}

export const CouponsTab: React.FC<CouponsTabProps> = ({
  coupons,
  isLoading,
  onToggle,
  onDelete,
  onOpenCreate,
}) => {
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400">جارِ تحميل الكوبونات...</div>
      ) : coupons.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#111827] border border-dashed border-slate-200 dark:border-[#1F293D] rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">لا توجد أكواد خصم مفعلة</h4>
            <p className="text-xs text-slate-400 mt-1">أنشئ كوبونات ترويجية وقسائم تخفيض لتقديمها لعملائك</p>
          </div>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            إضافة كود خصم
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

