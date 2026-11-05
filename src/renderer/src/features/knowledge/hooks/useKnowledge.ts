import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  KnowledgeItem,
  KnowledgeFormData,
  KnowledgeStats,
  KnowledgeFilterState,
} from '../types/knowledge.types';
import { knowledgeService } from '../services/knowledge.service';

export function useKnowledge() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [stats, setStats] = useState<KnowledgeStats>({
    totalItems: 0, activeItems: 0, totalTokens: 0, totalHits: 0, byCategory: {},
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<KnowledgeFilterState>({
    category: 'all', source_type: 'all', search: '',
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [listData, statsData] = await Promise.all([
        knowledgeService.fetchList(),
        knowledgeService.fetchStats(),
      ]);
      setItems(listData);
      setStats(statsData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveItem = useCallback(async (formData: KnowledgeFormData): Promise<boolean> => {
    let res: { success: boolean };
    if (formData.id) {
      res = await knowledgeService.updateItem(formData as KnowledgeFormData & { id: string });
    } else {
      res = await knowledgeService.createItem(formData);
    }
    if (res.success) {
      await loadData();
      return true;
    }
    return false;
  }, [loadData]);

  const removeItem = useCallback(async (id: string): Promise<boolean> => {
    const res = await knowledgeService.deleteItem(id);
    if (res.success) {
      await loadData();
      return true;
    }
    return false;
  }, [loadData]);

  const toggleActive = useCallback(async (id: string, currentActive: boolean): Promise<boolean> => {
    // Optimistic UI update
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, active: !currentActive } : it)));
    const res = await knowledgeService.toggleActive(id, !currentActive);
    if (res.success) {
      knowledgeService.fetchStats().then(setStats);
      return true;
    }
    await loadData();
    return false;
  }, [loadData]);

  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      if (filters.category !== 'all' && it.category !== filters.category) return false;
      if (filters.source_type !== 'all' && it.source_type !== filters.source_type) return false;
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        return (
          it.title.toLowerCase().includes(q) ||
          it.content.toLowerCase().includes(q) ||
          (it.summary || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, filters]);

  return {
    items,
    filteredItems,
    stats,
    isLoading,
    filters,
    setFilters,
    saveItem,
    removeItem,
    toggleActive,
    refreshKnowledge: loadData,
  };
}
