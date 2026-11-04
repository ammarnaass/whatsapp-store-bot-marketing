import React from 'react';
import { Bot, CheckCircle2, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ComponentTokensSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* قسم الأزرار القياسية */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
          أنماط الأزرار القياسية (Standard WaSell Buttons)
        </h4>
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <button type="button" className="wasell-btn-primary">
            <CheckCircle2 className="w-4 h-4" />
            <span>زر رئيسي (واتساب)</span>
          </button>

          <button type="button" className="wasell-btn-secondary">
            <span>زر ثانوي (إلغاء / تراجع)</span>
          </button>

          <button type="button" className="wasell-btn-ai">
            <Bot className="w-4 h-4" />
            <span>زر وكيل الذكاء الاصطناعي</span>
          </button>

          <button type="button" className="wasell-btn-danger">
            <AlertTriangle className="w-4 h-4" />
            <span>إيقاف الطوارئ / حذف</span>
          </button>
        </div>
      </div>

      {/* قسم الشارات والتصنيفات */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
          شارات الحالة وبصمة الذكاء الاصطناعي (Status Pills & AI Badge)
        </h4>
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="ai-badge">
            <Bot className="w-3.5 h-3.5" />
            <span>وكيل الذكاء الاصطناعي</span>
          </span>

          <span className="status-pill-success">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>واتساب متصل (100%)</span>
          </span>

          <span className="status-pill-warning">
            <span>بانتظار موافقة المدير</span>
          </span>

          <span className="status-pill-danger">
            <span>المخزون نفد</span>
          </span>

          <span className="status-pill-info">
            <span>قيد الشحن (سمسا)</span>
          </span>
        </div>
      </div>

      {/* قسم فقاعات واتساب */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
          فقاعات محادثة واتساب (WhatsApp Chat Bubbles)
        </h4>
        <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          {/* رسالة واردة من العميل */}
          <div className="flex justify-start">
            <div className="bubble-inbound p-3 max-w-[80%] text-xs shadow-sm">
              <span className="font-bold block mb-1 text-slate-700 dark:text-slate-300">العميل: محمد السعيد</span>
              مرحباً، هل متوفر لديكم سماعة بلوتوث Pro وما هي مدة التوصيل إلى الرياض؟
              <span className="block text-[10px] text-slate-400 mt-1 text-left font-mono">08:42 م</span>
            </div>
          </div>

          {/* رد الوكيل الذكي */}
          <div className="flex justify-end">
            <div className="bubble-outbound-agent p-3 max-w-[80%] text-xs shadow-sm">
              <div className="flex items-center gap-1.5 mb-1 text-emerald-800 dark:text-emerald-300 font-bold">
                <Bot className="w-3.5 h-3.5" />
                <span>رد وكيل واتساب الذكي:</span>
              </div>
              أهلاً بك يا محمد! نعم متوفرة باللونين الأسود والأبيض بسعر 45$، والتوصيل فوري خلال 24 ساعة للرياض مع شحن مجاني. هل ترغب بحجز طلبك الآن؟
              <span className="block text-[10px] text-emerald-700/70 dark:text-emerald-300/70 mt-1 text-left font-mono">08:43 م ✓✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

