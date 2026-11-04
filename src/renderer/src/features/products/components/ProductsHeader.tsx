import React from 'react';
import { Download, RefreshCw, Plus } from 'lucide-react';

interface ProductsHeaderProps {
  onExport: () => void;
  onSync: () => void;
  onAddNew: () => void;
  totalCount: number;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  onExport,
  onSync,
  onAddNew,
  totalCount
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            إدارة المنتجات وكتالوج واتساب الذكي
          </h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 text-xs font-bold border border-emerald-200/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            سلة &amp; زد متصلان
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          مزامنة تلقائية للمنتجات من منصتك التجارية، مع تمكين وكيل الذكاء الاصطناعي من اقتراحها وإرسال بطاقات الشراء التفاعلية عبر محادثات واتساب بنقرة واحدة.
        </p>
        <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
          <RefreshCw className="w-3.5 h-3.5 text-[#128C7E]" />
          <span>آخر مزامنة قبل 8 دقائق</span>
          <span>•</span>
          <span className="font-bold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
            {totalCount.toLocaleString('ar-SA')} منتج مسجل بالكتالوج
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onExport}
          type="button"
          className="h-[38px] inline-flex items-center gap-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer elevation-1"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>تصدير الكتالوج</span>
        </button>
        <button
          onClick={onSync}
          type="button"
          className="h-[38px] inline-flex items-center gap-2 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#128C7E] text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer elevation-1"
        >
          <RefreshCw className="w-4 h-4" />
          <span>مزامنة فورية (سلة / زد)</span>
        </button>
        <button
          onClick={onAddNew}
          type="button"
          className="h-[38px] inline-flex items-center gap-2 px-4 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold shadow-md shadow-[#128C7E]/25 transition-all cursor-pointer glow-whatsapp"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>
    </div>
  );
};
