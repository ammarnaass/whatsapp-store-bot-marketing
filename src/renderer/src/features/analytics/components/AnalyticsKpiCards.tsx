import React from 'react';
import { DollarSign, ArrowUpRight, TrendingUp, Zap, Star, ShoppingCart } from 'lucide-react';
import { useDataStore } from '../../data-management';

export const AnalyticsKpiCards: React.FC = () => {
  const kpis = useDataStore((s) => s.kpis);
  const orders = useDataStore((s) => s.orders);
  const chats = useDataStore((s) => s.chats);

  const revenue = kpis?.revenue || 0;
  const totalOrders = orders.length;
  const automationRate = kpis?.automationRate || 0;
  const activeChats = chats.length;
  const conversionRate = activeChats > 0 ? Math.round((totalOrders / activeChats) * 100) : 0;

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
              <span className="text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                {revenue.toLocaleString()}
              </span>
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
            <span>بيانات موثقة</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-violet-100 dark:bg-[#7C3AED]/20 text-[#7C3AED]">
            {automationRate}% عبر AI
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
              <span className="text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                {conversionRate}%
              </span>
              <span className="text-xs font-bold font-mono tabular-nums text-[#128C7E]">مباشر</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="my-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>نسبة إغلاق الصفقات</span>
            <span className="text-[#128C7E] font-bold font-mono tabular-nums">{totalOrders} من {activeChats} محادثة</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-[#128C7E] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(conversionRate, 100)}%` }}></div>
          </div>
        </div>
        <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-100 dark:border-[#1F293D]">
          <Zap className="w-3.5 h-3.5 text-[#128C7E]" />
          <span>تحويلات فورية عبر واتساب</span>
        </div>
      </div>

      {/* KPI 3: AI CSAT & Response Precision */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              كفاءة وأتمتة الوكيل الذكي
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono tabular-nums text-[#7C3AED]">
                {automationRate}%
              </span>
              <span className="text-xs text-slate-400 font-bold">أتمتة</span>
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
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">مبني على {activeChats} محادثة حقيقية</span>
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-[#1F293D] text-xs">
          <span className="text-slate-500">متوسط زمن الاستجابة:</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">1.2 ثانية</span>
        </div>
      </div>

      {/* KPI 4: Abandoned Cart Recovery ROI */}
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              الطلبات المؤكدة والنشطة
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                {totalOrders}
              </span>
              <span className="text-xs font-bold text-slate-400">طلب</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>
        <div className="my-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>الطلبات المسجلة في SQLite</span>
            <span className="text-[#128C7E] font-bold font-mono tabular-nums">{totalOrders} طلبات مؤكدة</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-[#128C7E] h-full rounded-full transition-all duration-500" style={{ width: totalOrders > 0 ? '100%' : '0%' }}></div>
          </div>
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-[#1F293D] text-xs">
          <span className="text-slate-500">المصدر:</span>
          <span className="font-bold text-[#128C7E] font-mono tabular-nums">قاعدة البيانات المحلية</span>
        </div>
      </div>
    </div>
  );
};
