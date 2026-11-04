import React from 'react';
import { RotateCcw, CheckCircle2, PauseCircle } from 'lucide-react';

interface SettingsHeaderProps {
  onSave: () => void;
  onRestore: () => void;
  onEmergencyStop: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onSave,
  onRestore,
  onEmergencyStop
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1F293D]">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            إعدادات التطبيق والمتجر الشاملة
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 border border-emerald-200/50">
            الإصدار 3.4.0
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          إدارة الهوية التجارية، سلوك الوكيل الذكي، إدارة الحساب وفريق العمل، تفضيلات الإشعارات، وسياسات الخصوصية والأمان لحساب متجرك في منصة WaSell.
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-2.5 shrink-0">
        <button
          onClick={onEmergencyStop}
          type="button"
          className="h-[38px] px-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all flex items-center gap-1.5 cursor-pointer elevation-1"
          title="إيقاف مؤقت للوكيل الذكي وتحويل المحادثات للإشراف البشري"
        >
          <PauseCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>إيقاف مؤقت للذكاء الاصطناعي</span>
        </button>

        <button
          onClick={onRestore}
          type="button"
          className="h-[38px] px-3.5 rounded-xl wasell-btn-secondary elevation-1 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>استعادة الإعدادات الافتراضية</span>
        </button>

        <button
          onClick={onSave}
          type="button"
          className="h-[38px] px-4 rounded-xl wasell-btn-primary elevation-2 glow-whatsapp text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>حفظ كافة التغييرات</span>
        </button>
      </div>
    </div>
  );
};
