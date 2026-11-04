import React from 'react';
import { Users, MapPin, ShoppingBag, ShieldCheck, RefreshCw } from 'lucide-react';
import { AudienceFilter } from '../../types/marketing.types';
import { useAudienceTargeting } from '../../hooks/useAudienceTargeting';

interface StepAudienceSelectorProps {
  filter: AudienceFilter;
  onChange: (filter: AudienceFilter) => void;
}

export const StepAudienceSelector: React.FC<StepAudienceSelectorProps> = ({
  filter,
  onChange,
}) => {
  const { estimatedCount, isEstimating } = useAudienceTargeting(filter);

  return (
    <div className="space-y-4">
      {/* بطاقة العداد التقديري للجمهور */}
      <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center font-black">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
              الجمهور المؤهل للإرسال
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {isEstimating ? '...' : estimatedCount} عميل
              </span>
              {isEstimating && <RefreshCw className="w-3.5 h-3.5 animate-spin text-pink-500" />}
            </div>
          </div>
        </div>

        <div className="text-left text-[11px] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> مستبعد منهم قائمة الحظر والانسحاب
          </span>
        </div>
      </div>

      {/* خيارات الجمهور */}
      <div className="space-y-3">
        <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 cursor-pointer">
          <input
            type="radio"
            name="audience_scope"
            checked={Boolean(filter.all)}
            onChange={() => onChange({ all: true })}
            className="text-pink-600 focus:ring-pink-500"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white block">كافة العملاء المسجلين في المتجر</span>
            <span className="text-slate-400">إرسال الحملة إلى جميع جهات الاتصال المسجلة في النظام</span>
          </div>
        </label>

        <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 cursor-pointer">
          <input
            type="radio"
            name="audience_scope"
            checked={!filter.all}
            onChange={() => onChange({ all: false, city: '', minOrders: 0 })}
            className="text-pink-600 focus:ring-pink-500"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white block">تخصيص الجمهور وفق معايير جغرافية وشرائية</span>
            <span className="text-slate-400">تصفية حسب المدينة أو عدد الطلبات السابقة</span>
          </div>
        </label>
      </div>

      {!filter.all && (
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-pink-500" /> المدينة المستهدفة
            </label>
            <input
              type="text"
              placeholder="مثال: الرياض أو جدة (أو اتركه فارغاً)"
              value={filter.city || ''}
              onChange={(e) => onChange({ ...filter, city: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1 flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-pink-500" /> الحد الأدنى للطلبات السابقة
            </label>
            <input
              type="number"
              min="0"
              value={filter.minOrders || 0}
              onChange={(e) => onChange({ ...filter, minOrders: Number(e.target.value) })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

