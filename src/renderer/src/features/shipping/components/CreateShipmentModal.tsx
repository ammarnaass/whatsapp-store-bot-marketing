import React from 'react';
import { X, Truck, Check } from 'lucide-react';
import { useCreateShipmentForm } from '../hooks/useCreateShipmentForm';
import { PRESET_CARRIERS } from '../constants/carriers-presets';

interface Props {
  isOpen: boolean;
  orders: any[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const CreateShipmentModal: React.FC<Props> = ({ isOpen, orders, onClose, onSubmit }) => {
  const form = useCreateShipmentForm(orders, onSubmit, onClose);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#128C7E]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">إصدار بوليصة شحن جديدة</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={form.handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold mb-1">اختر الطلب المراد شحنه</label>
            <select
              value={form.selectedOrderId} onChange={(e) => form.setSelectedOrderId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
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
              <label className="block font-bold mb-1">شركة الشحن والتوصيل</label>
              <select
                value={form.carrier} onChange={(e) => form.setCarrier(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
              >
                {PRESET_CARRIERS.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">رقم التتبع (اختياري)</label>
              <input
                type="text" placeholder="توليد تلقائي إذا تُرك فارغاً" value={form.trackingNo}
                onChange={(e) => form.setTrackingNo(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">مدينة التسليم</label>
              <input
                type="text" value={form.city} onChange={(e) => form.setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold" required
              />
            </div>
            <div>
              <label className="block font-bold mb-1">هاتف العميل (واتساب)</label>
              <input
                type="text" value={form.customerPhone} onChange={(e) => form.setCustomerPhone(e.target.value)}
                placeholder="9665xxxxxxxx أو 213xxxxxxxxx" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">تفاصيل العنوان والحي</label>
            <input
              type="text" value={form.street} onChange={(e) => form.setStreet(e.target.value)}
              placeholder="الحي، اسم الشارع، رقم العمارة أو المنزل..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1 font-semibold text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={form.sendWhatsApp} onChange={(e) => form.setSendWhatsApp(e.target.checked)} className="rounded text-[#128C7E]" />
            <span>إرسال إشعار فوري برقم ورابط التتبع للعميل عبر واتساب 📲</span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">إلغاء</button>
            <button type="submit" disabled={form.loading} className="px-5 py-2 rounded-xl bg-[#128C7E] text-white font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#0ea593]">
              <Check className="w-4 h-4" />
              <span>{form.loading ? 'جاري الإصدار...' : 'إصدار البوليصة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
