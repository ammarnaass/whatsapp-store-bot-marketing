import React from 'react';
import { Smartphone, Cloud, Layers, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface ProviderSelectorCardProps {
  activeProvider: 'openwa_gateway' | 'meta_cloud';
  onProviderChange: (provider: 'openwa_gateway' | 'meta_cloud') => void;
}

export const ProviderSelectorCard: React.FC<ProviderSelectorCardProps> = ({
  activeProvider,
  onProviderChange,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-[#1F293D] rounded-2xl p-5 elevation-1 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="p-1 rounded-lg bg-[#128C7E]/10 text-[#128C7E] dark:bg-[#128C7E]/20">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              المحرك المزدوج لقنوات واتساب (Dual WhatsApp Architecture)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            اختر محرك الإرسال والاستقبال النشط؛ يمكنك التبديل بحرية دون فقدان أي رسائل أو محادثات.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-500 px-2">القناة النشطة:</span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#128C7E] text-white flex items-center gap-1.5 elevation-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {activeProvider === 'meta_cloud' ? 'Meta Cloud API (رسمي)' : 'OpenWA QR (محلي)'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: OpenWA Gateway */}
        <button
          type="button"
          onClick={() => onProviderChange('openwa_gateway')}
          className={`relative text-right p-4 rounded-xl border transition-all cursor-pointer ${
            activeProvider === 'openwa_gateway'
              ? 'border-[#128C7E] bg-emerald-50/50 dark:bg-[#128C7E]/10 ring-2 ring-[#128C7E]/20'
              : 'border-slate-200 dark:border-[#1F293D] hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-[#128C7E] dark:text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              مجاني - مسح QR
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            بوابة OpenWA الذاتية (Local QR Gateway)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            ربط فوري لأي رقم واتساب شخصي أو تجاري بمسح رمز QR دون الحاجة لسجل تجاري لدى Meta.
          </p>
        </button>

        {/* Option 2: Meta Cloud API */}
        <button
          type="button"
          onClick={() => onProviderChange('meta_cloud')}
          className={`relative text-right p-4 rounded-xl border transition-all cursor-pointer ${
            activeProvider === 'meta_cloud'
              ? 'border-[#128C7E] bg-emerald-50/50 dark:bg-[#128C7E]/10 ring-2 ring-[#128C7E]/20'
              : 'border-slate-200 dark:border-[#1F293D] hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-lg bg-violet-500/10 text-[#7C3AED] dark:text-violet-400">
              <Cloud className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
              رسمي - Graph API v19.0
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            بوابة WhatsApp Cloud API المباشرة
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            ربط سحابي رسمي عالي الاستقرار مع خطافات الويب (Webhooks) وقوالب الرسائل المعتمدة.
          </p>
        </button>
      </div>
    </div>
  );
};
