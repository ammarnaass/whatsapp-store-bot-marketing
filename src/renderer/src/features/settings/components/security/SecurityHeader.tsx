import React, { useState } from 'react';
import { ShieldCheck, Lock, Database, CheckCircle2 } from 'lucide-react';
import { api } from '../../../../api-bridge';

interface SecurityHeaderProps {
  onBackupCreated?: () => void;
}

export const SecurityHeader: React.FC<SecurityHeaderProps> = ({ onBackupCreated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleInstantSnapshot = async () => {
    setIsCreating(true);
    try {
      const res = await api.settings.createBackup();
      if (res.success) {
        setSuccessMsg(true);
        if (onBackupCreated) onBackupCreated();
        setTimeout(() => setSuccessMsg(false), 3000);
      }
    } catch (err) {
      console.error('Failed to create instant backup:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-[#1F293D]">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
          style={{ backgroundColor: 'var(--color-brand-primary)' }}
        >
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900 dark:text-white">الأمان والخصوصية والنسخ الاحتياطي</h2>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#075E54] dark:text-emerald-300 text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>PDPL ممتثل</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تشفير البيانات وقاعدة SQLite محلياً، إدارة جلسات المشرفين، والنسخ الاحتياطي الشامل
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleInstantSnapshot}
          disabled={isCreating}
          className="h-9 px-4 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-brand-primary)' }}
        >
          {successMsg ? <CheckCircle2 className="w-4 h-4" /> : <Database className={`w-4 h-4 ${isCreating ? 'animate-spin' : ''}`} />}
          <span>{isCreating ? 'جارٍ الحفظ...' : successMsg ? 'تم النسخ بنجاح! 💾' : 'أخذ لقطة فورية لقاعدة البيانات'}</span>
        </button>
      </div>
    </div>
  );
};

