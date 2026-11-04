import React from 'react';
import { Phone, Tag, Clock, Sparkles } from 'lucide-react';
import { Conversation } from '../../../../shared/types';

interface CustomerInfoCardProps {
  conversation?: Conversation;
}

export const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ conversation }) => {
  if (!conversation) return null;

  return (
    <div className="hidden lg:flex w-72 flex-col wasell-card p-4 space-y-4 shrink-0 text-xs">
      <div className="text-center pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="w-14 h-14 rounded-full bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center font-bold text-lg mx-auto mb-2">
          {conversation.contact?.name ? conversation.contact.name.slice(0, 1) : 'U'}
        </div>
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
          {conversation.contact?.name || 'عميل واتساب'}
        </h4>
        <span className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1 mt-0.5">
          <Phone className="w-3 h-3 text-[#128C7E]" />
          {conversation.contact?.phone}
        </span>
      </div>

      {/* وسوم العميل */}
      <div>
        <span className="text-slate-400 font-bold block mb-1 text-[11px] flex items-center gap-1">
          <Tag className="w-3 h-3 text-[#128C7E]" />
          الوسوم والاهتمامات
        </span>
        <div className="flex flex-wrap gap-1">
          {conversation.contact?.tags?.map((t: string) => (
            <span key={t} className="bg-[#E7F6F2] dark:bg-[#075E54]/30 text-[#075E54] dark:text-emerald-300 px-2 py-0.5 rounded-lg text-[10px] font-bold">
              {t}
            </span>
          )) || <span className="text-slate-400 text-[11px]">لا توجد وسوم</span>}
        </div>
      </div>

      {/* ملخص الوكيل الذكي للعميل */}
      <div className="p-3 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 border border-violet-200 dark:border-violet-900/40 space-y-1">
        <span className="text-[#7C3AED] font-bold text-[11px] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          ملخص الوكيل الذكي
        </span>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          عميل مهتم بالاشتراكات السنوية، استفسر عن دعم بطاقات مدى وتم إنشاء مسودة طلب له.
        </p>
      </div>

      {/* ملاحظات الموظف */}
      <div className="pt-2 border-t border-slate-100 dark:border-[#1F293D] space-y-1.5">
        <span className="text-slate-400 font-bold text-[11px]">ملاحظات داخلية:</span>
        <textarea
          rows={3}
          placeholder="أضف ملاحظات خاصة للموظفين الآخرين..."
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-[11px] text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
        />
      </div>
    </div>
  );
};
