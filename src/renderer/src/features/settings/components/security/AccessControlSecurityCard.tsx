import React from 'react';
import { Lock, Clock, ShieldCheck, KeyRound } from 'lucide-react';
import { SecuritySettings } from '../../types/settings.types';

interface AccessControlSecurityCardProps {
  security: SecuritySettings;
  onChange: (updated: SecuritySettings) => void;
}

export const AccessControlSecurityCard: React.FC<AccessControlSecurityCardProps> = ({
  security,
  onChange,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">سياسات الدخول وأمان الجلسات</h3>
          <p className="text-[11px] text-slate-400">إدارة المصادقة الثنائية ومهلة الجلسات وحظر الهجمات</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* 2FA Item */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="space-y-0.5 max-w-[80%]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                التحقق بخطوتين (2FA) للمشرفين
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                موصى به
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              طلب رمز OTP إضافي عبر واتساب والبريد عند كل تسجيل دخول من جهاز جديد
            </p>
          </div>
          <input
            type="checkbox"
            checked={security.twoFactorAuth}
            onChange={(e) => onChange({ ...security, twoFactorAuth: e.target.checked })}
            className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
          />
        </div>

        {/* Brute Force Lockout */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="space-y-0.5 max-w-[80%]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                حماية القوة الغاشمة (Brute-Force Lockout)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              قفل الحساب تلقائياً لمدة 15 دقيقة بعد 5 محاولات إدخال كلمة مرور خاطئة
            </p>
          </div>
          <input
            type="checkbox"
            checked={security.bruteForceProtection}
            onChange={(e) => onChange({ ...security, bruteForceProtection: e.target.checked })}
            className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
          />
        </div>

        {/* Session Timeout */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">مهلة الخمول التلقائي للجلسة</h4>
            <p className="text-[11px] text-slate-400">تسجيل الخروج الآلي عند التوقف عن استخدام لوحة التحكم</p>
          </div>
          <select
            value={security.sessionTimeoutMinutes || 30}
            onChange={(e) => onChange({ ...security, sessionTimeoutMinutes: Number(e.target.value) })}
            className="h-8 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E]"
          >
            <option value={15}>15 دقيقة</option>
            <option value={30}>30 دقيقة (مستحسن)</option>
            <option value={60}>ساعة واحدة</option>
            <option value={120}>ساعتان</option>
            <option value={0}>إبقاء الجلسة نشطة دائماً</option>
          </select>
        </div>
      </div>
    </div>
  );
};

