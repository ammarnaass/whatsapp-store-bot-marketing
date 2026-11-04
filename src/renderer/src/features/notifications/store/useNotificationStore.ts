import { create } from 'zustand';
import { AppNotification, NotificationCategory } from '../types/notification.types';

const STORAGE_KEY = 'wasell_notifications_store_v1';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_welcome',
    title: 'بوابة واتساب متصلة بنجاح 🟢',
    message: 'تم إقلاع خادم OpenWA والاتصال بجلسة wasell-main-store برقم +213555220620.',
    category: 'system',
    priority: 'normal',
    timestamp: 'منذ قليل',
    read: false,
    actionTab: 'channels',
  },
  {
    id: 'notif_agent_ready',
    title: 'الوكيل الذكي في وضع المراقبة 🤖',
    message: 'الوكيل الذكي نشط ويتولى الردود الآلية والمبيعات الذكية عبر واتساب على مدار 24/7.',
    category: 'ai_alert',
    priority: 'normal',
    timestamp: 'اليوم',
    read: false,
    actionTab: 'agent',
  },
];

interface NotificationState {
  notifications: AppNotification[];
  isDrawerOpen: boolean;
  activeCategory: NotificationCategory;
  toasts: AppNotification[];
  setDrawerOpen: (open: boolean) => void;
  setActiveCategory: (cat: NotificationCategory) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  dismissToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => {
  const getInitialList = (): AppNotification[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  };

  const persist = (items: AppNotification[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  return {
    notifications: getInitialList(),
    isDrawerOpen: false,
    activeCategory: 'all',
    toasts: [],

    setDrawerOpen: (open) => set({ isDrawerOpen: open }),
    setActiveCategory: (cat) => set({ activeCategory: cat }),

    addNotification: (data) => {
      const newNotif: AppNotification = {
        ...data,
        id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: 'الآن',
        read: false,
      };

      set((state) => {
        const next = [newNotif, ...state.notifications].slice(0, 50);
        persist(next);
        // إضافة توست منبثق في أسفل الشاشة
        return {
          notifications: next,
          toasts: [newNotif, ...state.toasts.slice(0, 2)],
        };
      });
    },

    markAsRead: (id) => {
      set((state) => {
        const next = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
        persist(next);
        return { notifications: next };
      });
    },

    markAllAsRead: () => {
      set((state) => {
        const next = state.notifications.map((n) => ({ ...n, read: true }));
        persist(next);
        return { notifications: next };
      });
    },

    removeNotification: (id) => {
      set((state) => {
        const next = state.notifications.filter((n) => n.id !== id);
        persist(next);
        return { notifications: next };
      });
    },

    clearAll: () => {
      persist([]);
      set({ notifications: [] });
    },

    dismissToast: (id) => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    },
  };
});

