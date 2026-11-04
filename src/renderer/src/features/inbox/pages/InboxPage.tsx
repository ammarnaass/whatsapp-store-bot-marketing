import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useInbox } from '../hooks/useInbox';
import { InboxKpiStrip } from '../components/InboxKpiStrip';
import { InboxSidebar } from '../components/InboxSidebar';
import { ChatArea } from '../components/ChatArea';
import { CustomerDetailSidebar } from '../components/CustomerDetailSidebar';

export const InboxPage: React.FC = () => {
  const [isCustomerSidebarOpen, setIsCustomerSidebarOpen] = useState<boolean>(true);

  const {
    chats,
    selectedChat,
    selectedChatId,
    setSelectedChatId,
    filterMode,
    setFilterMode,
    isHumanControl,
    setIsHumanControl,
    searchQuery,
    setSearchQuery,
    toastMessage,
    chatMessages,
    inputMsg,
    setInputMsg,
    filteredChats,
    handleSendMessage,
    handleSendPaymentLink,
    isSyncing,
    handleSyncChats,
  } = useInbox();

  return (
    <div className="flex flex-col w-full h-full min-h-0 space-y-3 sm:space-y-4 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#128C7E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Stats Strip & Operational Velocity Bar */}
      <InboxKpiStrip chats={chats} />

      {/* 2. Master Triple-Pane Layout (Adaptive Flexbox) */}
      <div className="flex-1 min-h-0 flex gap-3 md:gap-4 h-full overflow-hidden relative">
        {/* العمود الأول: قائمة المحادثات (يظهر دائماً على الشاشات الكبيرة، وعلى الموبايل فقط إذا لم يتم تحديد محادثة) */}
        <div
          className={`${
            selectedChatId ? 'hidden md:flex' : 'flex'
          } w-full md:w-64 lg:w-72 xl:w-80 shrink-0 h-full overflow-hidden flex-col`}
        >
          <InboxSidebar
            chats={filteredChats}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
            filterMode={filterMode}
            onFilterModeChange={setFilterMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isSyncing={isSyncing}
            onSyncChats={handleSyncChats}
          />
        </div>

        {/* العمود الثاني: محادثة واتساب المباشرة (يظهر دائماً على الشاشات الكبيرة، وعلى الموبايل فقط عند اختيار محادثة) */}
        <div
          className={`${
            !selectedChatId ? 'hidden md:flex' : 'flex'
          } flex-1 min-w-0 h-full overflow-hidden flex-col`}
        >
          <ChatArea
            chat={selectedChat}
            messages={chatMessages}
            isHumanControl={isHumanControl}
            onToggleHumanControl={() => setIsHumanControl(!isHumanControl)}
            inputMsg={inputMsg}
            onInputMsgChange={setInputMsg}
            onSendMessage={handleSendMessage}
            onSendPaymentLink={handleSendPaymentLink}
            isCustomerSidebarOpen={isCustomerSidebarOpen}
            onToggleCustomerSidebar={() => setIsCustomerSidebarOpen(!isCustomerSidebarOpen)}
            onBack={() => setSelectedChatId('')}
          />
        </div>

        {/* العمود الثالث: بطاقة العميل الحقيقية وسجل طلباته (Docked على xl، و Slide-out Drawer على الشاشات الأصغر) */}
        {isCustomerSidebarOpen && (
          <>
            {/* Docked Column on >= 1280px */}
            <div className="hidden xl:flex w-72 lg:w-80 shrink-0 h-full overflow-hidden flex-col">
              <CustomerDetailSidebar
                chat={selectedChat}
                onSendPaymentLink={handleSendPaymentLink}
                onClose={() => setIsCustomerSidebarOpen(false)}
              />
            </div>

            {/* Slide-out Overlay Drawer on < 1280px */}
            <div className="xl:hidden fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="w-80 sm:w-96 h-full bg-white dark:bg-[#111827] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-left duration-200">
                <CustomerDetailSidebar
                  chat={selectedChat}
                  onSendPaymentLink={handleSendPaymentLink}
                  onClose={() => setIsCustomerSidebarOpen(false)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
