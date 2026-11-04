import React from 'react';
import { ShoppingBag, CreditCard, Sparkles, ThumbsUp, Lightbulb, Package } from 'lucide-react';
import { ChatItem } from '../types/inbox.types';

interface CustomerDetailSidebarProps {
  chat: ChatItem | null;
  onSendPaymentLink: () => void;
}

export const CustomerDetailSidebar: React.FC<CustomerDetailSidebarProps> = ({
  chat,
  onSendPaymentLink
}) => {
  if (!chat) {
    return (
      <section className="col-span-12 lg:col-span-3 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs">
        <span>لا توجد تفاصيل عميل محددة</span>
      </section>
    );
  }

  return (
    <section className="col-span-12 lg:col-span-3 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 flex flex-col overflow-y-auto p-4 space-y-4 h-full">
      {/* Customer Identity Profile Card */}
      <div className="flex flex-col items-center text-center p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/60">
        <div className="relative mb-2">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#128C7E]/20"
          />
          <span className="absolute bottom-0 right-0 bg-[#075E54] text-white px-2 py-0.5 rounded-full text-[11px] font-bold">
            VIP 2
          </span>
        </div>
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{chat.name}</h4>
        <span className="text-xs text-slate-400 font-medium">الرياض، حي النرجس</span>
        <span className="text-[11px] text-[#128C7E] font-bold mt-0.5">عميل نشط منذ 8 أشهر</span>

        <div className="grid grid-cols-2 gap-2 w-full mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center elevation-1">
            <span className="text-[11px] text-slate-400 block font-bold">الطلبات السابقة</span>
            <span className="text-xs font-black font-mono tabular-nums text-slate-900 dark:text-white">3 طلبات</span>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center elevation-1">
            <span className="text-[11px] text-slate-400 block font-bold">القيمة الدائمة (LTV)</span>
            <span className="text-xs font-black font-mono tabular-nums text-[#128C7E]">1,420 ر.س</span>
          </div>
        </div>
      </div>

      {/* Live WhatsApp Cart Summary */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-[#128C7E]" />
            السلة المفتوحة بالواتساب
          </h4>
          <span className="text-[11px] text-[#075E54] dark:text-emerald-300 font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 px-2 py-0.5 rounded-full">
            منتجان
          </span>
        </div>

        <div className="space-y-2">
          {/* Cart Item 1 */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-[#1F293D]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#128C7E]/20 flex items-center justify-center text-[#128C7E] shrink-0">
                <Package className="w-4 h-4 text-[#128C7E]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  عطر العود الملكي (100ml)
                </span>
                <span className="text-[11px] text-slate-400 font-mono tabular-nums">1 × 380 ر.س</span>
              </div>
            </div>
            <span className="text-xs font-bold font-mono tabular-nums text-slate-900 dark:text-white">380 ر.س</span>
          </div>

          {/* Cart Item 2 */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-[#1F293D]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#128C7E]/20 flex items-center justify-center text-[#128C7E] shrink-0">
                <ShoppingBag className="w-4 h-4 text-[#128C7E]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  مخلط العود النادر الصغير
                </span>
                <span className="text-[11px] text-slate-400 font-mono tabular-nums">1 × 180 ر.س</span>
              </div>
            </div>
            <span className="text-xs font-bold font-mono tabular-nums text-slate-900 dark:text-white">180 ر.س</span>
          </div>
        </div>

        {/* Price Calculations */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-[#1F293D] space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500 font-mono tabular-nums">
            <span>المجموع الجزئي:</span>
            <span>560 ر.س</span>
          </div>
          <div className="flex justify-between text-[#128C7E] font-bold font-mono tabular-nums">
            <span>كود الخصم (SA15):</span>
            <span>-84 ر.س</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>الشحن المباشر (الرياض):</span>
            <span className="text-[#075E54] dark:text-emerald-300 font-bold">مجاني</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-black text-slate-900 dark:text-white font-mono tabular-nums">
            <span>الإجمالي النهائي:</span>
            <span className="text-[#128C7E]">476 ر.س</span>
          </div>
        </div>

        {/* Fast Actions for Operator */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={onSendPaymentLink}
            type="button"
            className="w-full h-[38px] wasell-btn-primary elevation-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            إرسال رابط دفع سلة المباشر (Salla)
          </button>
        </div>
      </div>

      {/* AI Insights & Behavioral Sentiment Card */}
      <div className="p-3.5 bg-gradient-to-br from-violet-50 via-white to-violet-50/20 dark:from-violet-950/30 dark:via-slate-800 dark:to-transparent rounded-xl border border-violet-200 dark:border-violet-900/50 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[#7C3AED] text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            تحليل نبرة وسلوك العميل (AI)
          </span>
          <span className="w-2 h-2 rounded-full bg-[#128C7E] animate-pulse"></span>
        </div>

        {/* Progress Gauge: Buying Propensity */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-500">جاهزية الشراء الحالية:</span>
            <span className="text-[#128C7E] font-mono tabular-nums">92% (شديد الاحتمال)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-[#128C7E] rounded-full transition-all duration-500"
              style={{ width: '92%' }}
            ></div>
          </div>
        </div>

        {/* Sentiment Summary Bullets */}
        <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
          <div className="flex items-start gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5 text-[#128C7E] shrink-0 mt-0.5" />
            <span>نبرة الحديث إيجابية ومتحمسة لاستلام الطلب قبل عطلة نهاية الأسبوع.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-[#7C3AED] shrink-0 mt-0.5" />
            <span>توصية: عرض خدمة تغليف الهدايا مجاناً لزيادة رضا العميل.</span>
          </div>
        </div>
      </div>

      {/* Team Private Notes */}
      <div className="flex flex-col gap-1.5 pt-1">
        <label className="text-[11px] font-bold text-slate-500">
          ملاحظات الفريق الداخلي (خاصة):
        </label>
        <textarea
          rows={2}
          placeholder="أضف ملاحظة خاصة لا يراها العميل..."
          className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#128C7E]"
        />
      </div>
    </section>
  );
};
