import {
  KnowledgeItem,
  KnowledgeSourceType,
  KnowledgeCategory,
  KnowledgeStats,
  KnowledgeRetrievalTestResult,
} from '../../../../shared/types';

export type {
  KnowledgeItem,
  KnowledgeSourceType,
  KnowledgeCategory,
  KnowledgeStats,
  KnowledgeRetrievalTestResult,
};

export interface KnowledgeFormData {
  id?: string;
  title: string;
  category: KnowledgeCategory | string;
  source_type: KnowledgeSourceType;
  content: string;
  summary: string;
  source_url?: string;
  file_path?: string;
  priority: number;
  active: boolean;
}

export interface KnowledgeFormErrors {
  title?: string;
  content?: string;
}

export interface KnowledgeFilterState {
  category: 'all' | KnowledgeCategory | string;
  source_type: 'all' | KnowledgeSourceType;
  search: string;
}
