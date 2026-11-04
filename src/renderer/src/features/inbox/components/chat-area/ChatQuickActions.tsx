import React from 'react';
import { CreditCard } from 'lucide-react';

interface ChatQuickActionsProps {
  onSendPaymentLink: () => void;
  onSetInputMsg: (text: string) => void;
}

export const ChatQuickActions: React.FC<ChatQuickActionsProps> = ({
  onSendPaymentLink,
  onSetInputMsg,
}) => {
  return (
    <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-[#1F293D] flex items-center gap-2 overflow-x-auto text-[11px] font-bold shrink-0">
      <span className="text-slate-400 whitespace-nowrap">إجراءات سريعة:</span>
      <button
        onClick={onSendPaymentLink}
        type="button"
        className="h-[30px] px-3 rounded-lg bg-[#128C7E] hover:bg-[#075E54] text-white whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer elevation-1"
      >
        <CreditCard className="w-3.5 h-3.5" />
        <span className="font-mono tabular-nums">أرسل رابط الدفع (476 ر.س)</span>
      </button>
      <button
        onClick={() => onSetInputMsg('يسعدنا تطبيق كود خصم 10% إضافي لتأكيد طلبك اليوم!')}
        type="button"
        className="h-[30px] px-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
      >
        كود خصم 10%
      </button>
      <button
        onClick={() =>
          onSetInputMsg('التوصيل للرياض فوري خلال 3-5 ساعات وسعره 25 ريال ومجاني للطلب الحالي!')
        }
        type="button"
        className="h-[30px] px-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
      >
        عرض سياسة الشحن
      </button>
    </div>
  );
};

