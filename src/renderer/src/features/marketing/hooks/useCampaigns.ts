import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api-bridge';
import { Campaign, CreateCampaignFormData } from '../types/marketing.types';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRecipientCampaignId, setActiveRecipientCampaignId] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    try {
      setIsLoading(true);
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

  const createCampaign = async (formData: CreateCampaignFormData) => {
    try {
      const res = await api.campaigns.create(formData);
      if (res.success) {
        await loadCampaigns();
        return { success: true, count: res.recipientsCount };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const controlCampaign = async (id: string, action: 'START' | 'PAUSE' | 'CANCEL') => {
    try {
      await api.campaigns.control(id, action);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: action === 'START' ? 'RUNNING' : action === 'PAUSE' ? 'PAUSED' : 'CANCELLED' } : c))
      );
    } catch (err) {
      console.error('Failed to control campaign:', err);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الحملة التسويقية نهائياً؟')) return;
    try {
      await api.campaigns.delete(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete campaign:', err);
    }
  };

  return {
    campaigns,
    isLoading,
    activeRecipientCampaignId,
    setActiveRecipientCampaignId,
    loadCampaigns,
    createCampaign,
    controlCampaign,
    deleteCampaign,
  };
}

