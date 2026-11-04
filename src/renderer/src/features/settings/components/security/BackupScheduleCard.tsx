import React from 'react';
import { Calendar, Clock, Layers } from 'lucide-react';
import { SecuritySettings } from '../../types/settings.types';

interface BackupScheduleCardProps {
  security: SecuritySettings;
  onChange: (updated: SecuritySettings) => void;
}

export const BackupScheduleCard: React.FC<BackupScheduleCardProps> = ({ security, onChange }) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">الجدولة التلقائية وسياسة الاحتفاظ</h3>
          <p className="text-[11px] text-slate-400">أتمتة النسخ الدوري لقاعدة البيانات وحذف النسخ المتقادمة</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Toggle */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">تفعيل النسخ الاحتياطي التلقائي</h4>
              <p className="text-[11px] text-slate-400">توليد نسخة أرشيفية في الخلفية تلقائياً دون إشغال المعالج</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={security.autoBackupEnabled}
            onChange={(e) => onChange({ ...security, autoBackupEnabled: e.target.checked })}
            className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer"
          />
        </div>

        {security.autoBackupEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                تكرار وموعد النسخ
              </label>
              <select
                value={security.autoBackupSchedule || 'daily'}
                onChange={(e) => onChange({ ...security, autoBackupSchedule: e.target.value as 'daily' | 'weekly' })}
                className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E]"
              >
                <option value="daily">يومياً عند الساعة 03:00 ص (الفجر)</option>
                <option value="weekly">أسبوعياً كل ليلة جمعة</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                سياسة الاحتفاظ (Retention)
              </label>
              <select
                value={security.autoBackupRetentionCopies || 7}
                onChange={(e) => onChange({ ...security, autoBackupRetentionCopies: Number(e.target.value) })}
                className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-[#1F293D] text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#128C7E]"
              >
                <option value={3}>الاحتفاظ بآخر 3 نسخ فقط</option>
                <option value={7}>الاحتفاظ بآخر 7 نسخ (مستحسن)</option>
                <option value={14}>الاحتفاظ بآخر 14 نسخة</option>
                <option value={30}>الاحتفاظ بآخر 30 نسخة شهرية</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

