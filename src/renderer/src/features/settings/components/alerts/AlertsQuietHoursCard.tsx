import React from 'react';
import { Moon, Sun, Calendar, Clock, BellOff } from 'lucide-react';
import { AdminAlertSettings } from '../../types/settings.types';

interface AlertsQuietHoursCardProps {
  alerts: AdminAlertSettings;
  onChange: (updated: AdminAlertSettings) => void;
}

export const AlertsQuietHoursCard: React.FC<AlertsQuietHoursCardProps> = ({ alerts, onChange }) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Moon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">ساعات الهدوء والتقارير المجدولة</h3>
          <p className="text-[11px] text-slate-400">إدارة وضع عدم الإزعاج وتحديد مواعيد ملخصات الأداء الدورية</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Quiet Hours / DND */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <BellOff className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">تفعيل ساعات الهدوء (عدم الإزعاج)</h4>
                <p className="text-[11px] text-slate-400">كتم الإشعارات العادية ليلاً وتأجيلها للصباح</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={alerts.quietHoursEnabled}
              onChange={(e) => onChange({ ...alerts, quietHoursEnabled: e.target.checked })}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          {alerts.quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-[#1F293D]">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">من الساعة:</label>
                <input
                  type="time"
                  value={alerts.quietHoursStart || '00:00'}
                  onChange={(e) => onChange({ ...alerts, quietHoursStart: e.target.value })}
                  className="w-full h-8 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">حتى الساعة:</label>
                <input
                  type="time"
                  value={alerts.quietHoursEnd || '07:00'}
                  onChange={(e) => onChange({ ...alerts, quietHoursEnd: e.target.value })}
                  className="w-full h-8 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Morning Digest */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">ملخص الصباح التنفيذي اليومي</h4>
              <p className="text-[11px] text-slate-400">تقرير إحصائي لمبيعات الأمس والطلبات المجهزة عبر واتساب</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={alerts.morningDigestAlert}
            onChange={(e) => onChange({ ...alerts, morningDigestAlert: e.target.checked })}
            className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
          />
        </div>

        {/* Evening Digest */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">تقرير الإغلاق المسائي اليومي</h4>
              <p className="text-[11px] text-slate-400">موجز الأداء عند الساعة 09:00 م بحصيلة اليوم ومعدل التحويل</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={alerts.eveningDigestAlert}
            onChange={(e) => onChange({ ...alerts, eveningDigestAlert: e.target.checked })}
            className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

