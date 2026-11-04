import React from 'react';
import { UserX, X } from 'lucide-react';
import { ChatItem } from '../../types/inbox.types';
import { useCustomerDetail } from '../../hooks/useCustomerDetail';
import { CustomerIdentityCard } from './CustomerIdentityCard';
import { CustomerStatsSummary } from './CustomerStatsSummary';
import { CustomerOrdersHistory } from './CustomerOrdersHistory';
import { CustomerAiMemoryCard } from './CustomerAiMemoryCard';
import { CustomerInternalNotes } from './CustomerInternalNotes';

interface CustomerDetailSidebarProps {
  chat: ChatItem | null;
  onSendPaymentLink: () => void;
  onClose?: () => void;
}

export const CustomerDetailSidebar: React.FC<CustomerDetailSidebarProps> = ({
  chat,
  onSendPaymentLink,
  onClose,
}) => {
  const {
    profile,
    isLoading,
    notesInput,
    isSavingNotes,
    handleNotesChange,
    handleToggleTag,
  } = useCustomerDetail(chat?.phone, chat?.id);

  if (!chat) {
    return (
      <section className="w-full h-full bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs">
        <UserX className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
        <span>يرجى اختيار محادثة لعرض تفاصيل العميل الحقيقية</span>
      </section>
    );
  }

  // استخدام الملف الحقيقي المجلوب، أو fallback إلى بيانات المحادثة النشطة أثناء التحميل
  const activeProfile = profile || {
    id: chat.id,
    name: chat.name,
    phone: chat.phone,
    avatar: chat.avatar || '',
    notes: '',
    tags: chat.tag ? [chat.tag] : [],
    isVip: Boolean(chat.isVip),
    memorySummary: '',
    orders: [],
    ordersCount: 0,
    totalSpend: 0,
  };

  return (
    <section className="w-full h-full bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 flex flex-col overflow-y-auto p-4 space-y-4 relative">
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          title="إغلاق لوحة العميل"
          className="absolute top-3 left-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* 1. بطاقة الهوية الحقيقية والصورة */}
      <CustomerIdentityCard profile={activeProfile} isAi={chat.isAi} />

      {/* 2. ملخص المشتريات والطلبات وزر رابط الدفع */}
      <CustomerStatsSummary profile={activeProfile} onSendPaymentLink={onSendPaymentLink} />

      {/* 3. سجل الطلبات الحقيقية */}
      <CustomerOrdersHistory orders={activeProfile.orders} />

      {/* 4. ملخص ذاكرة الوكيل الذكي والوسوم */}
      <CustomerAiMemoryCard profile={activeProfile} onToggleTag={handleToggleTag} />

      {/* 5. ملاحظات الفريق المحفوظة في SQLite */}
      <CustomerInternalNotes
        notes={notesInput}
        isSaving={isSavingNotes}
        onNotesChange={handleNotesChange}
      />
    </section>
  );
};

