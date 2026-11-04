import React, { useState } from 'react';
import { ShieldAlert, Plus, Trash2, Calendar } from 'lucide-react';
import { BlocklistEntry } from '../../types/marketing.types';

interface BlocklistTabProps {
  blocklist: BlocklistEntry[];
  isLoading: boolean;
  onAdd: (phone: string, reason?: string) => Promise<void>;
  onRemove: (phone: string) => Promise<void>;
}

export const BlocklistTab: React.FC<BlocklistTabProps> = ({
  blocklist,
  isLoading,
  onAdd,
  onRemove,
}) => {
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('طلب العميل (Opt-Out)');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setIsAdding(true);
    try {
      await onAdd(phone.trim(), reason);
      setPhone('');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* بطاقة إضافة رقم يدوياً لقائمة الحظر */}
      <form onSubmit={handleAdd} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] p-4 rounded-2xl elevation-1 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full sm:w-auto">
          <input
            type="text"
            required
            placeholder="أدخل رقم واتساب مع رمز الدولة (مثال: +966500000000)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div className="w-full sm:w-56">
          <input
            type="text"
            placeholder="السبب (اختياري)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isAdding}
          className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          حظر الرقم
        </button>
      </form>

      {/* قائمة الأرقام المحظورة */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400">جارِ تحميل قائمة الحظر...</div>
      ) : blocklist.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#111827] border border-dashed border-slate-200 dark:border-[#1F293D] rounded-2xl space-y-2">
          <ShieldAlert className="w-8 h-8 text-emerald-500 mx-auto" />
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">قائمة الحظر فارغة</h4>
          <p className="text-xs text-slate-400">لا توجد أرقام منسحبة حتى الآن، ستظهر هنا تلقائياً عند طلب أي عميل إلغاء الاشتراك</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl overflow-hidden elevation-1">
          <div className="divide-y divide-slate-100 dark:divide-[#1F293D]">
            {blocklist.map((b) => (
              <div key={b.phone} className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{b.phone}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>السبب: {b.reason}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.added_at}</span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(b.phone)}
                  title="رفع الحظر"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

