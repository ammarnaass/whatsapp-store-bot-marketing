import React from 'react';
import { ChatItem, ChatFilterMode } from '../types/inbox.types';
import { InboxLiveStatusBadge } from './InboxLiveStatusBadge';
import { InboxSearchInput } from './InboxSearchInput';
import { InboxFilterChips } from './InboxFilterChips';
import { InboxChatItemRow } from './InboxChatItemRow';
import { InboxEmptyView } from './InboxEmptyView';

interface InboxSidebarProps {
  chats: ChatItem[];
  selectedChatId: string;
  onSelectChat: (id: string) => void;
  filterMode: ChatFilterMode;
  onFilterModeChange: (mode: ChatFilterMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSyncing?: boolean;
  onSyncChats?: () => void;
}

export const InboxSidebar: React.FC<InboxSidebarProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  filterMode,
  onFilterModeChange,
  searchQuery,
  onSearchChange,
  isSyncing = false,
  onSyncChats,
}) => {
  return (
    <section className="w-full h-full bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 flex flex-col overflow-hidden">
      {/* رأس القائمة: حالة المزامنة اللحظية والبحث والفلاتر */}
      <div className="p-4 border-b border-slate-100 dark:border-[#1F293D] flex flex-col gap-3">
        <InboxLiveStatusBadge />

        <InboxSearchInput
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          isSyncing={isSyncing}
          onSyncChats={onSyncChats}
        />

        <InboxFilterChips
          totalCount={chats.length}
          filterMode={filterMode}
          onFilterModeChange={onFilterModeChange}
        />
      </div>

      {/* قائمة المحادثات المتدفقة */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {chats.length === 0 ? (
          <InboxEmptyView isSyncing={isSyncing} onSyncChats={onSyncChats} />
        ) : (
          chats.map((c) => (
            <InboxChatItemRow
              key={c.id}
              chat={c}
              isSelected={c.id === selectedChatId}
              onSelect={onSelectChat}
            />
          ))
        )}
      </div>
    </section>
  );
};
