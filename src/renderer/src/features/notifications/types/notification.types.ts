export type NotificationCategory = 'all' | 'unread' | 'whatsapp' | 'order' | 'ai_alert' | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'whatsapp' | 'order' | 'ai_alert' | 'system';
  priority?: NotificationPriority;
  timestamp: string;
  read: boolean;
  avatar?: string;
  phone?: string;
  actionTab?: 'inbox' | 'orders' | 'agent' | 'customers' | 'settings' | 'channels';
  actionId?: string;
}

