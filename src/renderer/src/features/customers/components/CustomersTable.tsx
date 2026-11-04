import React from 'react';
import { Users, MapPin, MessageCircle } from 'lucide-react';
import { CustomerItem } from '../types/customers.types';
import { EmptyState } from '../../data-management';

interface CustomersTableProps {
  customers: CustomerItem[];
  onOpenWhatsApp: (customer: CustomerItem) => void;
  onSelectCustomer: (customer: CustomerItem) => void;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  onOpenWhatsApp,
  onSelectCustomer
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-right border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#1F293D] bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 font-bold">
              <th className="py-3.5 px-4">العميل</th>
              <th className="py-3.5 px-4">رقم الواتساب</th>
              <th className="py-3.5 px-4">التصنيف والوسوم</th>
              <th className="py-3.5 px-4 text-center">الطلبات</th>
              <th className="py-3.5 px-4 text-center">القيمة الدائمة (LTV)</th>
              <th className="py-3.5 px-4">آخر نشاط</th>
              <th className="py-3.5 px-4">ملخص ذكاء الوكيل (AI)</th>
              <th className="py-3.5 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8">
                  <EmptyState
                    icon={<Users className="w-8 h-8 text-blue-500" />}
                    title="لا توجد بيانات عملاء مسجلة"
                    description="قاعدة بيانات العملاء خالية حالياً. يمكنك المزامنة مع سلة / زد أو تعبئة بيانات تجريبية بنقرة واحدة."
                    sectionKey="customers"
                  />
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-sm font-bold shrink-0">
                          {(c.name || 'ع')[0]}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#128C7E]" />
                          {c.city}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300 dir-ltr text-right">
                    {c.phone}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          c.segment === 'vip'
                            ? 'bg-violet-100 text-[#7C3AED] dark:bg-[#7C3AED]/20 dark:text-violet-300 border border-violet-200 dark:border-violet-800'
                            : c.segment === 'churn_risk'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200'
                            : 'bg-emerald-50 text-[#075E54] dark:bg-[#128C7E]/20 dark:text-emerald-300'
                        }`}
                      >
                        {c.segmentLabel}
                      </span>
                      {c.tags.slice(0, 1).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    {c.ordersCount}
                  </td>

                  <td className="py-3.5 px-4 text-center font-black text-[#128C7E] font-mono tabular-nums text-sm">
                    {c.totalSpend.toLocaleString()} ر.س
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">{c.lastActive}</td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {c.aiSummary}
                    </p>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onOpenWhatsApp(c)}
                        type="button"
                        className="w-8 h-8 rounded-lg bg-[#128C7E]/10 hover:bg-[#128C7E] text-[#128C7E] hover:text-white transition-all cursor-pointer flex items-center justify-center"
                        title="محادثة واتساب مباشرة"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSelectCustomer(c)}
                        type="button"
                        className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                      >
                        الملف الكامل
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
