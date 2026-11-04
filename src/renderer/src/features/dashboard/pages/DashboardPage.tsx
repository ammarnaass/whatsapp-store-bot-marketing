import React, { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import {
  TrendingUp,
  ShoppingBag,
  Bot,
  MessageSquare,
  DollarSign,
  Download,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { SalesChart } from '../components/SalesChart';
import { OrderStatusDonut } from '../components/OrderStatusDonut';
import { TopProductsList } from '../components/TopProductsList';
import { AiActivityFeed } from '../components/AiActivityFeed';
import { AlertsPanel } from '../components/AlertsPanel';
import { useDataStore } from '../../data-management';

export const DashboardPage: React.FC = () => {
  const { kpis, refresh } = useDashboardData();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const isMockDataActive = useDataStore((state) => state.isMockDataActive);
  const orders = useDataStore((state) => state.orders);
  const chats = useDataStore((state) => state.chats);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Status Bar matching Stitch Screen 01 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              نظرة عامة على المبيعات والتجارة الذكية
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
              isMockDataActive
                ? 'bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 border-emerald-200/50'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              {isMockDataActive ? 'بيانات تجريبية نشطة' : 'وضع البيانات النظيفة'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isMockDataActive
              ? 'يراقب وكيل WaSell الذكي حالياً 1,280 محادثة، مع معدل تحويل آلي يتجاوز 84% خلال اليوم.'
              : 'النظام في وضع البيانات الحقيقية النظيفة (فارغ). بانتظار بدء أول محادثة أو طلب عبر واتساب.'}
          </p>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => alert('تم تصدير تقرير أداء اليوم بنجاح')}
            type="button"
            className="h-[38px] inline-flex items-center gap-2 px-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 elevation-1 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>تصدير تقرير اليوم</span>
          </button>

          <button
            onClick={refresh}
            type="button"
            className="h-[38px] inline-flex items-center gap-2 px-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] text-[#128C7E] text-xs font-bold hover:bg-emerald-50 dark:hover:bg-[#128C7E]/10 elevation-1 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>تحديث المؤشرات</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS (4-Column Grid with Signature Stitch Accents) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: مبيعات اليوم عبر الواتساب */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-[#128C7E]"></div>
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">مبيعات اليوم عبر الواتساب</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isMockDataActive ? '14,850' : '0'}
            </span>
            <span className="text-xs font-bold text-slate-400">ر.س</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-[#1F293D]">
            <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full ${
              isMockDataActive
                ? 'text-emerald-600 bg-emerald-50 dark:bg-[#128C7E]/20'
                : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
            }`}>
              {isMockDataActive && <ArrowUpRight className="w-3.5 h-3.5" />}
              {isMockDataActive ? '+18.4%' : '0%'}
            </span>
            <span className="text-slate-400">{isMockDataActive ? 'مقارنة بيوم أمس' : 'لا توجد مقارنة'}</span>
          </div>
        </div>

        {/* Card 2: الطلبات الجديدة والذكاء الاصطناعي */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-[#7C3AED]"></div>
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">الطلبات الجديدة</span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {orders.length}
            </span>
            <span className="text-xs font-bold text-slate-400">طلب مؤكد</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-[#1F293D]">
            <span className="inline-flex items-center gap-1 text-[#7C3AED] font-bold bg-violet-50 dark:bg-[#7C3AED]/20 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              {isMockDataActive ? '88 طلب آلي (62%)' : '0 طلب آلي'}
            </span>
            <span className="text-slate-400">أغلقها الوكيل الذكي</span>
          </div>
        </div>

        {/* Card 3: نسبة المحادثات المدارة (AI vs Human) */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-[#128C7E]"></div>
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">كفاءة الأتمتة بالمحادثات</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-black text-[#7C3AED]">
              {isMockDataActive ? '84%' : '0%'} <span className="text-xs font-normal text-slate-400">آلي</span>
            </span>
            <span className="text-xl font-bold text-[#128C7E]">
              {isMockDataActive ? '16%' : '0%'} <span className="text-xs font-normal text-slate-400">بشري</span>
            </span>
          </div>
          {/* Dual progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex mb-2">
            <div className="bg-[#7C3AED] h-full transition-all duration-500" style={{ width: isMockDataActive ? '84%' : '0%' }} title="ذكاء اصطناعي"></div>
            <div className="bg-[#128C7E] h-full transition-all duration-500" style={{ width: isMockDataActive ? '16%' : '0%' }} title="تدخل بشري"></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>إجمالي {chats.length} محادثات مسجلة</span>
            <span className="font-bold text-[#128C7E]">{isMockDataActive ? 'وفّر 48 ساعة' : '0 ساعات'}</span>
          </div>
        </div>

        {/* Card 4: تحويلات معلقة للموظفين (Handoffs) */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500"></div>
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">تحويلات معلقة للموظفين</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-amber-600 tracking-tight">
              {isMockDataActive ? '1' : '0'}
            </span>
            <span className="text-xs font-bold text-slate-400">محادثة بانتظار الرد</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-[#1F293D]">
            <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full ${
              isMockDataActive
                ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
            }`}>
              {isMockDataActive ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  مطلوب تدخل بشري
                </>
              ) : (
                'لا توجد تحويلات معلقة'
              )}
            </span>
            {isMockDataActive && (
              <span className="text-xs font-bold text-[#128C7E] flex items-center">
                استلام المحادثة <ChevronLeft className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ROW 1: 30-Day Sales Chart + Order Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SalesChart totalRevenue={isMockDataActive ? (kpis?.totalRevenue || 14850) : 0} />
        </div>
        <div className="lg:col-span-4">
          <OrderStatusDonut />
        </div>
      </div>

      {/* ROW 2: Top Products + Live AI Feed + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopProductsList />
        <AiActivityFeed />
        <AlertsPanel />
      </div>
    </div>
  );
};
