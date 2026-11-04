import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api-bridge';
import { BlocklistEntry } from '../types/marketing.types';

export function useMarketingStats() {
  const [blocklist, setBlocklist] = useState<BlocklistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBlocklist = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await api.blocklist.list();
      setBlocklist(list);
    } catch (err) {
      console.error('Failed to load blocklist:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlocklist();
  }, [loadBlocklist]);

  const addToBlocklist = async (phone: string, reason?: string) => {
    try {
      await api.blocklist.add(phone, reason);
      await loadBlocklist();
    } catch (err) {
      console.error('Failed to add to blocklist:', err);
    }
  };

  const removeFromBlocklist = async (phone: string) => {
    try {
      await api.blocklist.remove(phone);
      setBlocklist((prev) => prev.filter((b) => b.phone !== phone));
    } catch (err) {
      console.error('Failed to remove from blocklist:', err);
    }
  };

  return {
    blocklist,
    isLoading,
    loadBlocklist,
    addToBlocklist,
    removeFromBlocklist,
  };
}

