import { useState, useEffect } from 'react';
import { api } from '../api-bridge';
import { useDataStore } from '../features/data-management';
import { useAuthStore } from '../features/auth';

interface UseAppLifecycleProps {
  handleToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useAppLifecycle({
  handleToggleSidebar,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: UseAppLifecycleProps) {
  const [sessionStatus, setSessionStatus] = useState<string>('CONNECTED');

  useEffect(() => {
    // 1. مزامنة قاعدة البيانات والتحقق من جلسة المستخدم
    useDataStore.getState().hydrateFromApi();
    useAuthStore.getState().initAuth();

    // 2. الاستماع لوصول الرسائل الحية عبر Webhook
    const unsubMsg = api.chat.onMessageReceived((data) => {
      useDataStore.getState().handleLiveMessageReceived(data);
    });

    // 3. متابعة حالة جلسة واتساب
    api.session.getStatus().then((res) => setSessionStatus(res.status));
    const unsub = api.session.onStatusChanged((data) => setSessionStatus(data.status));

    // 4. اختصار F11 لملء الشاشة، و Ctrl+B لطي القائمة الجانبية
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        api.window.toggleFullscreen();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        handleToggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 5. التكيف التلقائي عند تغيير حجم الشاشة
    const handleResize = () => {
      if (window.innerWidth < 1024 && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      unsub();
      unsubMsg();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarCollapsed]);

  return { sessionStatus, setSessionStatus };
}

