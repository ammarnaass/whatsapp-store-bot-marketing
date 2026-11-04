import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api-bridge';
import { Conversation, Message } from '../../../../shared/types';

export function useInboxData() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv_1');
  const [messages, setMessages] = useState<Message[]>([]);
  const [filterHandler, setFilterHandler] = useState<'all' | 'agent' | 'human'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadConversations = useCallback(async () => {
    try {
      const convs = await api.chat.listConversations();
      setConversations(convs);
      if (convs.length > 0 && !activeConvId) {
        setActiveConvId(convs[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  }, [activeConvId]);

  const loadMessages = useCallback(async (id: string) => {
    try {
      const msgs = await api.chat.getMessages(id);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }, []);

  useEffect(() => {
    loadConversations().finally(() => setIsLoading(false));
  }, [loadConversations]);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    }
  }, [activeConvId, loadMessages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !activeConvId) return;
    const currentConv = conversations.find((c) => c.id === activeConvId);
    const phone = currentConv?.contact?.phone || '';
    await api.chat.sendMessage(activeConvId, phone, text.trim());
    await loadMessages(activeConvId);
    await loadConversations();
  };

  const takeover = async () => {
    if (!activeConvId) return;
    await api.chat.takeover(activeConvId);
    await loadConversations();
  };

  const returnToAgent = async () => {
    if (!activeConvId) return;
    await api.chat.returnToAgent(activeConvId);
    await loadConversations();
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return {
    conversations,
    activeConvId,
    setActiveConvId,
    messages,
    activeConv,
    filterHandler,
    setFilterHandler,
    sendMessage,
    takeover,
    returnToAgent,
    refresh: loadConversations,
    isLoading,
  };
}
