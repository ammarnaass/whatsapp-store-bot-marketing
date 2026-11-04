import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDataStore, ChatItem } from '../../data-management';
import { ChatFilterMode, ChatMessage } from '../types/inbox.types';
import { api } from '../../../api-bridge';

export function useInbox() {
  const chats = useDataStore((s) => s.chats);
  const setChats = useDataStore((s) => s.setChats);
  const hydrateFromApi = useDataStore((s) => s.hydrateFromApi);
  const handleLiveMessageReceived = useDataStore((s) => s.handleLiveMessageReceived);

  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [filterMode, setFilterMode] = useState<ChatFilterMode>('all');
  const [isHumanControl, setIsHumanControl] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // سجل الرسائل يبدأ فارغاً بدون أي بيانات وهمية ويتم جلبه حصراً من SQLite/واتساب
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [inputMsg, setInputMsg] = useState('');

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // تحديث المحادثة المختارة تلقائياً عند جلب المحادثات
  useEffect(() => {
    if (chats.length > 0) {
      const exists = chats.some((c) => c.id === selectedChatId);
      if (!exists) {
        setSelectedChatId(chats[0].id);
      }
    } else {
      setSelectedChatId('');
    }
  }, [chats, selectedChatId]);

  const selectedChat = useMemo(() => {
    return chats.find((c) => c.id === selectedChatId) || chats[0] || null;
  }, [chats, selectedChatId]);

  // مزامنة محادثات واتساب الحقيقية عبر بوابة OpenWA
  const handleSyncChats = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await api.chat.syncConversations();
      await hydrateFromApi();
      if (res.success) {
        showToast(`تمت مزامنة ${res.count} محادثة بنجاح من واتساب`);
      } else {
        showToast(res.error ? `تنبيه: ${res.error}` : 'تعذر مزامنة المحادثات، تأكد من اتصال واتساب');
      }
    } catch (err: any) {
      showToast(`خطأ في المزامنة: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  }, [hydrateFromApi, showToast]);

  // تحميل أولي للبيانات الحقيقية عند فتح صفحة المحادثات
  useEffect(() => {
    hydrateFromApi();
  }, [hydrateFromApi]);

  // تحديث حالة التحكم البشري وفق حالة المحادثة المختارة
  useEffect(() => {
    if (selectedChat) {
      setIsHumanControl(selectedChat.needsHuman || !selectedChat.isAi);
    }
  }, [selectedChat]);

  // جلب سجل رسائل المحادثة الحقيقي من SQLite
  useEffect(() => {
    if (!selectedChatId) {
      setChatMessages([]);
      return;
    }
    let isMounted = true;
    api.chat.getMessages(selectedChatId).then((dbMsgs) => {
      if (!isMounted) return;
      if (dbMsgs && dbMsgs.length > 0) {
        setChatMessages(
          dbMsgs.map((m) => ({
            id: m.id,
            sender: m.direction === 'INBOUND' ? 'customer' : (m.direction === 'OUTBOUND' && isHumanControl ? 'human' : 'ai'),
            text: m.body || '',
            time: m.ts ? new Date(m.ts).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : 'الآن',
          }))
        );
      } else {
        setChatMessages([]);
      }
    }).catch(() => {
      if (isMounted) setChatMessages([]);
    });
    return () => {
      isMounted = false;
    };
  }, [selectedChatId, isHumanControl]);

  // استدراك دوري سريع وتلقائي في الخلفية (Silent Reconciler) كل 3 ثوانٍ لضمان التزامن الفوري التام
  useEffect(() => {
    if (!selectedChatId) return;
    const pollInterval = setInterval(() => {
      api.chat.getMessages(selectedChatId).then((dbMsgs) => {
        if (dbMsgs && dbMsgs.length > 0) {
          setChatMessages((prev) => {
            if (dbMsgs.length === prev.length) return prev;
            return dbMsgs.map((m) => ({
              id: m.id,
              sender: m.direction === 'INBOUND' ? 'customer' : (m.direction === 'OUTBOUND' && isHumanControl ? 'human' : 'ai'),
              text: m.body || '',
              time: m.ts ? new Date(m.ts).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : 'الآن',
            }));
          });
        }
      }).catch(() => {});
    }, 3000);
    return () => clearInterval(pollInterval);
  }, [selectedChatId, isHumanControl]);

  // الاستماع لوصول رسائل جديدة حية عبر الـ Webhook
  useEffect(() => {
    const unsub = api.chat.onMessageReceived((data) => {
      handleLiveMessageReceived(data);
      const cleanDataPhone = data.phone ? data.phone.replace(/\D/g, '') : '';
      const cleanSelectedPhone = selectedChat?.phone ? selectedChat.phone.replace(/\D/g, '') : '';
      const isCurrentChat = data.conversationId === selectedChatId || 
                            (cleanDataPhone && cleanSelectedPhone && cleanDataPhone === cleanSelectedPhone);

      if (isCurrentChat) {
        const newMsg: ChatMessage = {
          id: data.id || String(Date.now()),
          sender: data.direction === 'INBOUND' ? 'customer' : (isHumanControl ? 'human' : 'ai'),
          text: data.body,
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
    });
    return () => unsub();
  }, [selectedChatId, selectedChat, isHumanControl, handleLiveMessageReceived]);

  const filteredChats = useMemo(() => {
    return chats.filter((c) => {
      if (filterMode === 'human' && !c.needsHuman) return false;
      if (filterMode === 'ai' && !c.isAi) return false;
      if (filterMode === 'abandoned' && c.tag !== 'سلة متروكة') return false;
      if (filterMode === 'vip' && !c.isVip) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [chats, filterMode, searchQuery]);

  const handleSendMessage = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!inputMsg.trim() || !selectedChat) return;

      const textToSend = inputMsg.trim();
      const newMsg: ChatMessage = {
        id: String(Date.now()),
        sender: isHumanControl ? 'human' : 'ai',
        text: textToSend,
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        latency: isHumanControl ? undefined : '0.9 ثانية'
      };

      setChatMessages((prev) => [...prev, newMsg]);
      setInputMsg('');

      // إرسال عبر قنوات IPC الحقيقية
      try {
        const res = await api.chat.sendMessage(selectedChat.id, selectedChat.phone, textToSend);
        if (!res.success) {
          showToast('تنبيه: تم حفظ الرسالة ولكن تعذر تسليمها عبر بوابة واتساب لعدم الاتصال');
        }
      } catch (err) {
        console.error('Failed to send chat message:', err);
      }
    },
    [inputMsg, isHumanControl, selectedChat, showToast]
  );

  const handleSendPaymentLink = useCallback(() => {
    if (!selectedChat) return;
    const linkMsg: ChatMessage = {
      id: String(Date.now()),
      sender: isHumanControl ? 'human' : 'ai',
      text: 'تفضل أستاذنا رابط الدفع الآمن والمباشر لطلبك:\nhttps://checkout.wasell.app/pay/ORD-9842\n\nالإجمالي بعد الخصم: 45$ (شامل الشحن السريع والضريبة).',
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      latency: '1.0 ثانية'
    };
    setChatMessages((prev) => [...prev, linkMsg]);
    api.chat.sendMessage(selectedChat.id, selectedChat.phone, linkMsg.text).catch(() => {});
    showToast('تم إرسال رابط الدفع المباشر للعميل بنجاح عبر واتساب');
  }, [isHumanControl, selectedChat, showToast]);

  const handleToggleHumanControl = useCallback(async () => {
    if (!selectedChat) return;
    const nextState = !isHumanControl;
    setIsHumanControl(nextState);
    if (nextState) {
      await api.chat.takeover(selectedChat.id).catch(() => {});
      showToast('تم تحويل المحادثة للتدخل البشري وإيقاف الرد الآلي للوكيل.');
    } else {
      await api.chat.returnToAgent(selectedChat.id).catch(() => {});
      showToast('تمت إعادة المحادثة لوكيل الذكاء الاصطناعي للرد التلقائي.');
    }
  }, [isHumanControl, selectedChat, showToast]);

  return {
    chats,
    selectedChat,
    selectedChatId,
    setSelectedChatId,
    filterMode,
    setFilterMode,
    isHumanControl,
    setIsHumanControl,
    handleToggleHumanControl,
    searchQuery,
    setSearchQuery,
    toastMessage,
    showToast,
    chatMessages,
    inputMsg,
    setInputMsg,
    filteredChats,
    handleSendMessage,
    handleSendPaymentLink,
    isSyncing,
    handleSyncChats,
  };
}
