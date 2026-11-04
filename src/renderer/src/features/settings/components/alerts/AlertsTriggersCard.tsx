import React from 'react';
import { ShoppingBag, Star, ShoppingCart, AlertCircle } from 'lucide-react';
import { AdminAlertSettings } from '../../types/settings.types';

interface AlertsTriggersCardProps {
  alerts: AdminAlertSettings;
  onChange: (updated: AdminAlertSettings) => void;
}

export const AlertsTriggersCard: React.FC<AlertsTriggersCardProps> = ({ alerts, onChange }) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">تنبيهات المبيعات والمخزون</h3>
          <p className="text-[11px] text-slate-400">إشعارات الطلبات الجديدة والطلبات الكبرى وتدني الكميات</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* New Order Alert */}
        <div className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">تأكيد الطلبات الجديدة فورياً</h4>
              <p className="text-[11px] text-slate-400">إشعار مباشر عند إتمام أي عميل لعملية شراء عبر واتساب</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={alerts.newOrderAlert}
            onChange={(e) => onChange({ ...alerts, newOrderAlert: e.target.checked })}
            className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
          />
        </div>

        {/* VIP Orders */}
        <div className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">طلبات VIP عالية القيمة</h4>
                <p className="text-[11px] text-slate-400">تنبيه خاص لمدير المبيعات للطلبات التي تتجاوز حداً معيناً</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={alerts.vipOrdersAlert}
              onChange={(e) => onChange({ ...alerts, vipOrdersAlert: e.target.checked })}
              className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
            />
          </div>
          {alerts.vipOrdersAlert && (
            <div className="flex items-center gap-2 pt-1 pr-11">
              <span className="text-[11px] text-slate-500">الحد الأدنى للطلب:</span>
              <input
                type="number"
                min={100}
                step={50}
                value={alerts.vipOrderThreshold || 1000}
                onChange={(e) => onChange({ ...alerts, vipOrderThreshold: Number(e.target.value) })}
                className="w-24 h-7 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white text-center outline-none focus:border-[#128C7E]"
              />
              <span className="text-[11px] text-slate-400 font-bold">ر.س</span>
            </div>
          )}
        </div>

        {/* Abandoned Cart */}
        <div className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">السلات المتروكة لأكثر من 30 دقيقة</h4>
              <p className="text-[11px] text-slate-400">إشعار لإرسال تذكير أو كوبون استرداد عبر حملة واتساب</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={alerts.abandonedCartAlert}
            onChange={(e) => onChange({ ...alerts, abandonedCartAlert: e.target.checked })}
            className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
          />
        </div>

        {/* Low Stock */}
        <div className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">إنذار تدني كميات المخزون</h4>
                <p className="text-[11px] text-slate-400">تنبيه عند وصول المنتج إلى حد نفاد وشيك</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={alerts.lowStockAlert}
              onChange={(e) => onChange({ ...alerts, lowStockAlert: e.target.checked })}
              className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
            />
          </div>
          {alerts.lowStockAlert && (
            <div className="flex items-center gap-2 pt-1 pr-11">
              <span className="text-[11px] text-slate-500">التنبيه عند بقاء:</span>
              <input
                type="number"
                min={1}
                max={50}
                value={alerts.lowStockThreshold || 5}
                onChange={(e) => onChange({ ...alerts, lowStockThreshold: Number(e.target.value) })}
                className="w-16 h-7 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white text-center outline-none focus:border-[#128C7E]"
              />
              <span className="text-[11px] text-slate-400 font-bold">قطع أو أقل</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

