import React from 'react';
import { Phone, Mail, MapPin, Globe, RefreshCw } from 'lucide-react';
import { StoreIdentity } from '../../types/settings.types';

interface StoreContactCardProps {
  identity: StoreIdentity;
  onChange: (updated: StoreIdentity) => void;
  onTestSync: () => void;
  isTestingSync: boolean;
}

export const StoreContactCard: React.FC<StoreContactCardProps> = ({
  identity,
  onChange,
  onTestSync,
  isTestingSync,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Phone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">بيانات الاتصال ومقر المتجر</h3>
          <p className="text-[11px] text-slate-400">قنوات الدعم الفني والعنوان الفعلي ورابط المتجر الإلكتروني</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              رقم هاتف خدمة العملاء
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                dir="ltr"
                value={identity.supportPhone || ''}
                onChange={(e) => onChange({ ...identity, supportPhone: e.target.value })}
                placeholder="+966 5x xxx xxxx"
                className="w-full h-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              البريد الإلكتروني للدعم
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={identity.supportEmail || ''}
                onChange={(e) => onChange({ ...identity, supportEmail: e.target.value })}
                placeholder="support@store.com"
                className="w-full h-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              المدينة والمقر
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={identity.city || 'الرياض'}
                onChange={(e) => onChange({ ...identity, city: e.target.value })}
                placeholder="مثال: الرياض"
                className="w-full h-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              العنوان التفصيلي
            </label>
            <input
              type="text"
              value={identity.address || ''}
              onChange={(e) => onChange({ ...identity, address: e.target.value })}
              placeholder="الحي والشارع"
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            رابط المتجر السحابي المربوط (سلة / زد / شوبيفاي)
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="url"
                dir="ltr"
                value={identity.storeUrl}
                onChange={(e) => onChange({ ...identity, storeUrl: e.target.value })}
                className="w-full h-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 text-xs font-mono font-medium text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left"
              />
            </div>
            <button
              type="button"
              onClick={onTestSync}
              disabled={isTestingSync}
              className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-[#128C7E] text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSync ? 'animate-spin' : ''}`} />
              <span>فحص الربط</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

