import React from 'react';
import { Smartphone, Cloud, Layers, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ChannelProviderType } from '../../../../shared/types';

interface ProviderSelectorCardProps {
  activeProvider: ChannelProviderType;
  onProviderChange: (provider: ChannelProviderType) => void;
}

export const ProviderSelectorCard: React.FC<ProviderSelectorCardProps> = ({
  activeProvider,
  onProviderChange,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-[#1F293D] rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#128C7E]/10 text-[#128C7E] dark:bg-[#128C7E]/20">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              محرك قنوات الربط المزدوج (Dual-Engine Architecture)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            حدد محرك الربط النشط لإرسال واستقبال رسائل متجرك وتفاعل وكيل الذكاء الاصطناعي
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 px-2">
            المحرك المفعل:
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#128C7E] text-white flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {activeProvider === 'openwa_gateway'
              ? 'OpenWA Gateway'
              : activeProvider === 'meta_cloud'
              ? 'Meta Cloud API'
              : 'محرك هجين تلقائي'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-[#128C7E] dark:text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            {activeProvider === 'openwa_gateway' && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#128C7E] animate-pulse"></span>
            )}
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            بوابة OpenWA المفتوحة
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            ربط مجاني مباشر عبر مسح رمز QR بدون أي رسوم لكل محادثة من Meta، مثالي للوكيل التوليدي.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#128C7E] dark:text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
            <span>0.00 ر.س / محادثة (تكلفة صفرية)</span>
          </div>
        </button>

        {/* Option 2: Meta Cloud API */}
        <button
          type="button"
          onClick={() => onProviderChange('meta_cloud')}
          className={`relative text-right p-4 rounded-xl border transition-all cursor-pointer ${
            activeProvider === 'meta_cloud'
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 ring-2 ring-blue-500/20'
              : 'border-slate-200 dark:border-[#1F293D] hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Cloud className="w-5 h-5" />
            </div>
            {activeProvider === 'meta_cloud' && (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            )}
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            سحابة Meta Cloud API الرسمية
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            القناة المعتمدة لتوثيق المتجر بالعلامة الخضراء وبث الحملات التسويقية الواسعة (HSM).
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>معتمد رسمياً مع اتفاقية SLA</span>
          </div>
        </button>

        {/* Option 3: Hybrid Routing */}
        <button
          type="button"
          onClick={() => onProviderChange('hybrid')}
          className={`relative text-right p-4 rounded-xl border transition-all cursor-pointer ${
            activeProvider === 'hybrid'
              ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-500/10 ring-2 ring-purple-500/20'
              : 'border-slate-200 dark:border-[#1F293D] hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            {activeProvider === 'hybrid' && (
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
            )}
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            المحرك الهجين الذكي (موصى به)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            توجيه الحملات الكبرى عبر قوالب Meta، ومعالجة محادثات المبيعات والاستفسارات مجاناً عبر OpenWA.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
            <Zap className="w-3.5 h-3.5" />
            <span>توجيه ذكي وموفر للتكلفة</span>
          </div>
        </button>
      </div>
    </div>
  );
};
