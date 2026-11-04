import React from 'react';
import { Users, DollarSign, Crown, UserX, ArrowUpRight, Sparkles } from 'lucide-react';
import { CustomerItem } from '../types/customers.types';

interface CustomersKpisProps {
  customers: CustomerItem[];
}

export const CustomersKpis: React.FC<CustomersKpisProps> = ({ customers }) => {
  const hasCustomers = customers.length > 0;
  const vipCount = customers.filter((c) => c.segment === 'vip').length;
  const churnRiskCount = customers.filter((c) => c.segment === 'churn_risk').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Total Customers */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              إجمالي قاعدة العملاء
            </span>
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {hasCustomers ? '8,640' : 0}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl">
          <span className="inline-flex items-center gap-1 text-[#128C7E] font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +12% هذا الشهر
          </span>
          <span className="text-slate-400 font-medium font-mono tabular-nums">6,150 نشط بواتساب</span>
        </div>
      </div>

      {/* Card 2: Avg LTV */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              متوسط القيمة الدائمة (Avg LTV)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                {hasCustomers ? '1,180' : 0}
              </span>
              <span className="text-xs font-bold text-slate-400">ر.س</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl">
          <span className="text-slate-400 font-medium">تكرار الشراء:</span>
          <span className="text-[#128C7E] font-bold font-mono tabular-nums">3.4 طلبات / عميل</span>
        </div>
      </div>

      {/* Card 3: VIP Customers */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              عملاء VIP ذوي القيمة العالية
            </span>
            <span className="text-3xl font-black text-[#7C3AED] font-mono tabular-nums">
              {hasCustomers ? vipCount || 482 : 0}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl">
          <span className="text-slate-400 font-medium">حصة الإيرادات:</span>
          <span className="text-[#7C3AED] font-bold font-mono tabular-nums">38% من مبيعات واتساب</span>
        </div>
      </div>

      {/* Card 4: Churn Risk */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              العملاء المعرضون للانسحاب
            </span>
            <span className="text-3xl font-black text-rose-600 font-mono tabular-nums">
              {hasCustomers ? churnRiskCount || 94 : 0}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center font-bold">
            <UserX className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl">
          <span className="text-[#128C7E] font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            تنشيط 36 آلياً
          </span>
          <span className="text-slate-400 font-medium">هذا الأسبوع</span>
        </div>
      </div>
    </div>
  );
};
