import React from 'react';
import { ShieldCheck, LogOut, KeyRound, Clock } from 'lucide-react';
import { useAuthStore } from '../../../auth/store/useAuthStore';
import { ROLE_LABELS } from '../../../auth/types/auth.types';

export const AccountSecuritySummary: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  if (!currentUser) return null;

  const roleMeta = ROLE_LABELS[currentUser.role];

  const handleLogout = () => {
    if (confirm('تأكيد تسجيل الخروج من منظومة واسل الذكية؟')) {
      logout();
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl p-5 elevation-1 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F293D]/80 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white">أمان الجلسة والترخيص</h3>
              <p className="text-[10px] text-slate-400">حالة التشفير المحلي والاتصال الآمن</p>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${roleMeta?.badgeColor}`}>
            {roleMeta?.label}
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>مستوى التشفير</span>
            </span>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-mono">
              AES-256-GCM / PBKDF2
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>آخر دخول للنظام</span>
            </span>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {currentUser.last_login_at ? new Date(currentUser.last_login_at).toLocaleTimeString('ar-SA') : 'الجلسة الحالية نشطة'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        type="button"
        className="w-full h-9 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-rose-100 dark:hover:bg-rose-900/40 cursor-pointer shadow-xs"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>تسجيل الخروج من الحساب</span>
      </button>
    </div>
  );
};

