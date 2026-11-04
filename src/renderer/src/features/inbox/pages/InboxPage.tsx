import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useInbox } from '../hooks/useInbox';
import { InboxKpiStrip } from '../components/InboxKpiStrip';
import { InboxSidebar } from '../components/InboxSidebar';
import { ChatArea } from '../components/ChatArea';
import { CustomerDetailSidebar } from '../components/CustomerDetailSidebar';

export const InboxPage: React.FC = () => {
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
    handleSendPaymentLink
  } = useInbox();

  return (
    <div className="flex flex-col w-full h-full min-h-0 space-y-4 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#128C7E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Stats Strip & Operational Velocity Bar */}
      <InboxKpiStrip chats={chats} />

      {/* 2. Triple-Pane Master Layout */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-4 md:gap-5 h-full overflow-hidden">
        {/* Column 1: Conversation Threads List (4 Cols) */}
        <InboxSidebar
          chats={filteredChats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          filterMode={filterMode}
          onFilterModeChange={setFilterMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Column 2: Active WhatsApp Live Thread (5 Cols) */}
        <ChatArea
          chat={selectedChat}
          messages={chatMessages}
          isHumanControl={isHumanControl}
          onToggleHumanControl={() => setIsHumanControl(!isHumanControl)}
          inputMsg={inputMsg}
          onInputMsgChange={setInputMsg}
          onSendMessage={handleSendMessage}
          onSendPaymentLink={handleSendPaymentLink}
        />

        {/* Column 3: Customer Context & Live Cart (3 Cols) */}
        <CustomerDetailSidebar
          chat={selectedChat}
          onSendPaymentLink={handleSendPaymentLink}
        />
      </div>
    </div>
  );
};
