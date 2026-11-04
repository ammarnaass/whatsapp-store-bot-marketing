import React, { useState } from 'react';
import { Copy, Check, Trash2, Power, Calendar, ShieldCheck } from 'lucide-react';
import { Coupon } from '../../types/marketing.types';

interface CouponCardProps {
  coupon: Coupon;
  onToggle: (id: string, currentStatus: number | boolean) => void;
  onDelete: (id: string) => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, onToggle, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const isActive = Boolean(coupon.is_active);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative bg-white dark:bg-[#111827] border-2 ${
      isActive ? 'border-pink-500/30 dark:border-pink-500/20' : 'border-slate-200 dark:border-slate-800 opacity-60'
    } rounded-2xl p-4 elevation-1 flex flex-col justify-between gap-3 overflow-hidden transition-all`}>
      {/* الترويسة ورمز الخصم */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded-md">
            {coupon.discount_type === 'PERCENTAGE' ? `خصم ${coupon.discount_value}%` : `خصم ${coupon.discount_value} ر.س`}
          </span>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-mono font-black text-base tracking-wider text-slate-900 dark:text-white select-all">
              {coupon.code}
            </span>
            <button
              onClick={handleCopy}
              title="نسخ الكوبون"
              className="p-1 rounded-md text-slate-400 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* أزرار الحالة والحذف */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggle(coupon.id, coupon.is_active)}
            title={isActive ? 'تعطيل الكود' : 'تفعيل الكود'}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(coupon.id)}
            title="حذف الكوبون"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* تفاصيل وشروط الكوبون */}
      <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>الحد الأدنى للطلب:</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {coupon.min_order_amount > 0 ? `${coupon.min_order_amount} ر.س` : 'بدون حد'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>مرات الاستخدام:</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {coupon.times_used} / {coupon.max_uses}
          </span>
        </div>
        {coupon.expires_at ? (
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> الانتهاء:</span>
            <span>{coupon.expires_at}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

