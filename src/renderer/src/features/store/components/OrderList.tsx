import React from 'react';
import { ShoppingCart, CheckCircle, Clock, Truck } from 'lucide-react';
import { Order } from '../../../../shared/types';

interface OrderListProps {
  orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <div className="wasell-card overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-[#128C7E]" />
          قائمة الطلبات المسجلة ({orders.length})
        </h3>
        <span className="text-xs text-slate-400">محدثة تلقائياً عبر SQLite</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-[#1F293D]">
            <tr>
              <th className="p-3">رقم الطلب</th>
              <th className="p-3">العميل</th>
              <th className="p-3">الإجمالي</th>
              <th className="p-3">حالة الدفع</th>
              <th className="p-3">حالة الطلب</th>
              <th className="p-3">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-3 font-mono font-bold text-[#128C7E]">
                  #{order.order_number || order.id.slice(-6)}
                </td>
                <td className="p-3 font-medium text-slate-900 dark:text-white">
                  {order.customer_phone}
                </td>
                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                  ${order.total_amount} {order.currency}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    order.payment_status === 'PAID'
                      ? 'bg-emerald-100 dark:bg-[#128C7E]/20 text-[#128C7E]'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                  }`}>
                    {order.payment_status === 'PAID' ? 'تم الدفع' : 'بانتظار الدفع'}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-max ${
                    order.status === 'DELIVERED'
                      ? 'bg-emerald-100 dark:bg-[#128C7E]/20 text-[#128C7E]'
                      : order.status === 'SHIPPED'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-600'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                  }`}>
                    {order.status === 'DELIVERED' && <CheckCircle className="w-3 h-3" />}
                    {order.status === 'SHIPPED' && <Truck className="w-3 h-3" />}
                    {order.status === 'NEW' && <Clock className="w-3 h-3" />}
                    <span>{order.status}</span>
                  </span>
                </td>
                <td className="p-3 text-slate-400 font-mono text-[11px]">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString('ar-EG') : 'اليوم'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
