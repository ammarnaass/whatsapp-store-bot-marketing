import React from 'react';
import { AlertTriangle, PauseCircle, X } from 'lucide-react';

interface KillSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const KillSwitchModal: React.FC<KillSwitchModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-3xl border border-slate-200 dark:border-[#1F293D] elevation-4 p-6 space-y-4 animate-in zoom-in-95 duration-150 relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 left-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-2">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            إيقاف مؤقت للوكيل الذكي؟
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            سيتم تحويل جميع المحادثات الجديدة والاستفسارات الواردة على الواتساب إلى طابور التدخل البشري فوراً. لن يقوم الذكاء الاصطناعي بإرسال أي عروض أو روابط دفع ذاتية حتى إعادة التشغيل.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1F293D]">
          <button
            type="button"
            onClick={onClose}
            className="h-[38px] px-4 rounded-xl wasell-btn-secondary elevation-1 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
          >
            إلغاء التراجع
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-[38px] px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-2 elevation-2 shadow-rose-600/20 cursor-pointer"
          >
            <PauseCircle className="w-4 h-4" />
            <span>تأكيد الإيقاف المؤقت</span>
          </button>
        </div>
      </div>
    </div>
  );
};
