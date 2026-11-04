import React from 'react';
import { X, Truck, Check } from 'lucide-react';
import { CARRIERS_LIST } from '../constants/shipping.constants';
import { useCreateShipmentForm } from '../hooks/useCreateShipmentForm';

interface CreateShipmentModalProps {
  isOpen: boolean;
  orders: any[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({
  isOpen,
  orders,
  onClose,
  onSubmit,
}) => {
  const form = useCreateShipmentForm(orders, onSubmit, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">إصدار بوليصة شحن جديدة</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">اختر الطلب المراد شحنه</label>
            <select
              value={form.selectedOrderId}
              onChange={(e) => form.setSelectedOrderId(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  طلب #{o.order_number || o.id} - {o.customer_name || 'عميل'} ({o.total || 0} ر.س) [{o.status || 'معلق'}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">شركة الشحن والتوصيل</label>
              <select
                value={form.carrier}
                onChange={(e) => form.setCarrier(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {CARRIERS_LIST.map((c) => (
                  <option key={c.id} value={c.name}>{c.name} ({c.labelAr})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">رقم التتبع (اختياري)</label>
              <input
                type="text"
                placeholder="توليد تلقائي إذا تُرك فارغاً"
                value={form.trackingNo}
                onChange={(e) => form.setTrackingNo(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">مدينة التسليم</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => form.setCity(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">رقم هاتف العميل (واتساب)</label>
              <input
                type="text"
                value={form.customerPhone}
                onChange={(e) => form.setCustomerPhone(e.target.value)}
                placeholder="9665xxxxxxxx"
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white dir-ltr text-right"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">تفاصيل العنوان والحي</label>
            <input
              type="text"
              value={form.street}
              onChange={(e) => form.setStreet(e.target.value)}
              placeholder="الحي، اسم الشارع، رقم المبنى..."
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.sendWhatsApp}
              onChange={(e) => form.setSendWhatsApp(e.target.checked)}
              className="rounded text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-slate-700 dark:text-slate-300">إرسال إشعار فوري برقم التتبع للعميل عبر واتساب</span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              إلغاء
            </button>
            <button
              type="submit"
              disabled={form.loading}
              className="px-4 py-2 rounded-xl text-white bg-cyan-600 hover:bg-cyan-500 font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{form.loading ? 'جاري الإصدار...' : 'إصدار البوليصة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
