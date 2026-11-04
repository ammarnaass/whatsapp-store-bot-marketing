import React from 'react';
import { ShieldCheck, ShieldAlert, Award } from 'lucide-react';

export const PdplComplianceCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">الامتثال للأنظمة والخصوصية السعودية (PDPL)</h3>
          <p className="text-[11px] text-slate-400">حماية البيانات السيادية وإفصاح البروتوكولات المعتمدة</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* PDPL Saudi Compliance Guarantee Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                حماية البيانات الشخصية السعودية (PDPL)
              </h4>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold">
                تخزين محلي سيادي
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              تخزن بيانات العملاء وسجلات المحادثات والطلبات محلياً في جهازك وقاعدة بيانات مشفرة بأعلى معايير (AES-256) دون تصدير بيانات المشترين لأي جهات خارجية غير مصرح بها.
            </p>
          </div>
        </div>

        {/* FR-80: OpenWA Gateway Legal & Technical Disclosure */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                إفصاح تقني وقانوني هام (FR-80)
              </h4>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200/50 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold">
                بوابة OpenWA
              </span>
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              يعمل اتصال واتساب الحالي محلياً عبر بوابة OpenWA مفتوحة المصدر (المستندة لبروتوكول واتساب ويب) وليس عبر سحابة Meta Cloud API الرسمية. يرجى احترام سياسات المراسلة الآمنة واستخدام أرقام تجارية معتمدة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

