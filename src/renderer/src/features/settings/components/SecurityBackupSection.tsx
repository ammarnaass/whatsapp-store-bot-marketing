import React from 'react';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  Download,
  Cloud,
  FileCheck
} from 'lucide-react';
import { SecuritySettings } from '../types/settings.types';

interface SecurityBackupSectionProps {
  security: SecuritySettings;
  onChange: (updated: SecuritySettings) => void;
  onDownloadBackup: () => void;
}

export const SecurityBackupSection: React.FC<SecurityBackupSectionProps> = ({
  security,
  onChange,
  onDownloadBackup
}) => {
  const toggle2FA = () => {
    onChange({ ...security, twoFactorAuth: !security.twoFactorAuth });
  };

  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#1F293D]/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                الأمان والخصوصية والنسخ الاحتياطي
              </h2>
              <p className="text-xs text-slate-400">
                تشفير المحادثات، سياسات المشرفين، والامتثال للأنظمة
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 border border-emerald-200/50 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PDPL ممتثل</span>
          </span>
        </div>

        {/* Security Controls */}
        <div className="space-y-3.5 mb-5">
          {/* 2FA Item */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
            <div className="space-y-0.5 max-w-[78%]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  التحقق بخطوتين (2FA) للمشرفين
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#128C7E] text-white font-bold">
                  إلزامي
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                طلب رمز OTP فوري عبر الواتساب والبريد عند كل عملية تسجيل دخول من جهاز جديد.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.twoFactorAuth}
                onChange={toggle2FA}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#128C7E]"></div>
            </label>
          </div>

          {/* PDPL Saudi Compliance Guarantee Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  حماية البيانات الشخصية السعودية (PDPL)
                </h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#128C7E]/10 text-[#128C7E] font-bold">
                  استضافة محلية
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                يتم تخزين بيانات العملاء وسجلات المحادثات والمدفوعات داخل مراكز بيانات سحابية معتمدة داخل المملكة العربية السعودية وفق أعلى معايير التشفير (AES-256).
              </p>
            </div>
          </div>

          {/* FR-80: Unofficial Gateway Legal & Technical Disclosure */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  إفصاح تقني وقانوني هام (FR-80)
                </h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/50 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold">
                  بوابة غير رسمية
                </span>
              </div>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                يعمل اتصال واتساب الحالي محلياً عبر بوابة OpenWA مفتوحة المصدر (المستندة لبروتوكول واتساب ويب) وليس عبر سحابة Meta Cloud API الرسمية (المؤجلة لما بعد v1). التطبيق غير معتمد رسمياً من شركة Meta. ينبغي احترام سياسات المراسلة الآمنة واستخدام رقم مخصص لتجنب أي تقييد للحساب.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Encrypted Backup Snapshot Box */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 text-[#128C7E] border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-xs shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              النسخ الاحتياطي التلقائي الشامل
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              آخر نسخة احتياطية مشفرة: {security.lastBackupDate} (الحجم: {security.backupSizeBytes})
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDownloadBackup}
          className="px-4 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#128C7E]" />
          <span>تحميل نسخة مشفرة</span>
        </button>
      </div>
    </section>
  );
};
