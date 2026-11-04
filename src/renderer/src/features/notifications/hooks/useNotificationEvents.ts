import { useEffect } from 'react';
import { api } from '../../../api-bridge';
import { useNotificationStore } from '../store/useNotificationStore';

export function useNotificationEvents() {
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    // الاستماع لرسائل واتساب الحية عبر Webhook وتوليد إشعار تلقائي
    const unsub = api.chat.onMessageReceived((data: any) => {
      if (data.direction === 'INBOUND') {
        const phone = data.phone || '';
        const body = data.body || 'رسالة جديدة من عميل واتساب';

        addNotification({
          title: `رسالة جديدة من عميل (${phone ? '+' + phone : 'واتساب'}) 💬`,
          message: body.length > 80 ? body.slice(0, 80) + '...' : body,
          category: 'whatsapp',
          priority: 'high',
          phone,
          actionTab: 'inbox',
          actionId: data.conversationId,
        });
      }
    });

    return () => {
      unsub();
    };
  }, [addNotification]);
}

