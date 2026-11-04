import React from 'react';
import { DollarSign, ArrowUpRight, TrendingUp, Zap, Star, ShoppingCart } from 'lucide-react';

export const AnalyticsKpiCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1: WhatsApp Attributed Revenue */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              إجمالي إيرادات واتساب
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white">342,800</span>
              <span className="text-xs font-bold text-slate-400">ر.س</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        {/* Sparkline SVG */}
        <div className="my-3">
          <svg
            className="w-full h-8 overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 100 25"
          >
            <path
              className="text-[#128C7E]"
              d="M 0 20 Q 20 22, 35 12 T 70 8 T 100 3"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.5"
            ></path>
            <path
              className="text-[#128C7E]/10"
              d="M 0 20 Q 20 22, 35 12 T 70 8 T 100 3 L 100 25 L 0 25 Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-[#1F293D] text-xs">
          <div className="flex items-center gap-1 font-bold text-[#128C7E] font-mono tabular-nums">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+28.4%</span>
            <span className="text-slate-400 font-normal">مقارنة بالشهر السابق</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-violet-100 dark:bg-[#7C3AED]/20 text-[#7C3AED]">
            81.2% عبر AI
          </span>
        </div>
      </div>

      {/* KPI 2: Overall Conversion Rate */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              معدل التحويل عبر المحادثات
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white">24.8%</span>
              <span className="text-xs font-bold font-mono tabular-nums text-[#128C7E]">+4.1%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="my-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>متوسط المتاجر (3.2%)</span>
            <span className="text-[#128C7E] font-bold font-mono tabular-nums">تفوق بمقدار 7.7x</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-[#128C7E] h-full rounded-full transition-all duration-500" style={{ width: '78%' }}></div>
          </div>
        </div>
        <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-100 dark:border-[#1F293D]">
          <Zap className="w-3.5 h-3.5 text-[#128C7E]" />
          <span>توفير 410 ساعات تدخل بشري شهرياً</span>
        </div>
      </div>

      {/* KPI 3: AI CSAT & Response Precision */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              دقة ورضا العميل عن وكيل AI
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono tabular-nums text-[#7C3AED]">96.4%</span>
              <span className="text-xs text-slate-400 font-bold">CSAT</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center font-bold">
            <Star className="w-5 h-5" />
          </div>
        </div>
        <div className="my-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">مبني على 4,820 محادثة</span>
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-[#1F293D] text-xs">
          <span className="text-slate-500">متوسط زمن الاستجابة:</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">1.4 ثانية</span>
        </div>
      </div>

      {/* KPI 4: Abandoned Cart Recovery ROI */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              عوائد استرجاع السلات المهجورة
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white">48,250</span>
              <span className="text-xs font-bold text-slate-400">ر.س</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>
        <div className="my-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>نسبة إنقاذ السلات</span>
            <span className="text-[#128C7E] font-bold font-mono tabular-nums">41.2%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-[#128C7E] h-full rounded-full transition-all duration-500" style={{ width: '41.2%' }}></div>
          </div>
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-[#1F293D] text-xs">
          <span className="text-slate-500">تم إنقاذ:</span>
          <span className="font-bold text-[#128C7E] font-mono tabular-nums">118 سلة متروكة</span>
        </div>
      </div>
    </div>
  );
};
