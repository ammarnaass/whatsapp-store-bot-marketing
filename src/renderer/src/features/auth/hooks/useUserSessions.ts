import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api-bridge';
import { useAuthStore } from '../store/useAuthStore';
import { UserSession } from '../types/auth.types';

export function useUserSessions() {
  const { currentUser, sessionToken, logout } = useAuthStore();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.auth.listSessions({
        userId: currentUser.id,
        currentToken: sessionToken || undefined,
      });
      setSessions(data || []);
    } catch (err: any) {
      setError(err.message || 'فشل تحميل قائمة الجلسات النشطة');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, sessionToken]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const revokeSession = async (targetToken: string) => {
    try {
      await api.auth.revokeSession({ sessionToken: targetToken });
      if (targetToken === sessionToken) {
        await logout();
      } else {
        await fetchSessions();
      }
      return true;
    } catch {
      return false;
    }
  };

  const revokeAllOtherSessions = async () => {
    if (!currentUser?.id || !sessionToken) return false;
    try {
      await api.auth.revokeAllSessions({
        userId: currentUser.id,
        keepCurrentToken: sessionToken,
      });
      await fetchSessions();
      return true;
    } catch {
      return false;
    }
  };

  return {
    sessions,
    isLoading,
    error,
    refreshSessions: fetchSessions,
    revokeSession,
    revokeAllOtherSessions,
  };
}
