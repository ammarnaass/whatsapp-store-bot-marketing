import React from 'react';
import { Laptop, Smartphone, ShieldCheck, LogOut, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { useUserSessions } from '../hooks/useUserSessions';

export const ActiveSessionsTab: React.FC = () => {
  const { sessions, isLoading, error, refreshSessions, revokeSession, revokeAllOtherSessions } = useUserSessions();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-[#1F293D]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-[#128C7E] dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">الأجهزة والجلسات النشطة</h4>
            <p className="text-[11px] text-slate-500">إدارة الأجهزة المصرح لها بالوصول إلى متجرك وحسابك</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshSessions}
            disabled={isLoading}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#1F293D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer disabled:opacity-50"
            title="تحديث"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {sessions.length > 1 && (
            <button
              type="button"
              onClick={revokeAllOtherSessions}
              className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>إنهاء كافة الجلسات الأخرى</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        {sessions.map((sess) => {
          const isMobile = sess.deviceName?.toLowerCase().includes('phone') || sess.deviceName?.toLowerCase().includes('android');
          return (
            <div
              key={sess.id}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                sess.isCurrent
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-[#1F293D]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                  {isMobile ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{sess.deviceName}</span>
                    {sess.isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#128C7E] text-white">
                        الجهاز الحالي
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        جلسة مسجلة
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>آخر نشاط: {sess.lastActiveAt ? new Date(sess.lastActiveAt).toLocaleString('ar-SA') : 'الآن'}</span>
                    <span>•</span>
                    <span dir="ltr">{sess.ipAddress}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => revokeSession(sess.sessionToken)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  sess.isCurrent
                    ? 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:text-slate-300'
                    : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                }`}
              >
                <LogOut className="w-3 h-3" />
                <span>{sess.isCurrent ? 'تسجيل الخروج' : 'إلغاء الجلسة'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

