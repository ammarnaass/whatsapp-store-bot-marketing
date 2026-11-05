import { api } from '../../../api-bridge';
import {
  KnowledgeItem,
  KnowledgeFormData,
  KnowledgeStats,
  KnowledgeRetrievalTestResult,
} from '../types/knowledge.types';

export const knowledgeService = {
  async fetchList(filters?: { category?: string; source_type?: string; search?: string }): Promise<KnowledgeItem[]> {
    try {
      if (api.knowledge?.list) {
        return await api.knowledge.list(filters);
      }
      return [];
    } catch (err) {
      console.error('[KnowledgeService] Failed to list items:', err);
      return [];
    }
  },

  async createItem(data: KnowledgeFormData): Promise<{ success: boolean; id?: string }> {
    try {
      if (!api.knowledge?.create) return { success: false };
      return await api.knowledge.create(data as Partial<KnowledgeItem>);
    } catch (err) {
      console.error('[KnowledgeService] Failed to create item:', err);
      return { success: false };
    }
  },

  async updateItem(data: KnowledgeFormData & { id: string }): Promise<{ success: boolean }> {
    try {
      if (!api.knowledge?.update) return { success: false };
      return await api.knowledge.update(data as Partial<KnowledgeItem>);
    } catch (err) {
      console.error('[KnowledgeService] Failed to update item:', err);
      return { success: false };
    }
  },

  async deleteItem(id: string): Promise<{ success: boolean }> {
    try {
      if (!api.knowledge?.delete) return { success: false };
      return await api.knowledge.delete(id);
    } catch (err) {
      console.error('[KnowledgeService] Failed to delete item:', err);
      return { success: false };
    }
  },

  async toggleActive(id: string, active: boolean): Promise<{ success: boolean }> {
    try {
      if (!api.knowledge?.toggleActive) return { success: false };
      return await api.knowledge.toggleActive({ id, active });
    } catch (err) {
      console.error('[KnowledgeService] Failed to toggle active:', err);
      return { success: false };
    }
  },

  async fetchStats(): Promise<KnowledgeStats> {
    try {
      if (api.knowledge?.getStats) {
        return await api.knowledge.getStats();
      }
      return { totalItems: 0, activeItems: 0, totalTokens: 0, totalHits: 0, byCategory: {} };
    } catch (err) {
      console.error('[KnowledgeService] Failed to fetch stats:', err);
      return { totalItems: 0, activeItems: 0, totalTokens: 0, totalHits: 0, byCategory: {} };
    }
  },

  async testRetrieval(query: string): Promise<KnowledgeRetrievalTestResult> {
    try {
      if (api.knowledge?.testRetrieval) {
        return await api.knowledge.testRetrieval({ query });
      }
      return { query, matchedItems: [], suggestedAnswer: '' };
    } catch (err) {
      console.error('[KnowledgeService] Failed to test retrieval:', err);
      return { query, matchedItems: [], suggestedAnswer: '' };
    }
  },
};

