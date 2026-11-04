import React from 'react';
import { QrCode, ShieldCheck, Smartphone, AlertTriangle } from 'lucide-react';
import { getMockWhatsAppQrDataUrl } from '../../../utils/qr.utils';

export const StepConnectWhatsApp: React.FC = () => {
  const sampleQr = getMockWhatsAppQrDataUrl('onboarding_setup');

  return (
    <div className="space-y-4">
      {/* تنبيه وتوصية أمان الحساب - متطلب FR-77 */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-[12px] block text-amber-800 dark:text-amber-300">
            توصية هامة لسلامة الحساب (متطلب FR-77):
          </span>
          <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-300/90">
            نوصي بشدة باستخدام <strong>شريحة/رقم هاتف مخصص لأعمال المتجر</strong> وتجنب استخدام رقمك الشخصي اليومي. إن الاتصال عبر بوابات الويب غير الرسمية والإرسال المكثف قد يعرض الرقم لخطر التقييد أو الحظر المؤقت من واتساب. يقوم WaSell بتفعيل بروتوكول التدفئة والتباطؤ الذاتي لحماية رقمك قدر الإمكان.
          </p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-[#1F293D] flex flex-col md:flex-row items-center gap-6">
        <div className="w-44 h-44 bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-md border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
          {sampleQr ? (
            <img
              src={sampleQr}
              alt="رمز الاستجابة السريعة لواتساب"
              className="w-full h-full object-contain select-none"
            />
          ) : (
            <div className="border-4 border-dashed border-slate-300 dark:border-slate-400 w-full h-full rounded-xl flex flex-col items-center justify-center text-slate-800">
              <QrCode className="w-14 h-14 text-[#128C7E] mb-1" />
              <span className="text-[10px] font-bold">امسح الرمز من هاتفك</span>
            </div>
          )}
        </div>

        <div className="space-y-2.5 flex-1 text-right">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>الخطوة 2: ربط حساب واتساب عبر رمز QR المباشر</span>
          </h4>
          <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside pr-1 leading-relaxed">
            <li>افتح تطبيق واتساب على هاتفك الذكي المخصص للمتجر.</li>
            <li>اضغط على <strong>القائمة (⋮)</strong> أو <strong>الإعدادات</strong>.</li>
            <li>اختر <strong>الأجهزة المرتبطة</strong> ثم <strong>ربط جهاز</strong>.</li>
            <li>وجّه كاميرا الهاتف نحو الرمز المقابل للمزامنة المباشرة.</li>
          </ol>
          <div className="p-2 rounded-xl bg-[#E7F6F2] dark:bg-[#128C7E]/20 border border-emerald-200 dark:border-emerald-800/60 text-[#075E54] dark:text-emerald-300 text-[11px] font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#128C7E]" />
            <span>يعمل المحرك محلياً دون أي خادم وسيط سحابي يحفظ محادثاتك.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
