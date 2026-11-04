import React from 'react';
import { X, Printer, Send } from 'lucide-react';
import { OrderItem } from '../types/orders.types';

interface OrderDetailModalProps {
  order: OrderItem | null;
  onClose: () => void;
  onSendWhatsAppTracking: (order: OrderItem) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onSendWhatsAppTracking
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#111827] w-full max-w-xl rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F293D]">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              تفاصيل الطلب {order.orderNumber}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              {order.fulfillmentStatusLabel}
            </span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Customer & Address */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">
          <div>
            <span className="text-slate-400 block font-bold mb-1">العميل والمستلم:</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {order.customerName}
            </span>
            <span className="block font-mono text-slate-500 dir-ltr text-right">
              {order.customerPhone}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold mb-1">عنوان التوصيل وشركة الشحن:</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{order.city}</span>
            <span className="block text-slate-500">
              {order.carrier || 'سمسا SMSA'} • بوليصة:{' '}
              {order.trackingNumber || 'بانتظار الإصدار'}
            </span>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 block">المنتجات المحجوزة:</span>
          {order.items.map((it, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-[#1F293D] text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{it.icon}</span>
                <span className="font-bold text-slate-900 dark:text-white">{it.title}</span>
              </div>
              <span className="font-black text-[#128C7E]">{it.price} ر.س</span>
            </div>
          ))}
        </div>

        {/* Total Calculation */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between text-sm font-black text-slate-900 dark:text-white">
          <span>إجمالي الطلب المسدد:</span>
          <span className="text-[#128C7E] text-base">{order.total} ر.س</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => window.print()}
            type="button"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة البوليصة والفاتورة</span>
          </button>

          <button
            onClick={() => {
              onSendWhatsAppTracking(order);
              onClose();
            }}
            type="button"
            className="px-5 py-2 rounded-xl bg-[#128C7E] text-white text-xs font-bold hover:bg-[#075E54] flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>إرسال إشعار التتبع للعميل بواتساب</span>
          </button>
        </div>
      </div>
    </div>
  );
};
