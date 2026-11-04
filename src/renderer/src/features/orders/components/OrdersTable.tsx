import React from 'react';
import { Copy, Eye, MessageCircle, Sparkles, ShoppingBag } from 'lucide-react';
import { OrderItem } from '../types/orders.types';
import { EmptyState } from '../../data-management';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrdersTableProps {
  orders: OrderItem[];
  onCopyOrder: (orderNo: string) => void;
  onSelectOrder: (order: OrderItem) => void;
  onSendWhatsAppTracking: (order: OrderItem) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders, onCopyOrder, onSelectOrder, onSendWhatsAppTracking,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-right border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#1F293D] bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 font-bold">
              <th className="py-3 px-4">رقم الطلب</th>
              <th className="py-3 px-4">العميل</th>
              <th className="py-3 px-4">المنتجات المطلوبة</th>
              <th className="py-3 px-4 text-center">مصدر الإغلاق</th>
              <th className="py-3 px-4 text-center">طريقة السداد</th>
              <th className="py-3 px-4 text-center">حالة الطلب</th>
              <th className="py-3 px-4 text-center">الإجمالي</th>
              <th className="py-3 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8">
                  <EmptyState icon={<ShoppingBag className="w-8 h-8 text-[#7C3AED]" />} title="لا توجد طلبات مسجلة" description="سجل مبيعات وطلبات واتساب خالي حالياً." sectionKey="orders" />
                </td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <button onClick={() => onCopyOrder(ord.orderNumber)} type="button" className="inline-flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-white hover:text-[#128C7E] cursor-pointer">
                      <span>{ord.orderNumber}</span>
                      <Copy className="w-3 h-3 text-slate-400" />
                    </button>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{ord.timeAgo}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {ord.avatar ? (
                        <img src={ord.avatar} alt={ord.customerName} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                          {(ord.customerName || 'ع')[0]}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{ord.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono text-right" dir="ltr">{ord.customerPhone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-xs">{ord.items[0]?.title}</span>
                    {ord.items.length > 1 && <span className="text-[10px] text-[#128C7E] font-bold">+{ord.items.length - 1} منتج إضافي</span>}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {ord.source === 'agent' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 dark:bg-[#7C3AED]/20 text-[#7C3AED]">
                        <Sparkles className="w-3 h-3" />
                        AI وكيل
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        يدوي
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center text-slate-700 dark:text-slate-300 font-bold text-[11px]">{ord.paymentMethodLabel}</td>

                  <td className="py-3 px-4 text-center">
                    <OrderStatusBadge status={ord.fulfillmentStatus} />
                  </td>

                  <td className="py-3 px-4 text-center font-black text-slate-900 dark:text-white font-mono text-xs">${ord.total}</td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => onSelectOrder(ord)} type="button" className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-[#128C7E] transition-all" title="تفاصيل الطلب">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onSendWhatsAppTracking(ord)} type="button" className="p-1.5 rounded-lg bg-[#128C7E]/10 text-[#128C7E] hover:bg-[#128C7E] hover:text-white transition-all" title="إرسال إشعار بالواتساب">
                        <MessageCircle className="w-3.5 h-3.5" />
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
