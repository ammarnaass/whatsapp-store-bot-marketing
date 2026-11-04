import React from 'react';
import { Database, Download, UploadCloud, RefreshCw } from 'lucide-react';
import { SecuritySettings } from '../../types/settings.types';

interface BackupSnapshotCardProps {
  security: SecuritySettings;
  onDownloadBackup: () => void;
  onOpenRestoreModal: () => void;
  onRefresh?: () => void;
}

export const BackupSnapshotCard: React.FC<BackupSnapshotCardProps> = ({
  security,
  onDownloadBackup,
  onOpenRestoreModal,
  onRefresh,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">النسخ الاحتياطي الفوري لقاعدة البيانات</h3>
            <p className="text-[11px] text-slate-400">لقطات حية وشاملة لكافة الجداول والطلبات والمحادثات</p>
          </div>
        </div>
        {onRefresh && (
          <button onClick={onRefresh} title="تحديث البيانات"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#1F293D] text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>حالة قاعدة بيانات المتجر:</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold">
              نشطة ومحمية
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            {security.backupSizeBytes} • آخر مزامنة: {security.lastBackupDate}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onDownloadBackup}
            className="h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#128C7E]" />
            <span>تنزيل أرشيف JSON</span>
          </button>

          <button
            type="button"
            onClick={onOpenRestoreModal}
            className="h-8 px-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
            <span>استعادة نسخة</span>
          </button>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 pr-1">
        يتم توليد النسخ باستخدام محرك النسخ المتوازي في SQLite لمنع أي تعليق أو تأخير في معالجة طلبات الواتساب الحية.
      </div>
    </div>
  );
};

