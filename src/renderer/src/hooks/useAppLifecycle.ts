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
  setIsSidebarCollapsed,
}: UseAppLifecycleProps) {
  const [sessionStatus, setSessionStatus] = useState<string>('CONNECTED');
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // 1. مزامنة البيانات من الـ API بمجرد توثيق الجلسة
  useEffect(() => {
    if (isAuthenticated) {
      useDataStore.getState().hydrateFromApi();
    }
  }, [isAuthenticated]);

  // 2. التحقق من صلاحية الجلسة والحساب مرة واحدة فقط عند إقلاع التطبيق
  useEffect(() => {
    useAuthStore.getState().initAuth();
  }, []);

  // 3. الاستماع لأحداث جلسة واتساب والرسائل الحية الواردة
  useEffect(() => {
    const unsubMsg = api.chat.onMessageReceived((data) => {
      useDataStore.getState().handleLiveMessageReceived(data);
    });
    api.session.getStatus().then((res) => setSessionStatus(res.status));
    const unsubStatus = api.session.onStatusChanged((data) => setSessionStatus(data.status));
    return () => {
      unsubStatus();
      unsubMsg();
    };
  }, []);

  // 4. اختصارات لوحة المفاتيح والتحجيم التلقائي للشاشة
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        api.window.toggleFullscreen();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        handleToggleSidebar();
      }
    };
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed((prev) => (prev ? prev : true));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleToggleSidebar, setIsSidebarCollapsed]);

  return { sessionStatus, setSessionStatus };
}

