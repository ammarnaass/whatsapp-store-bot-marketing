import React from 'react';
import { QrCode } from 'lucide-react';

export const StepConnectWhatsApp: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-[#1F293D] flex flex-col md:flex-row items-center gap-6">
      <div className="w-48 h-48 bg-white p-3 rounded-2xl flex items-center justify-center shadow-md border border-slate-200 dark:border-slate-700 shrink-0">
        <div className="border-4 border-dashed border-slate-300 dark:border-slate-400 w-full h-full rounded-xl flex flex-col items-center justify-center text-slate-800">
          <QrCode className="w-16 h-16 text-[#128C7E] mb-2" />
          <span className="text-[11px] font-bold">امسح الرمز من هاتفك</span>
        </div>
      </div>

      <div className="space-y-3 flex-1 text-right">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>الخطوة 2: ربط حساب واتساب عبر رمز QR</span>
        </h4>
        <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside pr-1 leading-relaxed">
          <li>افتح تطبيق واتساب على هاتفك الذكي.</li>
          <li>اضغط على <strong>القائمة (⋮)</strong> أو <strong>الإعدادات</strong>.</li>
          <li>اختر <strong>الأجهزة المرتبطة</strong> ثم <strong>ربط جهاز</strong>.</li>
          <li>وجّه كاميرا الهاتف نحو الرمز المقابل للمزامنة المباشرة.</li>
        </ol>
        <div className="p-2.5 rounded-xl bg-[#E7F6F2] dark:bg-[#128C7E]/20 border border-emerald-200 dark:border-emerald-800/60 text-[#075E54] dark:text-emerald-300 text-[11px] font-medium">
          ✓ يتم تشغيل المحرك محلياً دون أي وسيط خارجي يحفظ محادثاتك.
        </div>
      </div>
    </div>
  );
};
