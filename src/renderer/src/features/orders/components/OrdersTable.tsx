import React from 'react';
import { Copy, Eye, MessageCircle, CheckCircle2, Sparkles, ShoppingBag } from 'lucide-react';
import { OrderItem } from '../types/orders.types';
import { EmptyState } from '../../data-management';

interface OrdersTableProps {
  orders: OrderItem[];
  onCopyOrder: (orderNo: string) => void;
  onSelectOrder: (order: OrderItem) => void;
  onSendWhatsAppTracking: (order: OrderItem) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onCopyOrder,
  onSelectOrder,
  onSendWhatsAppTracking
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#1F293D] bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 font-bold">
              <th className="py-3.5 px-4">رقم الطلب</th>
              <th className="py-3.5 px-4">العميل</th>
              <th className="py-3.5 px-4">المنتجات المطلوبة</th>
              <th className="py-3.5 px-4 text-center">مصدر الإغلاق</th>
              <th className="py-3.5 px-4 text-center">طريقة وحالة السداد</th>
              <th className="py-3.5 px-4 text-center">حالة التجهيز</th>
              <th className="py-3.5 px-4 text-center">الإجمالي</th>
              <th className="py-3.5 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8">
                  <EmptyState
                    icon={<ShoppingBag className="w-8 h-8 text-[#7C3AED]" />}
                    title="لا توجد طلبات مسجلة"
                    description="سجل مبيعات وطلبات واتساب خالي حالياً. ستبدأ الطلبات بالظهور تلقائياً عند قيام العملاء بالشراء أو يمكنك تعبئة بيانات تجريبية."
                    sectionKey="orders"
                  />
                </td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr
                  key={ord.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onCopyOrder(ord.orderNumber)}
                      type="button"
                      className="inline-flex items-center gap-1.5 font-mono tabular-nums font-bold text-slate-900 dark:text-white hover:text-[#128C7E] cursor-pointer"
                      title="نسخ رقم الطلب"
                    >
                      <span>{ord.orderNumber}</span>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <span className="block text-[11px] text-slate-400 mt-0.5">{ord.timeAgo}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={ord.avatar}
                        alt={ord.customerName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {ord.customerName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono tabular-nums dir-ltr text-right">
                          {ord.customerPhone}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {ord.items[0]?.title}
                      </span>
                      {ord.items.length > 1 && (
                        <span className="text-[11px] text-[#128C7E] font-bold">
                          +{ord.items.length - 1} منتج إضافي
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {ord.source === 'agent' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-100 dark:bg-[#7C3AED]/20 text-[#7C3AED] border border-violet-200 dark:border-violet-800">
                        <Sparkles className="w-3 h-3" />
                        إغلاق آلي بـ AI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        موظف بشري
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-[#128C7E]" />
                      {ord.paymentMethodLabel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        ord.fulfillmentStatus === 'delivered'
                          ? 'bg-emerald-100 text-[#075E54] dark:bg-[#128C7E]/20 dark:text-emerald-300'
                          : ord.fulfillmentStatus === 'shipping'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : ord.fulfillmentStatus === 'preparing'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {ord.fulfillmentStatusLabel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-black text-slate-900 dark:text-white font-mono tabular-nums text-sm">
                    {ord.total} ر.س
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onSelectOrder(ord)}
                        type="button"
                        className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center"
                        title="تفاصيل الطلب"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSendWhatsAppTracking(ord)}
                        type="button"
                        className="w-8 h-8 rounded-lg bg-[#128C7E]/10 hover:bg-[#128C7E] text-[#128C7E] hover:text-white transition-all cursor-pointer flex items-center justify-center"
                        title="إرسال إشعار التتبع بالواتساب"
                      >
                        <MessageCircle className="w-4 h-4" />
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
