import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../../types/inbox.types';
import { ChatMessageBubble } from './ChatMessageBubble';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex-1 p-5 overflow-y-auto bg-[#EFEAE2]/30 dark:bg-[#0A0E17] space-y-4">
      <div className="flex justify-center my-2">
        <span className="px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800 text-[11px] text-slate-500 font-bold">
          محادثة واتساب نشطة ومؤمنة
        </span>
      </div>

      {messages.map((m) => (
        <ChatMessageBubble key={m.id} message={m} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

