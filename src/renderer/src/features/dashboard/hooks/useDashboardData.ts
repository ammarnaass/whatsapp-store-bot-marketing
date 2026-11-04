import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api-bridge';
import { DashboardKPIs, SessionStatus } from '../../../../shared/types';

export function useDashboardData() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('CONNECTED');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.analytics.getKPIs();
      setKpis(data);
      const session = await api.session.getStatus();
      setSessionStatus(session.status);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsub = api.session.onStatusChanged((data) => setSessionStatus(data.status));
    return () => unsub();
  }, [loadData]);

  return { kpis, sessionStatus, isLoading, refresh: loadData };
}
