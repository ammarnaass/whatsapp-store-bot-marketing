import React from 'react';
import { X, Sparkles, MessageCircle } from 'lucide-react';
import { CustomerItem } from '../types/customers.types';

interface CustomerProfileModalProps {
  customer: CustomerItem | null;
  onClose: () => void;
  onOpenWhatsApp: (customer: CustomerItem) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  customer,
  onClose,
  onOpenWhatsApp
}) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#111827] w-full max-w-xl rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F293D]">
          <div className="flex items-center gap-3">
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#128C7E]/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-lg font-bold ring-2 ring-[#128C7E]/30 shrink-0">
                {(customer.name || 'ع')[0]}
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {customer.name}
              </h3>
              <span className="text-xs text-slate-400">
                {customer.city} • {customer.phone}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Statistics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
            <span className="text-[11px] text-slate-400 block font-bold">الطلبات المكتملة</span>
            <span className="text-base font-black text-slate-900 dark:text-white">
              {customer.ordersCount} طلبات
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
            <span className="text-[11px] text-slate-400 block font-bold">القيمة الدائمة (LTV)</span>
            <span className="text-base font-black text-[#128C7E]">
              {customer.totalSpend.toLocaleString()} ر.س
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
            <span className="text-[11px] text-slate-400 block font-bold">جاهزية الشراء (AI)</span>
            <span className="text-base font-black text-[#7C3AED]">
              {customer.buyingPropensity}%
            </span>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="p-4 bg-violet-50 dark:bg-[#7C3AED]/20 rounded-xl border border-violet-200 dark:border-violet-900/50 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#7C3AED]">
            <Sparkles className="w-4 h-4" />
            <span>ملخص ذكاء الوكيل لسلوك العميل</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {customer.aiSummary}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold cursor-pointer"
          >
            إغلاق
          </button>
          <button
            onClick={() => {
              onOpenWhatsApp(customer);
              onClose();
            }}
            type="button"
            className="px-5 py-2 rounded-xl bg-[#128C7E] text-white text-xs font-bold hover:bg-[#075E54] flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>فتح المحادثة على واتساب</span>
          </button>
        </div>
      </div>
    </div>
  );
};
