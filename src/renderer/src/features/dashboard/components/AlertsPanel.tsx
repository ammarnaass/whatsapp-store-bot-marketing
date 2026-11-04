import React from 'react';
import { AlertCircle, Package, Key, Wifi, CheckCircle2 } from 'lucide-react';
import { useDataStore } from '../../data-management';

export const AlertsPanel: React.FC = () => {
  const isMockDataActive = useDataStore((state) => state.isMockDataActive);

  return (
    <div className="wasell-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          لوحة التنبيهات الفورية
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
          isMockDataActive
            ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
            : 'bg-emerald-100 dark:bg-[#128C7E]/20 text-emerald-600 dark:text-emerald-300'
        }`}>
          {isMockDataActive ? '2 تنبيه' : '0 تنبيهات'}
        </span>
      </div>

      <div className="space-y-2.5 text-xs">
        {isMockDataActive ? (
          <>
            {/* تنبيه انخفاض المخزون */}
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-2.5">
              <Package className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-amber-800 dark:text-amber-300">مخزون منخفض: كابل شحن 65W</h5>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                  المتبقي في المستودع 3 وحدات فقط. يرجى توريد كميات جديدة.
                </p>
              </div>
            </div>

            {/* تنبيه مفاتيح التراخيص */}
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 flex items-start gap-2.5">
              <Key className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-red-800 dark:text-red-300">مفاتيح التراخيص توشك على النفاد</h5>
                <p className="text-[11px] text-red-700 dark:text-red-400 mt-0.5">
                  اشتراك برو: متبقي مفتاحان غير مباعين فقط.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-[#128C7E]/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#128C7E] shrink-0" />
            <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
              كافة الأنظمة والمخازن بحالة ممتازة ولا توجد تنبيهات حرجة.
            </span>
          </div>
        )}

        {/* حالة بوابة واتساب */}
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
          <span className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
            <Wifi className="w-4 h-4 text-[#128C7E]" />
            بوابة OpenWA نشطة
          </span>
          <span className="text-[11px] text-[#128C7E] font-mono">127.0.0.1:3005</span>
        </div>
      </div>
    </div>
  );
};
