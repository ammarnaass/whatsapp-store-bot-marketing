import React from 'react';
import { Globe2 } from 'lucide-react';
import { StoreIdentity } from '../../types/settings.types';
import { SUPPORTED_CURRENCIES } from '@shared/currencies';

interface RegionalLocaleCardProps {
  identity: StoreIdentity;
  onChange: (updated: StoreIdentity) => void;
}

export const RegionalLocaleCard: React.FC<RegionalLocaleCardProps> = ({ identity, onChange }) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Globe2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">التفضيلات الإقليمية واللهجة</h3>
          <p className="text-[11px] text-slate-400">العملة الافتراضية، المنطقة الزمنية، ولهجة الوكيل الذكي</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              العملة الافتراضية للمتجر
            </label>
            <select
              value={identity.currency}
              onChange={(e) => onChange({ ...identity, currency: e.target.value })}
              className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E] cursor-pointer"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.code} - {c.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              المنطقة الزمنية
            </label>
            <select
              value={identity.timezone}
              onChange={(e) => onChange({ ...identity, timezone: e.target.value })}
              className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E] cursor-pointer"
            >
              <option value="Asia/Riyadh">توقيت مكة المكرمة (الرياض GMT+3)</option>
              <option value="Asia/Dubai">توقيت الخليج (دبي GMT+4)</option>
              <option value="Africa/Cairo">توقيت مصر (القاهرة GMT+2)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            لهجة وأسلوب رد وكيل الذكاء الاصطناعي
          </label>
          <select
            value={identity.aiDialect}
            onChange={(e) => onChange({ ...identity, aiDialect: e.target.value })}
            className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E] cursor-pointer"
          >
            <option value="اللهجة السعودية (نجدية / حجازية راقية)">اللهجة السعودية (نجدية / حجازية راقية)</option>
            <option value="الفصحى المبسطة والمعاصرة">الفصحى المبسطة والمعاصرة</option>
            <option value="اللهجة الخليجية العامة">اللهجة الخليجية العامة</option>
            <option value="اللهجة المصرية الودودة">اللهجة المصرية الودودة</option>
            <option value="اللهجة الشامية الراقية">اللهجة الشامية الراقية</option>
          </select>
        </div>
      </div>
    </div>
  );
};

