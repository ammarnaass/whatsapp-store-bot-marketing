import React from 'react';
import { ShoppingBag, TrendingUp, Bot, Sparkles, ShoppingCart, Truck } from 'lucide-react';
import { OrderItem } from '../types/orders.types';

interface OrdersKpisProps {
  orders: OrderItem[];
}

export const OrdersKpis: React.FC<OrdersKpisProps> = ({ orders }) => {
  const hasOrders = orders.length > 0;
  const shippingCount = orders.filter((o) => o.fulfillmentStatus === 'shipping').length;
  const aiOrdersCount = orders.filter((o) => o.source === 'agent').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Today's GMV */}
      <div className="relative overflow-hidden bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">إجمالي مبيعات اليوم</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                {hasOrders ? '38,920' : 0}
              </span>
              <span className="text-xs font-bold text-slate-400">ر.س</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-[#1F293D] text-xs">
          <span className="text-[#128C7E] font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +24.6% عن الأمس
          </span>
          <span className="text-slate-400 font-medium font-mono tabular-nums">{orders.length} طلب مؤكد</span>
        </div>
      </div>

      {/* Card 2: AI Autonomous Conversions */}
      <div className="relative overflow-hidden bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">إغلاق آلي بـ WaSell AI</span>
              <span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-[#7C3AED] font-mono tabular-nums">
                {hasOrders ? aiOrdersCount : 0}
              </span>
              <span className="text-xs font-bold text-[#7C3AED] font-mono tabular-nums">
                {hasOrders ? `طلباً (${Math.round((aiOrdersCount / (orders.length || 1)) * 100)}%)` : 'طلباً (0%)'}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-[#1F293D] text-xs">
          <span className="text-[#7C3AED] font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            متوسط الإغلاق: دقيقتان
          </span>
          <span className="text-slate-400 font-medium">بدون تدخل بشري</span>
        </div>
      </div>

      {/* Card 3: Recovered Abandoned Carts */}
      <div className="relative overflow-hidden bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">سلات مسترجعة بالواتساب</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                {hasOrders ? '4,680' : 0}
              </span>
              <span className="text-xs font-bold text-slate-400">ر.س</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-[#1F293D] text-xs">
          <span className="text-[#128C7E] font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            18 سلة تم استرجاعها
          </span>
          <span className="text-slate-400 font-medium">معدل تحويل 42%</span>
        </div>
      </div>

      {/* Card 4: Orders in Shipping */}
      <div className="relative overflow-hidden bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">طلبات قيد الشحن والتسليم</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-blue-600 font-mono tabular-nums">
                {shippingCount}
              </span>
              <span className="text-xs font-bold text-slate-400">شحنة نشطة</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-[#1F293D] text-xs">
          <span className="text-blue-600 font-bold">سمسا، أرامكس، سبل</span>
          <span className="text-slate-400 font-medium">بوالص صادرة آلياً</span>
        </div>
      </div>
    </div>
  );
};
