import React from 'react';
import { Sparkles, Tag } from 'lucide-react';
import { CustomerDetailProfile } from '../../types/customer-detail.types';

interface CustomerAiMemoryCardProps {
  profile: CustomerDetailProfile;
  onToggleTag: (tag: string) => void;
}

export const CustomerAiMemoryCard: React.FC<CustomerAiMemoryCardProps> = ({
  profile,
  onToggleTag,
}) => {
  const commonTags = ['VIP', 'مهتم بالسماعات', 'تراخيص برمجية', 'عميل متفاعل', 'متردد'];

  return (
    <div className="p-3.5 bg-gradient-to-br from-violet-50 via-white to-violet-50/20 dark:from-violet-950/30 dark:via-slate-800 dark:to-transparent rounded-xl border border-violet-200 dark:border-violet-900/50 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[#7C3AED] text-xs font-bold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          ذاكرة الوكيل الذكي
        </span>
        <span className="w-2 h-2 rounded-full bg-[#128C7E] animate-pulse"></span>
      </div>

      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/40 p-2 rounded-lg border border-violet-100 dark:border-violet-900/30">
        {profile.memorySummary || 'عميل تواصل عبر واتساب، لا توجد تفضيلات خاصة مسجلة حتى الآن.'}
      </p>

      {/* وسوم واهتمامات العميل */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
          <Tag className="w-3 h-3 text-[#7C3AED]" />
          الوسوم والاهتمامات:
        </span>
        <div className="flex flex-wrap gap-1">
          {profile.tags && profile.tags.length > 0 ? (
            profile.tags.map((t) => (
              <button
                key={t}
                onClick={() => onToggleTag(t)}
                title="انقر للإزالة"
                type="button"
                className="bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-rose-100 hover:text-rose-600 transition-all"
              >
                {t} ×
              </button>
            ))
          ) : (
            <span className="text-[10px] text-slate-400">لا توجد وسوم مخصصة</span>
          )}
        </div>

        {/* وسوم مقترحة سريعة */}
        <div className="flex items-center gap-1 overflow-x-auto pt-1 no-scrollbar">
          {commonTags
            .filter((t) => !profile.tags?.includes(t))
            .slice(0, 3)
            .map((t) => (
              <button
                key={t}
                onClick={() => onToggleTag(t)}
                type="button"
                className="text-[10px] text-slate-400 hover:text-[#7C3AED] hover:bg-violet-50 dark:hover:bg-violet-900/20 px-1.5 py-0.5 rounded border border-dashed border-slate-300 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-all"
              >
                + {t}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

