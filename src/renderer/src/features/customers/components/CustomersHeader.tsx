import React from 'react';
import { Sparkles, RefreshCw, Download, Megaphone } from 'lucide-react';

interface CustomersHeaderProps {
  onSync: () => void;
  onExport: () => void;
  onLaunchCampaign: () => void;
}

export const CustomersHeader: React.FC<CustomersHeaderProps> = ({
  onSync,
  onExport,
  onLaunchCampaign
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            إدارة العملاء وذكاء الجمهور
          </h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-100 dark:bg-[#7C3AED]/20 text-[#7C3AED] border border-violet-200/50">
            <Sparkles className="w-3.5 h-3.5" />
            تحليلات ذكية ومحادثات مخصصة
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          تحليل وتصنيف العملاء استناداً إلى سلوك الشراء والمحادثات التلقائية عبر واتساب مع حساب
          القيمة الدائمة (LTV).
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center flex-wrap gap-2.5">
        <button
          onClick={onSync}
          type="button"
          className="h-[38px] inline-flex items-center gap-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer elevation-1"
        >
          <RefreshCw className="w-4 h-4 text-[#128C7E]" />
          <span>مزامنة العملاء مع المتجر</span>
        </button>
        <button
          onClick={onExport}
          type="button"
          className="h-[38px] inline-flex items-center gap-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer elevation-1"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>تصدير القائمة (CSV / Excel)</span>
        </button>
        <button
          onClick={onLaunchCampaign}
          type="button"
          className="h-[38px] inline-flex items-center gap-2 px-4 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold shadow-md shadow-[#128C7E]/25 transition-all cursor-pointer glow-whatsapp"
        >
          <Megaphone className="w-4 h-4" />
          <span>إطلاق حملة واتساب مستهدفة</span>
        </button>
      </div>
    </div>
  );
};
