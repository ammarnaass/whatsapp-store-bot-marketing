import React from 'react';
import { Save, Check } from 'lucide-react';

interface CustomerInternalNotesProps {
  notes: string;
  isSaving: boolean;
  onNotesChange: (text: string) => void;
}

export const CustomerInternalNotes: React.FC<CustomerInternalNotesProps> = ({
  notes,
  isSaving,
  onNotesChange,
}) => {
  return (
    <div className="flex flex-col gap-1.5 pt-1">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-slate-500">
          ملاحظات الفريق الداخلي (خاصة):
        </label>
        {isSaving ? (
          <span className="text-[10px] text-amber-500 flex items-center gap-1">
            <Save className="w-3 h-3 animate-spin" />
            جارٍ الحفظ...
          </span>
        ) : (
          <span className="text-[10px] text-emerald-500 flex items-center gap-1">
            <Check className="w-3 h-3" />
            محفوظ في SQLite
          </span>
        )}
      </div>

      <textarea
        rows={3}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="أضف ملاحظة خاصة لا يراها العميل، تُحفظ تلقائياً في قاعدة البيانات..."
        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#128C7E] transition-all"
      />
    </div>
  );
};

