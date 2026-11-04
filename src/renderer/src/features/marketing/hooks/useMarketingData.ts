import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api-bridge';
import { Campaign } from '../../../../shared/types';

export function useMarketingData() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCampaigns = useCallback(async () => {
    try {
      const list = await api.campaigns.list();
      setCampaigns(list);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const createCampaign = async (name: string, template: string) => {
    const newCamp: Campaign = {
      id: `camp_${Date.now()}`,
      name,
      template,
      status: 'RUNNING',
      min_delay_sec: 25,
      max_delay_sec: 45,
      daily_limit: 200,
      recipients_count: 50,
      sent_count: 0,
      delivered_count: 0,
      created_at: new Date().toISOString(),
    };
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  return { campaigns, isLoading, createCampaign, refresh: loadCampaigns };
}
