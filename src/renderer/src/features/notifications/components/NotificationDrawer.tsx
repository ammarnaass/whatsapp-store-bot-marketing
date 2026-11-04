import React, { useEffect } from 'react';
import { useNotificationStore } from '../store/useNotificationStore';
import { NotificationHeader } from './NotificationHeader';
import { NotificationFilterTabs } from './NotificationFilterTabs';
import { NotificationItemCard } from './NotificationItemCard';
import { NotificationEmptyState } from './NotificationEmptyState';

interface NotificationDrawerProps {
  onNavigateTab?: (tab: string, id?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onNavigateTab }) => {
  const {
    notifications,
    isDrawerOpen,
    activeCategory,
    setDrawerOpen,
    setActiveCategory,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  // إغلاق الدرج عند الضغط على زر Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, setDrawerOpen]);

  if (!isDrawerOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const counts = {
    all: notifications.length,
    unread: unreadCount,
    whatsapp: notifications.filter((n) => n.category === 'whatsapp').length,
    order: notifications.filter((n) => n.category === 'order').length,
    ai_alert: notifications.filter((n) => n.category === 'ai_alert').length,
    system: notifications.filter((n) => n.category === 'system').length,
  };

  const filtered = notifications.filter((n) => {
    if (activeCategory === 'unread') return !n.read;
    if (activeCategory === 'all') return true;
    return n.category === activeCategory;
  });

  const handleItemNavigation = (tab: string, id?: string) => {
    setDrawerOpen(false);
    if (onNavigateTab) {
      onNavigateTab(tab, id);
    }
  };

  return (
    <>
      {/* 1. Backdrop Overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 animate-in fade-in duration-200"
      />

      {/* 2. Left Slide-Over Drawer Modal */}
      <aside className="fixed top-0 bottom-0 left-0 w-96 max-w-[85vw] bg-white dark:bg-[#111827] shadow-2xl z-50 flex flex-col border-r border-slate-200 dark:border-[#1F293D] animate-in slide-in-from-left duration-200">
        {/* Header Bar */}
        <NotificationHeader
          unreadCount={unreadCount}
          totalCount={notifications.length}
          onMarkAllAsRead={markAllAsRead}
          onClearAll={clearAll}
          onClose={() => setDrawerOpen(false)}
        />

        {/* Filter Tabs */}
        <NotificationFilterTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={counts}
        />

        {/* Notification Feed List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filtered.length === 0 ? (
            <NotificationEmptyState />
          ) : (
            filtered.map((item) => (
              <NotificationItemCard
                key={item.id}
                notification={item}
                onMarkAsRead={markAsRead}
                onRemove={removeNotification}
                onNavigateTab={handleItemNavigation}
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
};

