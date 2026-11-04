import React from 'react';
import { Key, Copy, Eye, EyeOff, Lock, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface WabaCredentialsCardProps {
  wbaid: string;
  phoneNumberId: string;
  accessToken: string;
  showAccessToken: boolean;
  onWbaidChange?: (val: string) => void;
  onPhoneNumberIdChange?: (val: string) => void;
  onAccessTokenChange?: (val: string) => void;
  onToggleShowAccessToken: () => void;
  onCopy: (text: string, label: string) => void;
}

export const WabaCredentialsCard: React.FC<WabaCredentialsCardProps> = ({
  wbaid,
  phoneNumberId,
  accessToken,
  showAccessToken,
  onWbaidChange,
  onPhoneNumberIdChange,
  onAccessTokenChange,
  onToggleShowAccessToken,
  onCopy
}) => {
  const isConfigured = Boolean(wbaid && phoneNumberId && accessToken);

  return (
    <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-sm flex flex-col justify-between space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              بيانات الاعتماد السحابية (Meta Business & API Credentials)
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Graph API v19.0
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mr-11">
          المفاتيح الخاصة بربط واجهة برمجة تطبيقات WhatsApp Cloud بحسابك التجاري لدى Meta (اختياري في حال استخدام سحابة Meta).
        </p>
      </div>

      <div className="space-y-4">
        {/* Field 1: WBAID */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>معرف حساب واتساب التجاري (WhatsApp Business Account ID - WBAID)</span>
            <span className="text-[11px] text-slate-400 font-normal">رسمي - Meta BM</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={wbaid}
              onChange={(e) => onWbaidChange?.(e.target.value)}
              placeholder="مثال: 948201948201928"
              dir="ltr"
              className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 pl-20 focus:outline-none focus:border-[#128C7E] select-all"
            />
            {wbaid && (
              <button
                onClick={() => onCopy(wbaid, 'معرف حساب واتساب التجاري WBAID')}
                type="button"
                className="absolute left-2 px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ</span>
              </button>
            )}
          </div>
        </div>

        {/* Field 2: Phone Number ID */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>معرف رقم الهاتف السحابي (Phone Number ID)</span>
            <span className={`text-[11px] font-bold ${isConfigured ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {isConfigured ? 'مهيأ' : 'غير مهيأ'}
            </span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={phoneNumberId}
              onChange={(e) => onPhoneNumberIdChange?.(e.target.value)}
              placeholder="مثال: 109283746501928"
              dir="ltr"
              className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 pl-20 focus:outline-none focus:border-[#128C7E] select-all"
            />
            {phoneNumberId && (
              <button
                onClick={() => onCopy(phoneNumberId, 'معرف رقم الهاتف Phone Number ID')}
                type="button"
                className="absolute left-2 px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ</span>
              </button>
            )}
          </div>
        </div>

        {/* Field 3: Permanent Access Token */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              مفتاح الوصول الدائم للنظام (Permanent System User Access Token)
            </label>
            <span className="text-[11px] text-[#128C7E] font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              صلاحية دائمة (Permanent)
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              type={showAccessToken ? 'text' : 'password'}
              value={accessToken}
              onChange={(e) => onAccessTokenChange?.(e.target.value)}
              placeholder="أدخل رمز الوصول EAAG..."
              dir="ltr"
              className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 pl-32 focus:outline-none focus:border-[#128C7E] tracking-widest select-all"
            />
            <div className="absolute left-2 flex items-center gap-1.5">
              <button
                onClick={onToggleShowAccessToken}
                type="button"
                className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
                title={showAccessToken ? 'إخفاء الرمز' : 'إظهار الرمز'}
              >
                {showAccessToken ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
              {accessToken && (
                <button
                  onClick={() => onCopy(accessToken, 'رمز الوصول الدائم Access Token')}
                  type="button"
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Diagnostic Notice */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              حساب Meta Cloud متصل مباشرة بالخوادم المخصصة
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              الترميز مشفر وفق معايير AES-256 GCM المعتمدة مصرفياً
            </span>
          </div>
        </div>
        <a
          href="https://developers.facebook.com/docs/whatsapp/cloud-api"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold text-[#128C7E] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>دليل المطورين</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
