import React, { useState, useEffect, useCallback } from 'react';
import { History, FileText, Trash2, RefreshCw } from 'lucide-react';
import { BackupRecord } from '../../types/settings.types';
import { api } from '../../../../api-bridge';

interface BackupHistoryCardProps {
  lastUpdated?: number;
}

export const BackupHistoryCard: React.FC<BackupHistoryCardProps> = ({ lastUpdated }) => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBackups = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await api.settings.listBackups();
      setBackups(list || []);
    } catch {
      setBackups([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups, lastUpdated]);

  const handleDelete = async (filename: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف النسخة الاحتياطية (${filename}) نهائياً؟`)) return;
    try {
      const res = await api.settings.deleteBackup({ filename });
      if (res.success) {
        await fetchBackups();
      }
    } catch {
      alert('تعذر حذف النسخة الاحتياطية');
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">سجل النسخ الاحتياطية السابقة</h3>
            <p className="text-[11px] text-slate-400">إدارة واستعراض النسخ المحفوظة محلياً على السيرفر ({backups.length})</p>
          </div>
        </div>
        <button onClick={fetchBackups} disabled={isLoading} title="تحديث السجل"
          className="p-1.5 rounded-lg border border-slate-200 dark:border-[#1F293D] text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2">
        {backups.length === 0 && !isLoading && (
          <div className="py-6 text-center text-xs text-slate-400">
            لا توجد نسخ احتياطية مسجلة بعد. اضغط "أخذ لقطة فورية" لحفظ أول نسخة.
          </div>
        )}
        {backups.map((b) => (
          <div key={b.id} className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-mono font-bold text-slate-900 dark:text-white text-[11px] truncate" dir="ltr">
                  {b.filename}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{b.sizeFormatted}</span>
                  <span>•</span>
                  <span>{new Date(b.createdAt).toLocaleString('ar-SA')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                b.type === 'scheduled' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                {b.type === 'scheduled' ? 'مجدول' : 'يدوي'}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(b.filename)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="حذف النسخة"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

