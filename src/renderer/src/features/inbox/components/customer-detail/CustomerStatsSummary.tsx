import React from 'react';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { CustomerDetailProfile } from '../../types/customer-detail.types';

interface CustomerStatsSummaryProps {
  profile: CustomerDetailProfile;
  onSendPaymentLink: () => void;
}

export const CustomerStatsSummary: React.FC<CustomerStatsSummaryProps> = ({
  profile,
  onSendPaymentLink,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-[#128C7E]" />
          المعاملات المالية
        </h4>
        <span className="text-[11px] text-[#075E54] dark:text-emerald-300 font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 px-2 py-0.5 rounded-full">
          {profile.ordersCount > 0 ? `${profile.ordersCount} طلبات سابقة` : 'عميل جديد'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-[#1F293D] text-center">
          <span className="text-[10px] text-slate-400 block font-bold mb-0.5">إجمالي المشتريات</span>
          <span className="text-xs font-black font-mono tabular-nums text-[#128C7E]">
            {profile.totalSpend.toLocaleString()} ر.س
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-[#1F293D] text-center">
          <span className="text-[10px] text-slate-400 block font-bold mb-0.5">عدد الطلبات</span>
          <span className="text-xs font-black font-mono tabular-nums text-slate-900 dark:text-white">
            {profile.ordersCount}
          </span>
        </div>
      </div>

      <button
        onClick={onSendPaymentLink}
        type="button"
        className="w-full h-[38px] wasell-btn-primary elevation-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-1"
      >
        <CreditCard className="w-4 h-4" />
        إصدار وإرسال رابط دفع مباشر للعميل
      </button>
    </div>
  );
};

