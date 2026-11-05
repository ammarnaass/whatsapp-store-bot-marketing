import React from 'react';
import { Key, Eye, EyeOff, Lock, Save, Play } from 'lucide-react';

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
  onSave?: () => void;
  onTestApi?: () => void;
  isTestingApi?: boolean;
}

export const WabaCredentialsCard: React.FC<WabaCredentialsCardProps> = ({
  wbaid, phoneNumberId, accessToken, showAccessToken,
  onWbaidChange, onPhoneNumberIdChange, onAccessTokenChange,
  onToggleShowAccessToken, onCopy, onSave, onTestApi, isTestingApi = false,
}) => {
  const isConfigured = Boolean(wbaid && phoneNumberId && accessToken);

  return (
    <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] elevation-1 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              بيانات الاعتماد السحابية (Meta Cloud API)
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Graph API v19.0
          </span>
        </div>
        <p className="text-xs text-slate-400">المفاتيح الرسمية لربط رقم واتساب التجاري بـ Meta لإرسال واستقبال الرسائل سحابياً.</p>
      </div>

      <div className="space-y-2.5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">معرف حساب واتساب التجاري (WBAID)</label>
          <div className="relative flex items-center">
            <input
              type="text" value={wbaid} onChange={(e) => onWbaidChange?.(e.target.value)}
              placeholder="مثال: 948201948201928" dir="ltr"
              className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pl-14 focus:outline-none focus:border-[#128C7E]"
            />
            {wbaid && <button onClick={() => onCopy(wbaid, 'WBAID')} type="button" className="absolute left-1.5 px-2 py-0.5 bg-white dark:bg-slate-800 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">نسخ</button>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">معرف رقم الهاتف السحابي (Phone Number ID)</label>
          <div className="relative flex items-center">
            <input
              type="text" value={phoneNumberId} onChange={(e) => onPhoneNumberIdChange?.(e.target.value)}
              placeholder="مثال: 109283746501928" dir="ltr"
              className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pl-14 focus:outline-none focus:border-[#128C7E]"
            />
            {phoneNumberId && <button onClick={() => onCopy(phoneNumberId, 'معرف الهاتف')} type="button" className="absolute left-1.5 px-2 py-0.5 bg-white dark:bg-slate-800 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">نسخ</button>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>مفتاح الوصول الدائم (System User Token)</span>
            <span className="text-[10px] text-[#128C7E] font-bold flex items-center gap-1 font-mono"><Lock className="w-3 h-3" /> Permanent</span>
          </label>
          <div className="relative flex items-center">
            <input
              type={showAccessToken ? 'text' : 'password'} value={accessToken} onChange={(e) => onAccessTokenChange?.(e.target.value)}
              placeholder="EAAG..." dir="ltr"
              className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pl-20 focus:outline-none focus:border-[#128C7E]"
            />
            <div className="absolute left-1.5 flex items-center gap-1">
              <button onClick={onToggleShowAccessToken} type="button" className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer">
                {showAccessToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              {accessToken && <button onClick={() => onCopy(accessToken, 'مفتاح الوصول')} type="button" className="px-2 py-0.5 bg-white dark:bg-slate-800 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">نسخ</button>}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-[#1F293D]">
        {onSave && (
          <button onClick={onSave} type="button" className="flex-1 h-[36px] wasell-btn-primary rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer">
            <Save className="w-3.5 h-3.5" />
            <span>حفظ الإعدادات</span>
          </button>
        )}
        {onTestApi && (
          <button onClick={onTestApi} disabled={!isConfigured || isTestingApi} type="button" className="h-[36px] px-3.5 wasell-btn-secondary rounded-xl flex items-center gap-1.5 text-xs font-bold cursor-pointer disabled:opacity-50">
            <Play className={`w-3.5 h-3.5 text-[#128C7E] ${isTestingApi ? 'animate-spin' : ''}`} />
            <span>{isTestingApi ? 'فحص...' : 'فحص اتصال Meta'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
