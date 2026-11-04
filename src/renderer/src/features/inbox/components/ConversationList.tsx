import React, { useState } from 'react';
import { MessageSquare, RefreshCw, Bot, UserCheck, Search } from 'lucide-react';
import { Conversation } from '../../../../shared/types';

interface ConversationListProps {
  conversations: Conversation[];
  activeConvId: string;
  onSelectConv: (id: string) => void;
  filterHandler: 'all' | 'agent' | 'human';
  onFilterChange: (filter: 'all' | 'agent' | 'human') => void;
  onRefresh: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConvId,
  onSelectConv,
  filterHandler,
  onFilterChange,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((c) => {
    const matchesHandler = filterHandler === 'all' || c.handler === filterHandler;
    const matchesSearch =
      c.contact?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.contact?.phone?.includes(search) ||
      c.last_message?.body?.toLowerCase().includes(search.toLowerCase());
    return matchesHandler && (matchesSearch || !search);
  });

  return (
    <div className="w-full md:w-80 flex flex-col wasell-card overflow-hidden shrink-0">
      <div className="p-3.5 border-b border-slate-100 dark:border-[#1F293D] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#128C7E]" />
            صندوق الوارد المشترك
          </h2>
          <button onClick={onRefresh} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* فلاتر المسؤول (All / AI / Human) */}
        <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => onFilterChange('all')}
            className={`py-1.5 rounded-lg transition-all ${filterHandler === 'all' ? 'bg-[#128C7E] text-white shadow-sm' : 'text-slate-400'}`}
          >
            الكل ({conversations.length})
          </button>
          <button
            onClick={() => onFilterChange('agent')}
            className={`py-1.5 rounded-lg transition-all ${filterHandler === 'agent' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-slate-400'}`}
          >
            الوكيل (AI)
          </button>
          <button
            onClick={() => onFilterChange('human')}
            className={`py-1.5 rounded-lg transition-all ${filterHandler === 'human' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}
          >
            موظف
          </button>
        </div>
      </div>

      {/* قائمة المحادثات */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectConv(c.id)}
            className={`p-3 cursor-pointer transition-colors flex items-start gap-3 ${
              activeConvId === c.id
                ? 'bg-emerald-50/60 dark:bg-[#075E54]/20 border-r-4 border-[#128C7E]'
                : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
              {c.contact?.name ? c.contact.name.slice(0, 1) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {c.contact?.name || c.contact?.phone}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {c.last_message?.timestamp ? new Date(c.last_message.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {c.last_message?.body || 'لا توجد رسائل'}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                {c.handler === 'agent' ? (
                  <span className="ai-badge text-[10px] py-0 px-1.5">
                    <Bot className="w-3 h-3" />
                    يديره AI
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0 rounded bg-blue-100 dark:bg-blue-950 text-blue-600">
                    <UserCheck className="w-3 h-3" />
                    موظف بشري
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
