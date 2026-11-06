import React from 'react';
import { ShoppingBag, Sliders, MessageSquare, MousePointerClick } from 'lucide-react';

interface Props {
  showCatalog: boolean;
  setShowCatalog: (val: boolean) => void;
  catalogLimit: number;
  setCatalogLimit: (val: number) => void;
  catalogCategoryFilter: string;
  setCatalogCategoryFilter: (val: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (val: string) => void;
  showQuickButtons: boolean;
  setShowQuickButtons: (val: boolean) => void;
}

export const TelegramBotCatalogSettings: React.FC<Props> = ({
  showCatalog, setShowCatalog, catalogLimit, setCatalogLimit,
  catalogCategoryFilter, setCatalogCategoryFilter,
  welcomeMessage, setWelcomeMessage, showQuickButtons, setShowQuickButtons,
}) => {
  return (
    <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-3.5 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#0088cc]" />
          <span className="font-extrabold text-slate-800 dark:text-slate-200">خيارات عرض الكتالوج ورسائل الترحيب</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={showCatalog} onChange={(e) => setShowCatalog(e.target.checked)} className="sr-only peer" />
          <div className="w-8 h-4 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0088cc]"></div>
        </label>
      </div>

      {showCatalog && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Sliders className="w-3 h-3" /> أقصى عدد منتجات بالكتالوج
            </label>
            <select
              value={catalogLimit}
              onChange={(e) => setCatalogLimit(Number(e.target.value))}
              className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
            >
              <option value={4}>4 منتجات</option>
              <option value={8}>8 منتجات (موصى به)</option>
              <option value={12}>12 منتجاً</option>
              <option value={16}>16 منتجاً</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              تصنيف المنتجات المعروضة
            </label>
            <select
              value={catalogCategoryFilter}
              onChange={(e) => setCatalogCategoryFilter(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
            >
              <option value="all">كافة التصنيفات والمنتجات</option>
              <option value="electronics">أجهزة وهواتف ذكية فقط</option>
              <option value="digital">بطاقات واشتراكات رقمية فقط</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <MousePointerClick className="w-3.5 h-3.5 text-purple-500" />
          <span className="font-bold text-[11px]">أزرار التفاعل السريع التفاعلية (Inline Keyboard)</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={showQuickButtons} onChange={(e) => setShowQuickButtons(e.target.checked)} className="sr-only peer" />
          <div className="w-8 h-4 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
          <MessageSquare className="w-3 h-3" /> رسالة الترحيب المخصصة (اختياري)
        </label>
        <input
          type="text"
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          placeholder="أهلاً بك في متجرنا! تفضل بالاطلاع على أحدث عروضنا..."
          className="w-full h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
        />
      </div>
    </div>
  );
};

