import React from 'react';
import { Radio, Activity, RotateCcw, Check } from 'lucide-react';

interface ChannelsHeaderProps {
  isPingingServer: boolean;
  onTestPing: () => void;
  onTokenRegenerate: () => void;
  onSaveSettings: () => void;
}

export const ChannelsHeader: React.FC<ChannelsHeaderProps> = ({
  isPingingServer,
  onTestPing,
  onTokenRegenerate,
  onSaveSettings
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1">
      <div className="flex flex-col gap-1.5 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-bold text-[#128C7E] dark:text-emerald-400">
          <Radio className="w-4 h-4 animate-pulse text-[#128C7E]" />
          <span>بوابة واتساب المدمجة / OPENWA ENGINE v0.27 (REST & WEBHOOKS)</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          قنوات واتساب وبوابة الربط الفني (WhatsApp Channels & Gateway)
        </h1>
        <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400">
          إدارة الاتصال المحلي المباشر عبر OpenWA كقناة أساسية معتمدة لـ v1، ومراقبة الجلسات الحية وخطافات الويب (Webhooks) وتبسيط أمان الإرسال.
        </p>
      </div>

      {/* Global Technical Actions */}
      <div className="flex items-center flex-wrap gap-2.5">
        <button
          onClick={onTestPing}
          disabled={isPingingServer}
          type="button"
          className="h-[38px] flex items-center gap-2 px-3.5 rounded-xl wasell-btn-secondary elevation-1 text-xs font-bold transition-all cursor-pointer"
        >
          <Activity className={`w-4 h-4 text-[#128C7E] ${isPingingServer ? 'animate-spin' : ''}`} />
          <span>{isPingingServer ? 'جاري الفحص...' : 'فحص الاتصال (Test Ping)'}</span>
        </button>

        <button
          onClick={onTokenRegenerate}
          type="button"
          className="h-[38px] flex items-center gap-2 px-3.5 rounded-xl wasell-btn-secondary elevation-1 text-xs font-bold transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#7C3AED]" />
          <span>إعادة توليد الرمز المميز</span>
        </button>

        <button
          onClick={onSaveSettings}
          type="button"
          className="h-[38px] flex items-center gap-2 px-4 rounded-xl wasell-btn-primary elevation-2 glow-whatsapp text-xs font-bold transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>حفظ الإعدادات الفنية</span>
        </button>
      </div>
    </div>
  );
};
