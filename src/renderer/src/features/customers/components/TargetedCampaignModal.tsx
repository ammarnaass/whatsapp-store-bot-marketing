import React from 'react';
import { X, Megaphone, Send, CheckCircle2 } from 'lucide-react';

interface TargetedCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  campaignTitle: string;
  onTitleChange: (title: string) => void;
  campaignText: string;
  onTextChange: (text: string) => void;
  targetCount: number;
}

export const TargetedCampaignModal: React.FC<TargetedCampaignModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  campaignTitle,
  onTitleChange,
  campaignText,
  onTextChange,
  targetCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F293D]">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#128C7E]" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              إطلاق حملة واتساب مستهدفة للجمهور
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              اسم الحملة
            </label>
            <input
              type="text"
              value={campaignTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              نص الرسالة التسويقية (يدعم المتغيرات مثل {'{الاسم}'})
            </label>
            <textarea
              rows={4}
              value={campaignText}
              onChange={(e) => onTextChange(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 leading-relaxed"
            />
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-[#128C7E]/20 rounded-xl text-[11px] text-[#075E54] dark:text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#128C7E]" />
            <span>
              سيتم إرسال الحملة إلى {targetCount} عميل مستهدف مع تأخير عشوائي لحماية الرقم من الحظر.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs font-bold cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-5 py-2 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>إطلاق الحملة الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
