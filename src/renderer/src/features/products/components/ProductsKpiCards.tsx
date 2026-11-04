import React from 'react';
import { Package, TrendingUp, Bot, Sparkles, AlertTriangle } from 'lucide-react';
import { CatalogProduct } from '../types/products.types';

interface ProductsKpiCardsProps {
  products: CatalogProduct[];
}

export const ProductsKpiCards: React.FC<ProductsKpiCardsProps> = ({ products }) => {
  const hasProducts = products.length > 0;
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Total Catalog */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            إجمالي المنتجات المعروضة
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {hasProducts ? '1,420' : 0}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#128C7E] bg-emerald-50 dark:bg-[#128C7E]/20 px-2.5 py-0.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            +45 هذا الشهر
          </span>
        </div>
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#128C7E] h-full rounded-full transition-all duration-500" style={{ width: hasProducts ? '88%' : '0%' }}></div>
        </div>
      </div>

      {/* Card 2: AI WhatsApp Sales */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            مبيعات الكتالوج عبر واتساب
          </span>
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {hasProducts ? '56,200' : 0}
            </span>
            <span className="text-xs text-slate-400 font-bold">ر.س</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] bg-violet-50 dark:bg-[#7C3AED]/20 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            68% من الإجمالي
          </span>
        </div>
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#7C3AED] h-full rounded-full transition-all duration-500" style={{ width: hasProducts ? '68%' : '0%' }}></div>
        </div>
      </div>

      {/* Card 3: Avg Conversion */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            متوسط التحويل للكتالوج
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {hasProducts ? '91.4%' : '0%'}
          </span>
          <span className="text-xs text-slate-400 font-medium">إتمام بيع مباشر</span>
        </div>
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#128C7E] h-full rounded-full transition-all duration-500" style={{ width: hasProducts ? '91.4%' : '0%' }}></div>
        </div>
      </div>

      {/* Card 4: Low Stock Alert */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            منتجات بانتظار التوريد
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-3xl font-black text-amber-600 font-mono tabular-nums">
            {lowStockCount}
          </span>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full">
            مخزون حرج (أقل من 10)
          </span>
        </div>
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: hasProducts ? '35%' : '0%' }}></div>
        </div>
      </div>
    </section>
  );
};
