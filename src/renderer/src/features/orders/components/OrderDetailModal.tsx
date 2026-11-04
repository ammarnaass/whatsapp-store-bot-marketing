import React, { useState } from 'react';
import { X, Printer, Send, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { OrderItem } from '../types/orders.types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderDetailModalProps {
  order: OrderItem | null;
  onClose: () => void;
  onSendWhatsAppTracking: (order: OrderItem) => void;
  onUpdateStatus?: (orderId: string, status: string, trackingNo?: string) => void;
  onCancelOrder?: (orderId: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order, onClose, onSendWhatsAppTracking, onUpdateStatus, onCancelOrder,
}) => {
  const [trackingNo, setTrackingNo] = useState(order?.trackingNumber || '');

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] w-full max-w-xl rounded-3xl border border-slate-200 dark:border-[#1F293D] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F293D]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">طلب {order.orderNumber}</span>
            <OrderStatusBadge status={order.fulfillmentStatus} />
          </div>
          <button onClick={onClose} type="button" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Customer & Address */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs">
          <div>
            <span className="text-slate-400 block font-bold mb-1">العميل والمستلم:</span>
            <span className="font-extrabold text-slate-900 dark:text-white block">{order.customerName}</span>
            <span className="font-mono text-slate-500 text-right block" dir="ltr">{order.customerPhone}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold mb-1">عنوان التوصيل والشحن:</span>
            <span className="font-extrabold text-slate-900 dark:text-white block">{order.city || 'الرياض'}</span>
            <span className="text-[11px] text-slate-500 block">{order.carrier || 'شركة التوصيل'} • {order.trackingNumber || 'بدون بوليصة'}</span>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-500 block">العناصر المطلوبة:</span>
          {order.items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-[#1F293D] text-xs">
              <span className="font-bold text-slate-900 dark:text-white">{it.title}</span>
              <span className="font-mono font-bold text-[#128C7E]">${it.price}</span>
            </div>
          ))}
        </div>

        {/* Total Calculation */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs font-black text-slate-900 dark:text-white">
          <span>إجمالي المبلغ:</span>
          <span className="text-[#128C7E] text-sm font-mono">${order.total}</span>
        </div>

        {/* Status Lifecycle Actions */}
        {onUpdateStatus && (
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/60 dark:border-[#1F293D] space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">تحديث حالة الطلب والشحن:</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="أدخل رقم التتبع للشحن..."
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
                className="flex-1 h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] rounded-lg outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'SHIPPED', trackingNo)}
                className="h-8 px-3 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-blue-700"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>شحن وتتبع</span>
              </button>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                className="flex-1 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تم التسليم بنجاح</span>
              </button>
              {onCancelOrder && order.fulfillmentStatus !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => onCancelOrder(order.id)}
                  className="h-8 px-3 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-bold flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>إلغاء الطلب</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* WhatsApp & Print Actions */}
        <div className="flex items-center justify-between pt-2">
          <button onClick={() => window.print()} type="button" className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5">
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>
          <button onClick={() => { onSendWhatsAppTracking(order); onClose(); }} type="button" className="h-9 px-4 rounded-xl bg-[#128C7E] text-white text-xs font-bold hover:bg-[#0da08e] flex items-center gap-1.5 shadow-sm">
            <Send className="w-3.5 h-3.5" />
            <span>إشعار العميل عبر واتساب</span>
          </button>
        </div>
      </div>
    </div>
  );
};
