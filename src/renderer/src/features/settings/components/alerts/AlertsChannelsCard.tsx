import React from 'react';
import { Smartphone, Mail, Volume2, Monitor, PhoneCall } from 'lucide-react';
import { AdminAlertSettings } from '../../types/settings.types';

interface AlertsChannelsCardProps {
  alerts: AdminAlertSettings;
  onChange: (updated: AdminAlertSettings) => void;
}

export const AlertsChannelsCard: React.FC<AlertsChannelsCardProps> = ({ alerts, onChange }) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">قنوات الاستقبال ووجهات الإرسال</h3>
          <p className="text-[11px] text-slate-400">تحديد أرقام الهواتف وقنوات إيصال التنبيهات الفورية</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              رقم واتساب الإدارة الأساسي
            </label>
            <div className="relative">
              <Smartphone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                dir="ltr"
                value={alerts.adminWhatsAppNumber}
                onChange={(e) => onChange({ ...alerts, adminWhatsAppNumber: e.target.value })}
                placeholder="+966 5x xxx xxxx"
                className="w-full h-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              رقم واتساب الطوارئ الاحتياطي
            </label>
            <div className="relative">
              <PhoneCall className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                dir="ltr"
                value={alerts.backupWhatsAppNumber || ''}
                onChange={(e) => onChange({ ...alerts, backupWhatsAppNumber: e.target.value })}
                placeholder="+966 5x xxx xxxx"
                className="w-full h-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E] text-left"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            البريد الإلكتروني للتقارير والملخصات
          </label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={alerts.adminEmail || ''}
              onChange={(e) => onChange({ ...alerts, adminEmail: e.target.value })}
              placeholder="manager@wasell.store"
              className="w-full h-9 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl pr-9 pl-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <label className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">إشعارات سطح المكتب</span>
            </div>
            <input
              type="checkbox"
              checked={alerts.enableDesktopPush}
              onChange={(e) => onChange({ ...alerts, enableDesktopPush: e.target.checked })}
              className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
            />
          </label>

          <label className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">صوت التنبيه المسموع</span>
            </div>
            <input
              type="checkbox"
              checked={alerts.enableNotificationSound}
              onChange={(e) => onChange({ ...alerts, enableNotificationSound: e.target.checked })}
              className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

