import React from 'react';
import { UserCheck, WifiOff, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AdminAlertSettings } from '../../types/settings.types';

interface AlertsEscalationCardProps {
  alerts: AdminAlertSettings;
  onChange: (updated: AdminAlertSettings) => void;
}

export const AlertsEscalationCard: React.FC<AlertsEscalationCardProps> = ({ alerts, onChange }) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">تنبيهات الطوارئ والتدخل البشري</h3>
          <p className="text-[11px] text-slate-400">حماية تجربة العميل والاستجابة الفورية عند حدوث أي خلل</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Human Escalation Alert */}
        <div className="p-3.5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">إنذار التحويل للتدخل البشري الفوري</h4>
                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold">
                  عاجل
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                إشعار فوري عند استشعار انزعاج العميل أو طلبه الصريح التحدث مع موظف
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={alerts.humanEscalationAlert}
            onChange={(e) => onChange({ ...alerts, humanEscalationAlert: e.target.checked })}
            className="w-4 h-4 accent-rose-600 rounded cursor-pointer shrink-0"
          />
        </div>

        {/* Channel Disconnect Alert */}
        <div className="p-3.5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">تنبيه انقطاع جلسة واتساب أو الخادم</h4>
                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold">
                  حرج
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                إرسال رسالة SMS أو إشعار فوري عند فقدان الاتصال بقناة WhatsApp
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={alerts.channelDisconnectAlert}
            onChange={(e) => onChange({ ...alerts, channelDisconnectAlert: e.target.checked })}
            className="w-4 h-4 accent-amber-600 rounded cursor-pointer shrink-0"
          />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>تنبيهات الطوارئ تتضمن رابطاً تفاعلياً للدخول المباشر للمحادثة وتسليمها للموظف البشري.</span>
        </div>
      </div>
    </div>
  );
};

