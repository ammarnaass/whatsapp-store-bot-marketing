import React from 'react';
import { Sparkles, Camera } from 'lucide-react';
import { StoreIdentity } from '../../types/settings.types';

interface BrandIdentityCardProps {
  identity: StoreIdentity;
  onChange: (updated: StoreIdentity) => void;
  onOpenLogoModal: () => void;
}

export const BrandIdentityCard: React.FC<BrandIdentityCardProps> = ({
  identity,
  onChange,
  onOpenLogoModal,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">العلامة التجارية والهوية البصرية</h3>
          <p className="text-[11px] text-slate-400">الاسم والشعار الرسمي وسلوجان المتجر في رسائل الواتساب</p>
        </div>
      </div>

      {/* Logo Banner */}
      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
        <div className="relative group shrink-0">
          <img
            src={identity.logoUrl}
            alt="Store Logo"
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#128C7E]/30"
          />
          <button
            type="button"
            onClick={onOpenLogoModal}
            className="absolute inset-0 bg-black/45 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
            title="تحديث الشعار"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">شعار المتجر الرسمي</h4>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">يظهر في بروفايل واتساب والفواتير الضريبية</p>
        </div>
        <button
          type="button"
          onClick={onOpenLogoModal}
          className="h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shrink-0"
        >
          تغيير الشعار
        </button>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              اسم المتجر بالعربية
            </label>
            <input
              type="text"
              value={identity.storeNameAr}
              onChange={(e) => onChange({ ...identity, storeNameAr: e.target.value })}
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              اسم المتجر بالإنجليزية
            </label>
            <input
              type="text"
              value={identity.storeNameEn}
              onChange={(e) => onChange({ ...identity, storeNameEn: e.target.value })}
              dir="ltr"
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            السلوجان التسويقي القصير (Slogan)
          </label>
          <input
            type="text"
            value={identity.storeSlogan || ''}
            onChange={(e) => onChange({ ...identity, storeSlogan: e.target.value })}
            placeholder="مثال: وجهتك الأولى للتسوق الذكي والتوصيل الفوري"
            className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#128C7E]"
          />
        </div>
      </div>
    </div>
  );
};

