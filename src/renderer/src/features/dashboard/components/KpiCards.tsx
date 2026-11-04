import React from 'react';
import { DollarSign, ShoppingCart, Bot, MessageSquare, ArrowUpRight, Sparkles, Clock } from 'lucide-react';
import { DashboardKPIs } from '../../../../shared/types';

interface KpiCardsProps {
  kpis: DashboardKPIs | null;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. مبيعات اليوم */}
      <div className="wasell-card p-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>مبيعات اليوم (Today's Sales)</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#128C7E] flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
          ${kpis?.totalRevenue ? (kpis.totalRevenue * 0.35).toFixed(0) : '340'}
        </div>
        <p className="text-[11px] text-[#128C7E] font-bold flex items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>+14.2% مقارنة بالأمس</span>
        </p>
      </div>

      {/* 2. الطلبات الجديدة */}
      <div className="wasell-card p-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>الطلبات الجديدة (New Orders)</span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
          {kpis?.totalOrders || 8}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          3 طلبات بانتظار الشحن والتأكيد
        </p>
      </div>

      {/* 3. نسبة محادثات الوكيل الذكي */}
      <div className="wasell-card p-5 space-y-2 border-violet-500/30">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 text-[#7C3AED] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            ردود الوكيل vs الإنسان
          </span>
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-[#7C3AED] flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold font-mono tracking-tight text-[#7C3AED]">
          {kpis?.agentHandledPercentage || 85}% AI
        </div>
        <p className="text-[11px] text-[#7C3AED] font-bold">
          15% فقط تطلبت تدخلاً بشرياً
        </p>
      </div>

      {/* 4. التسليمات المعلقة للموظف */}
      <div className="wasell-card p-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>تسليمات للموظف (Handoffs)</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold font-mono tracking-tight text-amber-500">
          {kpis?.waitingHumanCount || 1}
        </div>
        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>متوسط وقت الرد: 1.8 دقيقة</span>
        </p>
      </div>
    </div>
  );
};
