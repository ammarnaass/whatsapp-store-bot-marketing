import React from 'react';
import {
  Store,
  CheckCircle2,
  Camera,
  RefreshCw,
  Globe,
  Languages
} from 'lucide-react';
import { StoreIdentity } from '../types/settings.types';

interface StoreIdentitySectionProps {
  identity: StoreIdentity;
  onChange: (updated: StoreIdentity) => void;
  onTestSync: () => void;
  isTestingSync: boolean;
}

export const StoreIdentitySection: React.FC<StoreIdentitySectionProps> = ({
  identity,
  onChange,
  onTestSync,
  isTestingSync
}) => {
  const updateField = <K extends keyof StoreIdentity>(key: K, value: StoreIdentity[K]) => {
    onChange({ ...identity, [key]: value });
  };

  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl p-6 elevation-1 flex flex-col justify-between">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#1F293D]/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                هوية المتجر والبيانات الأساسية
              </h2>
              <p className="text-xs text-slate-400">
                البيانات الرسمية المرتبطة بواجهة الواتساب الرسمية (WABA)
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 border border-emerald-200/50 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>WABA موثق رسمياً</span>
          </span>
        </div>

        {/* Store Logo Banner */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] mb-5">
          <div className="relative group shrink-0">
            <img
              src={identity.logoUrl}
              alt="Store Logo"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#128C7E]/30 elevation-1"
            />
            <button
              type="button"
              onClick={() => alert('تم فتح نافذة استعراض ملفات الشعار الجديد (PNG/JPG)')}
              className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
              title="تغيير الشعار"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              شعار العلامة التجارية النشط
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              يظهر للعملاء في بروفايل الواتساب الرسمي، الفواتير التلقائية، وبطاقات المنتجات.
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert('تم تحديد مسار تحديث الشعار')}
            className="h-[34px] px-3 rounded-xl wasell-btn-secondary elevation-1 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer shrink-0"
          >
            تحديث الشعار
          </button>
        </div>

        {/* Core Store Form Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم المتجر بالعربية
              </label>
              <input
                type="text"
                value={identity.storeNameAr}
                onChange={(e) => updateField('storeNameAr', e.target.value)}
                className="w-full h-[38px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم المتجر بالإنجليزية
              </label>
              <input
                type="text"
                value={identity.storeNameEn}
                onChange={(e) => updateField('storeNameEn', e.target.value)}
                dir="ltr"
                className="w-full h-[38px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E] text-left font-mono transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              رابط المنصة السحابية المربوطة (Salla / Zid)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={identity.storeUrl}
                  onChange={(e) => updateField('storeUrl', e.target.value)}
                  dir="ltr"
                  className="w-full h-[38px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E] text-left font-mono transition-all"
                />
              </div>
              <button
                type="button"
                onClick={onTestSync}
                disabled={isTestingSync}
                className="h-[38px] px-3.5 rounded-xl wasell-btn-secondary elevation-1 text-[#128C7E] text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingSync ? 'animate-spin' : ''}`} />
                <span>{isTestingSync ? 'جارٍ الفحص...' : 'اختبار المزامنة'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                العملة الافتراضية
              </label>
              <select
                value={identity.currency}
                onChange={(e) => updateField('currency', e.target.value)}
                className="w-full h-[38px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E] transition-all cursor-pointer"
              >
                <option value="SAR">ريال سعودي (SAR - ر.س)</option>
                <option value="AED">درهم إماراتي (AED - د.إ)</option>
                <option value="KWD">دينار كويتي (KWD - د.ك)</option>
                <option value="USD">دولار أمريكي (USD - $)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                المنطقة الزمنية
              </label>
              <select
                value={identity.timezone}
                onChange={(e) => updateField('timezone', e.target.value)}
                className="w-full h-[38px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E] transition-all cursor-pointer"
              >
                <option value="Asia/Riyadh">توقيت مكة المكرمة (GMT+03:00 الرياض)</option>
                <option value="Asia/Dubai">توقيت أبوظبي (GMT+04:00)</option>
                <option value="Africa/Cairo">توقيت القاهرة (GMT+02:00)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* AI Persona Dialect Selector */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1F293D] p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center shrink-0">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              لهجة وكيل الذكاء الاصطناعي
            </h4>
            <p className="text-[11px] text-slate-400">
              اللهجة السعودية البيضاء المحببة والمحترمة للعملاء الإقليميين
            </p>
          </div>
        </div>
        <select
          value={identity.aiDialect}
          onChange={(e) => updateField('aiDialect', e.target.value)}
          className="h-[36px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl px-3 focus:outline-none focus:border-[#128C7E] shrink-0 cursor-pointer elevation-1"
        >
          <option>اللهجة السعودية (نجدية / حجازية راقية)</option>
          <option>الفصحى المبسطة والمعاصرة</option>
          <option>اللهجة الخليجية العامة</option>
        </select>
      </div>
    </section>
  );
};
