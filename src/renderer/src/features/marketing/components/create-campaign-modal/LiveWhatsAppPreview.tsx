import React from 'react';
import { CheckCheck } from 'lucide-react';
import { parseTemplatePreview } from '../../utils/template-parser';

interface LiveWhatsAppPreviewProps {
  template: string;
}

export const LiveWhatsAppPreview: React.FC<LiveWhatsAppPreviewProps> = ({ template }) => {
  const renderedMessage = parseTemplatePreview(template);

  return (
    <div className="bg-[#EFEAE2] dark:bg-[#0B141A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[220px]">
      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 text-center">
        معاينة حية لشكل الرسالة عند العميل في واتساب
      </div>

      {/* فقاعة رسالة واتساب الخضراء */}
      <div className="self-end max-w-[85%] bg-[#DCF8C6] dark:bg-[#005C4B] text-slate-900 dark:text-[#E9EDEF] p-3 rounded-2xl rounded-tr-none shadow-xs text-xs space-y-1 relative">
        <p className="leading-relaxed whitespace-pre-wrap select-text">{renderedMessage || 'أدخل نص الرسالة...'}</p>
        <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 dark:text-emerald-200/70 pt-0.5">
          <span>{new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
          <CheckCheck className="w-3.5 h-3.5 text-blue-500 dark:text-emerald-300" />
        </div>
      </div>

      <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2">
        يتم استبدال الرموز تلقائياً ببيانات كل عميل
      </div>
    </div>
  );
};

